// Pruebas del motor de reglas de manda2. Corre con:  node --test pruebas/
const { test } = require('node:test');
const assert = require('node:assert/strict');
const M = require('../js/motor.js');
const Datos = require('../js/datos.js');

const r2 = (n) => Math.round(n * 100) / 100;
const SIS = M.SISTEMA;
const ADMIN = { rol: 'admin', nombre: 'Dueño', permiso: 'dueño' };
const OPER = { rol: 'admin', nombre: 'Operador', permiso: 'operador' };
const N = (id) => ({ rol: 'negocio', id });
const R = (id) => ({ rol: 'repartidor', id });
const C = (id) => ({ rol: 'cliente', id });

/* Mundo pequeño y controlado para cada prueba (13:00) */
function mundo() {
  const W = M.crearMundo({ reloj: 780 });
  const todos = Datos.negocios();
  W.negocios = todos.filter((n) => ['tacos', 'pizza', 'mary', 'farma', 'gas'].includes(n.id));
  W.repartidores = [
    { id: 'luis', nombre: 'Luis', zona: 'Toscana Alta', vehiculo: 'moto', simulado: false, aprobado: true, enLinea: true, suspendido: false, rating: 4.9, ofertas: { recibidas: 20, aceptadas: 19 }, aceptacion: 0.95, entregasHoy: 0 },
    { id: 'pedro', nombre: 'Pedro', zona: 'Casas Quma', vehiculo: 'bici', simulado: true, aprobado: true, enLinea: true, suspendido: false, rating: 4.7, ofertas: { recibidas: 20, aceptadas: 18 }, aceptacion: 0.9, entregasHoy: 0 },
  ];
  const cli = (id, fracc, dir, dev, o = {}) => ({ id, nombre: id, tel: '55', fracc, dir, dispositivo: dev, pedidosOk: 0, noShows: 0, cancelTardias: 0, bienvenidaUsada: false, plus: { activo: false, enviosUsados: 0 }, creditoReservado: 0, referidoPor: null, bloqueado: false, ...o });
  W.clientes = [
    cli('ana', 'Toscana Alta', 'Calle Siena 14', 'd-ana'),
    cli('jorge', 'Casas Quma', 'Privada Quma 8', 'd-jorge', { pedidosOk: 6, bienvenidaUsada: true }),
  ];
  return W;
}
const pedir = (W, q) => { const r = M.crearPedido(W, q); assert.ok(r.ok, r.error); return r.pedido; };
const hacer = (W, id, acc, a, d) => { const r = M.ejecutar(W, id, acc, a, d); assert.ok(r.ok, `${acc}: ${r.error}`); return r; };

/* El dinero de cada pedido siempre cuadra entre todos */
function cuadra(W, p) {
  const e = M.economia(W, p);
  assert.equal(r2(e.m2.caja - e.repa.libro - e.neg.libro - e.cli.libro), e.m2.resultado, `manda2 no cuadra en #${p.id}`);
  const k = W.config.tarifas.repaPct / 100, c = p.cot;
  // Los cargos por reclamos se descuentan a propósito; se suman de vuelta para revisar el reparto original.
  const cargos = (pre) => W.movimientos.filter((m) => m.pedidoId === p.id && m.cuenta.startsWith(pre) && m.concepto.startsWith('Cargo por el reclamo')).reduce((s, m) => s + m.monto, 0);
  if (p.estado === 'entregado' && p.entrega === 'manda2') assert.equal(r2(e.repa.caja + e.repa.libro - cargos('repa:')), r2(c.E * k + c.L + c.PP + c.P + p.asignacion.bono), `repartidor #${p.id}`);
  if (p.estado === 'entregado' && p.tipo === 'tienda') {
    const derecho = p.entrega === 'propia' ? c.S + c.E + c.P - c.Dn : c.S - c.Dn;
    assert.equal(r2(e.neg.caja + e.neg.libro - cargos('neg:')), r2(derecho), `negocio #${p.id}`);
  }
}

