/* manda2 · Datos de ejemplo
 *
 * Negocios, repartidores y clientes ficticios de la zona. Los pedidos del día
 * NO se escriben a mano: se generan pasándolos por el motor de reglas, así que
 * el historial, el dinero y las alertas cuadran desde el primer minuto.
 */
(function (raiz, fabrica) {
  if (typeof module === 'object' && module.exports) module.exports = fabrica();
  else raiz.Datos = fabrica();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const met = () => ({ aceptados: 0, rechazados: 0, expirados: 0, cancelados: 0, entregados: 0 });
  const neg = (o) => ({ envioGratis: false, entregaPropia: false, abierto: true, saturado: false, pausa: null, prep: 20, anuncios: [], perdidos: 0, met: met(), promo: null, extra: [], ...o });
  const it = (id, n, p, il, o = {}) => ({ id, n, d: '', p, il, on: true, ...o });

  function negocios() {
    return [
      neg({ id: 'tacos', nombre: 'Tacos El Atlante', cat: 'comida', il: 'taco', extra: ['glass'], color: '#f2611d', desc: 'Pastor, suadero y campechanos', fracc: 'Toscana Alta', horario: { abre: 600, cierra: 1380 }, rating: 4.8, ops: 312, promo: '2x1 los martes',
        menu: [it(1, 'Orden de pastor (5)', 65, 'taco', { d: 'Con piña, cebolla y cilantro', top: true }), it(2, 'Orden de suadero (5)', 70, 'taco', { d: 'Tortilla de maíz hecha a mano' }), it(3, 'Gringa de pastor', 55, 'tortilla', { d: 'Harina, queso y pastor' }), it(4, 'Agua de horchata 1 L', 30, 'glass')] }),
      neg({ id: 'pizza', nombre: 'Pizzería La Toscana', cat: 'comida', il: 'pizza', extra: ['soda', 'chicken'], color: '#d93a2b', desc: 'Pizzas, alitas y papas', fracc: 'Toscana Alta', horario: { abre: 720, cierra: 1380 }, rating: 4.6, ops: 204, promo: 'Envío gratis', envioGratis: true,
        menu: [it(1, 'Pizza mediana pepperoni', 149, 'pizza', { d: '8 rebanadas', top: true }), it(2, 'Pizza mediana hawaiana', 159, 'pizza', { d: '8 rebanadas' }), it(3, 'Alitas BBQ (10)', 129, 'chicken', { d: 'Con aderezo ranch' }), it(4, 'Refresco 2 L', 45, 'soda')] }),
      neg({ id: 'burger', nombre: 'Burgers Quma', cat: 'comida', il: 'burger', extra: ['fries', 'soda'], color: '#f08a24', desc: 'Hamburguesas al carbón', fracc: 'Casas Quma', horario: { abre: 780, cierra: 1380 }, rating: 4.7, ops: 98, promo: 'Nuevo',
        menu: [it(1, 'Hamburguesa clásica', 99, 'burger', { d: 'Con papas', top: true }), it(2, 'Hamburguesa doble con tocino', 139, 'burger', { d: 'Con papas' }), it(3, 'Papas a la francesa', 45, 'fries')] }),
      neg({ id: 'lupe', nombre: 'Cocina Doña Lupe', cat: 'comida', il: 'bowl', extra: ['chila', 'glass'], color: '#7a42d6', desc: 'Comida corrida y desayunos', fracc: 'Casas Quma', horario: { abre: 480, cierra: 1020 }, rating: 4.9, ops: 421,
        menu: [it(1, 'Comida corrida', 85, 'bowl', { d: 'Sopa, guisado del día, arroz y agua', top: true }), it(2, 'Chilaquiles con pollo', 70, 'chila', { d: 'Rojos o verdes' }), it(3, 'Agua del día 1 L', 20, 'glass')] }),
      neg({ id: 'mary', nombre: 'Abarrotes Mary', cat: 'tiendita', il: 'basket', extra: ['milk', 'bread'], color: '#14937a', desc: 'Abarrotes, bebidas y botanas', fracc: 'Casas Quma', horario: { abre: 420, cierra: 1380 }, rating: 4.7, ops: 188, prep: 10,
        menu: [it(1, 'Leche entera 1 L', 28, 'milk'), it(2, 'Huevo blanco 18 pzs', 72, 'egg', { top: true }), it(3, 'Pan de caja grande', 52, 'bread'), it(4, 'Refresco de cola 3 L', 58, 'soda'), it(5, 'Tortillas 1 kg', 24, 'tortilla'), it(6, 'Cerveza clara (six)', 120, 'beer', { d: 'Solo mayores de 18', alcohol: true })] }),
      neg({ id: 'farma', nombre: 'Farmacia del Fracc', cat: 'farmacia', il: 'bottle', extra: ['pill', 'babybottle'], color: '#2e63d6', desc: 'Medicamentos y bebé', fracc: 'Atotonilco centro', horario: { abre: 540, cierra: 1260 }, rating: 4.5, ops: 77, prep: 10,
        menu: [it(1, 'Paracetamol 500 mg (10)', 38, 'pill', { d: 'Genérico', top: true }), it(2, 'Suero oral 625 ml', 32, 'bottle', { d: 'Sabor coco' }), it(3, 'Pañales etapa 3 (40)', 189, 'babybottle'), it(4, 'Termómetro digital', 95, 'thermo'), it(5, 'Losartán 50 mg (30)', 145, 'pill', { d: 'Necesita receta', receta: 'requerida' }), it(6, 'Amoxicilina 500 mg', 98, 'bottle', { d: 'Antibiótico', receta: 'antibiotico' })] }),
      neg({ id: 'gas', nombre: 'Gas Aliado (ejemplo)', cat: 'gas', il: 'gas', color: '#e2531a', desc: 'Gas LP en cilindro', fracc: 'Huehuetoca centro', horario: { abre: 420, cierra: 1140 }, rating: 4.4, ops: 150, entregaPropia: true, prep: 45, permiso: 'LP/0000/DIST/2019 (ejemplo)',
        menu: [it(1, 'Cilindro 20 kg', 420, 'gas', { kg: 20, d: 'Precio de ejemplo' }), it(2, 'Cilindro 30 kg', 630, 'gas', { kg: 30, d: 'Precio de ejemplo' })] }),
      neg({ id: 'agua', nombre: 'Purificadora Cristal', cat: 'agua', il: 'garrafon', color: '#1c8fd1', desc: 'Garrafones de 20 L', fracc: 'Toscana Alta', horario: { abre: 480, cierra: 1200 }, rating: 4.8, ops: 260, entregaPropia: true, prep: 30,
        menu: [it(1, 'Garrafón 20 L (recarga)', 40, 'garrafon', { d: 'Precio de ejemplo' })] }),
    ];
  }

  const repa = (o) => ({ simulado: true, aprobado: true, enLinea: true, suspendido: false, entregasHoy: 0, ...o });
  const cli = (id, nombre, tel, fracc, dir, dispositivo, o = {}) => ({
    id, nombre, tel, fracc, dir, dispositivo, pedidosOk: 0, noShows: 0, cancelTardias: 0, bienvenidaUsada: false,
    plus: { activo: false, enviosUsados: 0 }, creditoReservado: 0, referidoPor: null, bloqueado: false, ...o,
  });

  function sembrar(M) {
    const W = M.crearMundo({ reloj: 600, semilla: 11 });
    const SIS = M.SISTEMA, N = (id) => ({ rol: 'negocio', id }), R = (id) => ({ rol: 'repartidor', id }), C = (id) => ({ rol: 'cliente', id });
    const hacer = (id, acc, actor, d) => { const r = M.ejecutar(W, id, acc, actor, d); if (!r.ok) throw new Error(`Semilla #${id} ${acc}: ${r.error}`); return r; };
    const pedir = (q) => { const r = M.crearPedido(W, q); if (!r.ok) throw new Error('Semilla: ' + r.error); return r.pedido; };

    W.negocios = negocios();
    W.repartidores = [
      repa({ id: 'luis', nombre: 'Luis Hernández', zona: 'Toscana Alta', vehiculo: 'moto', tel: '55 2468 1357', simulado: false, rating: 4.9, ofertas: { recibidas: 40, aceptadas: 38 }, aceptacion: 0.95 }),
      repa({ id: 'pedro', nombre: 'Pedro Sánchez', zona: 'Casas Quma', vehiculo: 'bici', tel: '55 1357 2468', rating: 4.7, ofertas: { recibidas: 30, aceptadas: 27 }, aceptacion: 0.9 }),
      repa({ id: 'memo', nombre: 'Memo Ortiz', zona: 'Atotonilco centro', vehiculo: 'moto', tel: '55 9753 1864', enLinea: false, rating: 4.8, ofertas: { recibidas: 25, aceptadas: 24 }, aceptacion: 0.96 }),
    ];
    W.clientes = [
      cli('ana', 'Ana Martínez', '55 1234 5678', 'Toscana Alta', 'Calle Siena 14', 'dev-ana'),
      cli('jorge', 'Jorge Pérez', '55 2233 4455', 'Casas Quma', 'Privada Quma 8', 'dev-jorge', { pedidosOk: 6, bienvenidaUsada: true }),
      cli('monica', 'Mónica Salas', '55 3344 5566', 'Toscana Alta', 'Calle Florencia 3', 'dev-monica', { pedidosOk: 11, bienvenidaUsada: true }),
      cli('diana', 'Diana Ruiz', '55 4455 6677', 'Casas Quma', 'Av. Principal 120', 'dev-diana', { pedidosOk: 3, bienvenidaUsada: true }),
      cli('ricardo', 'Ricardo Torres', '55 5566 7788', 'Casas Quma', 'Calle Roble 22', 'dev-ricardo', { pedidosOk: 1, bienvenidaUsada: true }),
      cli('beto', 'Beto R.', '55 6677 8899', 'Casas Quma', 'Calle Olmo 5', 'dev-x'),
    ];
    for (const c of W.clientes.filter((x) => x.bienvenidaUsada)) { W.promoUsada.direcciones.push(M.claveDireccion(c)); W.promoUsada.dispositivos.push(c.dispositivo); }

    // Dinero de días anteriores, mensualidades, Plus y anuncios
    M.mov(W, 'repa:pedro', -380, 'Efectivo de ayer por entregar');
    M.mov(W, 'repa:memo', 80, 'Ganancias de ayer');
    M.emitirMensualidades(W, 'Noviembre', 5);
    M.negocio(W, 'lupe').factura.vence = 14; // Doña Lupe va atrasada 2 días: aún no se pausa
    for (const n of W.negocios) if (n.id !== 'lupe') M.registrarPagoNegocio(W, n.id, 399, SIS);
    M.suscribirPlus(W, 'monica');
    M.comprarAnuncio(W, 'pizza', 'destacado', SIS);
    M.comprarAnuncio(W, 'burger', 'carrusel', SIS);

    // 10:00 · Diana pide a Doña Lupe y la cocina no contesta: se cancela solo.
    pedir({ clienteId: 'diana', negocioId: 'lupe', tipo: 'tienda', items: [{ id: 1, q: 2 }], pago: 'efectivo', propina: 10 });
    M.avanzarReloj(W, 5);

    // 10:20 · Beto pide tacos y no sale a recibir: Luis espera, llama dos veces y se le repone todo.
    let p = pedir({ clienteId: 'beto', negocioId: 'tacos', tipo: 'tienda', items: [{ id: 1, q: 2 }], pago: 'efectivo', pagaCon: 500 });
    W.reloj = 620; p.t.creado = 620; p.t.enviado = 620;
    hacer(p.id, 'aceptar', N('tacos'), { prep: 20 });
    hacer(p.id, 'aceptar_oferta', R('luis'));
    hacer(p.id, 'llegue_tienda', R('luis'));
    M.avanzarReloj(W, 18);
    hacer(p.id, 'listo', N('tacos'));
    hacer(p.id, 'entregar_a_repa', N('tacos'));
    M.avanzarReloj(W, 9);
    hacer(p.id, 'llegue_domicilio', R('luis'));
    hacer(p.id, 'llamar_cliente', R('luis'));
    hacer(p.id, 'llamar_cliente', R('luis'));
    M.avanzarReloj(W, 10);
    hacer(p.id, 'cliente_ausente', R('luis'));
    // Después aparecieron dos cuentas nuevas en el mismo celular de Beto.
    W.clientes.push(cli('alberto', 'Alberto R.', '55 7788 9900', 'Paseos de la Pradera', 'Cerrada Lirio 2', 'dev-x'));
    W.clientes.push(cli('roberto', 'Roberto M.', '55 8899 0011', 'Casas Quma', 'Calle Olmo 5', 'dev-x'));

    // 11:20 · Jorge compra en Abarrotes Mary; lo entrega Pedro (paga en tienda y cobra en efectivo).
    W.reloj = 680;
    p = pedir({ clienteId: 'jorge', negocioId: 'mary', tipo: 'tienda', items: [{ id: 2, q: 1 }, { id: 5, q: 2 }], pago: 'efectivo', pagaCon: 200, propina: 10 });
    hacer(p.id, 'aceptar', N('mary'), { prep: 10 });
    M.avanzarReloj(W, 8);
    hacer(p.id, 'listo', N('mary'));
    hacer(p.id, 'entregar_a_repa', N('mary'));
    M.avanzarReloj(W, 4);

    // 12:00 · Mónica (Plus) pide pizza con transferencia; Luis la entrega con el código.
    W.reloj = 720;
    p = pedir({ clienteId: 'monica', negocioId: 'pizza', tipo: 'tienda', items: [{ id: 2, q: 1 }, { id: 4, q: 1 }], pago: 'transferencia', propina: 15 });
    M.avanzarReloj(W, 1);
    hacer(p.id, 'confirmar_pago', SIS);
    hacer(p.id, 'aceptar', N('pizza'), { prep: 20 });
    hacer(p.id, 'aceptar_oferta', R('luis'));
    M.avanzarReloj(W, 6);
    hacer(p.id, 'llegue_tienda', R('luis'));
    M.avanzarReloj(W, 14);
    hacer(p.id, 'listo', N('pizza'));
    hacer(p.id, 'entregar_a_repa', N('pizza'));
    M.avanzarReloj(W, 8);
    hacer(p.id, 'llegue_domicilio', R('luis'));
    hacer(p.id, 'entregar', R('luis'), { pin: p.pin });
    const pizzaMonica = p.id;

    // 12:15 · Diana pide un mandado: Pedro compra, sube el ticket y ella lo aprueba.
    p = pedir({ clienteId: 'diana', tipo: 'mandado', descripcion: 'Mandado: recoger receta y comprar medicamentos', origen: 'Atotonilco centro', lugar: 'Farmacia de la plaza', presupuesto: 250, pago: 'efectivo', propina: 10 });
    M.avanzarReloj(W, 2);
    hacer(p.id, 'aprobar_ticket', C('diana'));
    M.avanzarReloj(W, 3);

    // 12:40 · Mónica reporta que faltó el refresco (con foto).
    W.reloj = Math.max(W.reloj, 760);
    M.abrirIncidencia(W, pizzaMonica, C('monica'), { tipo: 'falta', detalle: 'No venía el refresco de 2 L', foto: true, monto: 45 });

    // 12:57 · Ricardo pide tacos en efectivo: el negocio todavía no contesta.
    W.reloj = 777;
    pedir({ clienteId: 'ricardo', negocioId: 'tacos', tipo: 'tienda', items: [{ id: 1, q: 2 }, { id: 4, q: 1 }], pago: 'efectivo', pagaCon: 200, propina: 10 });

    // Solicitudes por aprobar
    M.crearSolicitud(W, { tipo: 'negocio', nombre: 'Pollos Asados El Güero', giro: 'restaurante', zona: 'Casas Quma', il: 'chicken', docs: { ine: true, comprobante: true, clabe: true } });
    M.crearSolicitud(W, { tipo: 'repartidor', nombre: 'Karla Ríos', zona: 'Toscana Alta', vehiculo: 'moto', docs: { ine: true, selfie: true, licencia: false, placas: true } });

    W.reloj = 780; // 13:00
    W.bitacora = [];
    M.bit(W, SIS, 'Arrancó el día: 8 negocios, 3 repartidores y 7 clientes de ejemplo');
    return W;
  }

  return { sembrar, negocios };
});
