/* De Una Delivery · Motor de reglas
 *
 * Aquí vive TODA la lógica del negocio, separada de las pantallas:
 * precios, estados del pedido, asignación de repartidores, dinero (libro de
 * movimientos), confianza de clientes, promociones y antifraude.
 *
 * El "mundo" (W) es un objeto de datos simple. Cada arreglo equivale a una
 * tabla de la base de datos futura (ver docs/08-arquitectura.md).
 * Funciona en el navegador (window.Motor) y en Node (pruebas/motor.test.js).
 */
(function (raiz, fabrica) {
  if (typeof module === 'object' && module.exports) module.exports = fabrica();
  else raiz.Motor = fabrica();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* Configuración por defecto (el dueño la cambia desde Ajustes)        */
  /* ------------------------------------------------------------------ */
  const CONFIG_BASE = {
    zonas: ['Toscana Alta', 'Casas Quma', 'Paseos de la Pradera', 'Atotonilco centro', 'Huehuetoca centro'],
    lejana: 'Huehuetoca centro',
    tarifas: {
      mismo: 25, cerca: 35, lejos: 45, mandado: 45, servicio: 7, repaPct: 85,
      pedidoPequeno: { umbral: 100, cargo: 10 },
      lluvia: { activa: false, extra: 10 },
    },
    plus: { precio: 49, envioGratisDesde: 150, enviosMes: 8 },
    negocios: { mensualidad: 399, diasGracia: 7 },
    anuncios: { destacado: 99, carrusel: 199 },
    promos: { bienvenida: true, bienvenidaTope: 45, vecino: 30, vecinoMaxMes: 10 },
    limites: {
      efectivoMax: 800, efectivoNuevo: 400, pedidosNuevo: 3,
      efectivoRepa: 500, suspenderRepa: 800, adelantoMandado: 500,
      reclamosMes: 2, creditoOperador: 100, intentosPin: 3,
      cancelTardiaPct: 50, compensacionRepa: 15,
    },
    // minutos
    tiempos: { pago: 15, negocio: 5, avisoNegocio: 3, oferta: 1, sinRepa: 5, espera: 10, atraso: 10, reclamo: 1440 },
    // minutos desde las 00:00
    operacion: { abre: 480, cierra: 1380, alcoholHasta: 1320, leySeca: false },
    gas: { precioMaxKg: 21.5 },
  };

  const ESTADO_TXT = {
    pago_pendiente: 'Esperando tu pago', nuevo: 'Esperando al negocio', preparando: 'Preparando',
    listo: 'Listo para recoger', buscando: 'Buscando repartidor', comprando: 'Comprando tu mandado',
    por_aprobar: 'Revisa el ticket', en_camino: 'En camino', en_puerta: 'Llegó tu repartidor',
    entregado: 'Entregado', cancelado: 'Cancelado', no_entregado: 'No se entregó',
  };
  const TIPOS_INC = {
    falta: 'Faltó algo', equivocado: 'Llegó algo equivocado', mal_estado: 'Llegó en mal estado',
    no_llego: 'No me llegó', cobro: 'Me cobraron de más', trato: 'Problema con el repartidor',
    ticket: 'Ticket del mandado en duda', cliente_ausente: 'El cliente no recibió el pedido',
  };
  const DOCS = {
    ine: 'INE', comprobante: 'Comprobante de domicilio', clabe: 'Cuenta CLABE',
    permiso: 'Permiso de la CNE (gas LP)', sanitario: 'Aviso de funcionamiento (Cofepris)',
    alcohol: 'Licencia para vender alcohol', licencia: 'Licencia de manejo',
    selfie: 'Selfie de verificación', placas: 'Tarjeta de circulación',
  };
  const TERMINALES = ['entregado', 'cancelado', 'no_entregado'];
  const VIAJE_MIN = [8, 12, 18];
  const SISTEMA = { rol: 'sistema', nombre: 'Sistema' };
  const DIA_BASE = 16; // la demo arranca el 16 de noviembre

  /* ------------------------------------------------------------------ */
  /* Utilidades                                                          */
  /* ------------------------------------------------------------------ */
  const clonar = (o) => JSON.parse(JSON.stringify(o));
  const r2 = (n) => Math.round((+n || 0) * 100) / 100;
  const suma = (a, f) => a.reduce((s, x) => s + f(x), 0);
  const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
  function hora(min) {
    const m = ((Math.floor(min) % 1440) + 1440) % 1440;
    return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
  }
  const diaActual = (W) => DIA_BASE + Math.floor(W.reloj / 1440);
  const err = (error) => ({ ok: false, error });

  function crearMundo(opc = {}) {
    return {
      config: clonar(CONFIG_BASE), reloj: opc.reloj != null ? opc.reloj : 780, semilla: opc.semilla || 7,
      negocios: [], repartidores: [], clientes: [], pedidos: [], movimientos: [], incidencias: [],
      solicitudes: [], bitacora: [], promoUsada: { direcciones: [], dispositivos: [] }, direccionesMarcadas: [],
      sec: { pedido: 1041, mov: 1, inc: 1, sol: 1 },
    };
  }
  function azar(W) { W.semilla = (W.semilla * 1103515245 + 12345) % 2147483648; return W.semilla / 2147483648; }
  const nuevoPin = (W) => String(1000 + Math.floor(azar(W) * 9000));

  /* Búsquedas */
  const negocio = (W, id) => W.negocios.find((n) => n.id === id);
  const repartidor = (W, id) => W.repartidores.find((r) => r.id === id);
  const cliente = (W, id) => W.clientes.find((c) => c.id === id);
  const pedido = (W, id) => W.pedidos.find((p) => p.id === +id);
  const activo = (p) => !TERMINALES.includes(p.estado);
  const activoDe = (W, repaId) => W.pedidos.find((p) => activo(p) && p.asignacion.repaId === repaId) || null;
  const ofertaPara = (W, repaId) => W.pedidos.find((p) => activo(p) && p.asignacion.oferta && p.asignacion.oferta.repaId === repaId) || null;

  /* ------------------------------------------------------------------ */
  /* Dinero: libro de movimientos                                        */
  /* Cuentas: repa:<id>, neg:<id>, cli:<id> (positivo = De Una le debe,  */
  /* negativo = le debe a De Una) y du:<línea> (resultados de De Una).   */
  /* ------------------------------------------------------------------ */
  function mov(W, cuenta, monto, concepto, pedidoId = null) {
    monto = r2(monto);
    if (!monto) return;
    W.movimientos.push({ id: W.sec.mov++, t: W.reloj, cuenta, monto, concepto, pedidoId });
  }
  const saldo = (W, cuenta) => r2(suma(W.movimientos.filter((m) => m.cuenta === cuenta), (m) => m.monto));
  const movimientosDe = (W, cuenta) => W.movimientos.filter((m) => m.cuenta === cuenta);
  function flujo(W, p, de, a, monto, concepto) {
    monto = r2(monto);
    if (monto > 0) p.flujos.push({ de, a, monto, concepto, t: W.reloj });
  }
  function hist(W, p, quien, texto) { p.historial.push({ t: W.reloj, quien, texto }); }
  function bit(W, actor, texto) {
    W.bitacora.unshift({ t: W.reloj, quien: (actor && actor.nombre) || (actor && actor.rol) || 'Sistema', texto });
  }

  /* ------------------------------------------------------------------ */
  /* Zonas, horarios y productos                                         */
  /* ------------------------------------------------------------------ */
  function distZona(W, a, b) {
    if (a === b) return 0;
    if (a === W.config.lejana || b === W.config.lejana) return 2;
    return 1;
  }
  function envioBase(W, a, b) { const t = W.config.tarifas; return [t.mismo, t.cerca, t.lejos][distZona(W, a, b)]; }
  const viajeMin = (W, a, b) => VIAJE_MIN[distZona(W, a, b)];

  function negocioAbierto(W, n) {
    if (n.pausa === 'pago') return { ok: false, motivo: 'Pausado por mensualidad vencida' };
    if (n.pausa === 'sin_respuesta') return { ok: false, motivo: 'Pausado: no respondió pedidos' };
    if (n.pausa) return { ok: false, motivo: 'Pausado' };
    if (!n.abierto) return { ok: false, motivo: 'Cerrado por ahora' };
    const op = W.config.operacion, h = W.reloj % 1440;
    const abre = Math.max(op.abre, n.horario.abre), cierra = Math.min(op.cierra, n.horario.cierra);
    if (h < abre || h >= cierra) return { ok: false, motivo: 'Abre a las ' + hora(abre) };
    return { ok: true };
  }
  function alcoholPermitido(W) {
    const op = W.config.operacion;
    if (op.leySeca) return { ok: false, motivo: 'Hoy hay ley seca: no se vende alcohol' };
    if (W.reloj % 1440 >= op.alcoholHasta) return { ok: false, motivo: 'El alcohol se vende hasta las ' + hora(op.alcoholHasta) };
    return { ok: true };
  }
  const precioMaxGas = (W, m) => r2(W.config.gas.precioMaxKg * m.kg);
  const precioGasOk = (W, m) => !m.kg || m.p <= precioMaxGas(W, m);
  function productoVendible(W, n, m) {
    if (!m.on) return { ok: false, motivo: 'Agotado' };
    if (m.receta === 'antibiotico') return { ok: false, motivo: 'Los antibióticos solo se venden en mostrador con receta' };
    if (m.alcohol) { const a = alcoholPermitido(W); if (!a.ok) return a; }
    if (m.kg && !precioGasOk(W, m)) return { ok: false, motivo: `El precio pasa el máximo oficial ($${precioMaxGas(W, m)})` };
    return { ok: true };
  }

  /* ------------------------------------------------------------------ */
  /* Confianza del cliente, promociones y riesgo                          */
  /* ------------------------------------------------------------------ */
  const claveDireccion = (c) => norm(c.dir + c.fracc);
  const cuentasEnDispositivo = (W, dev) => W.clientes.filter((c) => c.dispositivo === dev).length;
  const reclamosRecientes = (W, c) => W.incidencias.filter((i) => i.clienteId === c.id && i.tipo !== 'cliente_ausente' && W.reloj - i.t <= 30 * 1440).length;
  function saldoDisponibleCliente(W, c) { return Math.max(0, r2(saldo(W, 'cli:' + c.id) - (c.creditoReservado || 0))); }

  function nivelCliente(W, c) {
    const L = W.config.limites;
    if (c.bloqueado) return { nivel: 'bloqueado', etiqueta: 'Cuenta bloqueada', efectivoMax: 0, motivo: 'Tu cuenta está bloqueada. Escríbenos.' };
    const deuda = saldo(W, 'cli:' + c.id) < 0;
    if (deuda || c.noShows > 0 || c.cancelTardias >= 2) {
      const motivo = deuda ? 'Tienes un adeudo pendiente: por ahora solo pago por adelantado'
        : c.noShows > 0 ? 'Por un pedido que no recibiste, por ahora solo pago por adelantado'
          : 'Cancelaste 2 pedidos que ya se preparaban: por ahora solo pago por adelantado';
      return { nivel: 'restringido', etiqueta: 'Solo pago por adelantado', efectivoMax: 0, motivo };
    }
    if (c.pedidosOk < L.pedidosNuevo) return { nivel: 'nuevo', etiqueta: 'Cliente nuevo', efectivoMax: L.efectivoNuevo, motivo: `En tus primeros ${L.pedidosNuevo} pedidos el efectivo es para compras de hasta $${L.efectivoNuevo}` };
    return { nivel: 'confiable', etiqueta: 'Cliente confiable', efectivoMax: L.efectivoMax, motivo: `Compras de más de $${L.efectivoMax} se pagan por adelantado` };
  }

  function motivoSinBienvenida(W, c) {
    if (!W.config.promos.bienvenida) return 'La promo de bienvenida está apagada';
    if (c.bienvenidaUsada || c.pedidosOk > 0) return 'Ya usaste tu promo de bienvenida';
    if (W.promoUsada.direcciones.includes(claveDireccion(c))) return 'Esta dirección ya usó la promo de bienvenida';
    if (W.promoUsada.dispositivos.includes(c.dispositivo)) return 'Este celular ya usó la promo de bienvenida';
    return null;
  }
  const bienvenidaElegible = (W, c) => !motivoSinBienvenida(W, c);
  function plusAplica(W, c, S) {
    const pl = W.config.plus;
    return !!(c.plus && c.plus.activo && S >= pl.envioGratisDesde && c.plus.enviosUsados < pl.enviosMes);
  }

  function riesgo(W, c, pago, T) {
    const motivos = []; let pts = 0;
    const L = W.config.limites, niv = nivelCliente(W, c);
    if (niv.nivel === 'nuevo' && pago === 'efectivo') { pts += 1; motivos.push('Cliente nuevo pagando en efectivo'); }
    const cuentas = cuentasEnDispositivo(W, c.dispositivo);
    if (cuentas >= 3) { pts += 2; motivos.push(`Su celular tiene ${cuentas} cuentas`); }
    const rec = reclamosRecientes(W, c);
    if (rec >= L.reclamosMes) { pts += 2; motivos.push(`${rec} reclamos en 30 días`); }
    if (W.direccionesMarcadas.includes(claveDireccion(c))) { pts += 3; motivos.push('Dirección con un pedido no recibido'); }
    if (pago === 'efectivo' && T > 600) { pts += 1; motivos.push('Monto alto en efectivo'); }
    if (pago === 'efectivo' && niv.nivel === 'nuevo' && W.reloj % 1440 >= 1320) { pts += 1; motivos.push('De noche, cliente nuevo y en efectivo'); }
    return { nivel: pts >= 3 ? 'alto' : pts >= 1 ? 'medio' : 'bajo', puntos: pts, motivos };
  }

  /* ------------------------------------------------------------------ */
  /* Cotizar: el desglose exacto que ve el cliente antes de pedir        */
  /* T = S + E + L + PP + V + P − Dm − Dn − Dc                            */
  /* ------------------------------------------------------------------ */
  function cotizar(W, q) {
    const cfg = W.config, t = cfg.tarifas, c = cliente(W, q.clienteId);
    if (!c) return { errores: ['No encontramos tu cuenta'] };
    const errores = [], avisos = [], requisitos = { mayorEdad: false, receta: false };
    if (c.bloqueado) errores.push('Tu cuenta está bloqueada. Escríbenos.');
    let n = null, items = [], S = 0, E = 0, entrega = 'deuna', origen = c.fracc;
    if (q.tipo === 'mandado') {
      E = t.mandado; origen = q.origen || c.fracc;
      const pres = Math.max(0, Math.round(+q.presupuesto || 0));
      if (pres <= 0 && !q.soloRecoger) errores.push('Escribe cuánto crees que cueste');
      if (pres > cfg.limites.adelantoMandado) errores.push(`Por ahora los mandados son de hasta $${cfg.limites.adelantoMandado}`);
      items = [{ id: 'mandado', n: q.descripcion || 'Mandado', p: pres, q: 1, il: 'bag' }];
      S = pres;
    } else {
      n = negocio(W, q.negocioId);
      if (!n) return { errores: ['No encontramos el negocio'] };
      const ab = negocioAbierto(W, n);
      if (!ab.ok) errores.push(`${n.nombre}: ${ab.motivo}`);
      entrega = n.entregaPropia ? 'propia' : 'deuna';
      origen = n.fracc;
      for (const it of q.items || []) {
        const m = n.menu.find((x) => x.id === it.id);
        if (!m || !(it.q > 0)) continue;
        const v = productoVendible(W, n, m);
        if (!v.ok) errores.push(`${m.n}: ${v.motivo}`);
        if (m.alcohol) requisitos.mayorEdad = true;
        if (m.receta === 'requerida') requisitos.receta = true;
        items.push({ id: m.id, n: m.n, p: m.p, q: it.q, il: m.il, alcohol: !!m.alcohol, receta: m.receta || 'no' });
      }
      if (!items.length) errores.push('Tu carrito está vacío');
      S = r2(suma(items, (i) => i.p * i.q));
      E = entrega === 'propia' ? 0 : envioBase(W, n.fracc, c.fracc);
    }
    const propia = entrega === 'propia';
    const L = !propia && t.lluvia.activa ? t.lluvia.extra : 0;
    const PP = q.tipo !== 'mandado' && !propia && S > 0 && S < t.pedidoPequeno.umbral ? t.pedidoPequeno.cargo : 0;
    const V = t.servicio;
    const P = Math.max(0, Math.round(+q.propina || 0));
    const descuentos = [];
    let Dm = 0, Dn = 0, promo = null;
    if (E > 0 && n && n.envioGratis) {
      Dn = E; descuentos.push({ etq: `Envío gratis, cortesía de ${n.nombre}`, monto: E, fondeo: 'negocio' });
    } else if (E > 0 && bienvenidaElegible(W, c)) {
      Dm = Math.min(E, cfg.promos.bienvenidaTope); promo = 'bienvenida';
      descuentos.push({ etq: 'Bienvenida: tu primer envío es gratis', monto: Dm, fondeo: 'deuna' });
    } else if (E > 0 && q.tipo !== 'mandado' && !propia && plusAplica(W, c, S)) {
      Dm = E; promo = 'plus';
      descuentos.push({ etq: 'De Una Plus: envío gratis', monto: E, fondeo: 'deuna' });
    }
    let T = r2(S + E + L + PP + V + P - Dm - Dn);
    let Dc = 0;
    if (q.usarSaldo !== false) {
      Dc = r2(Math.min(saldoDisponibleCliente(W, c), T));
      if (Dc > 0) descuentos.push({ etq: 'Tu saldo a favor', monto: Dc, fondeo: 'saldo' });
    }
    T = r2(T - Dc);

    const niv = nivelCliente(W, c);
    const riesgoEf = riesgo(W, c, 'efectivo', T);
    let efectivo = { ok: true };
    if (niv.efectivoMax <= 0) efectivo = { ok: false, motivo: niv.motivo };
    else if (S > niv.efectivoMax) efectivo = { ok: false, motivo: niv.motivo };
    else if (riesgoEf.nivel === 'alto') efectivo = { ok: false, motivo: 'Por seguridad, este pedido se paga por adelantado' };
    const metodos = {
      efectivo,
      transferencia: q.tipo === 'mandado' ? { ok: false, motivo: 'Los mandados se pagan al recibir: el repartidor compra con su dinero' } : c.bloqueado ? { ok: false, motivo: niv.motivo } : { ok: true },
      tarjeta: { ok: false, motivo: 'Próximamente' },
    };
    if (q.pago && metodos[q.pago] && !metodos[q.pago].ok) errores.push(metodos[q.pago].motivo);
    if (L) avisos.push(`Está lloviendo: el envío sube $${L} y todo es para tu repartidor`);
    if (requisitos.mayorEdad) avisos.push('Trae alcohol: el repartidor te pedirá tu INE al entregar');
    if (requisitos.receta) avisos.push('Trae medicamento con receta: sube la foto de tu receta');
    return {
      tipo: q.tipo, negocioId: n ? n.id : null, entrega, origen, items,
      S, E, L, PP, V, P, Dm, Dn, Dc, T, promo, descuentos, metodos, nivel: niv,
      riesgo: q.pago === 'efectivo' ? riesgoEf : riesgo(W, c, q.pago, T),
      requisitos, errores, avisos,
    };
  }

  /* ------------------------------------------------------------------ */
  /* Crear pedido                                                        */
  /* ------------------------------------------------------------------ */
  function crearPedido(W, q) {
    const cot = cotizar(W, q);
    if (!cot.errores) return err('No se pudo cotizar');
    if (!q.pago) cot.errores.push('Elige cómo vas a pagar');
    if (cot.requisitos.mayorEdad && !q.mayorEdad) cot.errores.push('Confirma que eres mayor de 18 años');
    if (cot.requisitos.receta && !q.recetaFoto) cot.errores.push('Sube la foto de tu receta');
    if (cot.errores.length) return { ok: false, error: cot.errores[0], errores: cot.errores };
    const c = cliente(W, q.clienteId);
    const p = {
      id: W.sec.pedido++, tipo: q.tipo, clienteId: c.id, negocioId: cot.negocioId, entrega: cot.entrega,
      origen: cot.origen, destino: c.fracc, dir: c.dir, lugar: q.lugar || '',
      items: clonar(cot.items), removidos: [], cot, pago: q.pago, pagaCon: q.pagaCon || null,
      sustitucion: q.sustitucion || 'quitar', nota: q.nota || '',
      mayorEdad: !!q.mayorEdad, recetaFoto: !!q.recetaFoto, requiereReceta: cot.requisitos.receta, tieneAlcohol: cot.requisitos.mayorEdad,
      estado: null, pin: nuevoPin(W), pinIntentos: 0, pinOmitido: false, prep: null, eta: null,
      asignacion: { repaId: null, oferta: null, rechazos: [], desde: null, bono: 0 },
      repaEnTienda: false, llamadas: 0, ticket: null,
      t: { creado: W.reloj }, historial: [], flujos: [], cancelacion: null, calif: null,
      riesgo: cot.riesgo, promoUsada: cot.promo, referencia: null,
    };
    if (cot.promo === 'bienvenida') {
      c.bienvenidaUsada = true;
      W.promoUsada.direcciones.push(claveDireccion(c));
      W.promoUsada.dispositivos.push(c.dispositivo);
    }
    if (cot.promo === 'plus') c.plus.enviosUsados++;
    if (cot.Dc) c.creditoReservado = r2((c.creditoReservado || 0) + cot.Dc);
    W.pedidos.push(p);
    hist(W, p, 'cliente', `${c.nombre} hizo el pedido (${q.pago === 'efectivo' ? 'efectivo' : 'transferencia'})`);
    if (q.pago === 'transferencia') {
      p.estado = 'pago_pendiente';
      p.referencia = 'DU-' + p.id;
      hist(W, p, 'sistema', `Esperando la transferencia con referencia ${p.referencia}`);
    } else arrancar(W, p);
    return { ok: true, pedido: p };
  }
  function arrancar(W, p) {
    if (p.tipo === 'mandado') {
      p.estado = 'buscando';
      p.eta = W.reloj + 35 + viajeMin(W, p.origen, p.destino);
      despachar(W, p);
    } else {
      p.estado = 'nuevo';
      p.t.enviado = W.reloj;
    }
  }

  /* ------------------------------------------------------------------ */
  /* Asignación de repartidores                                          */
  /* ------------------------------------------------------------------ */
  const tasa = (r) => r2(r.ofertas.aceptadas / Math.max(1, r.ofertas.recibidas));
  const necesitaRepa = (p) => p.entrega === 'deuna' && !p.asignacion.repaId && ['preparando', 'listo', 'buscando'].includes(p.estado);

  function candidatos(W, p) {
    const origen = p.negocioId ? negocio(W, p.negocioId).fracc : p.origen;
    return W.repartidores.filter((r) => r.aprobado).map((r) => {
      let motivo = null;
      if (!r.enLinea) motivo = 'Desconectado';
      else if (r.suspendido) motivo = 'Suspendido por efectivo sin entregar';
      else if (activoDe(W, r.id)) motivo = 'Ocupado con otro pedido';
      else if (p.pago === 'efectivo' && saldo(W, 'repa:' + r.id) <= -W.config.limites.efectivoRepa) motivo = 'Trae mucho efectivo por entregar';
      else if (p.asignacion.rechazos.includes(r.id)) motivo = 'Ya rechazó este pedido';
      const d = distZona(W, r.zona, origen);
      const puntos = d * 30 + (5 - r.rating) * 20 + (1 - r.aceptacion) * 20 + r.entregasHoy * 2;
      return { repa: r, motivo, dist: d, puntos: r2(puntos) };
    }).sort((a, b) => (a.motivo ? 1 : 0) - (b.motivo ? 1 : 0) || a.puntos - b.puntos);
  }
  function despachar(W, p) {
    if (!necesitaRepa(p) || p.asignacion.oferta) return;
    if (p.asignacion.desde == null) p.asignacion.desde = W.reloj;
    const libre = candidatos(W, p).find((x) => !x.motivo);
    if (!libre) {
      if (!p.asignacion.avisado) { hist(W, p, 'sistema', 'No hay repartidores libres; seguimos buscando'); p.asignacion.avisado = true; }
      return;
    }
    const r = libre.repa;
    r.ofertas.recibidas++;
    r.aceptacion = tasa(r);
    p.asignacion.oferta = { repaId: r.id, hasta: W.reloj + W.config.tiempos.oferta };
    hist(W, p, 'sistema', `Se le ofreció el viaje a ${r.nombre}`);
    if (r.simulado) asignar(W, p, r, 'aceptó el viaje');
  }
  function asignar(W, p, r, como) {
    p.asignacion.repaId = r.id;
    p.asignacion.oferta = null;
    p.repaEnTienda = false;
    r.ofertas.aceptadas++;
    r.aceptacion = tasa(r);
    if (p.tipo === 'mandado' && p.estado === 'buscando') p.estado = 'comprando';
    p.t.asignado = W.reloj;
    hist(W, p, 'sistema', `${r.nombre} ${como}`);
  }

  /* ------------------------------------------------------------------ */
  /* Reglas: quién puede hacer qué y cuándo                              */
  /* Devuelve un texto con el motivo si NO se puede, o null si sí.        */
  /* ------------------------------------------------------------------ */
  const esNeg = (a, p) => a.rol === 'negocio' && a.id === p.negocioId;
  const esRepa = (a, p) => a.rol === 'repartidor' && a.id === p.asignacion.repaId;
  const esCli = (a, p) => a.rol === 'cliente' && a.id === p.clienteId;
  const esAdmin = (a) => a.rol === 'admin' || a.rol === 'sistema';
  const repartePropio = (a, p) => p.entrega === 'propia' ? esNeg(a, p) : esRepa(a, p);

  function validar(W, p, acc, a, d = {}) {
    if (!p) return 'No existe el pedido';
    const e = p.estado, T = W.config.tiempos;
    if (TERMINALES.includes(e) && !['calificar'].includes(acc)) return 'El pedido ya terminó';
    switch (acc) {
      case 'confirmar_pago':
        if (!esAdmin(a)) return 'El pago se confirma solo cuando llega a la cuenta de De Una';
        return e === 'pago_pendiente' ? null : 'Este pedido no está esperando pago';
      case 'aceptar':
        if (!esNeg(a, p) && !esAdmin(a)) return 'Solo el negocio acepta pedidos';
        if (e !== 'nuevo') return 'Este pedido ya no está esperando';
        if (![10, 20, 30, 45].includes(+d.prep)) return 'Elige el tiempo de preparación';
        if (p.requiereReceta && !d.recetaOk) return 'Revisa la receta y confírmala antes de aceptar';
        if ((d.agotados || []).length && p.sustitucion === 'llamar' && !['quitar', 'cancelar'].includes(d.decision)) return 'Llama al cliente y elige qué hacer con lo que no hay';
        return null;
      case 'rechazar':
        if (!esNeg(a, p) && !esAdmin(a)) return 'Solo el negocio rechaza pedidos';
        if (e !== 'nuevo') return 'Ya no se puede rechazar';
        return d.motivo ? null : 'Elige un motivo';
      case 'listo':
        if (!esNeg(a, p)) return 'Solo el negocio marca listo';
        if (p.entrega !== 'deuna') return 'Este pedido lo entregas tú';
        return e === 'preparando' ? null : 'El pedido no está en preparación';
      case 'entregar_a_repa':
        if (!esNeg(a, p)) return 'Solo el negocio entrega al repartidor';
        if (e !== 'listo') return 'Marca el pedido como listo primero';
        if (!p.asignacion.repaId) return 'Todavía no hay repartidor asignado';
        if (!p.repaEnTienda) return 'El repartidor aún no llega a tu tienda';
        return null;
      case 'salio':
        if (!esNeg(a, p)) return 'Solo el negocio';
        if (p.entrega !== 'propia') return 'Este pedido lo lleva un repartidor de De Una';
        return e === 'preparando' ? null : 'El pedido no está en preparación';
      case 'aceptar_oferta':
      case 'rechazar_oferta':
        if (a.rol !== 'repartidor' || !p.asignacion.oferta || p.asignacion.oferta.repaId !== a.id) return 'Esta oferta ya no es para ti';
        if (acc === 'aceptar_oferta' && activoDe(W, a.id)) return 'Termina tu viaje actual';
        return null;
      case 'llegue_tienda':
        if (!esRepa(a, p)) return 'Este viaje no es tuyo';
        if (!['preparando', 'listo'].includes(e)) return 'Ya recogiste el pedido';
        return p.repaEnTienda ? 'Ya avisaste que llegaste' : null;
      case 'soltar':
        if (!esRepa(a, p)) return 'Este viaje no es tuyo';
        return ['preparando', 'listo', 'comprando'].includes(e) && !p.ticket ? null : 'Ya no puedes soltar este viaje';
      case 'enviar_ticket':
        if (!esRepa(a, p)) return 'Este viaje no es tuyo';
        if (e !== 'comprando') return 'Este mandado no está en compra';
        if (!(+d.monto >= 0) || d.monto === '' || d.monto == null) return 'Escribe el total del ticket';
        if (+d.monto > W.config.limites.adelantoMandado) return `Lo máximo que adelantas es $${W.config.limites.adelantoMandado}: llama al cliente`;
        return d.foto === false ? 'Toma la foto del ticket' : null;
      case 'aprobar_ticket':
      case 'rechazar_ticket':
        if (!esCli(a, p) && !esAdmin(a)) return 'Solo el cliente aprueba el ticket';
        return e === 'por_aprobar' ? null : 'No hay ticket por revisar';
      case 'llegue_domicilio':
        if (!repartePropio(a, p)) return 'Este viaje no es tuyo';
        return e === 'en_camino' ? null : 'Todavía no vas en camino';
      case 'llamar_cliente':
        if (!repartePropio(a, p)) return 'Este viaje no es tuyo';
        return e === 'en_puerta' ? null : 'Primero avisa que llegaste';
      case 'entregar':
        if (!repartePropio(a, p)) return 'Este viaje no es tuyo';
        if (e !== 'en_puerta') return 'Primero avisa que llegaste';
        if (p.tieneAlcohol && !d.ine) return 'Revisa la INE: el pedido trae alcohol';
        return null;
      case 'cliente_ausente': {
        if (!repartePropio(a, p)) return 'Este viaje no es tuyo';
        if (e !== 'en_puerta') return 'Primero avisa que llegaste';
        const falta = T.espera - (W.reloj - p.t.llegada);
        if (falta > 0) return `Espera ${T.espera} min desde que llegaste (faltan ${falta})`;
        return p.llamadas >= 2 ? null : 'Llama al cliente al menos 2 veces desde la app';
      }
      case 'cancelar':
        if (!d.motivo) return 'Elige un motivo';
        if (esAdmin(a)) return null;
        if (esCli(a, p)) {
          if (['en_camino', 'en_puerta', 'por_aprobar'].includes(e)) return 'Tu pedido ya va en camino. Escríbenos desde Ayuda.';
          if (e === 'comprando') return 'El repartidor ya está comprando tu mandado. Escríbenos desde Ayuda.';
          return null;
        }
        if (esNeg(a, p)) return ['nuevo', 'preparando', 'listo'].includes(e) ? null : 'Ya entregaste el pedido';
        return 'No puedes cancelar este pedido';
      case 'autorizar_sin_pin':
        if (!esAdmin(a)) return 'Solo De Una puede autorizarlo';
        return ['en_camino', 'en_puerta'].includes(e) ? null : 'Solo cuando va en camino';
      case 'asignar':
      case 'subir_bono':
        if (!esAdmin(a)) return 'Solo De Una';
        if (p.entrega !== 'deuna') return 'Este pedido lo entrega el negocio';
        if (!['preparando', 'listo', 'buscando', 'comprando'].includes(e) || (p.estado !== 'buscando' && p.repaEnTienda && acc === 'asignar')) return 'Ya no se puede cambiar el repartidor';
        if (acc === 'subir_bono') return +d.monto > 0 ? null : 'Escribe el monto del bono';
        if (!repartidor(W, d.repaId)) return 'Elige un repartidor';
        if (activoDe(W, d.repaId) && activoDe(W, d.repaId).id !== p.id) return 'Ese repartidor está ocupado';
        return null;
      case 'calificar':
        if (!esCli(a, p)) return 'Solo el cliente califica';
        if (e !== 'entregado') return 'Califica cuando recibas tu pedido';
        return p.calif ? 'Ya calificaste este pedido' : null;
      default:
        return 'Acción desconocida';
    }
  }

  /* ------------------------------------------------------------------ */
  /* Ejecutar una acción sobre un pedido                                 */
  /* ------------------------------------------------------------------ */
  function ejecutar(W, pedidoId, acc, a, d = {}) {
    const p = pedido(W, pedidoId);
    const e = validar(W, p, acc, a, d);
    if (e) return err(e);
    const r = aplicar(W, p, acc, a, d) || {};
    if (r.error) return err(r.error);
    revisarCuentas(W);
    return { ok: true, ...r };
  }

  function aplicar(W, p, acc, a, d) {
    const c = cliente(W, p.clienteId), n = p.negocioId ? negocio(W, p.negocioId) : null;
    const r = p.asignacion.repaId ? repartidor(W, p.asignacion.repaId) : null;
    switch (acc) {
      case 'confirmar_pago':
        flujo(W, p, 'cli', 'du', p.cot.T, 'Transferencia recibida');
        p.t.pagado = W.reloj;
        hist(W, p, 'sistema', `Llegó la transferencia de $${p.cot.T}`);
        arrancar(W, p);
        return;
      case 'aceptar': {
        const agotados = (d.agotados || []).map(Number);
        if (agotados.length) {
          const pref = p.sustitucion === 'llamar' ? d.decision : p.sustitucion;
          const quedan = p.items.filter((i) => !agotados.includes(i.id));
          if (pref === 'cancelar' || !quedan.length) {
            cancelarInterno(W, p, a, 'No había los productos', { sinPenalizar: true });
            return { cancelado: true };
          }
          const antes = p.cot.T;
          p.removidos = p.items.filter((i) => agotados.includes(i.id));
          p.items = quedan;
          recotizar(W, p);
          hist(W, p, 'negocio', `No había ${p.removidos.map((i) => i.n).join(', ')}: se quitó del pedido`);
          if (p.pago === 'transferencia' && antes > p.cot.T) flujo(W, p, 'du', 'cli', antes - p.cot.T, 'Reembolso por productos que no había');
        }
        p.estado = 'preparando';
        p.prep = +d.prep;
        p.t.aceptado = W.reloj;
        p.eta = W.reloj + p.prep + viajeMin(W, p.origen, p.destino) + 3;
        n.perdidos = 0;
        n.met.aceptados++;
        hist(W, p, 'negocio', `${n.nombre} aceptó el pedido (${p.prep} min)`);
        if (p.entrega === 'deuna') despachar(W, p);
        return;
      }
      case 'rechazar':
        n.met.rechazados++;
        cancelarInterno(W, p, a, d.motivo, { sinPenalizar: true });
        return;
      case 'listo':
        p.estado = 'listo';
        p.t.listo = W.reloj;
        hist(W, p, 'negocio', 'El pedido está listo');
        return;
      case 'entregar_a_repa':
        p.estado = 'en_camino';
        p.t.recogido = W.reloj;
        if (p.pago === 'efectivo') flujo(W, p, 'repa', 'neg', p.cot.S, 'Pago en tienda');
        hist(W, p, 'negocio', `${n.nombre} entregó el pedido a ${r.nombre}${p.pago === 'efectivo' ? ` y cobró $${p.cot.S}` : ''}`);
        return;
      case 'salio':
        p.estado = 'en_camino';
        p.t.recogido = W.reloj;
        hist(W, p, 'negocio', `${n.nombre} salió a entregar`);
        return;
      case 'aceptar_oferta':
        asignar(W, p, repartidor(W, a.id), 'aceptó el viaje');
        return;
      case 'rechazar_oferta': {
        const yo = repartidor(W, a.id);
        p.asignacion.rechazos.push(yo.id);
        p.asignacion.oferta = null;
        hist(W, p, 'sistema', `${yo.nombre} rechazó el viaje`);
        despachar(W, p);
        return;
      }
      case 'llegue_tienda':
        p.repaEnTienda = true;
        p.t.enTienda = W.reloj;
        hist(W, p, 'repartidor', `${r.nombre} llegó a la tienda`);
        return;
      case 'soltar':
        p.asignacion.rechazos.push(r.id);
        p.asignacion.repaId = null;
        p.repaEnTienda = false;
        r.ofertas.aceptadas = Math.max(0, r.ofertas.aceptadas - 1);
        r.aceptacion = tasa(r);
        if (p.tipo === 'mandado') p.estado = 'buscando';
        hist(W, p, 'repartidor', `${r.nombre} soltó el viaje`);
        despachar(W, p);
        return;
      case 'enviar_ticket':
        p.ticket = { monto: Math.round(+d.monto), foto: true, t: W.reloj, disputa: false };
        flujo(W, p, 'repa', 'tienda', p.ticket.monto, 'Compra del mandado');
        p.estado = 'por_aprobar';
        hist(W, p, 'repartidor', `${r.nombre} compró y subió el ticket: $${p.ticket.monto}`);
        return;
      case 'aprobar_ticket':
        p.items[0].p = p.ticket.monto;
        recotizar(W, p);
        p.ticket.disputa = false;
        p.estado = 'en_camino';
        p.t.recogido = W.reloj;
        hist(W, p, a.rol === 'cliente' ? 'cliente' : 'deuna', `Ticket aprobado: $${p.ticket.monto}`);
        return;
      case 'rechazar_ticket':
        p.ticket.disputa = true;
        hist(W, p, 'cliente', 'El cliente no está de acuerdo con el ticket');
        abrirIncidencia(W, p.id, SISTEMA, { tipo: 'ticket', detalle: 'El cliente no aprobó el ticket del mandado' });
        return;
      case 'llegue_domicilio':
        p.estado = 'en_puerta';
        p.t.llegada = W.reloj;
        hist(W, p, p.entrega === 'propia' ? 'negocio' : 'repartidor', 'Llegó al domicilio');
        return;
      case 'llamar_cliente':
        p.llamadas++;
        hist(W, p, p.entrega === 'propia' ? 'negocio' : 'repartidor', `Llamó al cliente (${p.llamadas})`);
        return;
      case 'entregar': {
        if (!p.pinOmitido && String(d.pin || '').trim() !== p.pin) {
          p.pinIntentos++;
          hist(W, p, 'sistema', `Código de entrega equivocado (${p.pinIntentos})`);
          return { error: p.pinIntentos >= W.config.limites.intentosPin ? 'Código equivocado otra vez. Ya avisamos a De Una para revisarlo.' : 'Código incorrecto. Pídele al cliente su código de 4 dígitos.' };
        }
        p.estado = 'entregado';
        p.t.entregado = W.reloj;
        if (p.pago === 'efectivo') flujo(W, p, 'cli', p.entrega === 'propia' ? 'neg' : 'repa', p.cot.T, 'Cobro en efectivo');
        liquidar(W, p);
        c.pedidosOk++;
        if (r) r.entregasHoy++;
        if (n) n.met.entregados++;
        premioVecino(W, c, p);
        hist(W, p, p.entrega === 'propia' ? 'negocio' : 'repartidor', p.pinOmitido ? 'Entregado (autorizado por De Una sin código)' : 'Entregado con el código del cliente');
        return;
      }
      case 'cliente_ausente':
        p.estado = 'no_entregado';
        p.t.cerrado = W.reloj;
        liquidarAusente(W, p);
        c.noShows++;
        if (!W.direccionesMarcadas.includes(claveDireccion(c))) W.direccionesMarcadas.push(claveDireccion(c));
        hist(W, p, p.entrega === 'propia' ? 'negocio' : 'repartidor', `El cliente no salió después de ${W.reloj - p.t.llegada} min y ${p.llamadas} llamadas`);
        abrirIncidencia(W, p.id, SISTEMA, { tipo: 'cliente_ausente', detalle: 'Revisar y confirmar el adeudo' });
        return;
      case 'cancelar':
        cancelarInterno(W, p, a, d.motivo);
        return;
      case 'autorizar_sin_pin':
        p.pinOmitido = true;
        hist(W, p, 'deuna', 'De Una autorizó entregar sin código');
        bit(W, a, `Autorizó entregar sin código el pedido #${p.id}`);
        return;
      case 'asignar': {
        const nuevo = repartidor(W, d.repaId);
        if (p.asignacion.repaId && p.asignacion.repaId !== nuevo.id) hist(W, p, 'deuna', `Se le quitó el viaje a ${r.nombre}`);
        p.asignacion.oferta = null;
        nuevo.ofertas.recibidas++;
        asignar(W, p, nuevo, 'quedó asignado por De Una');
        bit(W, a, `Asignó el pedido #${p.id} a ${nuevo.nombre}`);
        return;
      }
      case 'subir_bono':
        p.asignacion.bono = r2(p.asignacion.bono + +d.monto);
        p.asignacion.rechazos = [];
        p.asignacion.avisado = false;
        hist(W, p, 'deuna', `De Una subió el bono del viaje a $${p.asignacion.bono}`);
        bit(W, a, `Subió el bono del pedido #${p.id} a $${p.asignacion.bono}`);
        despachar(W, p);
        return;
      case 'calificar':
        p.calif = { repa: +d.repa || null, neg: +d.neg || null };
        if (r && d.repa) r.rating = r2((r.rating * 49 + +d.repa) / 50);
        if (n && d.neg) n.rating = r2((n.rating * 49 + +d.neg) / 50);
        return;
    }
  }

  function recotizar(W, p) {
    const c = p.cot, t = W.config.tarifas;
    c.items = clonar(p.items);
    c.S = r2(suma(p.items, (i) => i.p * i.q));
    const pp = p.tipo === 'tienda' && p.entrega === 'deuna' && c.S > 0 && c.S < t.pedidoPequeno.umbral ? t.pedidoPequeno.cargo : 0;
    c.PP = Math.min(c.PP, pp); // quitar productos nunca sube el cobro
    const antes = r2(c.S + c.E + c.L + c.PP + c.V + c.P - c.Dm - c.Dn);
    const dc = r2(Math.min(c.Dc, Math.max(0, antes)));
    if (dc !== c.Dc) {
      const cli = cliente(W, p.clienteId);
      cli.creditoReservado = r2(cli.creditoReservado - (c.Dc - dc));
      c.Dc = dc;
    }
    c.T = r2(antes - c.Dc);
  }

  /* ------------------------------------------------------------------ */
  /* Liquidaciones: cómo se reparte el dinero de cada pedido             */
  /* ------------------------------------------------------------------ */
  function liquidar(W, p) {
    const c = p.cot, k = W.config.tarifas.repaPct / 100, id = p.id;
    const cli = cliente(W, p.clienteId), B = p.asignacion.bono || 0;
    if (p.entrega === 'deuna') {
      const repa = 'repa:' + p.asignacion.repaId;
      mov(W, repa, c.E * k, `Envío (${W.config.tarifas.repaPct} %)`, id);
      mov(W, repa, c.L, 'Extra por lluvia', id);
      mov(W, repa, c.PP, 'Cargo por pedido pequeño', id);
      mov(W, repa, c.P, 'Propina', id);
      mov(W, repa, B, 'Bono extra de De Una', id);
      if (p.pago === 'efectivo') {
        const pagadoEnTienda = p.tipo === 'mandado' ? (p.ticket ? p.ticket.monto : 0) : c.S;
        mov(W, repa, -(c.T - pagadoEnTienda), 'Efectivo cobrado que no es tuyo', id);
      }
      if (p.tipo === 'tienda') {
        if (p.pago !== 'efectivo') mov(W, 'neg:' + p.negocioId, c.S, 'Venta pagada en línea', id);
        if (c.Dn) mov(W, 'neg:' + p.negocioId, -c.Dn, 'Envío gratis que regalaste', id);
      }
      mov(W, 'du:servicio', c.V, 'Servicio', id);
      mov(W, 'du:envio', c.E * (1 - k), 'Parte del envío', id);
      if (c.Dm) mov(W, 'du:promos', -c.Dm, p.promoUsada === 'plus' ? 'Envío cubierto por Plus' : 'Promo de bienvenida', id);
      if (B) mov(W, 'du:bonos', -B, 'Bono al repartidor', id);
    } else {
      const neg = 'neg:' + p.negocioId;
      const derecho = c.S + c.E + c.P - c.Dn;
      if (p.pago === 'efectivo') mov(W, neg, -(c.T - derecho), 'Servicio De Una que cobraste al cliente', id);
      else mov(W, neg, derecho, 'Venta pagada en línea', id);
      mov(W, 'du:servicio', c.V, 'Servicio', id);
      if (c.Dm) mov(W, 'du:promos', -c.Dm, 'Promo de bienvenida', id);
    }
    if (c.Dc) {
      mov(W, 'cli:' + cli.id, -c.Dc, 'Usaste tu saldo a favor', id);
      cli.creditoReservado = r2(cli.creditoReservado - c.Dc);
    }
  }

  function liquidarAusente(W, p) {
    const c = p.cot, k = W.config.tarifas.repaPct / 100, id = p.id;
    const cli = cliente(W, p.clienteId), B = p.asignacion.bono || 0;
    if (p.pago !== 'efectivo') { // ya pagó: se cobra completo, como en las apps grandes
      liquidar(W, p);
      return;
    }
    liberarSaldo(W, p);
    if (p.entrega === 'propia') return; // el negocio absorbe; el cliente queda marcado
    const repa = 'repa:' + p.asignacion.repaId;
    const compra = p.tipo === 'mandado' ? (p.ticket ? p.ticket.monto : 0) : c.S;
    const viaje = c.E * k + c.L + c.PP + B;
    mov(W, repa, compra, p.tipo === 'mandado' ? 'Te reponemos la compra del mandado' : 'Te reponemos lo que pagaste en tienda', id);
    mov(W, repa, viaje, 'Tu viaje se paga aunque el cliente no salió', id);
    mov(W, 'du:garantia', -(compra + viaje), 'Pedido no recibido', id);
    const adeudo = r2(compra + c.E + c.V);
    mov(W, 'cli:' + cli.id, -adeudo, `Adeudo del pedido #${id} que no recibiste`, id);
    mov(W, 'du:adeudos', adeudo, `Adeudo por cobrar a ${cli.nombre}`, id);
  }

  function liberarSaldo(W, p) {
    if (!p.cot.Dc) return;
    const cli = cliente(W, p.clienteId);
    cli.creditoReservado = r2(cli.creditoReservado - p.cot.Dc);
  }
  function restaurarPromos(W, p) {
    const c = cliente(W, p.clienteId);
    if (p.promoUsada === 'bienvenida') {
      c.bienvenidaUsada = false;
      W.promoUsada.direcciones = W.promoUsada.direcciones.filter((x) => x !== claveDireccion(c));
      W.promoUsada.dispositivos = W.promoUsada.dispositivos.filter((x) => x !== c.dispositivo);
    }
    if (p.promoUsada === 'plus' && c.plus) c.plus.enviosUsados = Math.max(0, c.plus.enviosUsados - 1);
    liberarSaldo(W, p);
  }

  function politicaCancelacion(W, p, rol) {
    const a = { rol, id: rol === 'cliente' ? p.clienteId : rol === 'negocio' ? p.negocioId : null };
    const e = validar(W, p, 'cancelar', a, { motivo: 'x' });
    if (e) return { permitido: false, texto: e, costo: 0 };
    if (rol !== 'cliente') return { permitido: true, costo: 0, texto: 'Al cliente se le devuelve todo.' };
    if (['pago_pendiente', 'nuevo', 'buscando'].includes(p.estado)) return { permitido: true, costo: 0, texto: 'Cancelar no tiene costo porque nadie ha empezado.' };
    const pct = W.config.limites.cancelTardiaPct, cargo = Math.round(p.cot.S * pct / 100);
    if (p.pago === 'efectivo') return { permitido: true, costo: 0, texto: 'El negocio ya está preparando tu pedido. Si cancelas, cuenta como cancelación tardía: con 2, solo podrás pagar por adelantado.' };
    return { permitido: true, costo: cargo, texto: `El negocio ya está preparando tu pedido. Si cancelas, se le pagan $${cargo} (el ${pct} %) por los insumos y te devolvemos $${r2(p.cot.T - cargo)}.` };
  }

  function cancelarInterno(W, p, a, motivo, opc = {}) {
    const prev = p.estado, c = cliente(W, p.clienteId), n = p.negocioId ? negocio(W, p.negocioId) : null;
    const tarde = a.rol === 'cliente' && ['preparando', 'listo'].includes(prev);
    p.estado = 'cancelado';
    p.t.cerrado = W.reloj;
    p.cancelacion = { por: a.rol, motivo, cargo: 0, reembolso: 0 };
    restaurarPromos(W, p);
    if (p.t.pagado != null) {
      const pagado = r2(p.cot.T + suma(p.flujos.filter((f) => f.de === 'du' && f.a === 'cli'), (f) => -f.monto));
      const cargo = tarde ? Math.round(p.cot.S * W.config.limites.cancelTardiaPct / 100) : 0;
      if (cargo) mov(W, 'neg:' + p.negocioId, cargo, 'Cancelación tardía: pago por insumos', p.id);
      const reembolso = r2(pagado - cargo);
      flujo(W, p, 'du', 'cli', reembolso, 'Reembolso por cancelación');
      p.cancelacion.cargo = cargo;
      p.cancelacion.reembolso = reembolso;
    }
    if (tarde && p.pago === 'efectivo') c.cancelTardias++;
    const repa = p.asignacion.repaId ? 'repa:' + p.asignacion.repaId : null;
    const enRuta = ['por_aprobar', 'en_camino', 'en_puerta'].includes(prev);
    if (repa && ['preparando', 'listo', 'comprando'].concat(enRuta ? [prev] : []).includes(prev) && a.rol !== 'repartidor') {
      const comp = W.config.limites.compensacionRepa;
      mov(W, repa, comp, 'Compensación por viaje cancelado', p.id);
      if (a.rol === 'negocio') mov(W, 'neg:' + p.negocioId, -comp, 'Compensación al repartidor por cancelar', p.id);
      else mov(W, 'du:garantia', -comp, 'Compensación al repartidor', p.id);
    }
    // Cancelado cuando ya se había recogido o comprado: nadie pierde lo que ya pagó.
    if (enRuta && p.entrega === 'deuna') {
      if (p.tipo === 'mandado' && p.ticket && p.ticket.monto) {
        mov(W, repa, p.ticket.monto, 'Te reponemos la compra del mandado cancelado', p.id);
        mov(W, 'du:garantia', -p.ticket.monto, 'Compra de mandado cancelado', p.id);
      } else if (p.tipo === 'tienda' && p.pago === 'efectivo') {
        mov(W, repa, p.cot.S, 'Te reponemos lo que pagaste en tienda', p.id);
        mov(W, 'du:garantia', -p.cot.S, 'Pedido cancelado ya recogido', p.id);
      } else if (p.tipo === 'tienda') {
        mov(W, 'neg:' + p.negocioId, p.cot.S, 'Pedido cancelado que ya habías entregado', p.id);
        mov(W, 'du:garantia', -p.cot.S, 'Pedido cancelado ya recogido', p.id);
      }
    }
    p.asignacion.oferta = null;
    if (n && a.rol === 'negocio' && !opc.sinPenalizar) n.met.cancelados++;
    const quien = { cliente: 'cliente', negocio: 'negocio', admin: 'deuna', sistema: 'sistema' }[a.rol] || a.rol;
    hist(W, p, quien, `Pedido cancelado: ${motivo}`);
    if (a.rol === 'admin') bit(W, a, `Canceló el pedido #${p.id}: ${motivo}`);
  }

  function premioVecino(W, c, p) {
    if (!c.referidoPor || c.premioVecino || c.pedidosOk !== 1) return;
    const ref = cliente(W, c.referidoPor), v = W.config.promos.vecino;
    if (!ref) return;
    mov(W, 'cli:' + c.id, v, `Premio por usar el código de ${ref.nombre}`, p.id);
    mov(W, 'cli:' + ref.id, v, `Premio porque ${c.nombre} usó tu código`, p.id);
    mov(W, 'du:promos', -2 * v, 'Invita a un vecino', p.id);
    ref.referidosMes = (ref.referidosMes || 0) + 1;
    c.premioVecino = true;
  }

  /* ------------------------------------------------------------------ */
  /* El reloj: tiempos límite y repartidores simulados                    */
  /* ------------------------------------------------------------------ */
  function revisarTiempos(W) {
    const T = W.config.tiempos;
    for (const p of W.pedidos.filter(activo)) {
      if (p.estado === 'pago_pendiente' && W.reloj - p.t.creado >= T.pago) {
        cancelarInterno(W, p, SISTEMA, 'No llegó el pago a tiempo');
        continue;
      }
      if (p.estado === 'nuevo' && W.reloj - p.t.enviado >= T.negocio) {
        const n = negocio(W, p.negocioId);
        n.met.expirados++;
        n.perdidos++;
        cancelarInterno(W, p, SISTEMA, `${n.nombre} no respondió a tiempo`);
        if (n.perdidos >= 2 && !n.pausa) {
          n.pausa = 'sin_respuesta';
          bit(W, SISTEMA, `Se pausó ${n.nombre} por no responder ${n.perdidos} pedidos seguidos`);
        }
        continue;
      }
      const o = p.asignacion.oferta;
      if (o && W.reloj >= o.hasta) {
        const r = repartidor(W, o.repaId);
        p.asignacion.rechazos.push(r.id);
        p.asignacion.oferta = null;
        hist(W, p, 'sistema', `${r.nombre} no respondió la oferta a tiempo`);
      }
      if (necesitaRepa(p)) despachar(W, p);
      simularRepartidor(W, p);
    }
    revisarCuentas(W);
  }
  function simularRepartidor(W, p) {
    const r = p.asignacion.repaId && repartidor(W, p.asignacion.repaId);
    if (!r || !r.simulado || p.t.ultimoSim === W.reloj) return;
    p.t.ultimoSim = W.reloj;
    const yo = { rol: 'repartidor', id: r.id, nombre: r.nombre };
    if (['preparando', 'listo'].includes(p.estado) && !p.repaEnTienda) ejecutar(W, p.id, 'llegue_tienda', yo);
    else if (p.estado === 'comprando') ejecutar(W, p.id, 'enviar_ticket', yo, { monto: Math.round(p.cot.S * 0.94) });
    else if (p.estado === 'en_camino') ejecutar(W, p.id, 'llegue_domicilio', yo);
    else if (p.estado === 'en_puerta') ejecutar(W, p.id, 'entregar', yo, { pin: p.pin, ine: true });
  }
  function avanzarReloj(W, minutos) {
    for (let i = 0; i < minutos; i++) { W.reloj++; revisarTiempos(W); }
  }

  function revisarCuentas(W) {
    const L = W.config.limites;
    for (const r of W.repartidores) {
      const s = saldo(W, 'repa:' + r.id);
      if (!r.suspendido && s <= -L.suspenderRepa) {
        r.suspendido = true;
        bit(W, SISTEMA, `Se suspendió a ${r.nombre}: trae $${-s} de efectivo sin entregar`);
      } else if (r.suspendido && s > -L.efectivoRepa) {
        r.suspendido = false;
        bit(W, SISTEMA, `${r.nombre} volvió a recibir pedidos`);
      }
    }
    for (const n of W.negocios) {
      const e = estadoMensualidad(W, n).estado;
      if (e === 'pausado' && n.pausa !== 'pago') { n.pausa = 'pago'; bit(W, SISTEMA, `Se pausó ${n.nombre} por mensualidad vencida`); }
      if (e !== 'pausado' && n.pausa === 'pago') { n.pausa = null; bit(W, SISTEMA, `${n.nombre} volvió a aparecer en la app`); }
    }
  }

  /* ------------------------------------------------------------------ */
  /* Negocios: mensualidad, depósitos, anuncios                          */
  /* ------------------------------------------------------------------ */
  function emitirMensualidades(W, mes, vence) {
    for (const n of W.negocios) {
      n.factura = { mes, monto: W.config.negocios.mensualidad, vence, pagada: false };
      mov(W, 'neg:' + n.id, -n.factura.monto, `Mensualidad de ${mes.toLowerCase()}`);
      mov(W, 'du:mensualidad', n.factura.monto, `Mensualidad de ${n.nombre}`);
    }
  }
  function estadoMensualidad(W, n) {
    const f = n.factura;
    if (!f || f.pagada) return { estado: 'al_corriente', texto: 'Al corriente' };
    if (saldo(W, 'neg:' + n.id) >= 0) return { estado: 'se_descuenta', texto: 'Se descuenta de tu próximo depósito' };
    const atraso = diaActual(W) - f.vence, g = W.config.negocios.diasGracia;
    if (atraso <= 0) return { estado: 'por_vencer', texto: `Vence el ${f.vence} de ${f.mes.toLowerCase()}` };
    if (atraso > g) return { estado: 'pausado', texto: `Vencida hace ${atraso} días: no aparece en la app`, atraso };
    return { estado: 'vencida', texto: `Vencida hace ${atraso} ${atraso === 1 ? 'día' : 'días'}. Se pausa en ${g - atraso + 1}`, atraso };
  }
  function registrarPagoNegocio(W, negId, monto, a) {
    const n = negocio(W, negId);
    if (!(monto > 0)) return err('Escribe el monto');
    mov(W, 'neg:' + n.id, monto, 'Pago recibido');
    if (n.factura && !n.factura.pagada && saldo(W, 'neg:' + n.id) >= 0) n.factura.pagada = true;
    bit(W, a, `Registró un pago de $${monto} de ${n.nombre}`);
    revisarCuentas(W);
    return { ok: true };
  }
  function depositarNegocio(W, negId, a) {
    const n = negocio(W, negId), s = saldo(W, 'neg:' + n.id);
    if (n.factura && !n.factura.pagada && s >= 0) n.factura.pagada = true;
    if (s <= 0) return err('No hay nada por depositar');
    mov(W, 'neg:' + n.id, -s, 'Depósito a tu cuenta');
    bit(W, a, `Depositó $${s} a ${n.nombre}`);
    revisarCuentas(W);
    return { ok: true, monto: s };
  }
  function comprarAnuncio(W, negId, tipo, a) {
    const n = negocio(W, negId), precio = W.config.anuncios[tipo];
    if (!precio) return err('Tipo de anuncio desconocido');
    if (n.anuncios.some((x) => x.tipo === tipo && x.hasta >= diaActual(W))) return err('Ya tienes ese anuncio activo');
    n.anuncios.push({ tipo, hasta: diaActual(W) + 6 });
    mov(W, 'neg:' + n.id, -precio, `Anuncio ${tipo === 'destacado' ? 'destacado' : 'en el carrusel'} (7 días)`);
    mov(W, 'du:anuncios', precio, `Anuncio de ${n.nombre}`);
    bit(W, a, `${n.nombre} compró un anuncio ${tipo} por $${precio}`);
    return { ok: true };
  }
  const anuncioActivo = (W, n, tipo) => n.anuncios.some((x) => x.tipo === tipo && x.hasta >= diaActual(W));

  /* Repartidores: depósitos y pagos */
  function registrarDeposito(W, repaId, monto, a) {
    const r = repartidor(W, repaId);
    if (!(monto > 0)) return err('Escribe el monto');
    mov(W, 'repa:' + r.id, monto, 'Depósito de efectivo recibido');
    bit(W, a, `Registró un depósito de $${monto} de ${r.nombre}`);
    revisarCuentas(W);
    return { ok: true };
  }
  function pagarRepartidor(W, repaId, a) {
    const r = repartidor(W, repaId), s = saldo(W, 'repa:' + r.id);
    if (s <= 0) return err('No hay nada por pagar');
    mov(W, 'repa:' + r.id, -s, 'Pago de tus ganancias');
    bit(W, a, `Pagó $${s} a ${r.nombre}`);
    return { ok: true, monto: s };
  }

  /* Clientes: Plus, vecinos, adeudos */
  function suscribirPlus(W, cliId) {
    const c = cliente(W, cliId);
    if (c.plus && c.plus.activo) return err('Ya tienes Plus');
    c.plus = { activo: true, enviosUsados: 0 };
    mov(W, 'du:plus', W.config.plus.precio, `Plus de ${c.nombre}`);
    return { ok: true };
  }
  function cancelarPlus(W, cliId) { const c = cliente(W, cliId); if (c.plus) c.plus.activo = false; return { ok: true }; }
  const codigoVecino = (c) => 'DU' + c.id.toUpperCase();
  function usarCodigoVecino(W, cliId, codigo) {
    const c = cliente(W, cliId), cod = String(codigo || '').trim().toUpperCase();
    const ref = W.clientes.find((x) => codigoVecino(x) === cod);
    if (!ref) return err('Ese código no existe');
    if (ref.id === c.id) return err('No puedes usar tu propio código');
    if (c.pedidosOk > 0 || c.referidoPor) return err('El código de vecino es solo para tu primer pedido');
    if (ref.dispositivo === c.dispositivo || claveDireccion(ref) === claveDireccion(c)) return err('Ese código es de alguien que vive contigo o usa tu celular');
    if ((ref.referidosMes || 0) >= W.config.promos.vecinoMaxMes) return err('Ese vecino ya llegó al máximo de invitaciones del mes');
    c.referidoPor = ref.id;
    return { ok: true, nombre: ref.nombre };
  }
  function pagarAdeudo(W, cliId) {
    const c = cliente(W, cliId), s = saldo(W, 'cli:' + c.id);
    if (s >= 0) return err('No tienes adeudos');
    mov(W, 'cli:' + c.id, -s, 'Pagaste tu adeudo');
    return { ok: true, monto: -s };
  }

  /* ------------------------------------------------------------------ */
  /* Reclamos (incidencias)                                              */
  /* ------------------------------------------------------------------ */
  function abrirIncidencia(W, pedidoId, a, { tipo, detalle = '', foto = false, monto = 0 }) {
    const p = pedido(W, pedidoId);
    if (!p) return err('No existe el pedido');
    if (!TIPOS_INC[tipo]) return err('Elige qué pasó');
    if (W.incidencias.some((i) => i.pedidoId === p.id && i.estado === 'abierta')) return err('Ya hay un reclamo abierto para este pedido');
    if (a.rol === 'cliente') {
      if (a.id !== p.clienteId) return err('Este pedido no es tuyo');
      if (p.estado !== 'entregado') return err('Puedes reportar cuando el pedido se haya entregado');
      if (W.reloj - p.t.entregado > W.config.tiempos.reclamo) return err('El plazo para reportar es de 24 horas');
      if (['falta', 'equivocado', 'mal_estado'].includes(tipo) && !foto) return err('Sube una foto de lo que recibiste');
    }
    const c = cliente(W, p.clienteId), motivos = [];
    const rec = reclamosRecientes(W, c);
    if (tipo !== 'cliente_ausente' && rec >= W.config.limites.reclamosMes) motivos.push(`Sería su reclamo número ${rec + 1} en 30 días`);
    if (tipo === 'no_llego' && !p.pinOmitido) motivos.push('El pedido se entregó con el código del cliente');
    if (cuentasEnDispositivo(W, c.dispositivo) >= 3) motivos.push('Su celular tiene varias cuentas');
    const inc = {
      id: W.sec.inc++, pedidoId: p.id, clienteId: c.id, negocioId: p.negocioId, repaId: p.asignacion.repaId,
      tipo, detalle, foto: !!foto, monto: r2(monto), t: W.reloj, estado: 'abierta', sospechosa: motivos.length > 0, motivos, resolucion: null,
    };
    W.incidencias.push(inc);
    hist(W, p, a.rol === 'cliente' ? 'cliente' : 'sistema', `Reporte: ${TIPOS_INC[tipo]}`);
    return { ok: true, incidencia: inc };
  }
  function resolverIncidencia(W, incId, a, res) {
    const i = W.incidencias.find((x) => x.id === +incId);
    if (!i) return err('No existe el reclamo');
    if (i.estado !== 'abierta') return err('Este reclamo ya se resolvió');
    if (!esAdmin(a)) return err('Solo De Una resuelve reclamos');
    const p = pedido(W, i.pedidoId);
    if (res.decision === 'rechazar' || res.decision === 'confirmar') {
      i.estado = res.decision === 'rechazar' ? 'rechazada' : 'resuelta';
      i.resolucion = { ...res, t: W.reloj, por: a.nombre || 'deuna' };
      hist(W, p, 'deuna', res.decision === 'rechazar' ? `Reclamo rechazado: ${res.nota || 'sin motivo'}` : 'De Una confirmó el adeudo');
      bit(W, a, `${res.decision === 'rechazar' ? 'Rechazó' : 'Confirmó'} el reclamo #${i.id}`);
      return { ok: true };
    }
    if (res.decision === 'perdonar') {
      const deuda = -saldo(W, 'cli:' + i.clienteId);
      if (deuda > 0) { mov(W, 'cli:' + i.clienteId, deuda, 'De Una te perdonó el adeudo', p.id); mov(W, 'du:adeudos', -deuda, 'Adeudo perdonado', p.id); }
      const c = cliente(W, i.clienteId);
      c.noShows = Math.max(0, c.noShows - 1);
      i.estado = 'resuelta';
      i.resolucion = { ...res, t: W.reloj, por: a.nombre || 'deuna' };
      bit(W, a, `Perdonó el adeudo del reclamo #${i.id}`);
      return { ok: true };
    }
    const monto = r2(res.monto);
    if (!(monto > 0)) return err('Escribe el monto a devolver');
    if (monto > p.cot.T) return err(`No puede ser más de lo que pagó ($${p.cot.T})`);
    if (a.permiso === 'operador' && monto > W.config.limites.creditoOperador) return err(`Más de $${W.config.limites.creditoOperador} lo aprueba el dueño`);
    if (res.destino === 'transferencia') flujo(W, p, 'du', 'cli', monto, `Reembolso por el reclamo #${i.id}`);
    else mov(W, 'cli:' + i.clienteId, monto, `Saldo a favor por el reclamo #${i.id}`, p.id);
    if (res.cargoA === 'negocio' && p.negocioId) mov(W, 'neg:' + p.negocioId, -monto, `Cargo por el reclamo #${i.id}`, p.id);
    else if (res.cargoA === 'repartidor' && i.repaId) mov(W, 'repa:' + i.repaId, -monto, `Cargo por el reclamo #${i.id}`, p.id);
    else mov(W, 'du:reembolsos', -monto, `Reclamo #${i.id}`, p.id);
    i.estado = 'resuelta';
    i.resolucion = { ...res, monto, t: W.reloj, por: a.nombre || 'deuna' };
    hist(W, p, 'deuna', `Reclamo resuelto: $${monto} ${res.destino === 'transferencia' ? 'por transferencia' : 'como saldo a favor'}`);
    bit(W, a, `Resolvió el reclamo #${i.id}: $${monto} a cargo de ${res.cargoA || 'deuna'}`);
    return { ok: true };
  }

  /* ------------------------------------------------------------------ */
  /* Altas de negocios y repartidores                                    */
  /* ------------------------------------------------------------------ */
  function docsRequeridos(s) {
    if (s.tipo === 'repartidor') return ['ine', 'selfie'].concat(s.vehiculo === 'bici' ? [] : ['licencia', 'placas']);
    const d = ['ine', 'comprobante', 'clabe'];
    if (s.giro === 'gas') d.push('permiso');
    if (['farmacia', 'agua'].includes(s.giro)) d.push('sanitario');
    if (s.vendeAlcohol) d.push('alcohol');
    return d;
  }
  function crearSolicitud(W, s) {
    const sol = { id: 's' + W.sec.sol++, t: W.reloj, docs: {}, ...s };
    for (const k of docsRequeridos(sol)) if (sol.docs[k] == null) sol.docs[k] = false;
    W.solicitudes.push(sol);
    return sol;
  }
  const faltantes = (s) => docsRequeridos(s).filter((k) => !s.docs[k]);
  function aprobarSolicitud(W, id, a) {
    const s = W.solicitudes.find((x) => x.id === id);
    if (!s) return err('No existe la solicitud');
    const f = faltantes(s);
    if (f.length) return err('Faltan documentos: ' + f.map((k) => DOCS[k]).join(', '));
    if (s.tipo === 'repartidor') {
      W.repartidores.push({ id: 'r' + s.id, nombre: s.nombre, zona: s.zona, vehiculo: s.vehiculo, simulado: true, aprobado: true, enLinea: false, suspendido: false, rating: 5, ofertas: { recibidas: 0, aceptadas: 0 }, aceptacion: 1, entregasHoy: 0 });
    } else {
      const n = {
        id: 'n' + s.id, nombre: s.nombre, cat: s.giro === 'restaurante' ? 'comida' : s.giro, fracc: s.zona, entregaPropia: !!s.entregaPropia,
        envioGratis: false, abierto: true, saturado: false, pausa: null, horario: { abre: 540, cierra: 1320 }, rating: 5, ops: 0,
        il: s.il || 'chicken', extra: ['tortilla'], color: '#c2410c', desc: 'Nuevo en De Una', promo: 'Nuevo', anuncios: [],
        perdidos: 0, met: { aceptados: 0, rechazados: 0, expirados: 0, cancelados: 0, entregados: 0 },
        menu: [{ id: 1, n: 'Producto de ejemplo', d: 'El negocio carga su menú', p: 80, il: s.il || 'chicken', on: true, top: true }],
      };
      W.negocios.push(n);
      n.factura = { mes: 'Noviembre', monto: W.config.negocios.mensualidad, vence: diaActual(W) + 5, pagada: false };
      mov(W, 'neg:' + n.id, -n.factura.monto, 'Mensualidad de noviembre');
      mov(W, 'du:mensualidad', n.factura.monto, `Mensualidad de ${n.nombre}`);
    }
    W.solicitudes = W.solicitudes.filter((x) => x !== s);
    bit(W, a, `Aprobó a ${s.nombre} (${s.tipo})`);
    return { ok: true };
  }
  function rechazarSolicitud(W, id, a, motivo) {
    const s = W.solicitudes.find((x) => x.id === id);
    if (!s) return err('No existe la solicitud');
    W.solicitudes = W.solicitudes.filter((x) => x !== s);
    bit(W, a, `Rechazó a ${s.nombre}: ${motivo || 'sin motivo'}`);
    return { ok: true };
  }

  /* ------------------------------------------------------------------ */
  /* Lecturas para pantallas                                              */
  /* ------------------------------------------------------------------ */
  function pasos(p) {
    let f;
    if (p.tipo === 'mandado') f = [['buscando', 'Buscando repartidor'], ['comprando', 'Comprando tu mandado'], ['por_aprobar', 'Revisas el ticket'], ['en_camino', 'En camino'], ['en_puerta', 'Llegó a tu puerta'], ['entregado', 'Entregado']];
    else if (p.entrega === 'propia') f = [['nuevo', 'Pedido enviado'], ['preparando', 'Confirmado'], ['en_camino', 'En camino'], ['en_puerta', 'Llegó a tu puerta'], ['entregado', 'Entregado']];
    else f = [['nuevo', 'Pedido enviado'], ['preparando', 'Preparando'], ['listo', 'Listo para recoger'], ['en_camino', 'En camino'], ['en_puerta', 'Llegó a tu puerta'], ['entregado', 'Entregado']];
    if (p.pago === 'transferencia') f.unshift(['pago_pendiente', 'Pago']);
    const i = f.findIndex((x) => x[0] === p.estado);
    return f.map((x, k) => ({ id: x[0], txt: x[1], hecho: p.estado === 'entregado' || (i >= 0 && k < i), ahora: k === i && p.estado !== 'entregado' }));
  }

  function alertas(W) {
    const A = [], T = W.config.tiempos, L = W.config.limites;
    for (const p of W.pedidos.filter(activo)) {
      const n = p.negocioId && negocio(W, p.negocioId);
      if (p.estado === 'nuevo' && W.reloj - p.t.enviado >= T.avisoNegocio) A.push({ id: 'n' + p.id, nivel: 'alta', pedidoId: p.id, titulo: `${n.nombre} no responde`, detalle: `Pedido #${p.id}: ${W.reloj - p.t.enviado} min esperando. Se cancela solo a los ${T.negocio} min.`, acciones: ['llamar_negocio', 'cancelar'] });
      if (necesitaRepa(p) && p.asignacion.desde != null && W.reloj - p.asignacion.desde >= T.sinRepa) A.push({ id: 'r' + p.id, nivel: 'alta', pedidoId: p.id, titulo: 'Pedido sin repartidor', detalle: `#${p.id} lleva ${W.reloj - p.asignacion.desde} min buscando repartidor`, acciones: ['subir_bono', 'asignar'] });
      if (p.estado === 'pago_pendiente' && W.reloj - p.t.creado >= 10) A.push({ id: 'p' + p.id, nivel: 'media', pedidoId: p.id, titulo: 'Pago sin llegar', detalle: `#${p.id} espera la transferencia ${p.referencia}. Se cancela a los ${T.pago} min.`, acciones: ['confirmar_pago'] });
      if (['en_camino', 'en_puerta'].includes(p.estado) && p.eta && W.reloj > p.eta + T.atraso) A.push({ id: 'a' + p.id, nivel: 'media', pedidoId: p.id, titulo: 'Pedido atrasado', detalle: `#${p.id} debía llegar a las ${hora(p.eta)}`, acciones: ['ver'] });
      if (p.pinIntentos >= L.intentosPin) A.push({ id: 'pin' + p.id, nivel: 'alta', pedidoId: p.id, titulo: 'Código de entrega equivocado', detalle: `#${p.id}: ${p.pinIntentos} intentos fallidos. Llama al cliente antes de autorizar.`, acciones: ['autorizar_sin_pin', 'cancelar'] });
    }
    for (const i of W.incidencias.filter((x) => x.estado === 'abierta')) A.push({ id: 'i' + i.id, nivel: i.sospechosa ? 'alta' : 'media', incidenciaId: i.id, pedidoId: i.pedidoId, titulo: i.tipo === 'cliente_ausente' ? 'Cliente no recibió su pedido' : 'Reclamo por resolver', detalle: `#${i.pedidoId}: ${TIPOS_INC[i.tipo]}${i.sospechosa ? ' · ' + i.motivos[0] : ''}`, acciones: ['resolver'] });
    for (const r of W.repartidores.filter((x) => x.aprobado)) {
      const s = saldo(W, 'repa:' + r.id);
      if (s <= -L.efectivoRepa * 0.8) A.push({ id: 'e' + r.id, nivel: s <= -L.efectivoRepa ? 'alta' : 'media', repaId: r.id, titulo: `${r.nombre} trae $${-s} en efectivo`, detalle: s <= -L.efectivoRepa ? 'Ya no recibe pedidos en efectivo hasta que deposite' : `Está cerca del límite de $${L.efectivoRepa}`, acciones: ['registrar_deposito'] });
    }
    for (const n of W.negocios) {
      const e = estadoMensualidad(W, n);
      if (['vencida', 'pausado'].includes(e.estado)) A.push({ id: 'm' + n.id, nivel: e.estado === 'pausado' ? 'alta' : 'media', negocioId: n.id, titulo: `Mensualidad de ${n.nombre}`, detalle: e.texto, acciones: ['registrar_pago'] });
      if (n.pausa === 'sin_respuesta') A.push({ id: 'ps' + n.id, nivel: 'media', negocioId: n.id, titulo: `${n.nombre} está pausado`, detalle: 'No respondió 2 pedidos seguidos. Llámale antes de reactivarlo.', acciones: ['reactivar'] });
      for (const m of n.menu.filter((x) => x.kg && !precioGasOk(W, x))) A.push({ id: 'g' + n.id + m.id, nivel: 'alta', negocioId: n.id, titulo: 'Precio de gas arriba del máximo', detalle: `${n.nombre} cobra $${m.p} por ${m.n}; el máximo es $${precioMaxGas(W, m)}`, acciones: [] });
    }
    const vistos = {};
    for (const c of W.clientes) {
      const k = cuentasEnDispositivo(W, c.dispositivo);
      if (k >= 3 && !vistos[c.dispositivo]) { vistos[c.dispositivo] = 1; A.push({ id: 'd' + c.dispositivo, nivel: 'media', clienteId: c.id, titulo: 'Varias cuentas en un celular', detalle: `${k} cuentas usan el mismo celular (${W.clientes.filter((x) => x.dispositivo === c.dispositivo).map((x) => x.nombre).join(', ')})`, acciones: ['ver_cliente'] }); }
    }
    const peso = { alta: 0, media: 1, baja: 2 };
    return A.sort((a, b) => peso[a.nivel] - peso[b.nivel]);
  }

  const LINEAS = [
    ['servicio', 'Servicio por pedido'], ['envio', 'Tu parte del envío'], ['mensualidad', 'Mensualidades'],
    ['anuncios', 'Anuncios'], ['plus', 'Membresías Plus'], ['adeudos', 'Adeudos de clientes por cobrar'],
    ['promos', 'Promociones'], ['bonos', 'Bonos a repartidores'], ['garantia', 'Garantía y compensaciones'], ['reembolsos', 'Reembolsos pagados por De Una'],
  ];
  function resumenFinanzas(W) {
    const lineas = LINEAS.map(([k, n]) => ({ k, n, monto: saldo(W, 'du:' + k) }));
    const repas = W.repartidores.filter((r) => r.aprobado).map((r) => ({ id: r.id, nombre: r.nombre, saldo: saldo(W, 'repa:' + r.id), suspendido: r.suspendido }));
    const negs = W.negocios.map((n) => ({ id: n.id, nombre: n.nombre, saldo: saldo(W, 'neg:' + n.id), mens: estadoMensualidad(W, n) }));
    return {
      lineas, total: r2(suma(lineas, (l) => l.monto)),
      efectivoEnCalle: r2(suma(repas, (r) => Math.max(0, -r.saldo))),
      porPagarRepas: r2(suma(repas, (r) => Math.max(0, r.saldo))),
      porDepositarNeg: r2(suma(negs, (n) => Math.max(0, n.saldo))),
      porCobrarNeg: r2(suma(negs, (n) => Math.max(0, -n.saldo))),
      repas, negs,
    };
  }
  function kpis(W) {
    const ent = W.pedidos.filter((p) => p.estado === 'entregado'), canc = W.pedidos.filter((p) => p.estado === 'cancelado');
    const gmv = r2(suma(ent, (p) => p.cot.S));
    const tiempos = ent.map((p) => p.t.entregado - p.t.creado);
    const ingresoPedidos = r2(suma(W.movimientos.filter((m) => m.pedidoId && m.cuenta.startsWith('du:')), (m) => m.monto));
    return {
      pedidos: W.pedidos.length, entregados: ent.length, cancelados: canc.length, activos: W.pedidos.filter(activo).length,
      gmv, ticket: ent.length ? Math.round(gmv / ent.length) : 0,
      tiempo: tiempos.length ? Math.round(suma(tiempos, (x) => x) / tiempos.length) : 0,
      tasaCancel: W.pedidos.length ? canc.length / W.pedidos.length : 0,
      ingresoPedidos, enLinea: W.repartidores.filter((r) => r.aprobado && r.enLinea && !r.suspendido).length,
    };
  }

  /* Para pruebas: cómo le fue a cada quien con un pedido */
  function economia(W, p) {
    const caja = (q) => r2(suma(p.flujos.filter((f) => f.a === q), (f) => f.monto) - suma(p.flujos.filter((f) => f.de === q), (f) => f.monto));
    const libro = (pre) => r2(suma(W.movimientos.filter((m) => m.pedidoId === p.id && m.cuenta.startsWith(pre)), (m) => m.monto));
    return {
      repa: { caja: caja('repa'), libro: libro('repa:') },
      neg: { caja: caja('neg'), libro: libro('neg:') },
      cli: { caja: caja('cli'), libro: libro('cli:') },
      du: { caja: caja('du'), resultado: libro('du:') },
    };
  }

  return {
    CONFIG_BASE, ESTADO_TXT, TIPOS_INC, DOCS, SISTEMA, LINEAS,
    crearMundo, hora, diaActual, norm,
    negocio, repartidor, cliente, pedido, activo, activoDe, ofertaPara,
    mov, saldo, movimientosDe, saldoDisponibleCliente, bit,
    distZona, envioBase, viajeMin, negocioAbierto, alcoholPermitido, productoVendible, precioMaxGas, precioGasOk,
    nivelCliente, bienvenidaElegible, motivoSinBienvenida, plusAplica, riesgo, cuentasEnDispositivo, reclamosRecientes, claveDireccion,
    cotizar, crearPedido, validar, ejecutar, politicaCancelacion, candidatos,
    revisarTiempos, avanzarReloj, alertas, pasos,
    emitirMensualidades, estadoMensualidad, registrarPagoNegocio, depositarNegocio, comprarAnuncio, anuncioActivo,
    registrarDeposito, pagarRepartidor, suscribirPlus, cancelarPlus, codigoVecino, usarCodigoVecino, pagarAdeudo,
    abrirIncidencia, resolverIncidencia, crearSolicitud, docsRequeridos, faltantes, aprobarSolicitud, rechazarSolicitud,
    resumenFinanzas, kpis, economia,
  };
});