/* Lleva un pedido de tienda de "nuevo" a "entregado" con Luis */
function entregarConLuis(W, p) {
  hacer(W, p.id, 'aceptar', N(p.negocioId), { prep: 10 });
  hacer(W, p.id, 'aceptar_oferta', R('luis'));
  hacer(W, p.id, 'llegue_tienda', R('luis'));
  hacer(W, p.id, 'listo', N(p.negocioId));
  hacer(W, p.id, 'entregar_a_repa', N(p.negocioId));
  hacer(W, p.id, 'llegue_domicilio', R('luis'));
  hacer(W, p.id, 'entregar', R('luis'), { pin: p.pin, ine: true });
}

test('cotizar: envío por zona, servicio, propina y promo de bienvenida', () => {
  const W = mundo();
  const q = M.cotizar(W, { clienteId: 'ana', negocioId: 'tacos', tipo: 'tienda', items: [{ id: 1, q: 2 }], propina: 10, pago: 'efectivo' });
  assert.equal(q.S, 130);
  assert.equal(q.E, 25); // Toscana Alta → Toscana Alta
  assert.equal(q.V, 7);
  assert.equal(q.Dm, 25); // primer envío gratis
  assert.equal(q.T, 130 + 25 + 7 + 10 - 25);
  const lejos = M.cotizar(W, { clienteId: 'jorge', negocioId: 'gas', tipo: 'tienda', items: [{ id: 1, q: 1 }] });
  assert.equal(lejos.E, 0, 'el gas lo entrega la gasera: envío incluido');
  const cerca = M.cotizar(W, { clienteId: 'jorge', negocioId: 'tacos', tipo: 'tienda', items: [{ id: 1, q: 2 }] });
  assert.equal(cerca.E, 35);
});

test('cargo por pedido pequeño y extra por lluvia van al repartidor', () => {
  const W = mundo();
  W.config.tarifas.lluvia.activa = true;
  const p = pedir(W, { clienteId: 'jorge', negocioId: 'mary', tipo: 'tienda', items: [{ id: 1, q: 1 }], pago: 'efectivo' });
  assert.equal(p.cot.PP, 10);
  assert.equal(p.cot.L, 10);
  hacer(W, p.id, 'aceptar', N('mary'), { prep: 10 });
  // Pedro (simulado, misma zona) toma el viaje solo
  assert.equal(p.asignacion.repaId, 'pedro');
  M.avanzarReloj(W, 1);
  hacer(W, p.id, 'listo', N('mary'));
  hacer(W, p.id, 'entregar_a_repa', N('mary'));
  M.avanzarReloj(W, 2);
  assert.equal(p.estado, 'entregado');
  const ganancias = M.movimientosDe(W, 'repa:pedro').filter((m) => m.monto > 0).reduce((s, m) => s + m.monto, 0);
  assert.equal(r2(ganancias), r2(25 * 0.85 + 10 + 10));
  cuadra(W, p);
});

test('pedido en efectivo de punta a punta: código de entrega y dinero cuadrado', () => {
  const W = mundo();
  const p = pedir(W, { clienteId: 'jorge', negocioId: 'tacos', tipo: 'tienda', items: [{ id: 1, q: 2 }], pago: 'efectivo', propina: 15, pagaCon: 500 });
  hacer(W, p.id, 'aceptar', N('tacos'), { prep: 20 });
  assert.equal(p.asignacion.oferta.repaId, 'luis', 'la oferta va al repartidor más cercano y mejor calificado');
  hacer(W, p.id, 'aceptar_oferta', R('luis'));
  assert.ok(M.validar(W, p, 'entregar_a_repa', N('tacos')), 'no se entrega antes de que esté listo y llegue el repartidor');
  hacer(W, p.id, 'llegue_tienda', R('luis'));
  hacer(W, p.id, 'listo', N('tacos'));
  hacer(W, p.id, 'entregar_a_repa', N('tacos'));
  hacer(W, p.id, 'llegue_domicilio', R('luis'));
  const malo = M.ejecutar(W, p.id, 'entregar', R('luis'), { pin: '0000' });
  assert.equal(malo.ok, false);
  assert.equal(p.pinIntentos, 1);
  hacer(W, p.id, 'entregar', R('luis'), { pin: p.pin });
  assert.equal(p.estado, 'entregado');
  // El repartidor le debe a manda2 el servicio + el 15 % del envío
  assert.equal(M.saldo(W, 'repa:luis'), r2(-(7 + 35 * 0.15)));
  cuadra(W, p);
});

test('transferencia: espera el pago, se cancela sola a los 15 min y nunca acepta capturas', () => {
  const W = mundo();
  const p = pedir(W, { clienteId: 'jorge', negocioId: 'tacos', tipo: 'tienda', items: [{ id: 1, q: 1 }], pago: 'transferencia' });
  assert.equal(p.estado, 'pago_pendiente');
  assert.ok(M.validar(W, p, 'confirmar_pago', C('jorge')), 'el cliente no puede marcar su propio pago');
  M.avanzarReloj(W, 15);
  assert.equal(p.estado, 'cancelado');
  const p2 = pedir(W, { clienteId: 'jorge', negocioId: 'pizza', tipo: 'tienda', items: [{ id: 1, q: 1 }], pago: 'transferencia', propina: 10 });
  hacer(W, p2.id, 'confirmar_pago', SIS);
  entregarConLuis(W, p2);
  assert.equal(M.saldo(W, 'neg:pizza'), r2(149 - 35), 'la pizzería recibe su venta menos el envío gratis que regaló');
  cuadra(W, p2);
});

test('el negocio tiene 5 minutos para aceptar; con 2 seguidos sin responder se pausa', () => {
  const W = mundo();
  const a = pedir(W, { clienteId: 'jorge', negocioId: 'tacos', tipo: 'tienda', items: [{ id: 1, q: 1 }], pago: 'efectivo' });
  M.avanzarReloj(W, 3);
  assert.ok(M.alertas(W).some((x) => x.pedidoId === a.id && x.titulo.includes('no responde')));
  M.avanzarReloj(W, 2);
  assert.equal(a.estado, 'cancelado');
  pedir(W, { clienteId: 'jorge', negocioId: 'tacos', tipo: 'tienda', items: [{ id: 1, q: 1 }], pago: 'efectivo' });
  M.avanzarReloj(W, 5);
  assert.equal(M.negocio(W, 'tacos').pausa, 'sin_respuesta');
  assert.equal(M.negocioAbierto(W, M.negocio(W, 'tacos')).ok, false);
});

test('la oferta expira en 1 min y pasa al siguiente repartidor', () => {
  const W = mundo();
  const p = pedir(W, { clienteId: 'ana', negocioId: 'tacos', tipo: 'tienda', items: [{ id: 1, q: 2 }], pago: 'efectivo' });
  hacer(W, p.id, 'aceptar', N('tacos'), { prep: 20 });
  assert.equal(p.asignacion.oferta.repaId, 'luis');
  M.avanzarReloj(W, 1);
  assert.equal(p.asignacion.repaId, 'pedro');
  assert.ok(p.asignacion.rechazos.includes('luis'));
});

test('sin repartidores: alerta al dueño, que puede subir el bono (pagado por manda2)', () => {
  const W = mundo();
  W.repartidores.forEach((r) => { r.enLinea = false; });
  const p = pedir(W, { clienteId: 'jorge', negocioId: 'tacos', tipo: 'tienda', items: [{ id: 1, q: 2 }], pago: 'efectivo' });
  hacer(W, p.id, 'aceptar', N('tacos'), { prep: 20 });
  M.avanzarReloj(W, 5);
  assert.ok(M.alertas(W).some((x) => x.pedidoId === p.id && x.titulo === 'Pedido sin repartidor'));
  M.repartidor(W, 'pedro').enLinea = true;
  hacer(W, p.id, 'subir_bono', ADMIN, { monto: 10 });
  assert.equal(p.asignacion.repaId, 'pedro');
  M.avanzarReloj(W, 1);
  hacer(W, p.id, 'listo', N('tacos'));
  hacer(W, p.id, 'entregar_a_repa', N('tacos'));
  M.avanzarReloj(W, 2);
  assert.equal(p.estado, 'entregado');
  assert.equal(M.saldo(W, 'm2:bonos'), -10);
  cuadra(W, p);
});

test('un repartidor con mucho efectivo no recibe pedidos en efectivo; con más se suspende', () => {
  const W = mundo();
  M.mov(W, 'repa:luis', -520, 'Efectivo pendiente');
  M.repartidor(W, 'pedro').enLinea = false;
  const p = pedir(W, { clienteId: 'jorge', negocioId: 'tacos', tipo: 'tienda', items: [{ id: 1, q: 2 }], pago: 'efectivo' });
  hacer(W, p.id, 'aceptar', N('tacos'), { prep: 20 });
  assert.equal(p.asignacion.oferta, null);
  assert.equal(M.candidatos(W, p)[0].motivo, 'Trae mucho efectivo por entregar');
  M.mov(W, 'repa:luis', -300, 'Más efectivo');
  M.revisarTiempos(W);
  assert.equal(M.repartidor(W, 'luis').suspendido, true);
  M.registrarDeposito(W, 'luis', 500, ADMIN);
  assert.equal(M.repartidor(W, 'luis').suspendido, false);
});

test('límites de efectivo por confianza del cliente', () => {
  const W = mundo();
  const ana = M.cotizar(W, { clienteId: 'ana', negocioId: 'mary', tipo: 'tienda', items: [{ id: 2, q: 6 }], pago: 'efectivo' });
  assert.equal(ana.metodos.efectivo.ok, false, 'cliente nuevo: efectivo hasta $400');
  const jorge = M.cotizar(W, { clienteId: 'jorge', negocioId: 'mary', tipo: 'tienda', items: [{ id: 2, q: 6 }], pago: 'efectivo' });
  assert.equal(jorge.metodos.efectivo.ok, true);
  const grande = M.cotizar(W, { clienteId: 'jorge', negocioId: 'mary', tipo: 'tienda', items: [{ id: 2, q: 12 }], pago: 'efectivo' });
  assert.equal(grande.metodos.efectivo.ok, false, 'más de $800 se paga por adelantado');
});

test('productos agotados: se quitan y el total baja; si el cliente prefiere, se cancela', () => {
  const W = mundo();
  const p = pedir(W, { clienteId: 'jorge', negocioId: 'tacos', tipo: 'tienda', items: [{ id: 1, q: 2 }, { id: 4, q: 1 }], pago: 'efectivo', sustitucion: 'quitar' });
  const antes = p.cot.T;
  hacer(W, p.id, 'aceptar', N('tacos'), { prep: 10, agotados: [4] });
  assert.equal(p.cot.T, antes - 30);
  assert.equal(p.estado, 'preparando');
  const q = pedir(W, { clienteId: 'jorge', negocioId: 'tacos', tipo: 'tienda', items: [{ id: 1, q: 1 }, { id: 4, q: 1 }], pago: 'efectivo', sustitucion: 'cancelar' });
  hacer(W, q.id, 'aceptar', N('tacos'), { prep: 10, agotados: [4] });
  assert.equal(q.estado, 'cancelado');
  const l = pedir(W, { clienteId: 'jorge', negocioId: 'tacos', tipo: 'tienda', items: [{ id: 1, q: 1 }, { id: 4, q: 1 }], pago: 'efectivo', sustitucion: 'llamar' });
  assert.ok(M.validar(W, l, 'aceptar', N('tacos'), { prep: 10, agotados: [4] }), 'si pidió que le llamen, el negocio debe decidir con el cliente');
});

test('cancelaciones: gratis antes de preparar; tarde con transferencia se paga la mitad al negocio', () => {
  const W = mundo();
  const a = pedir(W, { clienteId: 'jorge', negocioId: 'tacos', tipo: 'tienda', items: [{ id: 1, q: 2 }], pago: 'efectivo' });
  hacer(W, a.id, 'cancelar', C('jorge'), { motivo: 'Ya no lo quiero' });
  assert.equal(M.cliente(W, 'jorge').cancelTardias, 0);
  const b = pedir(W, { clienteId: 'jorge', negocioId: 'pizza', tipo: 'tienda', items: [{ id: 1, q: 1 }], pago: 'transferencia' });
  hacer(W, b.id, 'confirmar_pago', SIS);
  hacer(W, b.id, 'aceptar', N('pizza'), { prep: 20 });
  hacer(W, b.id, 'cancelar', C('jorge'), { motivo: 'Tarda mucho' });
  assert.equal(b.cancelacion.cargo, Math.round(149 * 0.5));
  assert.equal(b.cancelacion.reembolso, r2(b.cot.T - b.cancelacion.cargo));
  cuadra(W, b);
  const c = pedir(W, { clienteId: 'jorge', negocioId: 'tacos', tipo: 'tienda', items: [{ id: 1, q: 2 }], pago: 'efectivo' });
  entregarConLuis(W, c);
  assert.ok(M.validar(W, c, 'cancelar', C('jorge'), { motivo: 'x' }));
});

test('cliente ausente: espera de 10 min y 2 llamadas; al repartidor se le repone todo', () => {
  const W = mundo();
  const p = pedir(W, { clienteId: 'jorge', negocioId: 'tacos', tipo: 'tienda', items: [{ id: 1, q: 2 }], pago: 'efectivo' });
  hacer(W, p.id, 'aceptar', N('tacos'), { prep: 10 });
  hacer(W, p.id, 'aceptar_oferta', R('luis'));
  hacer(W, p.id, 'llegue_tienda', R('luis'));
  hacer(W, p.id, 'listo', N('tacos'));
  hacer(W, p.id, 'entregar_a_repa', N('tacos'));
  hacer(W, p.id, 'llegue_domicilio', R('luis'));
  assert.ok(M.validar(W, p, 'cliente_ausente', R('luis')), 'no se puede marcar ausente sin esperar');
  hacer(W, p.id, 'llamar_cliente', R('luis'));
  hacer(W, p.id, 'llamar_cliente', R('luis'));
  M.avanzarReloj(W, 10);
  hacer(W, p.id, 'cliente_ausente', R('luis'));
  assert.equal(M.saldo(W, 'repa:luis'), r2(130 + 35 * 0.85));
  assert.equal(M.saldo(W, 'cli:jorge'), -(130 + 35 + 7));
  assert.equal(M.nivelCliente(W, M.cliente(W, 'jorge')).nivel, 'restringido');
  assert.ok(W.incidencias.some((i) => i.pedidoId === p.id && i.tipo === 'cliente_ausente'));
  cuadra(W, p);
});

test('alcohol: ley seca lo bloquea y al entregar se revisa la INE', () => {
  const W = mundo();
  W.config.operacion.leySeca = true;
  assert.equal(M.cotizar(W, { clienteId: 'jorge', negocioId: 'mary', tipo: 'tienda', items: [{ id: 6, q: 1 }] }).errores.length > 0, true);
  W.config.operacion.leySeca = false;
  const sinEdad = M.crearPedido(W, { clienteId: 'jorge', negocioId: 'mary', tipo: 'tienda', items: [{ id: 6, q: 1 }], pago: 'efectivo' });
  assert.equal(sinEdad.ok, false);
  const p = pedir(W, { clienteId: 'jorge', negocioId: 'mary', tipo: 'tienda', items: [{ id: 6, q: 1 }], pago: 'efectivo', mayorEdad: true });
  hacer(W, p.id, 'aceptar', N('mary'), { prep: 10 });
  M.repartidor(W, 'pedro').enLinea = false;
  // Pedro ya lo tenía; lo dejamos a mano para revisar la INE
  hacer(W, p.id, 'asignar', ADMIN, { repaId: 'luis' });
  hacer(W, p.id, 'llegue_tienda', R('luis'));
  hacer(W, p.id, 'listo', N('mary'));
  hacer(W, p.id, 'entregar_a_repa', N('mary'));
  hacer(W, p.id, 'llegue_domicilio', R('luis'));
  assert.equal(M.ejecutar(W, p.id, 'entregar', R('luis'), { pin: p.pin }).ok, false);
  hacer(W, p.id, 'entregar', R('luis'), { pin: p.pin, ine: true });
  cuadra(W, p);
});

test('farmacia: antibióticos no se venden; con receta el negocio la revisa antes de aceptar', () => {
  const W = mundo();
  assert.ok(M.cotizar(W, { clienteId: 'jorge', negocioId: 'farma', tipo: 'tienda', items: [{ id: 6, q: 1 }] }).errores.some((e) => e.includes('antibióticos')));
  const p = pedir(W, { clienteId: 'jorge', negocioId: 'farma', tipo: 'tienda', items: [{ id: 5, q: 1 }], pago: 'efectivo', recetaFoto: true });
  assert.ok(M.validar(W, p, 'aceptar', N('farma'), { prep: 10 }));
  hacer(W, p.id, 'aceptar', N('farma'), { prep: 10, recetaOk: true });
});

test('gas: precio tope oficial y entrega propia con dinero cuadrado', () => {
  const W = mundo();
  W.config.gas.precioMaxKg = 20;
  assert.equal(M.productoVendible(W, M.negocio(W, 'gas'), M.negocio(W, 'gas').menu[0]).ok, false);
  assert.ok(M.alertas(W).some((a) => a.titulo.includes('gas')));
  W.config.gas.precioMaxKg = 21.5;
  const p = pedir(W, { clienteId: 'jorge', negocioId: 'gas', tipo: 'tienda', items: [{ id: 1, q: 1 }], pago: 'efectivo', propina: 20 });
  hacer(W, p.id, 'aceptar', N('gas'), { prep: 45 });
  hacer(W, p.id, 'salio', N('gas'));
  hacer(W, p.id, 'llegue_domicilio', N('gas'));
  hacer(W, p.id, 'entregar', N('gas'), { pin: p.pin });
  assert.equal(M.saldo(W, 'neg:gas'), -7, 'la gasera le debe a manda2 solo el servicio');
  cuadra(W, p);
  const q = pedir(W, { clienteId: 'jorge', negocioId: 'gas', tipo: 'tienda', items: [{ id: 2, q: 1 }], pago: 'transferencia' });
  hacer(W, q.id, 'confirmar_pago', SIS);
  hacer(W, q.id, 'aceptar', N('gas'), { prep: 45 });
  hacer(W, q.id, 'salio', N('gas'));
  hacer(W, q.id, 'llegue_domicilio', N('gas'));
  hacer(W, q.id, 'entregar', N('gas'), { pin: q.pin });
  cuadra(W, q);
});

test('mandado: tope de adelanto, ticket aprobado por el cliente y dinero cuadrado', () => {
  const W = mundo();
  assert.equal(M.crearPedido(W, { clienteId: 'jorge', tipo: 'mandado', presupuesto: 900, origen: 'Casas Quma', pago: 'efectivo' }).ok, false);
  const p = pedir(W, { clienteId: 'jorge', tipo: 'mandado', descripcion: 'Pollo y tortillas', presupuesto: 300, origen: 'Casas Quma', pago: 'efectivo', propina: 10 });
  assert.equal(p.asignacion.repaId, 'pedro');
  M.avanzarReloj(W, 1);
  assert.equal(p.estado, 'por_aprobar');
  hacer(W, p.id, 'aprobar_ticket', C('jorge'));
  M.avanzarReloj(W, 2);
  assert.equal(p.estado, 'entregado');
  assert.equal(p.cot.S, p.ticket.monto);
  cuadra(W, p);
});

test('reclamos: plazo de 24 h, foto obligatoria y tope para operadores', () => {
  const W = mundo();
  const p = pedir(W, { clienteId: 'jorge', negocioId: 'tacos', tipo: 'tienda', items: [{ id: 1, q: 2 }, { id: 4, q: 1 }], pago: 'efectivo' });
  entregarConLuis(W, p);
  assert.equal(M.abrirIncidencia(W, p.id, C('jorge'), { tipo: 'falta' }).ok, false, 'sin foto no');
  const r = M.abrirIncidencia(W, p.id, C('jorge'), { tipo: 'falta', foto: true, monto: 30 });
  assert.ok(r.ok);
  assert.equal(M.resolverIncidencia(W, r.incidencia.id, OPER, { decision: 'reembolso', monto: 150, destino: 'saldo', cargoA: 'negocio' }).ok, false);
  assert.ok(M.resolverIncidencia(W, r.incidencia.id, ADMIN, { decision: 'reembolso', monto: 30, destino: 'saldo', cargoA: 'negocio' }).ok);
  assert.equal(M.saldo(W, 'cli:jorge'), 30);
  cuadra(W, p);
  // El saldo a favor se usa solo en el siguiente pedido y también cuadra
  const q = pedir(W, { clienteId: 'jorge', negocioId: 'tacos', tipo: 'tienda', items: [{ id: 1, q: 2 }], pago: 'efectivo' });
  assert.equal(q.cot.Dc, 30);
  entregarConLuis(W, q);
  assert.equal(M.saldo(W, 'cli:jorge'), 0);
  cuadra(W, q);
  const tarde = pedir(W, { clienteId: 'jorge', negocioId: 'tacos', tipo: 'tienda', items: [{ id: 1, q: 1 }], pago: 'efectivo' });
  entregarConLuis(W, tarde);
  M.avanzarReloj(W, 1441);
  assert.equal(M.abrirIncidencia(W, tarde.id, C('jorge'), { tipo: 'no_llego' }).ok, false);
});

test('promos: la bienvenida no se repite con otra cuenta en el mismo celular ni la misma casa', () => {
  const W = mundo();
  const p = pedir(W, { clienteId: 'ana', negocioId: 'tacos', tipo: 'tienda', items: [{ id: 1, q: 2 }], pago: 'efectivo' });
  assert.equal(p.promoUsada, 'bienvenida');
  W.clientes.push({ ...M.cliente(W, 'ana'), id: 'ana2', nombre: 'Ana 2', pedidosOk: 0, bienvenidaUsada: false, creditoReservado: 0 });
  assert.equal(M.motivoSinBienvenida(W, M.cliente(W, 'ana2')), 'Esta dirección ya usó la promo de bienvenida');
  // Si el pedido se cancela, la promo regresa
  hacer(W, p.id, 'cancelar', C('ana'), { motivo: 'Me equivoqué' });
  assert.equal(M.bienvenidaElegible(W, M.cliente(W, 'ana')), true);
});

test('invita a un vecino: no vale en la misma casa; el premio llega tras el primer pedido', () => {
  const W = mundo();
  W.clientes.push({ ...M.cliente(W, 'ana'), id: 'vecina', nombre: 'Vecina', dir: 'Calle Roma 2', dispositivo: 'd-vecina', creditoReservado: 0 });
  W.clientes.push({ ...M.cliente(W, 'ana'), id: 'hermana', nombre: 'Hermana', dispositivo: 'd-hermana', creditoReservado: 0 });
  assert.equal(M.usarCodigoVecino(W, 'hermana', M.codigoVecino(M.cliente(W, 'ana'))).ok, false);
  assert.ok(M.usarCodigoVecino(W, 'vecina', M.codigoVecino(M.cliente(W, 'ana'))).ok);
  const p = pedir(W, { clienteId: 'vecina', negocioId: 'tacos', tipo: 'tienda', items: [{ id: 1, q: 2 }], pago: 'efectivo' });
  entregarConLuis(W, p);
  assert.equal(M.saldo(W, 'cli:vecina'), 30);
  assert.equal(M.saldo(W, 'cli:ana'), 30);
  cuadra(W, p);
});

test('Plus: envío gratis desde $150 hasta 8 al mes', () => {
  const W = mundo();
  M.suscribirPlus(W, 'jorge');
  const chico = M.cotizar(W, { clienteId: 'jorge', negocioId: 'tacos', tipo: 'tienda', items: [{ id: 1, q: 1 }] });
  assert.equal(chico.promo, null);
  const p = pedir(W, { clienteId: 'jorge', negocioId: 'tacos', tipo: 'tienda', items: [{ id: 1, q: 3 }], pago: 'efectivo' });
  assert.equal(p.promoUsada, 'plus');
  entregarConLuis(W, p);
  assert.equal(M.saldo(W, 'm2:promos'), -35);
  cuadra(W, p);
  M.cliente(W, 'jorge').plus.enviosUsados = 8;
  assert.equal(M.cotizar(W, { clienteId: 'jorge', negocioId: 'tacos', tipo: 'tienda', items: [{ id: 1, q: 3 }] }).promo, null);
});

test('mensualidad: vencida se pausa a los 7 días y se descuenta de las ventas en el depósito', () => {
  const W = mundo();
  M.emitirMensualidades(W, 'Noviembre', 5);
  M.negocio(W, 'pizza').factura.vence = 30;
  const tacos = M.negocio(W, 'tacos');
  assert.equal(M.estadoMensualidad(W, tacos).estado, 'pausado');
  assert.equal(tacos.pausa, null);
  M.revisarTiempos(W);
  assert.equal(tacos.pausa, 'pago');
  assert.ok(M.registrarPagoNegocio(W, 'tacos', 399, ADMIN).ok);
  assert.equal(tacos.pausa, null);
  // La pizzería vende en línea y la mensualidad se descuenta al depositar
  const pizza = M.negocio(W, 'pizza');
  assert.equal(pizza.pausa, null);
  const p = pedir(W, { clienteId: 'jorge', negocioId: 'pizza', tipo: 'tienda', items: [{ id: 1, q: 3 }], pago: 'transferencia' });
  hacer(W, p.id, 'confirmar_pago', SIS);
  entregarConLuis(W, p);
  const dep = M.depositarNegocio(W, 'pizza', ADMIN);
  assert.ok(dep.ok);
  assert.equal(dep.monto, r2(149 * 3 - 35 - 399));
  assert.equal(pizza.factura.pagada, true);
});

test('cancelar después de recoger: nadie pierde lo que ya pagó', () => {
  const W = mundo();
  const p = pedir(W, { clienteId: 'jorge', negocioId: 'tacos', tipo: 'tienda', items: [{ id: 1, q: 2 }], pago: 'efectivo' });
  hacer(W, p.id, 'aceptar', N('tacos'), { prep: 10 });
  hacer(W, p.id, 'aceptar_oferta', R('luis'));
  hacer(W, p.id, 'llegue_tienda', R('luis'));
  hacer(W, p.id, 'listo', N('tacos'));
  hacer(W, p.id, 'entregar_a_repa', N('tacos'));
  hacer(W, p.id, 'cancelar', ADMIN, { motivo: 'Accidente en el camino' });
  assert.equal(M.saldo(W, 'repa:luis'), 130 + 15);
  cuadra(W, p);
});

test('los datos de ejemplo se generan con el motor y todo cuadra', () => {
  const W = Datos.sembrar(M);
  assert.equal(M.hora(W.reloj), '13:00');
  for (const p of W.pedidos) cuadra(W, p);
  const est = Object.fromEntries(W.pedidos.map((p) => [p.clienteId + '-' + p.negocioId, p.estado]));
  assert.equal(est['diana-lupe'], 'cancelado');
  assert.equal(est['beto-tacos'], 'no_entregado');
  assert.equal(est['jorge-mary'], 'entregado');
  assert.equal(est['monica-pizza'], 'entregado');
  assert.equal(est['diana-null'], 'entregado');
  assert.equal(est['ricardo-tacos'], 'nuevo');
  const titulos = M.alertas(W).map((a) => a.titulo);
  assert.ok(titulos.includes('Tacos El Atlante no responde'));
  assert.ok(titulos.includes('Reclamo por resolver'));
  assert.ok(titulos.includes('Varias cuentas en un celular'));
  assert.ok(titulos.some((t) => t.startsWith('Mensualidad de Cocina Doña Lupe')));
});
