/* De Una Delivery · Pantallas de la maqueta
 *
 * Este archivo solo dibuja y responde a toques. Ninguna regla de negocio vive
 * aquí: si una pantalla necesita saber si algo se puede, se lo pregunta al
 * motor (Motor.validar / Motor.cotizar) y muestra su respuesta.
 */
(function () {
  'use strict';
  const M = window.Motor;
  let W = window.Datos.sembrar(M);

  /* ---------------------------------------------------------------- */
  /* Íconos de la interfaz (duotono propio), marca e ilustraciones      */
  /* ---------------------------------------------------------------- */
  // Cada ícono tiene un trazo y una capa de relleno suave (.acc) que se pinta de naranja cuando está activo.
  const ic = (o, a = '') => `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${a ? `<g class="acc" stroke="none">${a}</g>` : ''}${o}</svg>`;
  const BOLSA = 'M5.2 8.2h13.6l-1.1 11a1.9 1.9 0 0 1-1.9 1.7H8.2a1.9 1.9 0 0 1-1.9-1.7Z';
  const ICONS = {
    home: ic('<path d="M3.5 10.6 12 3.6l8.5 7V19a1.6 1.6 0 0 1-1.6 1.6h-4.3v-5.4H9.4v5.4H5.1A1.6 1.6 0 0 1 3.5 19Z"/>', '<path d="M3.5 10.6 12 3.6l8.5 7V19a1.6 1.6 0 0 1-1.6 1.6H5.1A1.6 1.6 0 0 1 3.5 19Z"/>'),
    search: ic('<circle cx="10.6" cy="10.6" r="6.6"/><path d="m15.6 15.6 4.9 4.9M7.8 9.4a3.2 3.2 0 0 1 2.4-2.1"/>', '<circle cx="10.6" cy="10.6" r="6.6"/>'),
    bolsa: ic(`<path d="${BOLSA}"/><path d="M9 8.2V7a3 3 0 0 1 6 0v1.2M9.7 14q2.3 2.2 4.6 0"/>`, `<path d="${BOLSA}"/>`),
    user: ic('<circle cx="12" cy="8.4" r="3.9"/><path d="M4.4 20.4c1.3-3.9 4.1-5.9 7.6-5.9s6.3 2 7.6 5.9"/>', '<circle cx="12" cy="8.4" r="3.9"/>'),
    inbox: ic('<path d="M3.6 13.4 6.2 5h11.6l2.6 8.4V19a1.6 1.6 0 0 1-1.6 1.6H5.2A1.6 1.6 0 0 1 3.6 19Z"/><path d="M3.6 13.4h5l1.2 2.2h4.4l1.2-2.2h5"/>', '<path d="M3.6 13.4h5l1.2 2.2h4.4l1.2-2.2h5V19a1.6 1.6 0 0 1-1.6 1.6H5.2A1.6 1.6 0 0 1 3.6 19Z"/>'),
    menu: ic('<rect x="4.6" y="3.4" width="14.8" height="17.2" rx="2.6"/><path d="M8.6 8.4h6.8M8.6 12.2h6.8M8.6 16h4"/>', '<rect x="4.6" y="3.4" width="14.8" height="17.2" rx="2.6"/>'),
    coin: ic('<ellipse cx="12" cy="7" rx="6.6" ry="2.9"/><path d="M5.4 7v5c0 1.6 3 2.9 6.6 2.9s6.6-1.3 6.6-2.9V7M5.4 12v5c0 1.6 3 2.9 6.6 2.9s6.6-1.3 6.6-2.9v-5"/>', '<ellipse cx="12" cy="7" rx="6.6" ry="2.9"/>'),
    bike: ic('<circle cx="6.2" cy="17.2" r="2.8"/><circle cx="17.8" cy="17.2" r="2.8"/><path d="M9 17.2h5.4l2.6-7h2.4M14.6 5.8h2.6l1.4 4.4"/><rect x="3.4" y="8.2" width="6.4" height="5.2" rx="1.2"/>', '<rect x="3.4" y="8.2" width="6.4" height="5.2" rx="1.2"/>'),
    pulse: ic('<rect x="3.2" y="4.2" width="17.6" height="15.6" rx="4.4"/><path d="M6.6 12.2h2.4l1.8-3.6 2.4 7 1.8-3.4h2.4"/>', '<rect x="3.2" y="4.2" width="17.6" height="15.6" rx="4.4"/>'),
    people: ic('<circle cx="9" cy="8.6" r="3.3"/><path d="M3 19.6c.9-3.3 3.2-4.9 6-4.9s5.1 1.6 6 4.9M15.4 5.5a3.1 3.1 0 0 1 0 6.1M17.6 14.9c1.8.6 3 2.1 3.5 4.7"/>', '<circle cx="9" cy="8.6" r="3.3"/>'),
    gear: ic('<path d="M4 7.2h8.6M17.6 7.2H20M4 16.8h3M12 16.8h8"/><circle cx="15.1" cy="7.2" r="2.4"/><circle cx="9.5" cy="16.8" r="2.4"/>', '<circle cx="15.1" cy="7.2" r="2.4"/><circle cx="9.5" cy="16.8" r="2.4"/>'),
    chat: ic('<path d="M4.6 18.6 5.9 15A7.6 7.6 0 1 1 8.8 18Z"/><path d="M8.8 11.2h.01M12 11.2h.01M15.2 11.2h.01"/>', '<path d="M4.6 18.6 5.9 15A7.6 7.6 0 1 1 8.8 18Z"/>'),
    phone: ic('<path d="M5.2 4h3.6l1.9 4.8-2.4 1.5a11 11 0 0 0 5.4 5.4l1.5-2.4L20 15.2v3.6a2 2 0 0 1-2 2A16.4 16.4 0 0 1 3.2 6a2 2 0 0 1 2-2Z"/>', '<path d="M5.2 4h3.6l1.9 4.8-2.4 1.5a11 11 0 0 0 5.4 5.4l1.5-2.4L20 15.2v3.6a2 2 0 0 1-2 2A16.4 16.4 0 0 1 3.2 6a2 2 0 0 1 2-2Z"/>'),
    cash: ic('<rect x="2.6" y="6.4" width="18.8" height="11.2" rx="2.2"/><circle cx="12" cy="12" r="2.6"/><path d="M6 9.6v4.8M18 9.6v4.8"/>', '<rect x="2.6" y="6.4" width="18.8" height="11.2" rx="2.2"/>'),
    bank: ic('<path d="M3.2 9.4 12 4.4l8.8 5Z"/><path d="M5.4 10.6v6.2M9.8 10.6v6.2M14.2 10.6v6.2M18.6 10.6v6.2M3.6 19.8h16.8"/>', '<path d="M3.2 9.4 12 4.4l8.8 5Z"/>'),
    card: ic('<rect x="3" y="5.4" width="18" height="13.2" rx="2.6"/><path d="M3 10h18M7 15h4"/>', '<path d="M3 8a2.6 2.6 0 0 1 2.6-2.6h12.8A2.6 2.6 0 0 1 21 8v2H3Z"/>'),
    camera: ic('<path d="M4 8h3l2-3h6l2 3h3v11.4H4Z"/><circle cx="12" cy="13.2" r="3.6"/>', '<circle cx="12" cy="13.2" r="3.6"/>'),
    doc: ic('<path d="M6.2 3.2h8l4 4v13.6H6.2Z"/><path d="M14.2 3.2v4h4M9.2 12.2h5.6M9.2 16h5.6"/>', '<path d="M6.2 3.2h8l4 4v13.6H6.2Z"/>'),
    shield: ic('<path d="M12 3 4.6 6v6c0 4.6 3.2 7.7 7.4 9 4.2-1.3 7.4-4.4 7.4-9V6Z"/><path d="m9 12.2 2.1 2.1 4-4.2"/>', '<path d="M12 3 4.6 6v6c0 4.6 3.2 7.7 7.4 9 4.2-1.3 7.4-4.4 7.4-9V6Z"/>'),
    chart: ic('<path d="M4 20V4M4 20h16"/><rect x="7.4" y="12" width="2.8" height="5" rx=".8"/><rect x="12" y="8" width="2.8" height="9" rx=".8"/><rect x="16.6" y="10.4" width="2.8" height="6.6" rx=".8"/>', '<rect x="7.4" y="12" width="2.8" height="5" rx=".8"/><rect x="12" y="8" width="2.8" height="9" rx=".8"/><rect x="16.6" y="10.4" width="2.8" height="6.6" rx=".8"/>'),
    tag: ic('<path d="M3.4 12V4.2h7.8l9.4 9.4-7.8 7.8Z"/><circle cx="7.6" cy="8.2" r="1.3"/>', '<path d="M3.4 12V4.2h7.8l9.4 9.4-7.8 7.8Z"/>'),
    store: ic('<path d="M4.4 10.2V20h15.2v-9.8M10 20v-5h4v5"/><path d="M3.2 10.2 5.2 4h13.6l2 6.2a2.6 2.6 0 0 1-4.6 1.6 2.6 2.6 0 0 1-4.2 0 2.6 2.6 0 0 1-4.2 0 2.6 2.6 0 0 1-4.6-1.6Z"/>', '<path d="M3.2 10.2 5.2 4h13.6l2 6.2a2.6 2.6 0 0 1-4.6 1.6 2.6 2.6 0 0 1-4.2 0 2.6 2.6 0 0 1-4.2 0 2.6 2.6 0 0 1-4.6-1.6Z"/>'),
    back: ic('<path d="M15 5l-7 7 7 7"/>'),
    check: ic('<path d="m5 12.4 4.6 4.6L19 7.4"/>'),
    x: ic('<path d="M6 6l12 12M18 6 6 18"/>'),
  };
  ICONS.list = ICONS.bolsa;
  // Marca: generada por marca/generar.js (js/marca.js)
  const MK = window.MARCA;
  const TILE = MK.tile;
  const APPICON = TILE;
  const wm = (sub = false) => `<svg class="wm" viewBox="-7 33 258 ${sub ? 104 : 68}" aria-hidden="true"><g class="wm-de">${MK.letras.de}</g><g class="wm-una">${MK.letras.una}</g>${sub ? `<g class="wm-sub" transform="translate(126 118) scale(.8)">${MK.letras.delivery}</g>` : ''}</svg>`;
  const brand = (cls = '') => `<span class="brand ${cls}" role="img" aria-label="De Una Delivery"><span class="brand-tile">${TILE}</span>${wm()}</span>`;
  const brandBig = () => `<span class="brand big" role="img" aria-label="De Una Delivery"><span class="brand-tile">${TILE}</span>${wm(true)}</span>`;
  // Ilustraciones con borde blanco de estampa (filtro #sticker de index.html)
  const ill = (k, cls = '') => `<svg viewBox="-3 -3 70 70" class="il ${cls}" aria-hidden="true"><g filter="url(#sticker)">${IL[k] || IL.bag}</g></svg>`;
  const blogo = (n, s = 44) => `<span class="blogo" style="--c:${n.color};width:${s}px;height:${s}px"><span class="disc">${ill(n.il)}</span></span>`;
  const cover = (n, cls = '') => `<div class="cover ${cls}" style="background-color:${n.color};background-image:radial-gradient(rgba(255,255,255,.22) 1.4px,transparent 1.8px),linear-gradient(140deg,rgba(255,255,255,.3),rgba(0,0,0,.1));background-size:16px 16px,100% 100%">${(n.extra || []).map((k, i) => ill(k, 'a' + (i + 2))).join('')}${ill(n.il, 'a1')}`;
  const thumb = (k, s = 72) => `<div class="thumb" style="width:${s}px;height:${s}px">${ill(k)}</div>`;

  /* ---------------------------------------------------------------- */
  /* Utilidades                                                         */
  /* ---------------------------------------------------------------- */
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function money(n) {
    n = Math.round((+n || 0) * 100) / 100;
    const neg = n < 0, a = Math.abs(n);
    const s = Number.isInteger(a) ? a.toLocaleString('es-MX') : a.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return (neg ? '−$' : '$') + s;
  }
  const hora = M.hora;
  const PILL = { pago_pendiente: 'Pago pendiente', nuevo: 'Nuevo', preparando: 'Preparando', listo: 'Listo', buscando: 'Buscando repartidor', comprando: 'Comprando', por_aprobar: 'Ticket por aprobar', en_camino: 'En camino', en_puerta: 'En la puerta', entregado: 'Entregado', cancelado: 'Cancelado', no_entregado: 'No entregado' };
  const pill = (e) => `<span class="pill p-${e}">${PILL[e] || e}</span>`;
  const riesgoChip = (r) => r && r.nivel !== 'bajo' ? `<span class="pill risk-${r.nivel}" title="${esc(r.motivos.join(' · '))}">Riesgo ${r.nivel}</span>` : '';
  const mask = (t) => { const d = String(t || '').replace(/\D/g, ''); return d.length >= 4 ? '•••• ' + d.slice(-4) : '••••'; };
  const kv = (a, b) => `<div class="kv"><span>${a}</span><span>${b}</span></div>`;
  const chip = (txt, act, on, dis) => `<button class="chipbtn" data-act="${act}" aria-pressed="${!!on}" ${dis ? 'disabled' : ''}>${txt}</button>`;
  const empty = (k, txt) => `<div class="empty">${ill(k)}${txt}</div>`;
  const nota = (txt) => `<div class="note-demo">${txt}</div>`;
  const neg = (id) => M.negocio(W, id);
  const nombreCuenta = (c) => {
    const [t, id] = c.split(':');
    if (t === 'repa') return (M.repartidor(W, id) || {}).nombre || id;
    if (t === 'neg') return (neg(id) || {}).nombre || id;
    if (t === 'cli') return (M.cliente(W, id) || {}).nombre || id;
    return 'De Una · ' + (M.LINEAS.find((l) => l[0] === id) || [0, id])[1];
  };
  const quien = (p, x) => ({ cli: (M.cliente(W, p.clienteId) || {}).nombre, repa: p.asignacion.repaId ? M.repartidor(W, p.asignacion.repaId).nombre : 'Repartidor', neg: p.negocioId ? neg(p.negocioId).nombre : 'Negocio', du: 'De Una', tienda: 'Tienda del mandado' }[x] || x);
  const origenDe = (p) => p.negocioId ? neg(p.negocioId).nombre : (p.lugar ? p.lugar + ', ' : '') + p.origen;
  const ilDe = (p) => p.negocioId ? neg(p.negocioId).il : 'bag';
  const k85 = () => W.config.tarifas.repaPct / 100;
  const ganancia = (p) => Math.round((p.cot.E * k85() + p.cot.L + p.cot.PP + p.cot.P + p.asignacion.bono) * 100) / 100;
  let toastT;
  function toast(m) { const t = document.getElementById('toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2600); }
  function hdr(title, sub, { back = null, right = '', lead = '' } = {}) {
    return `<div class="top"><div class="top-row"><div class="row" style="min-width:0">${back ? `<button class="icon-btn" data-act="${back}" aria-label="Regresar">${ICONS.back}</button>` : ''}${lead}<div style="min-width:0"><h1>${title}</h1>${sub ? `<small>${sub}</small>` : ''}</div></div>${right}</div></div>`;
  }
  const nav = (items, cur) => `<nav class="nav">${items.map((i) => `<button data-act="${i.act}" aria-current="${i.id === cur}"><span class="nv">${ICONS[i.icon]}</span>${i.n}${i.badge ? `<span class="badge">${i.badge}</span>` : ''}</button>`).join('')}</nav>`;

  /* ---------------------------------------------------------------- */
  /* Estado de las pantallas (no es del negocio: eso vive en W)         */
  /* ---------------------------------------------------------------- */
  const UI = {
    role: 'cliente',
    cli: { id: 'ana', step: 'onb', onb: 0, screen: 'inicio', cat: null, q: '', negId: null, cart: [], cartNeg: null, pago: null, pagaCon: null, nota: '', tip: 10, sust: 'quitar', mayorEdad: false, recetaFoto: false, codigo: '', orderId: null, gasItem: 1, garrafones: 2, sheet: null, inc: { tipo: null, detalle: '', foto: false, monto: '' }, mand: { que: 'Recoger mi receta y comprar los medicamentos', origen: 'Atotonilco centro', lugar: 'Farmacia de la plaza', presu: 250 }, rate: {}, motivo: null },
    neg: { id: 'tacos', screen: 'pedidos', tab: 'nuevo', form: {}, reg: { nombre: 'Pollería La Güera', giro: 'restaurante', zona: 'Casas Quma', propia: false, alcohol: false, docs: {} }, solicitud: null },
    rep: { id: 'luis', screen: 'viajes', pin: '', ine: false, ticket: '', foto: false, reg: { nombre: 'Karla Ríos', zona: 'Toscana Alta', vehiculo: 'moto', docs: {} }, solicitud: null },
    adm: { screen: 'vivo', permiso: 'dueño', filtro: 'activos', sel: null, personas: 'solicitudes', res: {}, motivo: {} },
  };
  const yoCli = () => ({ rol: 'cliente', id: UI.cli.id });
  const yoNeg = () => ({ rol: 'negocio', id: UI.neg.id });
  const yoRep = () => ({ rol: 'repartidor', id: UI.rep.id, nombre: M.repartidor(W, UI.rep.id).nombre });
  const yoAdm = () => ({ rol: 'admin', nombre: UI.adm.permiso === 'dueño' ? 'Dueño' : 'Operador', permiso: UI.adm.permiso });
  const esDueno = () => UI.adm.permiso === 'dueño';
  const MSG = {
    aceptar: 'Pedido aceptado. Avisamos al cliente', rechazar: 'Pedido rechazado. Avisamos al cliente', listo: 'Listo. Avisamos al repartidor',
    entregar_a_repa: 'Entregado al repartidor', salio: 'Va en camino', aceptar_oferta: 'Viaje aceptado. Ve a la tienda', rechazar_oferta: 'Rechazaste el viaje',
    llegue_tienda: 'Avisamos a la tienda que llegaste', enviar_ticket: 'Ticket enviado. Esperando al cliente', aprobar_ticket: 'Ticket aprobado. Va en camino',
    rechazar_ticket: 'Avisamos a De Una para revisarlo', llegue_domicilio: 'Avisamos al cliente que llegaste', llamar_cliente: 'Llamando al cliente (simulado)',
    entregar: '¡Entregado!', cliente_ausente: 'Registramos que el cliente no salió. Se te repone todo', cancelar: 'Pedido cancelado', confirmar_pago: 'Pago confirmado',
    autorizar_sin_pin: 'Autorizado: puede entregar sin código', asignar: 'Repartidor asignado', subir_bono: 'Bono subido. Volvimos a ofrecer el viaje',
    calificar: '¡Gracias por calificar!', soltar: 'Soltaste el viaje. Se lo ofrecemos a alguien más',
  };
  function tx(pid, acc, d = {}, actor) {
    const r = M.ejecutar(W, +pid, acc, actor, d);
    if (!r.ok) { toast(r.error); return false; }
    if (MSG[acc]) toast(MSG[acc]);
    return true;
  }

  /* ================================================================ */
  /* CLIENTE                                                           */
  /* ================================================================ */
  const yo = () => M.cliente(W, UI.cli.id);
  const ONB = [
    { ils: ['burger', 'taco', 'pizza'], t: '¿Se te antojó? ¡De una!', d: 'Tacos, pizza, tiendita y farmacia de tu fraccionamiento, en un solo lugar.' },
    { ils: ['gas', 'garrafon'], t: 'Gas y garrafones hasta tu puerta', d: 'Pídelos desde el celular y te avisamos cuando van en camino.' },
    { ils: ['bag', 'gift'], t: 'Pagas seguro, recibes con código', d: 'Tu repartidor solo cierra el pedido con tu código de 4 dígitos. Tu primer envío es gratis.' },
  ];
  const CATS = [
    { id: 'comida', n: 'Restaurantes', il: 'burger' }, { id: 'tiendita', n: 'Tiendita', il: 'basket' }, { id: 'farmacia', n: 'Farmacia', il: 'bottle' },
    { id: 'gas', n: 'Gas', il: 'gas' }, { id: 'agua', n: 'Garrafones', il: 'garrafon' }, { id: 'mandado', n: 'Mandados', il: 'moto' },
  ];

  function vCliente() {
    const c = UI.cli, cl = yo();
    if (c.step === 'onb') {
      const o = ONB[c.onb];
      const art = o.ils.map((k, i) => ill(k, 'o' + i)).join('');
      return `<div class="onb"><div class="row between">${brand('on-orange')}<button class="link" data-act="c-step:tel">Saltar</button></div>
        <div><div class="onb-art">${art}</div><div class="dots">${ONB.map((_, i) => `<i class="${i === c.onb ? 'on' : ''}"></i>`).join('')}</div><h1>${o.t}</h1><p>${o.d}</p></div>
        <button class="btn dark block" data-act="${c.onb < 2 ? 'c-onb' : 'c-step:tel'}">${c.onb < 2 ? 'Siguiente' : 'Empezar'}</button></div>`;
    }
    if (c.step === 'tel') return hdr('¿Cuál es tu número?', 'Te mandamos un código por WhatsApp', { back: 'c-step:onb' }) + `<div class="scroll">
      <label class="f">Número de celular<div class="phone-in"><span>+52</span><input id="c-tel" inputmode="tel" value="${esc(cl.tel)}" aria-label="Número"></div></label>
      <p class="small muted" style="margin:0">Sin contraseñas: entras siempre con un código. Un número, una cuenta.</p>
      <button class="btn block" data-act="c-sendcode">Enviar código</button></div>`;
    if (c.step === 'code') return hdr('Escribe el código', `Lo enviamos al +52 ${esc(cl.tel)}`, { back: 'c-step:tel' }) + `<div class="scroll">
      <div class="otp">${'1234'.split('').map((d, i) => `<input value="${d}" maxlength="1" inputmode="numeric" aria-label="Dígito ${i + 1}">`).join('')}</div>
      ${nota('Maqueta: el código de prueba ya viene escrito.')}
      <button class="btn block" data-act="c-step:datos">Verificar</button></div>`;
    if (c.step === 'datos') return hdr('¿A dónde te llevamos?', 'Solo te lo pedimos una vez') + `<div class="scroll">
      <label class="f">Tu nombre<input class="in" id="c-nombre" value="${esc(cl.nombre)}"></label>
      <label class="f">Fraccionamiento<select class="in" id="c-fracc">${W.config.zonas.map((f) => `<option ${f === cl.fracc ? 'selected' : ''}>${f}</option>`).join('')}</select></label>
      <label class="f">Calle y número<input class="in" id="c-dir" value="${esc(cl.dir)}"></label>
      <label class="f">Código de un vecino (opcional)<input class="in" id="c-codigo" placeholder="Ej. M2JORGE" value="${esc(c.codigo)}"></label>
      <p class="small muted" style="margin:0">Si un vecino te invitó, los dos ganan $${W.config.promos.vecino} cuando recibas tu primer pedido.</p>
      <button class="btn block" data-act="c-registrar">Empezar a pedir</button></div>`;

    const s = c.screen;
    const navC = nav([{ id: 'inicio', n: 'Inicio', icon: 'home', act: 'c-go:inicio' }, { id: 'buscar', n: 'Buscar', icon: 'search', act: 'c-go:buscar' }, { id: 'pedidos', n: 'Pedidos', icon: 'list', act: 'c-go:pedidos' }, { id: 'cuenta', n: 'Cuenta', icon: 'user', act: 'c-go:cuenta' }], s);
    const V = { negocio: vTienda, carrito: vCarrito, seguimiento: vSeguimiento, reclamo: vReclamo, gas: vGas, agua: vAgua, mandado: vMandado, buscar: vBuscar, pedidos: vPedidos, cuenta: vCuenta, cat: vCategoria };
    return (V[s] || vInicio)() + cartFab() + navC + sheetCliente();
  }
  function cartFab() {
    const c = UI.cli;
    if (!c.cart.length || ['carrito', 'seguimiento', 'gas', 'agua', 'mandado', 'reclamo'].includes(c.screen)) return '';
    const n = c.cart.reduce((a, i) => a + i.q, 0), sub = c.cart.reduce((a, i) => a + i.q * i.p, 0);
    return `<button class="cartfab" data-act="c-go:carrito"><span><span class="n">${n}</span>Ver carrito</span><span>${money(sub)}</span></button>`;
  }
  function bizCard(n) {
    const ab = M.negocioAbierto(W, n), cl = yo();
    const e = n.entregaPropia ? 0 : n.envioGratis ? 0 : M.envioBase(W, n.fracc, cl.fracc);
    const dest = M.anuncioActivo(W, n, 'destacado');
    return `<button class="bizc ${ab.ok ? '' : 'closed'}" data-act="c-neg:${n.id}">${cover(n)}${n.promo && ab.ok ? `<span class="chip">${esc(n.promo)}</span>` : ''}<span class="eta">${ab.ok ? `${n.prep + 10}–${n.prep + 20} min` : esc(ab.motivo)}</span></div>
      <div class="meta"><div class="row" style="min-width:0;gap:10px">${blogo(n, 42)}<div style="min-width:0"><h3>${esc(n.nombre)}${dest ? ' <span class="tag-ad">Destacado · anuncio</span>' : ''}</h3><p>${esc(n.desc)}<span class="dot">•</span>${e ? 'Envío ' + money(e) : '<b style="color:var(--ok)">Envío gratis</b>'}</p></div></div><span class="rating">★ ${n.rating.toFixed(1)}</span></div></button>`;
  }
  const miniCard = (n) => `<button class="mini" data-act="c-neg:${n.id}">${cover(n)}</div><h3>${esc(n.nombre)}</h3><p>★ ${n.rating.toFixed(1)} · ${n.prep + 10}–${n.prep + 20} min</p></button>`;
  const isStandalone = () => { try { return matchMedia('(display-mode: standalone)').matches || navigator.standalone === true; } catch (e) { return false; } };
  const installCard = () => isStandalone() ? '' : `<button class="install" data-act="c-sheet:install"><span class="ic">${APPICON}</span><span style="flex:1"><b>Instala De Una en tu celular</b><span>Queda en tu pantalla de inicio como cualquier app. Sin App Store.</span></span></button>`;
  const ordenNegocios = (list) => [...list].sort((a, b) => (M.negocioAbierto(W, b).ok - M.negocioAbierto(W, a).ok) || (M.anuncioActivo(W, b, 'destacado') - M.anuncioActivo(W, a, 'destacado')) || b.ops - a.ops);

  function vInicio() {
    const cl = yo(), op = W.config.operacion, t = W.config.tarifas;
    const activoP = W.pedidos.filter((p) => p.clienteId === cl.id && M.activo(p)).pop();
    const tienda = ordenNegocios(W.negocios.filter((n) => ['comida', 'tiendita', 'farmacia'].includes(n.cat)));
    const top4 = tienda.filter((n) => M.negocioAbierto(W, n).ok).sort((a, b) => b.ops - a.ops).slice(0, 4);
    const promos = [];
    if (M.bienvenidaElegible(W, cl)) promos.push(`<div class="promo pr-1"><div><b>Tu primer envío es gratis</b><span>Se aplica solo, sin código</span><span class="code">BIENVENIDO</span></div><span class="big">${ill('gift')}</span></div>`);
    for (const n of W.negocios.filter((x) => M.anuncioActivo(W, x, 'carrusel'))) promos.push(`<button class="promo pr-2" data-act="c-neg:${n.id}"><div><span class="tag-ad" style="color:inherit;opacity:.9">Anuncio</span><b>${esc(n.nombre)}</b><span>${esc(n.desc)} · ${esc(n.fracc)}</span></div><span class="big">${ill(n.il)}</span></button>`);
    if (!cl.plus.activo) promos.push(`<button class="promo pr-3" data-act="c-go:cuenta"><div><b>De Una Plus: envío gratis</b><span>$${W.config.plus.precio} al mes · en pedidos desde $${W.config.plus.envioGratisDesde}</span></div><span class="big">${ill('moto')}</span></button>`);
    promos.push(`<button class="promo pr-4" data-act="c-cat:gas"><div><b>¿Se acabó el gas?</b><span>Pídelo aquí; lo lleva una gasera con permiso</span></div><span class="big">${ill('gas')}</span></button>`);
    return `<div class="top hot"><div class="top-row"><button class="addr" data-act="c-sheet:dir"><span>Entregar en</span><b>${esc(cl.dir)}, ${esc(cl.fracc)}</b></button>${brand('inv')}</div>
      <div class="hola">Hola, ${esc(cl.nombre.split(' ')[0])}. <span>¿Qué se te antoja hoy?</span></div>
      <button class="search" data-act="c-go:buscar" style="text-align:left">${ICONS.search}<span class="muted" style="padding:13px 0">Busca tacos, gas, farmacia…</span></button></div>
    <div class="scroll">
      ${activoP ? `<button class="live" data-act="c-ver:${activoP.id}"><span class="pulse"></span><div class="grow"><b>${M.ESTADO_TXT[activoP.estado]} · #${activoP.id}</b><small>${esc(origenDe(activoP))} · ver seguimiento</small></div><span>›</span></button>` : ''}
      ${t.lluvia.activa ? `<div class="banner accent small">Está lloviendo: el envío sube $${t.lluvia.extra} y todo es para tu repartidor.</div>` : ''}
      ${op.leySeca ? '<div class="banner small">Hoy hay ley seca: no se vende alcohol.</div>' : ''}
      <div class="promos">${promos.join('')}</div>
      <div class="cats">${CATS.map((k) => `<button class="cat" data-act="c-cat:${k.id}"><span class="ic-box">${ill(k.il)}</span>${k.n}</button>`).join('')}</div>
      ${installCard()}
      ${top4.length ? `<div class="stack"><h2>Lo más pedido en ${esc(cl.fracc)}</h2><div class="hscroll">${top4.map(miniCard).join('')}</div></div>` : ''}
      <button class="gasband" data-act="c-cat:gas"><span class="duo">${ill('gas')}${ill('garrafon')}</span><span style="flex:1"><b>Gas y garrafones</b><span>Te los lleva una gasera o purificadora de la zona</span></span><span style="font-size:22px">›</span></button>
      <div class="stack"><h2>Todos los negocios</h2>${tienda.map(bizCard).join('')}</div>
      <p class="small muted" style="margin:0;text-align:center">Mismo precio que en el local: De Una no le cobra comisión a los negocios.</p>
    </div>`;
  }
  function vCategoria() {
    const k = CATS.find((x) => x.id === UI.cli.cat), list = ordenNegocios(W.negocios.filter((n) => n.cat === UI.cli.cat));
    return hdr(k.n, `${list.length} negocios cerca de ti`, { back: 'c-go:inicio', lead: `<span class="ill-box" style="width:40px;height:40px">${ill(k.il)}</span>` }) + `<div class="scroll">${list.length ? list.map(bizCard).join('') : empty('bag', 'Pronto habrá negocios aquí.')}</div>`;
  }
  function vBuscar() {
    const q = UI.cli.q.trim().toLowerCase();
    let res = '';
    if (q) {
      const ns = W.negocios.filter((n) => (n.nombre + ' ' + n.desc).toLowerCase().includes(q));
      const ps = [];
      W.negocios.forEach((n) => n.menu.forEach((m) => { if (m.on && m.n.toLowerCase().includes(q)) ps.push({ n, m }); }));
      res = (ns.length ? `<div class="stack"><div class="eyebrow">Negocios</div>${ns.map(bizCard).join('')}</div>` : '') +
        (ps.length ? `<div class="stack"><div class="eyebrow">Productos</div><div class="card" style="padding:4px 14px">${ps.map(({ n, m }) => `<button class="item" style="width:100%;border-left:0;border-right:0;border-top:0;background:none;text-align:left;color:inherit" data-act="c-neg:${n.id}">${thumb(m.il, 52)}<div class="grow"><h3>${esc(m.n)}</h3><p>${esc(n.nombre)}</p></div><span class="price">${money(m.p)}</span></button>`).join('')}</div></div>` : '');
      if (!res) res = empty('moto', 'No encontramos eso. Pídelo como mandado.') + '<button class="btn ghost" data-act="c-cat:mandado">Pedir un mandado</button>';
    } else res = `<div class="stack"><div class="eyebrow">Lo que más buscan en tu zona</div><div class="chips">${['tacos', 'pizza', 'gas', 'garrafón', 'huevo', 'paracetamol', 'cerveza'].map((w) => chip(w, 'c-q:' + w)).join('')}</div></div>`;
    return `<div class="top"><label class="search">${ICONS.search}<input id="c-q" placeholder="Busca tacos, gas, farmacia…" value="${esc(UI.cli.q)}" data-input="c-q" aria-label="Buscar"></label></div><div class="scroll">${res}</div>`;
  }
  function vTienda() {
    const c = UI.cli, n = neg(c.negId), cl = yo(), ab = M.negocioAbierto(W, n);
    const e = n.entregaPropia ? 0 : n.envioGratis ? 0 : M.envioBase(W, n.fracc, cl.fracc);
    const q = (id) => { const it = c.cartNeg === n.id && c.cart.find((x) => x.id === id); return it ? it.q : 0; };
    const prod = (m) => {
      const v = M.productoVendible(W, n, m);
      const tags = [m.alcohol ? '<span class="chip soft">+18</span>' : '', m.receta === 'requerida' ? '<span class="chip soft">Con receta</span>' : '', !v.ok ? `<span class="chip" style="background:var(--surface-2);color:var(--muted)">${esc(v.motivo.length > 26 ? 'No disponible' : v.motivo)}</span>` : ''].join(' ');
      return `<div class="item ${v.ok ? '' : 'dim'}"><div class="grow"><h3>${esc(m.n)}</h3>${m.d ? `<p>${esc(m.d)}</p>` : ''}<div class="row" style="gap:6px;margin-top:6px;flex-wrap:wrap"><span class="price">${money(m.p)}</span>${tags}</div>
        ${!v.ok && m.receta === 'antibiotico' ? `<p>${esc(v.motivo)}</p>` : ''}
        ${q(m.id) ? `<div class="qty" style="margin-top:8px;width:max-content"><button data-act="c-menos:${m.id}" aria-label="Quitar uno">−</button>${q(m.id)}<button class="add" data-act="c-mas:${m.id}" aria-label="Agregar uno">+</button></div>` : ''}</div>
        <div class="thumb">${ill(m.il)}${q(m.id) || !v.ok || !ab.ok ? '' : `<button class="add-f" data-act="c-mas:${m.id}" aria-label="Agregar ${esc(m.n)}">+</button>`}</div></div>`;
    };
    const tops = n.menu.filter((m) => m.top), rest = n.menu.filter((m) => !m.top);
    return `<div class="scroll" style="padding:0 0 110px;gap:0">
      ${cover(n, 'store-cover')}<button class="icon-btn glass" data-act="c-go:inicio" aria-label="Regresar">${ICONS.back}</button></div>
      <div class="store-head">${blogo(n, 68)}<h1>${esc(n.nombre)}</h1><div class="small muted">${esc(n.desc)} · ${esc(n.fracc)}</div>
        <div class="facts"><div class="fact"><b>★ ${n.rating.toFixed(1)}</b>${n.ops}+ pedidos</div><div class="fact"><b>${n.prep + 10}–${n.prep + 20} min</b>Entrega</div><div class="fact"><b>${n.entregaPropia ? 'Incluido' : e ? money(e) : 'Gratis'}</b>Envío</div></div>
        ${!ab.ok ? `<div class="banner small"><b>${esc(ab.motivo)}.</b> Puedes ver el menú, pero todavía no recibe pedidos.</div>` : ''}
        ${n.saturado && ab.ok ? '<div class="banner accent small">Hay mucha demanda: hoy tarda un poco más de lo normal.</div>' : ''}
        <div class="row" style="flex-wrap:wrap;gap:6px">${n.promo ? `<span class="chip">${esc(n.promo)}</span>` : ''}<span class="chip soft">Mismo precio que en el local</span></div></div>
      <div style="padding:0 16px;display:flex;flex-direction:column;gap:6px">
        ${tops.length ? `<h2 style="margin-top:14px">Lo más pedido</h2><div>${tops.map(prod).join('')}</div>` : ''}
        ${rest.length ? `<h2 style="margin-top:14px">Menú</h2><div>${rest.map(prod).join('')}</div>` : ''}
      </div></div>`;
  }

  const qCarrito = () => { const c = UI.cli; return { clienteId: c.id, negocioId: c.cartNeg, tipo: 'tienda', items: c.cart.map((i) => ({ id: i.id, q: i.q })), propina: c.tip, pago: c.pago, pagaCon: c.pagaCon, sustitucion: c.sust, nota: c.nota, mayorEdad: c.mayorEdad, recetaFoto: c.recetaFoto }; };
  function elegirPago(cot) {
    const c = UI.cli;
    if (!c.pago || !cot.metodos[c.pago] || !cot.metodos[c.pago].ok) c.pago = ['efectivo', 'transferencia'].find((k) => cot.metodos[k].ok) || null;
  }
  function desglose(c) {
    const row = (a, b) => `<div><span>${a}</span><span>${b}</span></div>`;
    let h = '<div class="card sum">';
    if (c.tipo === 'mandado') h += row('Productos (según ticket)', c.S ? money(c.S) : 'Por definir') + row('Mandado', money(c.E));
    else h += row('Productos', money(c.S)) + row('Envío', c.entrega === 'propia' ? 'Incluido' : money(c.E));
    if (c.L) h += row('Extra por lluvia (para tu repartidor)', money(c.L));
    if (c.PP) h += row(`Pedido menor a $${W.config.tarifas.pedidoPequeno.umbral} (para tu repartidor)`, money(c.PP));
    h += row('Servicio De Una', money(c.V));
    if (c.P) h += row('Propina (100 % para quien te lo lleva)', money(c.P));
    for (const d of c.descuentos || []) h += `<div class="disc"><span>${esc(d.etq)}</span><span>${money(-d.monto)}</span></div>`;
    return h + `<div class="tot"><span>Total</span><span>${money(c.T)}</span></div></div>`;
  }
  function pagoOpts(cot, efectivoTxt) {
    const p = UI.cli.pago;
    const o = (id, ic, t, d) => { const m = cot.metodos[id]; return `<button class="opt" data-act="c-pago:${id}" aria-pressed="${p === id}" ${m.ok ? '' : 'disabled'}><span class="r"></span><span style="width:22px;height:22px;flex:none;color:var(--muted)">${ICONS[ic]}</span><span><b>${t}</b><small>${esc(m.ok ? d : m.motivo)}</small></span></button>`; };
    return `<div class="stack"><h2>Forma de pago</h2><div class="opts">${o('efectivo', 'cash', 'Efectivo', efectivoTxt || 'Pagas al recibir')}${o('transferencia', 'bank', 'Transferencia', 'Te damos una CLABE y se confirma sola')}${o('tarjeta', 'card', 'Tarjeta', 'Próximamente')}</div></div>`;
  }
  function vCarrito() {
    const c = UI.cli;
    if (!c.cart.length) return hdr('Carrito', '', { back: 'c-go:inicio' }) + `<div class="scroll">${empty('bag', 'Tu carrito está vacío.')}<button class="btn ghost" data-act="c-go:inicio">Ver negocios</button></div>`;
    let cot = M.cotizar(W, qCarrito());
    elegirPago(cot);
    cot = M.cotizar(W, qCarrito());
    const n = neg(c.cartNeg), cl = yo();
    const errores = cot.errores.filter((e) => !(c.pago && cot.metodos[c.pago] && !cot.metodos[c.pago].ok && e === cot.metodos[c.pago].motivo));
    const billetes = [0, 200, 500, 1000].filter((b) => b === 0 || b >= cot.T);
    return hdr('Tu pedido', esc(n.nombre), { back: 'c-neg:' + n.id, lead: blogo(n, 38) }) + `<div class="scroll">
      <div class="card" style="padding:4px 14px">${c.cart.map((i) => `<div class="item">${thumb(i.il, 48)}<div class="grow"><h3>${esc(i.n)}</h3><div class="price">${money(i.p * i.q)}</div></div><div class="qty"><button data-act="c-menos:${i.id}" aria-label="Quitar uno">−</button>${i.q}<button class="add" data-act="c-mas:${i.id}" aria-label="Agregar uno">+</button></div></div>`).join('')}
        <button class="link" style="padding:12px 0;text-align:left" data-act="c-neg:${n.id}">+ Agregar más productos</button></div>
      <div class="stack"><h2>Si algo no hay</h2><div class="chips">${chip('Quítalo y ajusta el total', 'c-sust:quitar', c.sust === 'quitar')}${chip('Llámame', 'c-sust:llamar', c.sust === 'llamar')}${chip('Cancela todo', 'c-sust:cancelar', c.sust === 'cancelar')}</div></div>
      <label class="f">Nota para el negocio<textarea class="in" id="c-nota" data-bind="cli.nota" placeholder="Ej. sin cebolla, salsa aparte">${esc(c.nota)}</textarea></label>
      <div class="card"><div class="row between"><div class="row">${thumb('house', 44)}<div><div class="eyebrow">Entregar en</div><div style="font-weight:700">${esc(cl.dir)}</div><div class="small muted">${esc(cl.fracc)}</div></div></div><button class="link" data-act="c-sheet:dir">Cambiar</button></div></div>
      ${cot.requisitos.mayorEdad ? `<button class="opt" data-act="c-toggle:mayorEdad" aria-pressed="${c.mayorEdad}"><span class="r"></span><span><b>Soy mayor de 18 años</b><small>El repartidor te pedirá tu INE al entregar</small></span></button>` : ''}
      ${cot.requisitos.receta ? `<button class="opt" data-act="c-toggle:recetaFoto" aria-pressed="${c.recetaFoto}"><span class="r"></span><span style="width:22px;height:22px;flex:none;color:var(--muted)">${ICONS.camera}</span><span><b>${c.recetaFoto ? 'Receta subida: receta.jpg' : 'Subir foto de la receta'}</b><small>La farmacia la revisa antes de aceptar</small></span></button>` : ''}
      ${n.entregaPropia ? '' : `<div class="stack"><div><h2>Propina para tu repartidor</h2><p class="small muted" style="margin:2px 0 0">Es opcional y el 100 % es para quien te lo lleva.</p></div>
        <div class="tips">${[0, 10, 15, 20].map((v) => `<button class="tip" data-act="c-tip:${v}" aria-pressed="${c.tip === v}">${v ? money(v) : 'Ahora no'}${v === 10 ? '<small>Sugerida</small>' : ''}</button>`).join('')}</div></div>`}
      ${pagoOpts(cot, cot.nivel.nivel === 'nuevo' ? `Pagas al recibir · ${cot.nivel.motivo.toLowerCase()}` : 'Pagas al recibir')}
      ${c.pago === 'efectivo' ? `<div class="stack"><div class="eyebrow">¿Con cuánto pagas?</div><div class="chips">${billetes.map((b) => chip(b ? money(b) : 'Exacto', 'c-billete:' + b, (c.pagaCon || 0) === b)).join('')}</div><p class="small muted" style="margin:0">Así tu repartidor lleva cambio.</p></div>` : ''}
      ${desglose(cot)}
      ${cot.avisos.map((a) => `<div class="banner small">${esc(a)}</div>`).join('')}
      ${errores.length ? `<div class="banner small" style="border:1px solid var(--line)"><b>${esc(errores[0])}</b></div>` : ''}
      <button class="btn block" data-act="c-pedir" ${errores.length || !c.pago ? 'disabled' : ''}>Hacer pedido · ${money(cot.T)}</button>
      <p class="small muted" style="margin:0;text-align:center">Sin cargos escondidos: esto es todo lo que pagas.</p>
    </div>`;
  }

  const nest = (k, x, y, s) => `<svg x="${x}" y="${y}" width="${s}" height="${s}" viewBox="0 0 64 64">${IL[k]}</svg>`;
  function mapSvg(p) {
    const prog = { pago_pendiente: 0, nuevo: 0, preparando: 0, listo: 0.04, buscando: 0, comprando: 0.12, por_aprobar: 0.2, en_camino: 0.6, en_puerta: 1, entregado: 1 }[p.estado] || 0;
    return `<div class="map"><svg viewBox="0 0 360 210" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Mapa del recorrido">
      <rect width="360" height="210" fill="var(--map)"/>
      <g stroke="var(--street)" stroke-width="12" stroke-linecap="round"><path d="M0 60H360M0 150H360M70 0V210M200 0V210M300 0V210"/></g>
      <g fill="var(--line)"><rect x="90" y="75" width="95" height="60" rx="8"/><rect x="215" y="75" width="70" height="60" rx="8"/><rect x="10" y="75" width="45" height="60" rx="8"/><rect x="90" y="165" width="95" height="40" rx="8"/><rect x="215" y="5" width="70" height="40" rx="8"/></g>
      <path id="ruta" d="M70 40 V150 H300 V105" fill="none" stroke="var(--accent)" stroke-width="5" stroke-dasharray="2 9" stroke-linecap="round"/>
      <circle cx="70" cy="40" r="20" fill="#fff" stroke="var(--accent)" stroke-width="3"/>${nest(ilDe(p), 56, 26, 28)}
      <circle cx="300" cy="105" r="20" fill="#fff" stroke="var(--accent)" stroke-width="3"/>${nest('house', 286, 90, 28)}
      ${p.asignacion.repaId || p.entrega === 'propia' ? `<g id="moto" data-p="${prog}"><circle r="21" fill="#3B2416"/>${nest('moto', -15, -16, 30)}</g>` : ''}
    </svg></div>`;
  }
  const incidenciaDe = (p) => W.incidencias.filter((i) => i.pedidoId === p.id && i.tipo !== 'cliente_ausente').pop();

  function vSeguimiento() {
    const p = M.pedido(W, UI.cli.orderId);
    if (!p) return hdr('Pedido', '', { back: 'c-go:inicio' }) + `<div class="scroll">${empty('bag', 'No encontramos ese pedido.')}</div>`;
    const r = p.asignacion.repaId && M.repartidor(W, p.asignacion.repaId);
    const n = p.negocioId && neg(p.negocioId), cl = yo();
    const pasos = M.pasos(p), activo = M.activo(p);
    const eta = p.eta && activo && !['pago_pendiente', 'nuevo'].includes(p.estado) ? `${hora(p.eta - 5)}–${hora(p.eta + 5)}` : null;
    const pol = M.politicaCancelacion(W, p, 'cliente');
    const inc = incidenciaDe(p);
    let bloque = '';
    if (p.estado === 'pago_pendiente') {
      const vence = p.t.creado + W.config.tiempos.pago;
      bloque = `<div class="card"><h2>Haz tu transferencia</h2>
        ${kv('Monto exacto', `<b>${money(p.cot.T)}</b>`)}${kv('CLABE', '<span class="mono">646 180 0000 0000 00</span> (ejemplo)')}${kv('Referencia', `<b class="mono">${p.referencia}</b>`)}${kv('Tienes hasta', hora(vence))}
        <p class="small muted" style="margin:0">Tu pedido se confirma solo cuando el dinero llega a la cuenta de De Una. No necesitas mandar captura: las capturas no confirman pagos.</p>
        <button class="btn ghost sm" data-act="c-simpago:${p.id}">Maqueta: simular que llegó la transferencia</button></div>`;
    }
    if (p.estado === 'por_aprobar') {
      bloque = `<div class="card"><h2>Revisa el ticket</h2><div class="row">${thumb('doc', 64).replace(ill('doc'), `<span style="width:30px;height:30px;color:var(--muted)">${ICONS.doc}</span>`)}<div><b>${money(p.ticket.monto)}</b> en productos<p class="small muted" style="margin:2px 0 0">${esc(r ? r.nombre : 'Tu repartidor')} compró y subió la foto del ticket.</p></div></div>
        ${desglose({ ...p.cot, S: p.ticket.monto, T: Math.round((p.cot.T - p.cot.S + p.ticket.monto) * 100) / 100 })}
        <div class="row-btns"><button class="btn ghost" data-act="c-ticket:${p.id}:no">No estoy de acuerdo</button><button class="btn" style="flex:1" data-act="c-ticket:${p.id}:si">Aprobar y que lo traiga</button></div></div>`;
    }
    const pinCard = activo && p.estado !== 'pago_pendiente' ? `<div class="card pincard"><div class="eyebrow">Tu código de entrega</div><div class="pinbig">${p.pin}</div><p class="small muted" style="margin:0;text-align:center">Dáselo a ${p.entrega === 'propia' ? 'quien te entregue' : 'tu repartidor'} solo cuando tengas tu pedido en la mano.${p.tieneAlcohol ? ' Ten lista tu INE.' : ''}</p></div>` : '';
    let fin = '';
    if (p.estado === 'entregado') {
      const rt = UI.cli.rate[p.id] || {};
      fin += p.calif ? '<div class="card" style="text-align:center"><b>¡Gracias por calificar!</b><p class="small muted" style="margin:0">Tu calificación ayuda a tus vecinos.</p></div>' : `<div class="card" style="text-align:center;gap:8px"><h2>¿Qué tal estuvo?</h2>
        ${r ? `<div class="small muted">${esc(r.nombre)}</div><div class="stars">${[1, 2, 3, 4, 5].map((v) => `<button class="${(rt.repa || 0) >= v ? 'on' : ''}" data-act="c-rate:${p.id}:repa:${v}" aria-label="${v} estrellas al repartidor">★</button>`).join('')}</div>` : ''}
        ${n ? `<div class="small muted">${esc(n.nombre)}</div><div class="stars">${[1, 2, 3, 4, 5].map((v) => `<button class="${(rt.neg || 0) >= v ? 'on' : ''}" data-act="c-rate:${p.id}:neg:${v}" aria-label="${v} estrellas al negocio">★</button>`).join('')}</div>` : ''}
        <button class="btn sm" data-act="c-enviar-calif:${p.id}" ${rt.repa || rt.neg ? '' : 'disabled'}>Enviar calificación</button></div>`;
      fin += inc ? `<div class="card"><div class="row between"><h3>Reclamo #${inc.id}: ${esc(M.TIPOS_INC[inc.tipo])}</h3><span class="pill ${inc.estado === 'abierta' ? 'p-pago_pendiente' : inc.estado === 'resuelta' ? 'p-entregado' : 'p-cancelado'}">${inc.estado === 'abierta' ? 'En revisión' : inc.estado === 'resuelta' ? 'Resuelto' : 'No procede'}</span></div>
        <p class="small muted" style="margin:0">${inc.estado === 'abierta' ? 'Lo revisamos y te respondemos en menos de 24 horas.' : inc.estado === 'resuelta' ? (inc.resolucion.monto ? `Te devolvimos ${money(inc.resolucion.monto)} ${inc.resolucion.destino === 'transferencia' ? 'por transferencia' : 'como saldo a favor'}.` : 'Resuelto.') : esc(inc.resolucion.nota || 'Revisamos tu reporte y no procede.')}</p></div>` : `<button class="btn ghost block" data-act="c-reclamo:${p.id}">Tengo un problema con este pedido</button>`;
    }
    if (p.estado === 'cancelado') fin = `<div class="card"><h2>Pedido cancelado</h2><p class="small" style="margin:0">${esc(p.cancelacion.motivo)}.</p>${p.cancelacion.reembolso ? `<p class="small muted" style="margin:0">Te devolvemos ${money(p.cancelacion.reembolso)} por transferencia.${p.cancelacion.cargo ? ` Al negocio se le pagan ${money(p.cancelacion.cargo)} por insumos.` : ''}</p>` : ''}</div>`;
    if (p.estado === 'no_entregado') fin = `<div class="card"><h2>No recibiste este pedido</h2><p class="small" style="margin:0">Tu repartidor esperó ${W.config.tiempos.espera} min y te llamó ${p.llamadas} veces.</p><p class="small muted" style="margin:0">${M.saldo(W, 'cli:' + cl.id) < 0 ? `Quedó un adeudo de ${money(-M.saldo(W, 'cli:' + cl.id))}. Mientras, solo puedes pagar por adelantado.` : 'Ya no tienes adeudos.'}</p></div>`;
    return hdr(`Pedido #${p.id}`, esc(origenDe(p)), { back: 'c-go:inicio' }) + `<div class="scroll">
      ${p.estado !== 'pago_pendiente' && p.estado !== 'cancelado' ? mapSvg(p) : ''}
      <div class="card"><div class="eta-card"><div><div class="small muted" style="font-weight:700">${M.ESTADO_TXT[p.estado]}</div>${eta ? `<b>${eta}</b>` : p.estado === 'entregado' ? '<b>¡Llegó!</b>' : `<b>${p.estado === 'nuevo' ? 'Esperando confirmación' : p.estado === 'pago_pendiente' ? 'Falta tu pago' : M.ESTADO_TXT[p.estado]}</b>`}</div>${pill(p.estado)}</div></div>
      ${bloque}${pinCard}
      ${r ? `<div class="card courier"><div class="avatar">${esc(r.nombre[0])}</div><div style="flex:1;min-width:0"><h3>${esc(r.nombre)}</h3><p class="small muted" style="margin:2px 0 0">${r.vehiculo === 'bici' ? 'Bicicleta' : 'Moto'} · ★ ${r.rating.toFixed(1)}</p></div><button class="icon-btn" data-act="toast:Chat dentro de la app: tu número no se comparte" aria-label="Escribir al repartidor">${ICONS.chat}</button></div>` : ''}
      ${fin}
      <div class="card"><ol class="steps">${pasos.map((s) => `<li class="${s.hecho ? 'done' : s.ahora ? 'now' : ''}"><span class="mk"></span><div><b>${s.txt}</b></div></li>`).join('')}</ol></div>
      ${activo ? nota(`Maqueta: el pedido avanza desde la vista ${p.estado === 'nuevo' || (p.entrega === 'propia' && p.estado !== 'por_aprobar') ? '<b>Negocio</b>' : p.estado === 'pago_pendiente' ? '<b>Cliente</b> (simula el pago) o <b>Admin</b>' : '<b>Repartidor</b>'} o con el reloj de la demo.`) : ''}
      ${desglose(p.cot)}
      ${pol.permitido && activo ? `<button class="btn ghost block" data-act="c-sheet:cancelar">Cancelar pedido</button>` : ''}
    </div>`;
  }
  function vReclamo() {
    const p = M.pedido(W, UI.cli.orderId), f = UI.cli.inc;
    const tipos = ['falta', 'equivocado', 'mal_estado', 'no_llego', 'cobro', 'trato'];
    const pideFoto = ['falta', 'equivocado', 'mal_estado'].includes(f.tipo);
    return hdr('¿Qué pasó?', `Pedido #${p.id}`, { back: 'c-ver:' + p.id }) + `<div class="scroll">
      <div class="chips">${tipos.map((t) => chip(M.TIPOS_INC[t], 'c-inc:tipo:' + t, f.tipo === t)).join('')}</div>
      <label class="f">Cuéntanos<textarea class="in" data-bind="cli.inc.detalle" placeholder="Ej. no venía el refresco">${esc(f.detalle)}</textarea></label>
      <label class="f">¿Cuánto crees que te deben? (opcional)<input class="in" inputmode="numeric" data-bind="cli.inc.monto" value="${esc(f.monto)}" placeholder="45"></label>
      <button class="opt" data-act="c-inc:foto" aria-pressed="${f.foto}"><span class="r"></span><span style="width:22px;height:22px;flex:none;color:var(--muted)">${ICONS.camera}</span><span><b>${f.foto ? 'Foto agregada: pedido.jpg' : 'Agregar foto'}</b><small>${pideFoto ? 'Obligatoria para este tipo de reporte' : 'Opcional'}</small></span></button>
      <div class="banner small">Revisamos cada reporte con la foto, el ticket del negocio y el código de entrega. Si procede, te devolvemos como saldo a favor al momento o por transferencia.</div>
      <button class="btn block" data-act="c-enviar-inc:${p.id}" ${f.tipo ? '' : 'disabled'}>Enviar reporte</button></div>`;
  }
  function vGas() {
    const c = UI.cli, g = neg('gas'), q = () => M.cotizar(W, { clienteId: c.id, negocioId: 'gas', tipo: 'tienda', items: [{ id: c.gasItem, q: 1 }], pago: c.pago });
    elegirPago(q());
    const cot = q();
    const ab = M.negocioAbierto(W, g);
    return hdr('Gas LP', 'Te lo lleva una gasera con permiso', { back: 'c-go:inicio' }) + `<div class="scroll">
      <div class="card row" style="flex-direction:row">${blogo(g, 56)}<div><h3>${esc(g.nombre)}</h3><p class="small muted" style="margin:2px 0 0">${ab.ok ? `Llega en 1 a 2 horas · ★ ${g.rating.toFixed(1)}` : esc(ab.motivo)}</p><p class="small muted" style="margin:2px 0 0">Permiso: ${esc(g.permiso)}</p></div></div>
      <div class="stack"><h2>¿Qué cilindro?</h2><div class="opts">${g.menu.map((m) => `<button class="opt" data-act="c-gasitem:${m.id}" aria-pressed="${c.gasItem === m.id}"><span class="r"></span><span class="ill-box" style="width:${m.kg > 20 ? 44 : 36}px;height:44px">${ill('gas')}</span><span style="flex:1"><b>${m.n}</b><small>Máximo oficial: ${money(M.precioMaxGas(W, m))}</small></span><span class="price">${money(m.p)}</span></button>`).join('')}</div></div>
      <div class="banner small">De Una toma tu pedido y se lo pasa a la gasera. Ella entrega con su camión y su personal, como marca la norma. El precio nunca pasa el máximo oficial de la semana.</div>
      ${pagoOpts(cot)}${desglose(cot)}
      ${cot.errores.length ? `<div class="banner small"><b>${esc(cot.errores[0])}</b></div>` : ''}
      <button class="btn block" data-act="c-pedir-directo:gas" ${cot.errores.length ? 'disabled' : ''}>Pedir gas · ${money(cot.T)}</button></div>`;
  }
  function vAgua() {
    const c = UI.cli, a = neg('agua'), n = c.garrafones, q = () => M.cotizar(W, { clienteId: c.id, negocioId: 'agua', tipo: 'tienda', items: [{ id: 1, q: n }], pago: c.pago });
    elegirPago(q());
    const cot = q();
    return hdr('Garrafones', 'Agua purificada de 20 L', { back: 'c-go:inicio' }) + `<div class="scroll">
      <div class="card row" style="flex-direction:row">${blogo(a, 56)}<div><h3>${esc(a.nombre)}</h3><p class="small muted" style="margin:2px 0 0">${money(a.menu[0].p)} por garrafón · entrega la purificadora</p></div></div>
      <div class="card" style="align-items:center;gap:6px"><div class="row" style="justify-content:center;gap:0;height:84px">${Array.from({ length: Math.min(n, 5) }, (_, i) => `<span class="ill-box" style="width:56px;height:80px;margin-left:${i ? -18 : 0}px">${ill('garrafon')}</span>`).join('')}</div>
        <div class="row between" style="width:100%"><div><h3>¿Cuántos garrafones?</h3><p class="small muted" style="margin:2px 0 0">Ten listos los vacíos</p></div><div class="qty"><button data-act="c-garr:-1" aria-label="Uno menos">−</button>${n}<button class="add" data-act="c-garr:1" aria-label="Uno más">+</button></div></div></div>
      ${pagoOpts(cot)}${desglose(cot)}
      ${cot.errores.length ? `<div class="banner small"><b>${esc(cot.errores[0])}</b></div>` : ''}
      <button class="btn block" data-act="c-pedir-directo:agua" ${cot.errores.length ? 'disabled' : ''}>Pedir garrafones · ${money(cot.T)}</button></div>`;
  }
  function vMandado() {
    const c = UI.cli, f = c.mand;
    const cot = M.cotizar(W, { clienteId: c.id, tipo: 'mandado', descripcion: f.que, origen: f.origen, presupuesto: f.presu, propina: c.tip, pago: 'efectivo' });
    return hdr('Mandado', 'Compramos o recogemos lo que necesites', { back: 'c-go:inicio', lead: `<span class="ill-box" style="width:40px;height:40px">${ill('moto')}</span>` }) + `<div class="scroll">
      <label class="f">¿Qué necesitas?<textarea class="in" data-bind="cli.mand.que">${esc(f.que)}</textarea></label>
      <label class="f">¿En qué zona se compra o se recoge?<select class="in" data-change="c-mand-origen">${W.config.zonas.map((z) => `<option ${z === f.origen ? 'selected' : ''}>${z}</option>`).join('')}</select></label>
      <label class="f">Lugar exacto<input class="in" data-bind="cli.mand.lugar" value="${esc(f.lugar)}"></label>
      <label class="f">¿Cuánto crees que cueste?<input class="in" inputmode="numeric" data-bind="cli.mand.presu" data-rerender="1" value="${esc(f.presu)}"></label>
      <div class="banner small">El repartidor paga con su dinero (hasta $${W.config.limites.adelantoMandado}), te manda la foto del ticket y tú lo apruebas antes de que salga. Pagas el ticket más el mandado al recibir.</div>
      ${desglose(cot)}
      ${cot.metodos.efectivo.ok ? '' : `<div class="banner small"><b>${esc(cot.metodos.efectivo.motivo)}</b></div>`}
      ${cot.errores.length ? `<div class="banner small"><b>${esc(cot.errores[0])}</b></div>` : ''}
      <button class="btn block" data-act="c-pedir-mandado" ${cot.errores.length || !cot.metodos.efectivo.ok ? 'disabled' : ''}>Pedir mandado</button></div>`;
  }
  function vPedidos() {
    const mine = W.pedidos.filter((p) => p.clienteId === UI.cli.id).slice().reverse();
    return hdr('Mis pedidos', '') + `<div class="scroll">${mine.length ? mine.map((p) => `<button class="card" style="text-align:left;flex-direction:row;align-items:center;gap:12px;color:inherit" data-act="c-ver:${p.id}">${p.negocioId ? blogo(neg(p.negocioId), 48) : thumb('moto', 48)}<div style="flex:1;min-width:0"><h3>${esc(origenDe(p))}</h3><p class="small muted" style="margin:2px 0 0">#${p.id} · ${hora(p.t.creado)} · ${money(p.cot.T)}</p></div>${pill(p.estado)}</button>`).join('') : empty('bag', 'Aún no haces pedidos.<br>Tu primer envío es gratis.') + '<button class="btn" data-act="c-go:inicio">Explorar negocios</button>'}</div>`;
  }
  function vCuenta() {
    const cl = yo(), niv = M.nivelCliente(W, cl), saldo = M.saldo(W, 'cli:' + cl.id), pl = W.config.plus, code = M.codigoVecino(cl);
    return hdr('Cuenta', '') + `<div class="scroll">
      <div class="card row" style="flex-direction:row"><div class="avatar" style="background:var(--accent);color:var(--accent-ink)">${esc(cl.nombre[0] || '?')}</div><div><h3>${esc(cl.nombre)}</h3><p class="small muted" style="margin:2px 0 0">+52 ${esc(cl.tel)} · verificado por código</p></div></div>
      <div class="card"><div class="row between"><h3>${esc(niv.etiqueta)}</h3><span class="pill ${niv.nivel === 'confiable' ? 'p-entregado' : niv.nivel === 'nuevo' ? 'p-listo' : 'p-no_entregado'}">${cl.pedidosOk} pedidos</span></div><p class="small muted" style="margin:0">${esc(niv.motivo)}.</p></div>
      ${saldo > 0 ? `<div class="coupon">${ill('gift')}<span style="flex:1">Tienes ${money(saldo)} de saldo a favor. Se aplica solo en tu próximo pedido.</span></div>` : ''}
      ${saldo < 0 ? `<div class="card"><h3>Tienes un adeudo de ${money(-saldo)}</h3><p class="small muted" style="margin:0">Es de un pedido que no recibiste. Págalo por transferencia para volver a la normalidad.</p><button class="btn sm" data-act="c-adeudo">Maqueta: simular que lo pagué</button></div>` : ''}
      <div class="promo pr-3" style="flex:none;min-height:0"><div><b>${cl.plus.activo ? 'Tienes De Una Plus' : `De Una Plus · $${pl.precio} al mes`}</b><span>${cl.plus.activo ? `Usaste ${cl.plus.enviosUsados} de ${pl.enviosMes} envíos gratis este mes` : `Envío gratis en pedidos desde $${pl.envioGratisDesde}, hasta ${pl.enviosMes} al mes. Cancelas cuando quieras.`}</span></div><span class="big">${ill('moto')}</span></div>
      <button class="btn ${cl.plus.activo ? 'ghost' : ''} block" data-act="c-plus">${cl.plus.activo ? 'Cancelar Plus' : 'Suscribirme a Plus'}</button>
      <div class="promo pr-4" style="flex:none;min-height:0"><div><b>Invita a un vecino</b><span>Cuando reciba su primer pedido, ganan $${W.config.promos.vecino} cada uno. No vale para alguien de tu misma casa.</span><span class="code">${esc(code)}</span></div><span class="big">${ill('house')}</span></div>
      <button class="btn ghost block" data-act="c-share:${esc(code)}">Copiar invitación para WhatsApp</button>
      ${installCard()}
      <div class="card"><div class="row between"><div><div class="eyebrow">Dirección</div><div style="font-weight:700">${esc(cl.dir)}, ${esc(cl.fracc)}</div></div><button class="link" data-act="c-sheet:dir">Cambiar</button></div></div>
      <div class="card"><h3>¿Tienes un negocio o quieres repartir?</h3><div class="row"><button class="btn ghost sm" style="flex:1" data-act="neg-registro">Registrar negocio</button><button class="btn ghost sm" style="flex:1" data-act="rep-registro">Ser repartidor</button></div></div>
      <button class="btn ghost block" data-act="c-salir">Cerrar sesión</button></div>`;
  }
  function sheetCliente() {
    const c = UI.cli, cl = yo();
    if (!c.sheet) return '';
    const wrap = (h) => `<div class="sheet-bg" data-act="c-sheet:"><div class="sheet" data-stop="1"><span class="grab"></span>${h}</div></div>`;
    if (c.sheet === 'dir') return wrap(`<h2>¿A dónde te lo llevamos?</h2>
      <div class="opts">${W.config.zonas.map((f) => `<button class="opt" data-act="c-fracc:${f}" aria-pressed="${f === cl.fracc}"><span class="r"></span><span><b>${f}</b></span></button>`).join('')}</div>
      <label class="f">Calle y número<input class="in" id="c-dir2" value="${esc(cl.dir)}"></label><button class="btn block" data-act="c-savedir">Guardar dirección</button>`);
    if (c.sheet === 'cancelar') {
      const p = M.pedido(W, c.orderId), pol = M.politicaCancelacion(W, p, 'cliente');
      const motivos = ['Me equivoqué de dirección', 'Tarda mucho', 'Ya no lo quiero', 'Otro'];
      return wrap(`<h2>¿Cancelar el pedido #${p.id}?</h2><div class="banner small">${esc(pol.texto)}</div>
        <div class="chips">${motivos.map((m) => chip(m, 'c-motivo:' + m, c.motivo === m)).join('')}</div>
        <div class="row-btns"><button class="btn ghost" data-act="c-sheet:">No, seguir</button><button class="btn" style="flex:1" data-act="c-cancelar:${p.id}" ${c.motivo ? '' : 'disabled'}>Sí, cancelar${pol.costo ? ` (${money(pol.costo)} para el negocio)` : ''}</button></div>`);
    }
    return wrap(`<div class="row"><span class="ic" style="width:56px;height:56px">${APPICON}</span><div><h2>Instala De Una</h2><p class="small muted" style="margin:2px 0 0">Pesa menos de 1 MB. Se abre como app, sin la barra del navegador.</p></div></div>
      ${deferredPrompt ? '<button class="btn block" data-act="c-install">Instalar ahora</button>' : ''}
      <div class="stack"><div class="eyebrow">En iPhone (Safari)</div><ol class="howto"><li>Toca el botón Compartir, el cuadro con la flecha hacia arriba.</li><li>Elige “Agregar a inicio”.</li><li>Toca “Agregar”. Ya tienes el ícono de De Una.</li></ol></div>
      <div class="stack"><div class="eyebrow">En Android (Chrome)</div><ol class="howto"><li>Toca los tres puntos ⋮ arriba a la derecha.</li><li>Elige “Instalar app” o “Agregar a pantalla principal”.</li><li>Confirma con “Instalar”.</li></ol></div>
      <button class="btn ghost block" data-act="c-sheet:">Ahora no</button>`);
  }

  /* ================================================================ */
  /* NEGOCIO                                                           */
  /* ================================================================ */
  function vNegocio() {
    const s = UI.neg;
    if (s.screen === 'registro') return vRegistroNegocio();
    const n = neg(s.id), yoN = yoNeg();
    const mine = W.pedidos.filter((p) => p.negocioId === n.id);
    const nuevos = mine.filter((p) => p.estado === 'nuevo').length;
    const selector = `<select class="in" style="width:auto;padding:6px 8px;font-size:12px;max-width:128px" data-change="n-ver" aria-label="Ver panel de otro negocio">${W.negocios.map((x) => `<option value="${x.id}" ${x.id === n.id ? 'selected' : ''}>${esc(x.nombre)}</option>`).join('')}<option value="__nuevo">+ Registrar negocio</option></select>`;
    const navN = nav([{ id: 'pedidos', n: 'Pedidos', icon: 'inbox', act: 'n-go:pedidos', badge: nuevos || '' }, { id: 'menu', n: 'Menú', icon: 'menu', act: 'n-go:menu' }, { id: 'dinero', n: 'Dinero', icon: 'coin', act: 'n-go:dinero' }], s.screen);
    const head = hdr(esc(n.nombre), 'Panel del negocio', { right: selector, lead: blogo(n, 40) });
    if (s.screen === 'menu') return head + vMenuNegocio(n) + navN;
    if (s.screen === 'dinero') return head + vDineroNegocio(n) + navN;
    const ab = M.negocioAbierto(W, n);
    const groups = { nuevo: ['nuevo'], curso: ['preparando', 'listo', 'en_camino', 'en_puerta'], hist: ['entregado', 'cancelado', 'no_entregado'] };
    const shown = mine.filter((p) => groups[s.tab].includes(p.estado)).slice().reverse();
    return head + `<div class="scroll">
      ${n.pausa ? `<div class="banner" style="border:1px solid var(--line)"><b>${esc(ab.motivo)}.</b> ${n.pausa === 'sin_respuesta' ? 'No respondiste 2 pedidos seguidos, así que dejaste de aparecer para no quedar mal con los clientes.' : 'Paga tu mensualidad para volver a aparecer.'}${n.pausa === 'sin_respuesta' ? '<button class="btn sm" style="margin-top:8px" data-act="n-reactivar">Ya estoy atendiendo: reactivar</button>' : ''}</div>` : ''}
      <div class="card"><div class="row between"><div><h3><span class="dotst" style="background:${ab.ok ? 'var(--ok)' : 'var(--danger)'}"></span>${ab.ok ? 'Recibiendo pedidos' : esc(ab.motivo)}</h3><p class="small muted" style="margin:2px 0 0">Horario: ${hora(n.horario.abre)} a ${hora(n.horario.cierra)}</p></div><button class="switch" data-act="n-abierto" aria-pressed="${n.abierto}" aria-label="Abierto"><span class="t"></span></button></div>
        <div class="row between"><div><b class="small">Mucha demanda</b><p class="small muted" style="margin:0">Avisa a los clientes que hoy tardas más</p></div><button class="switch" data-act="n-saturado" aria-pressed="${n.saturado}" aria-label="Mucha demanda"><span class="t"></span></button></div></div>
      <div class="tabs"><button data-act="n-tab:nuevo" aria-pressed="${s.tab === 'nuevo'}">Nuevos (${nuevos})</button><button data-act="n-tab:curso" aria-pressed="${s.tab === 'curso'}">En curso</button><button data-act="n-tab:hist" aria-pressed="${s.tab === 'hist'}">Historial</button></div>
      ${shown.length ? shown.map((p) => ordenNegocio(p, n, yoN)).join('') : empty(n.il, s.tab === 'nuevo' ? 'Sin pedidos nuevos.<br>Haz uno desde la vista Cliente.' : 'Nada por aquí.')}</div>` + navN;
  }
  function ordenNegocio(p, n, yoN) {
    const cl = M.cliente(W, p.clienteId), r = p.asignacion.repaId && M.repartidor(W, p.asignacion.repaId);
    const f = UI.neg.form[p.id] || (UI.neg.form[p.id] = { prep: n.prep, agotados: [], decision: null, recetaOk: false, rechazo: null, cancelar: null });
    const T = W.config.tiempos;
    let cuerpo = '';
    if (p.estado === 'nuevo') {
      const queda = T.negocio - (W.reloj - p.t.enviado);
      const sust = { quitar: 'quitarlo y ajustar el total', llamar: 'que le llames', cancelar: 'cancelar todo' }[p.sustitucion];
      cuerpo = `<div class="timer ${queda <= 2 ? 'urge' : ''}">Responde antes de las ${hora(p.t.enviado + T.negocio)} · quedan ${Math.max(0, queda)} min</div>
        <div class="stack" style="gap:4px">${p.items.map((i) => `<button class="opt" data-act="nf:${p.id}:agotado:${i.id}" aria-pressed="${f.agotados.includes(i.id)}"><span class="r"></span><span style="flex:1"><b>${i.q} × ${esc(i.n)}</b><small>${f.agotados.includes(i.id) ? 'Marcado: no hay' : 'Toca si no lo tienes'}</small></span><span class="price">${money(i.p * i.q)}</span></button>`).join('')}</div>
        <p class="small muted" style="margin:0">Si falta algo, el cliente prefiere ${sust}.</p>
        ${f.agotados.length && p.sustitucion === 'llamar' ? `<div class="banner small">Llama a ${esc(cl.nombre)} al ${mask(cl.tel)} (la llamada pasa por De Una). ¿Qué decidió?<div class="chips" style="margin-top:6px">${chip('Quitarlo', `nf:${p.id}:decision:quitar`, f.decision === 'quitar')}${chip('Cancelar pedido', `nf:${p.id}:decision:cancelar`, f.decision === 'cancelar')}</div></div>` : ''}
        ${p.requiereReceta ? `<button class="opt" data-act="nf:${p.id}:receta:1" aria-pressed="${f.recetaOk}"><span class="r"></span><span><b>Revisé la receta (receta.jpg)</b><small>Médico, fecha y medicamento coinciden</small></span></button>` : ''}
        ${p.tieneAlcohol ? '<p class="small muted" style="margin:0">Trae alcohol: el repartidor revisará la INE del cliente.</p>' : ''}
        <div class="eyebrow">Tiempo de preparación</div><div class="seg">${[10, 20, 30, 45].map((m) => chip(m + ' min', `nf:${p.id}:prep:${m}`, f.prep === m)).join('')}</div>
        ${f.rechazo === 'abrir' ? `<div class="chips">${['Ya cerramos', 'No tenemos los productos', 'Estamos saturados', 'Otro'].map((m) => chip(m, `n-rechazar:${p.id}:${m}`)).join('')}</div>` : ''}
        <div class="row-btns"><button class="btn ghost sm" data-act="nf:${p.id}:rechazo:abrir">Rechazar</button><button class="btn sm" style="flex:1" data-act="n-aceptar:${p.id}">Aceptar · ${f.prep} min</button></div>`;
    } else if (['preparando', 'listo'].includes(p.estado) && p.entrega === 'deuna') {
      const repTxt = !r ? (p.asignacion.oferta ? `Ofreciendo el viaje a ${M.repartidor(W, p.asignacion.oferta.repaId).nombre}…` : 'Buscando repartidor…') : p.repaEnTienda ? `${r.nombre} ya está en tu tienda` : `${r.nombre} va hacia tu tienda`;
      cuerpo = `<div class="kv"><span>Repartidor</span><span>${esc(repTxt)}</span></div>`;
      if (p.estado === 'preparando') cuerpo += `<button class="btn sm" data-act="n-tx:${p.id}:listo">Ya está listo</button>`;
      else if (r && p.repaEnTienda) cuerpo += `<div class="banner ${p.pago === 'efectivo' ? 'accent' : ''}"><b>${p.pago === 'efectivo' ? `Cobra ${money(p.cot.S)} en efectivo a ${esc(r.nombre)}` : 'Ya está pagado'}</b><br><span class="small">${p.pago === 'efectivo' ? 'Él lo cobra después al cliente. Entrégale la bolsa cerrada con el número de pedido.' : 'Lo recibes en tu depósito de esta noche. Entrégale la bolsa cerrada.'}</span></div><button class="btn sm" data-act="n-tx:${p.id}:entregar_a_repa">Entregar a ${esc(r.nombre)}${p.pago === 'efectivo' ? ` y cobrar ${money(p.cot.S)}` : ''}</button>`;
      else cuerpo += '<p class="small muted" style="margin:0">Cuando llegue, aquí te decimos si te paga en efectivo o si ya está pagado.</p>';
      cuerpo += cancelarNegocio(p, f);
    } else if (p.entrega === 'propia' && ['preparando', 'en_camino', 'en_puerta'].includes(p.estado)) {
      if (p.estado === 'preparando') cuerpo = `<button class="btn sm" data-act="n-tx:${p.id}:salio">Salió a entregar</button>${cancelarNegocio(p, f)}`;
      if (p.estado === 'en_camino') cuerpo = `<p class="small muted" style="margin:0">Va hacia ${esc(p.dir)}, ${esc(p.destino)}</p><button class="btn sm" data-act="n-tx:${p.id}:llegue_domicilio">Llegamos al domicilio</button>`;
      if (p.estado === 'en_puerta') cuerpo = entregaConCodigo(p, 'n');
    } else if (['en_camino', 'en_puerta'].includes(p.estado)) {
      cuerpo = `<p class="small muted" style="margin:0">${esc(r ? r.nombre : 'El repartidor')} lo lleva al cliente.</p>`;
    } else if (p.estado === 'cancelado') cuerpo = `<p class="small muted" style="margin:0">Cancelado: ${esc(p.cancelacion.motivo)}</p>`;
    else if (p.estado === 'no_entregado') cuerpo = '<p class="small muted" style="margin:0">El cliente no salió a recibirlo. De Una lo está revisando.</p>';
    return `<div class="card"><div class="row between"><h3>#${p.id} · ${esc(cl.nombre)}</h3>${pill(p.estado)}</div>
      <div class="small muted">${hora(p.t.creado)} · ${esc(p.dir)}, ${esc(p.destino)} · ${p.pago === 'efectivo' ? 'efectivo' : 'pagado en línea'}</div>
      ${p.estado !== 'nuevo' ? `<div class="sum">${p.items.map((i) => `<div><span>${i.q} × ${esc(i.n)}</span><span>${money(i.p * i.q)}</span></div>`).join('')}${p.removidos.map((i) => `<div style="color:var(--muted);text-decoration:line-through"><span>${i.q} × ${esc(i.n)}</span><span>${money(i.p * i.q)}</span></div>`).join('')}<div class="tot"><span>Te pagan</span><span>${money(p.cot.S - p.cot.Dn)}</span></div></div>` : ''}
      ${p.nota ? `<div class="banner small">Nota: ${esc(p.nota)}</div>` : ''}${cuerpo}</div>`;
  }
  function cancelarNegocio(p, f) {
    if (f.cancelar !== 'abrir') return `<button class="link" style="align-self:flex-start" data-act="nf:${p.id}:cancelar:abrir">No puedo surtirlo</button>`;
    return `<div class="banner small">Si cancelas ahora, al cliente se le devuelve todo${p.asignacion.repaId ? ` y le pagas ${money(W.config.limites.compensacionRepa)} al repartidor por el viaje` : ''}. ¿Por qué?<div class="chips" style="margin-top:6px">${['Se nos acabó', 'Se descompuso el equipo', 'Otro'].map((m) => chip(m, `n-cancelar:${p.id}:${m}`)).join('')}</div></div>`;
  }
  function entregaConCodigo(p, pref) {
    const espera = W.reloj - p.t.llegada, falta = W.config.tiempos.espera - espera;
    const cobrar = p.pago === 'efectivo' ? `Cobra <b>${money(p.cot.T)}</b> en efectivo${p.pagaCon ? `: paga con ${money(p.pagaCon)}, lleva ${money(p.pagaCon - p.cot.T)} de cambio` : ' (paga exacto)'}.` : 'Ya está pagado: no cobres nada.';
    const aus = M.validar(W, p, 'cliente_ausente', pref === 'n' ? yoNeg() : yoRep());
    return `<div class="banner accent small">${cobrar}</div>
      <label class="f">Código del cliente<input class="in pin-in" inputmode="numeric" maxlength="4" placeholder="••••" data-bind="rep.pin" value="${esc(UI.rep.pin)}"></label>
      ${p.tieneAlcohol ? `<button class="opt" data-act="r-ine" aria-pressed="${UI.rep.ine}"><span class="r"></span><span><b>Revisé su INE: es mayor de 18</b><small>El pedido trae alcohol</small></span></button>` : ''}
      ${nota(`Pista de la maqueta: el código de este pedido es <b>${p.pin}</b> (lo ve el cliente en su app).`)}
      <button class="btn ok block" data-act="${pref}-entregar:${p.id}">Entregar</button>
      <div class="row-btns"><button class="btn ghost sm" data-act="${pref}-tx:${p.id}:llamar_cliente">${ICONS.phone.replace('<svg', '<svg width="16" height="16" style="vertical-align:-3px;margin-right:4px"')}Llamar (${p.llamadas})</button><button class="btn ghost sm" style="flex:1" data-act="${pref}-tx:${p.id}:cliente_ausente" ${aus ? 'disabled' : ''}>El cliente no sale</button></div>
      <p class="small muted" style="margin:0">${aus ? esc(aus) : 'Ya puedes marcar que el cliente no salió.'}${falta > 0 ? ` Llevas ${espera} min esperando.` : ''}</p>`;
  }
  function vMenuNegocio(n) {
    return `<div class="scroll">
      <div class="card" style="padding:4px 14px">${n.menu.map((m) => {
        const v = M.productoVendible(W, n, m);
        return `<div class="item">${thumb(m.il, 48)}<div class="grow"><h3>${esc(m.n)}</h3><div class="row" style="gap:6px;flex-wrap:wrap"><span class="price">${money(m.p)}</span>${m.alcohol ? '<span class="chip soft">+18</span>' : ''}${m.receta === 'requerida' ? '<span class="chip soft">Con receta</span>' : ''}${m.kg ? `<span class="chip soft">Máx. ${money(M.precioMaxGas(W, m))}</span>` : ''}</div>${!v.ok && m.on ? `<p>${esc(v.motivo)}</p>` : ''}</div><button class="switch" data-act="n-toggle:${m.id}" aria-pressed="${m.on}" aria-label="Disponible"><span class="t"></span></button></div>`;
      }).join('')}</div>
      <p class="small muted" style="margin:-8px 0 0">Apaga un producto cuando se te acabe y deja de salir en la app. En De Una cobras lo mismo que en tu local.</p>
      <div class="card"><h3>Agregar producto</h3><label class="f">Nombre<input class="in" id="n-pn" placeholder="Ej. Torta de milanesa"></label><label class="f">Precio<input class="in" id="n-pp" inputmode="numeric" placeholder="75"></label><button class="btn" data-act="n-addprod">Agregar al menú</button></div></div>`;
  }
  function vDineroNegocio(n) {
    const s = M.saldo(W, 'neg:' + n.id), e = M.estadoMensualidad(W, n), movs = M.movimientosDe(W, 'neg:' + n.id).slice().reverse().slice(0, 8);
    const hoy = W.pedidos.filter((p) => p.negocioId === n.id && p.estado === 'entregado');
    const ventas = hoy.reduce((a, p) => a + p.cot.S, 0), efectivo = hoy.filter((p) => p.pago === 'efectivo').reduce((a, p) => a + p.cot.S, 0);
    const an = W.config.anuncios, mt = n.met, tot = mt.aceptados + mt.rechazados + mt.expirados;
    return `<div class="scroll">
      <div class="hero"><span>${s >= 0 ? 'De Una te deposita esta noche' : 'Saldo por pagar a De Una'}</span><b>${money(Math.abs(s))}</b><span>${s >= 0 ? 'Ventas pagadas en línea, menos tus cargos del mes' : 'Mensualidad o anuncios sin cubrir'}</span></div>
      <div class="kpis"><div class="kpi"><span>Vendido hoy</span><b>${money(ventas)}</b></div><div class="kpi"><span>Cobrado en tienda</span><b>${money(efectivo)}</b></div><div class="kpi"><span>Comisión de De Una</span><b>0 %</b></div><div class="kpi"><span>Aceptación</span><b>${tot ? Math.round(mt.aceptados / tot * 100) : 100} %</b></div></div>
      <div class="card"><div class="row between"><h3>Mensualidad · ${money(W.config.negocios.mensualidad)}</h3><span class="pill ${e.estado === 'al_corriente' ? 'p-entregado' : ['vencida', 'pausado'].includes(e.estado) ? 'p-no_entregado' : 'p-pago_pendiente'}">${e.estado === 'al_corriente' ? 'Al corriente' : e.estado === 'se_descuenta' ? 'Se descuenta' : e.estado === 'por_vencer' ? 'Por vencer' : 'Vencida'}</span></div><p class="small muted" style="margin:0">${esc(e.texto)}. Si se te pasa más de ${W.config.negocios.diasGracia} días, tu negocio se pausa hasta que pagues.</p>
        ${['vencida', 'pausado', 'por_vencer'].includes(e.estado) ? `<button class="btn sm" data-act="n-pagar">Maqueta: simular transferencia de ${money(-s)}</button>` : ''}</div>
      <div class="card"><h3>Anúnciate en De Una</h3><p class="small muted" style="margin:0">Se marca como anuncio para que el cliente lo sepa.</p>
        ${[['destacado', 'Destacado en la lista', an.destacado], ['carrusel', 'En el carrusel de la portada', an.carrusel]].map(([k, t, pr]) => `<div class="row between"><div><b class="small">${t}</b><p class="small muted" style="margin:0">${money(pr)} por 7 días${M.anuncioActivo(W, n, k) ? ' · activo' : ''}</p></div><button class="btn sm ${M.anuncioActivo(W, n, k) ? 'ghost' : ''}" data-act="n-anuncio:${k}" ${M.anuncioActivo(W, n, k) ? 'disabled' : ''}>${M.anuncioActivo(W, n, k) ? 'Activo' : 'Comprar'}</button></div>`).join('')}</div>
      <div class="banner accent small">Con una app que cobra 27 % de comisión, por los ${money(ventas)} de hoy pagarías unos <b>${money(ventas * 0.27)}</b>. Con De Una pagas ${money(W.config.negocios.mensualidad)} al mes, vendas lo que vendas.</div>
      <div class="card"><h3>Movimientos</h3>${movs.length ? movs.map((m) => kv(`${esc(m.concepto)}${m.pedidoId ? ` · #${m.pedidoId}` : ''}`, `<b style="color:${m.monto < 0 ? 'inherit' : 'var(--ok)'}">${money(m.monto)}</b>`)).join('') : '<p class="small muted" style="margin:0">Sin movimientos.</p>'}</div>
      <div class="card"><h3>Tu servicio</h3>${kv('Pedidos entregados', mt.entregados)}${kv('Rechazados', mt.rechazados)}${kv('Sin responder', mt.expirados)}${kv('Calificación', '★ ' + n.rating.toFixed(1))}</div></div>`;
  }
  function vRegistroNegocio() {
    const f = UI.neg.reg;
    if (UI.neg.solicitud) {
      const s = W.solicitudes.find((x) => x.id === UI.neg.solicitud);
      const aprobado = !s;
      return hdr('Tu solicitud', aprobado ? 'Aprobada' : 'En revisión', { back: 'n-go:pedidos' }) + `<div class="scroll">
        ${aprobado ? `<div class="hero"><span>¡Bienvenido!</span><b>${esc(f.nombre)}</b><span>Ya apareces en la app. Elígelo arriba en el selector para atender pedidos.</span></div>` : `<div class="card"><h3>${esc(s.nombre)}</h3>${M.docsRequeridos(s).map((k) => `<div class="doc"><span>${M.DOCS[k]}</span><span class="${s.docs[k] ? 'ok' : 'no'}">${s.docs[k] ? 'Recibido' : 'Falta'}</span></div>`).join('')}</div>${nota('Maqueta: apruébala en <b>Admin → Personas</b>. Si falta un documento, el sistema no deja aprobarla.')}`}</div>`;
    }
    const giros = [['restaurante', 'Restaurante'], ['tiendita', 'Tiendita'], ['farmacia', 'Farmacia'], ['gas', 'Gas LP'], ['agua', 'Agua purificada']];
    const sol = { tipo: 'negocio', giro: f.giro, vendeAlcohol: f.alcohol };
    return hdr('Vende en De Una', 'Tus vecinos ya están pidiendo', { back: 'n-go:pedidos', lead: `<span class="ic" style="width:40px;height:40px">${APPICON}</span>` }) + `<div class="scroll">
      <div class="hero"><span>Plan único para negocios</span><b>${money(W.config.negocios.mensualidad)} al mes</b><span>0 % de comisión por pedido. Cobras lo mismo que en tu local. Cancelas cuando quieras.</span></div>
      <label class="f">Nombre del negocio<input class="in" data-bind="neg.reg.nombre" value="${esc(f.nombre)}"></label>
      <div class="stack"><div class="eyebrow">Giro</div><div class="chips">${giros.map(([k, t]) => chip(t, 'nr:giro:' + k, f.giro === k)).join('')}</div></div>
      <label class="f">Fraccionamiento<select class="in" data-change="nr-zona">${W.config.zonas.map((z) => `<option ${z === f.zona ? 'selected' : ''}>${z}</option>`).join('')}</select></label>
      <div class="chips">${chip('Vendo alcohol', 'nr:alcohol', f.alcohol)}${chip('Tengo mi propio repartidor', 'nr:propia', f.propia)}</div>
      <div class="stack"><div class="eyebrow">Documentos</div>${M.docsRequeridos(sol).map((k) => `<button class="upload" data-act="nr:doc:${k}" style="width:100%;background:none;color:inherit"><span>${M.DOCS[k]}</span><span class="${f.docs[k] ? 'okc' : ''}" style="font-weight:800">${f.docs[k] ? 'Subido' : 'Subir'}</span></button>`).join('')}</div>
      <p class="small muted" style="margin:0">Pedimos documentos según tu giro: permiso de la CNE para gas, aviso de Cofepris para farmacias y purificadoras, y licencia si vendes alcohol.</p>
      <button class="btn block" data-act="nr-enviar">Enviar solicitud</button></div>`;
  }

  /* ================================================================ */
  /* REPARTIDOR                                                        */
  /* ================================================================ */
  function vRepa() {
    const s = UI.rep;
    if (s.screen === 'registro') return vRegistroRepa();
    const r = M.repartidor(W, s.id), saldo = M.saldo(W, 'repa:' + r.id), L = W.config.limites;
    const navR = nav([{ id: 'viajes', n: 'Viajes', icon: 'bike', act: 'r-go:viajes' }, { id: 'dinero', n: 'Dinero', icon: 'coin', act: 'r-go:dinero' }, { id: 'perfil', n: 'Perfil', icon: 'user', act: 'r-go:perfil' }], s.screen);
    const head = hdr(`Hola, ${esc(r.nombre.split(' ')[0])}`, `<span class="dotst" style="background:${r.suspendido ? 'var(--danger)' : r.enLinea ? 'var(--ok)' : 'var(--muted)'}"></span>${r.suspendido ? 'Suspendido' : r.enLinea ? 'En línea' : 'Desconectado'}`, { right: `<button class="switch" data-act="r-on" aria-pressed="${r.enLinea}" aria-label="En línea"><span class="t"></span></button>`, lead: `<span class="ill-box" style="width:44px;height:44px">${ill('moto')}</span>` });
    if (s.screen === 'dinero') return head + vDineroRepa(r) + navR;
    if (s.screen === 'perfil') return head + vPerfilRepa(r) + navR;
    const oferta = M.ofertaPara(W, r.id), activo = M.activoDe(W, r.id);
    const pct = Math.min(100, Math.max(0, -saldo) / L.efectivoRepa * 100);
    return head + `<div class="scroll">
      ${r.suspendido ? `<div class="banner" style="border:1px solid var(--line)"><b>No recibes viajes:</b> traes ${money(-saldo)} de efectivo sin entregar. Deposítalo para volver.</div>` : ''}
      <div class="card"><div class="row between"><b class="small">Efectivo que traes de De Una</b><b>${money(Math.max(0, -saldo))}</b></div><div class="limitbar"><i class="${pct >= 100 ? 'bad' : pct >= 80 ? 'warn' : ''}" style="width:${pct}%"></i></div><p class="small muted" style="margin:0">${pct >= 100 ? 'Llegaste al límite: no recibes pedidos en efectivo.' : `Límite ${money(L.efectivoRepa)}. Arriba de eso solo recibes pedidos pagados en línea.`}</p></div>
      ${oferta ? cardOferta(oferta, r) : ''}
      ${activo ? cardViaje(activo, r) : ''}
      ${!oferta && !activo ? (r.enLinea ? empty('moto', 'Sin viajes por ahora.<br>Cuando un negocio acepte un pedido cerca de ti, te llega aquí.') : empty('moto', 'Estás desconectado. Actívate arriba para recibir viajes.')) : ''}
      </div>` + navR;
  }
  function cardOferta(p, r) {
    const n = p.negocioId && neg(p.negocioId), g = ganancia(p);
    const dinero = p.tipo === 'mandado' ? `Compras hasta ${money(p.cot.S)} con tu dinero y cobras el ticket + ${money(p.cot.E + p.cot.V + p.cot.P - p.cot.Dm - p.cot.Dc)}` : p.pago === 'efectivo' ? `Pagas ${money(p.cot.S)} en la tienda y cobras ${money(p.cot.T)} al cliente` : 'Ya está pagado: no pagas ni cobras nada';
    return `<div class="card offer"><div class="row between"><div class="row" style="min-width:0">${n ? blogo(n, 44) : thumb('bag', 44)}<div style="min-width:0"><h3>${esc(origenDe(p))}</h3><p class="small muted" style="margin:2px 0 0">${esc(p.origen)} → ${esc(p.destino)} · ${M.viajeMin(W, p.origen, p.destino)} min</p></div></div><span class="price" style="color:var(--ok);font-size:20px">+${money(g)}</span></div>
      ${kv('Envío (' + W.config.tarifas.repaPct + ' %)', money(p.cot.E * k85()))}${p.cot.L ? kv('Extra por lluvia', money(p.cot.L)) : ''}${p.cot.PP ? kv('Pedido pequeño', money(p.cot.PP)) : ''}${p.cot.P ? kv('Propina', money(p.cot.P)) : ''}${p.asignacion.bono ? kv('Bono de De Una', money(p.asignacion.bono)) : ''}
      <div class="banner small">${dinero}.${p.tieneAlcohol ? ' Trae alcohol: revisa la INE.' : ''}</div>
      <div class="timer">Responde antes de las ${hora(p.asignacion.oferta.hasta)}</div>
      <div class="row-btns"><button class="btn ghost" data-act="r-tx:${p.id}:rechazar_oferta">Rechazar</button><button class="btn" style="flex:1" data-act="r-tx:${p.id}:aceptar_oferta">Aceptar viaje</button></div></div>`;
  }
  function cardViaje(p, r) {
    const n = p.negocioId && neg(p.negocioId), cl = M.cliente(W, p.clienteId);
    let paso = '';
    if (['preparando', 'listo'].includes(p.estado) && !p.repaEnTienda) paso = `<div class="banner small">Ve a <b>${esc(n.nombre)}</b>, ${esc(n.fracc)}. ${p.estado === 'listo' ? 'El pedido ya está listo.' : `Estará listo como a las ${hora(p.t.aceptado + p.prep)}.`}</div><button class="btn block" data-act="r-tx:${p.id}:llegue_tienda">Llegué a la tienda</button><button class="link" data-act="r-tx:${p.id}:soltar">No puedo ir: soltar el viaje</button>`;
    else if (['preparando', 'listo'].includes(p.estado)) paso = `<div class="banner ${p.pago === 'efectivo' ? 'accent' : ''}">Pide el pedido <b>#${p.id}</b> a nombre de ${esc(cl.nombre)}.<br>${p.pago === 'efectivo' ? `Paga <b>${money(p.cot.S)}</b> en la tienda.` : 'Ya está pagado: no pagues nada.'}</div><p class="small muted" style="margin:0">${p.estado === 'listo' ? 'La tienda confirma la entrega desde su app.' : 'La tienda lo está preparando.'} Revisa que la bolsa venga cerrada.</p>`;
    else if (p.estado === 'comprando') paso = `<div class="banner small">Compra: <b>${esc(p.items[0].n)}</b><br>En: ${esc(origenDe(p))}<br>Presupuesto del cliente: ${money(p.cot.S)} · máximo que adelantas ${money(W.config.limites.adelantoMandado)}</div>
      <label class="f">Total del ticket<input class="in" inputmode="numeric" data-bind="rep.ticket" value="${esc(UI.rep.ticket)}" placeholder="235"></label>
      <button class="opt" data-act="r-foto" aria-pressed="${UI.rep.foto}"><span class="r"></span><span style="width:22px;height:22px;flex:none;color:var(--muted)">${ICONS.camera}</span><span><b>${UI.rep.foto ? 'Foto del ticket lista' : 'Tomar foto del ticket'}</b><small>El cliente la ve antes de aprobar</small></span></button>
      <button class="btn block" data-act="r-ticket:${p.id}">Enviar ticket al cliente</button>`;
    else if (p.estado === 'por_aprobar') paso = `<div class="banner small">Esperando que ${esc(cl.nombre)} apruebe el ticket de ${money(p.ticket.monto)}.${p.ticket.disputa ? ' No estuvo de acuerdo: De Una ya lo está revisando.' : ''}</div>`;
    else if (p.estado === 'en_camino') paso = `<div class="banner small">Lleva el pedido a <b>${esc(p.dir)}</b>, ${esc(p.destino)}.</div><button class="btn block" data-act="r-tx:${p.id}:llegue_domicilio">Llegué al domicilio</button>`;
    else if (p.estado === 'en_puerta') paso = entregaConCodigo(p, 'r');
    return `<div class="card" style="border-color:var(--accent)"><div class="row between"><h2>Viaje #${p.id}</h2>${pill(p.estado)}</div>
      <div class="small muted">${esc(origenDe(p))} → ${esc(cl.nombre.split(' ')[0])}, ${esc(p.destino)} · ganas ${money(ganancia(p))}</div>${paso}</div>`;
  }
  function vDineroRepa(r) {
    const s = M.saldo(W, 'repa:' + r.id), movs = M.movimientosDe(W, 'repa:' + r.id).slice().reverse().slice(0, 10);
    const hoy = W.movimientos.filter((m) => m.cuenta === 'repa:' + r.id && m.pedidoId && m.monto > 0 && !m.concepto.startsWith('Te reponemos')).reduce((a, m) => a + m.monto, 0);
    return `<div class="scroll">
      <div class="hero"><span>Ganado hoy (envíos, propinas y bonos)</span><b>${money(hoy)}</b><span>${r.entregasHoy} entregas · ★ ${r.rating.toFixed(1)}</span></div>
      <div class="card"><h3>${s >= 0 ? `De Una te paga ${money(s)} el lunes` : `Debes entregar ${money(-s)} de efectivo`}</h3>
        <p class="small muted" style="margin:0">${s >= 0 ? 'Te depositamos cada semana por transferencia.' : 'Es el servicio y la parte del envío de los pedidos que cobraste en efectivo. Deposítalo en OXXO o por transferencia a la CLABE de De Una con tu referencia.'}</p>
        ${s < 0 ? `${kv('Referencia', `<b class="mono">R-${r.id.toUpperCase()}</b>`)}<button class="btn sm" data-act="r-deposito">Maqueta: simular depósito de ${money(-s)}</button>` : ''}</div>
      <div class="card"><h3>Cómo se calcula</h3><p class="small muted" style="margin:0">En cada viaje ganas el ${W.config.tarifas.repaPct} % del envío, el extra por lluvia, el cargo por pedido pequeño, el 100 % de la propina y los bonos. Si el cliente paga en efectivo, lo que cobras de más es de De Una y se descuenta de tus ganancias.</p></div>
      <div class="card"><h3>Movimientos</h3>${movs.map((m) => kv(`${esc(m.concepto)}${m.pedidoId ? ` · #${m.pedidoId}` : ''}`, `<b style="color:${m.monto < 0 ? 'inherit' : 'var(--ok)'}">${money(m.monto)}</b>`)).join('') || '<p class="small muted" style="margin:0">Sin movimientos.</p>'}</div></div>`;
  }
  function vPerfilRepa(r) {
    return `<div class="scroll">
      <div class="card row" style="flex-direction:row"><div class="avatar">${esc(r.nombre[0])}</div><div><h3>${esc(r.nombre)}</h3><p class="small muted" style="margin:2px 0 0">${r.vehiculo === 'bici' ? 'Bicicleta' : 'Moto'} · zona ${esc(r.zona)}</p></div></div>
      <div class="kpis"><div class="kpi"><span>Calificación</span><b>★ ${r.rating.toFixed(1)}</b></div><div class="kpi"><span>Aceptación</span><b>${Math.round(r.aceptacion * 100)} %</b></div></div>
      <div class="card"><h3>Reglas que te protegen</h3>
        ${kv('Cliente que no sale', `Esperas ${W.config.tiempos.espera} min, llamas 2 veces y se te repone todo`)}
        ${kv('Viaje cancelado', `Te pagamos ${money(W.config.limites.compensacionRepa)} si ya ibas en camino`)}
        ${kv('Propina', '100 % tuya')}
        ${kv('Código de entrega', 'Sin el código no se cierra el pedido: nadie puede decir que no llegó')}
        ${kv('Tu número', 'No se comparte: las llamadas pasan por De Una')}</div>
      <div class="card"><h3>Reglas que cuidan a todos</h3>
        ${kv('Efectivo', `Si traes más de ${money(W.config.limites.efectivoRepa)}, solo recibes pedidos pagados en línea; con ${money(W.config.limites.suspenderRepa)} se pausa tu cuenta`)}
        ${kv('Ofertas', `Tienes ${W.config.tiempos.oferta} min para aceptar; si no, pasa a otro`)}
        ${kv('Mandados', `Adelantas hasta ${money(W.config.limites.adelantoMandado)} y siempre con foto del ticket`)}</div>
      <button class="btn ghost block" data-act="rep-registro">Ver el registro de un repartidor nuevo</button></div>`;
  }
  function vRegistroRepa() {
    const f = UI.rep.reg;
    if (UI.rep.solicitud) {
      const s = W.solicitudes.find((x) => x.id === UI.rep.solicitud);
      return hdr('Tu solicitud', s ? 'En revisión' : 'Aprobada', { back: 'r-go:viajes' }) + `<div class="scroll">${s ? `<div class="card"><h3>${esc(s.nombre)}</h3>${M.docsRequeridos(s).map((k) => `<div class="doc"><span>${M.DOCS[k]}</span><span class="${s.docs[k] ? 'ok' : 'no'}">${s.docs[k] ? 'Recibido' : 'Falta'}</span></div>`).join('')}</div>${nota('Maqueta: apruébala en <b>Admin → Personas</b>.')}` : `<div class="hero"><span>¡Bienvenido!</span><b>${esc(f.nombre)}</b><span>Ya puedes conectarte y recibir viajes.</span></div>`}<button class="btn ghost block" data-act="r-go:viajes">Volver a la vista de Luis</button></div>`;
    }
    const sol = { tipo: 'repartidor', vehiculo: f.vehiculo };
    return hdr('Reparte con De Una', 'Gana en tu propio fraccionamiento', { back: 'r-go:perfil' }) + `<div class="scroll">
      <div class="hero"><span>Te quedas con</span><b>${W.config.tarifas.repaPct} % del envío</b><span>Más el 100 % de las propinas. Pago semanal por transferencia.</span></div>
      <label class="f">Nombre completo<input class="in" data-bind="rep.reg.nombre" value="${esc(f.nombre)}"></label>
      <div class="stack"><div class="eyebrow">¿En qué repartes?</div><div class="chips">${[['moto', 'Moto'], ['bici', 'Bicicleta'], ['auto', 'Auto']].map(([k, t]) => chip(t, 'rr:vehiculo:' + k, f.vehiculo === k)).join('')}</div></div>
      <label class="f">Zona donde vives<select class="in" data-change="rr-zona">${W.config.zonas.map((z) => `<option ${z === f.zona ? 'selected' : ''}>${z}</option>`).join('')}</select></label>
      <div class="stack"><div class="eyebrow">Documentos</div>${M.docsRequeridos(sol).map((k) => `<button class="upload" data-act="rr:doc:${k}" style="width:100%;background:none;color:inherit"><span>${M.DOCS[k]}</span><span style="font-weight:800">${f.docs[k] ? 'Subido' : 'Subir'}</span></button>`).join('')}</div>
      <p class="small muted" style="margin:0">La selfie se compara con tu INE para que nadie use tu cuenta. Antes de aprobarte te llamamos.</p>
      <button class="btn block" data-act="rr-enviar">Enviar solicitud</button></div>`;
  }

  /* ================================================================ */
  /* ADMIN (dueño)                                                     */
  /* ================================================================ */
  function vAdmin() {
    const a = UI.adm, al = M.alertas(W);
    const nInc = W.incidencias.filter((i) => i.estado === 'abierta').length;
    const navA = nav([{ id: 'vivo', n: 'En vivo', icon: 'pulse', act: 'a-go:vivo', badge: al.filter((x) => x.nivel === 'alta').length || '' }, { id: 'pedidos', n: 'Pedidos', icon: 'list', act: 'a-go:pedidos', badge: nInc || '' }, { id: 'dinero', n: 'Dinero', icon: 'coin', act: 'a-go:dinero' }, { id: 'personas', n: 'Personas', icon: 'people', act: 'a-go:personas', badge: W.solicitudes.length || '' }, { id: 'ajustes', n: 'Ajustes', icon: 'gear', act: 'a-go:ajustes' }], a.screen);
    const head = hdr('Panel de control', `Entraste como <b>${a.permiso === 'dueño' ? 'dueño' : 'operador'}</b> · ${hora(W.reloj)}`, { right: brand('') });
    const V = { vivo: aVivo, pedidos: aPedidos, dinero: aDinero, personas: aPersonas, ajustes: aAjustes };
    return head + `<div class="scroll">${V[a.screen](al)}</div>` + navA;
  }
  function alertaHTML(x) {
    const b = [];
    for (const ac of x.acciones) {
      if (ac === 'llamar_negocio') b.push(`<button class="btn ghost sm" data-act="toast:Llamando a ${esc(neg(M.pedido(W, x.pedidoId).negocioId).nombre)} (simulado)">Llamar</button>`);
      if (ac === 'cancelar') b.push(`<button class="btn ghost sm" data-act="a-cancelar:${x.pedidoId}:${x.titulo.includes('Código') ? 'Posible fraude' : 'El negocio no contesta'}">Cancelar pedido</button>`);
      if (ac === 'subir_bono') b.push(`<button class="btn sm" data-act="a-tx:${x.pedidoId}:subir_bono:10">Subir bono $10</button>`);
      if (ac === 'asignar' || ac === 'ver' || ac === 'resolver') b.push(`<button class="btn ghost sm" data-act="a-ver:${x.pedidoId}${ac === 'resolver' ? ':reclamos' : ''}">${ac === 'resolver' ? 'Resolver' : ac === 'asignar' ? 'Asignar a mano' : 'Ver pedido'}</button>`);
      if (ac === 'confirmar_pago') b.push(`<button class="btn sm" data-act="a-tx:${x.pedidoId}:confirmar_pago">Ya llegó al banco</button>`);
      if (ac === 'autorizar_sin_pin') b.push(`<button class="btn ghost sm" data-act="a-tx:${x.pedidoId}:autorizar_sin_pin">Autorizar sin código</button>`);
      if (ac === 'registrar_deposito') b.push(`<button class="btn ghost sm" data-act="a-deposito:${x.repaId}" ${esDueno() ? '' : 'disabled'}>Registrar depósito</button>`);
      if (ac === 'registrar_pago') b.push(`<button class="btn ghost sm" data-act="a-pagoneg:${x.negocioId}" ${esDueno() ? '' : 'disabled'}>Registrar pago</button>`);
      if (ac === 'reactivar') b.push(`<button class="btn ghost sm" data-act="a-reactivar:${x.negocioId}">Reactivar</button>`);
      if (ac === 'ver_cliente') b.push(`<button class="btn ghost sm" data-act="a-personas:clientes">Ver clientes</button>`);
    }
    return `<div class="alert ${x.nivel}"><div style="flex:1;min-width:0"><h3>${esc(x.titulo)}</h3><p>${esc(x.detalle)}</p>${b.length ? `<div class="row-btns" style="margin-top:8px">${b.join('')}</div>` : ''}</div></div>`;
  }
  const filaPedido = (p) => `<button class="card prow" data-act="a-ver:${p.id}">${p.negocioId ? blogo(neg(p.negocioId), 36) : thumb('moto', 36)}<div style="flex:1;min-width:0"><div class="row between"><h3>#${p.id} · ${esc(origenDe(p))}</h3>${pill(p.estado)}</div><div class="small muted">${esc(M.cliente(W, p.clienteId).nombre)} · ${esc(p.destino)} · ${money(p.cot.T)} · ${p.pago}${p.asignacion.repaId ? ' · ' + esc(M.repartidor(W, p.asignacion.repaId).nombre) : ''} ${riesgoChip(p.riesgo)}</div></div></button>`;
  function aVivo(al) {
    const k = M.kpis(W), f = M.resumenFinanzas(W);
    const act = W.pedidos.filter(M.activo).slice().reverse();
    return `<div class="kpis"><div class="kpi"><span>Pedidos hoy</span><b>${k.pedidos}</b></div><div class="kpi"><span>Ventas de negocios</span><b>${money(k.gmv)}</b></div><div class="kpi"><span>De Una ganó con pedidos</span><b>${money(k.ingresoPedidos)}</b></div><div class="kpi"><span>Efectivo en la calle</span><b>${money(f.efectivoEnCalle)}</b></div></div>
      <div class="row between"><h2>Atiende esto</h2><span class="small muted">${al.length} alertas</span></div>
      ${al.length ? al.map(alertaHTML).join('') : empty('bag', 'Todo en orden.')}
      <div class="row between"><h2>En curso</h2><span class="small muted">${act.length} · ${k.enLinea} repartidores en línea</span></div>
      ${act.length ? act.map(filaPedido).join('') : empty('moto', 'Sin pedidos en curso.')}
      ${nota('Usa el <b>reloj de la demo</b> para ver qué pasa con el tiempo: el negocio que no contesta se cancela solo, las ofertas pasan a otro repartidor y los pagos que no llegan se cancelan.')}`;
  }
  function aPedidos() {
    const a = UI.adm;
    if (a.sel) return aDetallePedido(M.pedido(W, a.sel));
    const fil = { activos: W.pedidos.filter(M.activo), terminados: W.pedidos.filter((p) => !M.activo(p)), todos: W.pedidos };
    const chips = `<div class="chips">${[['activos', 'Activos'], ['reclamos', 'Reclamos'], ['terminados', 'Terminados'], ['todos', 'Todos']].map(([k, t]) => chip(t, 'a-filtro:' + k, a.filtro === k)).join('')}</div>`;
    if (a.filtro === 'reclamos') {
      const incs = W.incidencias.slice().sort((x, y) => (x.estado === 'abierta' ? 0 : 1) - (y.estado === 'abierta' ? 0 : 1) || y.t - x.t);
      return chips + (incs.length ? incs.map(cardReclamo).join('') : empty('bag', 'Sin reclamos.'));
    }
    const list = fil[a.filtro].slice().reverse();
    return chips + (list.length ? list.map(filaPedido).join('') : empty('bag', 'Nada por aquí.'));
  }
  function cardReclamo(i) {
    const p = M.pedido(W, i.pedidoId), cl = M.cliente(W, i.clienteId), f = UI.adm.res[i.id] || (UI.adm.res[i.id] = { decision: i.tipo === 'cliente_ausente' ? 'confirmar' : 'reembolso', monto: String(i.monto || ''), destino: 'saldo', cargoA: i.tipo === 'falta' || i.tipo === 'equivocado' ? 'negocio' : 'deuna', nota: '' });
    const abierto = i.estado === 'abierta';
    let form = '';
    if (abierto && i.tipo === 'cliente_ausente') form = `<p class="small muted" style="margin:0">Adeudo del cliente: ${money(-M.saldo(W, 'cli:' + cl.id))}. Confírmalo si el repartidor esperó y llamó; perdónalo si el cliente tuvo una razón válida.</p><div class="row-btns"><button class="btn ghost sm" data-act="a-resolver:${i.id}:perdonar">Perdonar adeudo</button><button class="btn sm" style="flex:1" data-act="a-resolver:${i.id}:confirmar">Confirmar adeudo</button></div>`;
    else if (abierto) form = `<div class="chips">${chip('Devolver', `ar:${i.id}:decision:reembolso`, f.decision === 'reembolso')}${chip('No procede', `ar:${i.id}:decision:rechazar`, f.decision === 'rechazar')}</div>
      ${f.decision === 'reembolso' ? `<label class="f">Monto<input class="in" inputmode="numeric" data-bind="adm.res.${i.id}.monto" value="${esc(f.monto)}" placeholder="45"></label>
        <div class="eyebrow">Cómo se le devuelve</div><div class="chips">${chip('Saldo a favor (al momento)', `ar:${i.id}:destino:saldo`, f.destino === 'saldo')}${chip('Transferencia', `ar:${i.id}:destino:transferencia`, f.destino === 'transferencia')}</div>
        <div class="eyebrow">Quién lo paga</div><div class="chips">${chip('deuna', `ar:${i.id}:cargoA:De Una`, f.cargoA === 'deuna')}${p.negocioId ? chip('El negocio', `ar:${i.id}:cargoA:negocio`, f.cargoA === 'negocio') : ''}${i.repaId ? chip('El repartidor', `ar:${i.id}:cargoA:repartidor`, f.cargoA === 'repartidor') : ''}</div>
        ${!esDueno() ? `<p class="small muted" style="margin:0">Como operador puedes devolver hasta ${money(W.config.limites.creditoOperador)}; más lo aprueba el dueño.</p>` : ''}` : `<label class="f">Motivo para el cliente<input class="in" data-bind="adm.res.${i.id}.nota" value="${esc(f.nota)}" placeholder="El pedido salió completo según el ticket"></label>`}
      <button class="btn sm" data-act="a-resolver:${i.id}">Resolver reclamo</button>`;
    else form = `<p class="small muted" style="margin:0">${i.estado === 'resuelta' ? `Resuelto por ${esc(i.resolucion.por)}${i.resolucion.monto ? `: ${money(i.resolucion.monto)} ${i.resolucion.destino === 'transferencia' ? 'por transferencia' : 'como saldo'}, a cargo de ${i.resolucion.cargoA || 'deuna'}` : ''}.` : `No procedió: ${esc(i.resolucion.nota || 'sin motivo')}`}</p>`;
    return `<div class="card ${abierto && i.sospechosa ? 'flag' : ''}"><div class="row between"><h3>#${i.id} · ${esc(M.TIPOS_INC[i.tipo])}</h3><span class="pill ${abierto ? 'p-pago_pendiente' : 'p-entregado'}">${abierto ? 'Abierto' : i.estado === 'resuelta' ? 'Resuelto' : 'No procede'}</span></div>
      <div class="small muted">Pedido <button class="link" data-act="a-ver:${p.id}">#${p.id}</button> · ${esc(cl.nombre)} · ${hora(i.t)}${i.foto ? ' · con foto' : ''}${i.monto ? ` · pide ${money(i.monto)}` : ''}</div>
      ${i.detalle ? `<p class="small" style="margin:0">“${esc(i.detalle)}”</p>` : ''}
      ${i.sospechosa ? `<div class="banner small"><b>Revisa con cuidado:</b> ${esc(i.motivos.join(' · '))}</div>` : ''}
      ${p.pinOmitido === false && p.estado === 'entregado' ? '<p class="small muted" style="margin:0">Se entregó con el código del cliente.</p>' : ''}${form}</div>`;
  }
  function aDetallePedido(p) {
    const cl = M.cliente(W, p.clienteId), niv = M.nivelCliente(W, cl), A = yoAdm(), f = UI.adm.motivo;
    const acciones = [];
    if (!M.validar(W, p, 'confirmar_pago', A)) acciones.push(`<button class="btn sm" data-act="a-tx:${p.id}:confirmar_pago">Ya llegó la transferencia</button>`);
    if (!M.validar(W, p, 'subir_bono', A, { monto: 10 })) acciones.push(`<button class="btn ghost sm" data-act="a-tx:${p.id}:subir_bono:10">Subir bono $10</button>`);
    if (!M.validar(W, p, 'autorizar_sin_pin', A) && !p.pinOmitido) acciones.push(`<button class="btn ghost sm" data-act="a-tx:${p.id}:autorizar_sin_pin">Autorizar sin código</button>`);
    const puedeAsignar = p.entrega === 'deuna' && ['preparando', 'listo', 'buscando', 'comprando'].includes(p.estado) && !(p.repaEnTienda && p.estado !== 'buscando');
    const cands = puedeAsignar ? M.candidatos(W, p) : [];
    const movs = W.movimientos.filter((m) => m.pedidoId === p.id);
    const porCuenta = {};
    movs.forEach((m) => { (porCuenta[m.cuenta] = porCuenta[m.cuenta] || []).push(m); });
    return `<button class="link" style="align-self:flex-start" data-act="a-ver:">‹ Todos los pedidos</button>
      <div class="card"><div class="row between"><h2>#${p.id} · ${esc(origenDe(p))}</h2>${pill(p.estado)}</div>
        ${kv('Cliente', `${esc(cl.nombre)} · ${esc(niv.etiqueta)}`)}${kv('Entrega', `${esc(p.dir)}, ${esc(p.destino)}`)}${kv('Pago', p.pago === 'efectivo' ? `Efectivo${p.pagaCon ? ` (paga con ${money(p.pagaCon)})` : ''}` : `Transferencia · ${p.referencia}`)}
        ${kv('Repartidor', p.entrega === 'propia' ? 'Entrega el negocio' : p.asignacion.repaId ? esc(M.repartidor(W, p.asignacion.repaId).nombre) : p.asignacion.oferta ? `Ofrecido a ${esc(M.repartidor(W, p.asignacion.oferta.repaId).nombre)}` : 'Sin asignar')}
        ${kv('Código de entrega', `<span class="mono">${p.pin}</span>${p.pinIntentos ? ` · ${p.pinIntentos} intentos fallidos` : ''}${p.pinOmitido ? ' · autorizado sin código' : ''}`)}
        ${p.riesgo && p.riesgo.motivos.length ? `<div class="banner small"><b>Riesgo ${p.riesgo.nivel}:</b> ${esc(p.riesgo.motivos.join(' · '))}</div>` : ''}</div>
      ${acciones.length ? `<div class="row-btns">${acciones.join('')}</div>` : ''}
      ${cands.length ? `<div class="card"><h3>Asignar repartidor</h3>${cands.map((c) => `<div class="row between"><div><b class="small">${esc(c.repa.nombre)}</b><p class="small muted" style="margin:0">${esc(c.repa.zona)} · ★ ${c.repa.rating.toFixed(1)} · ${c.motivo ? esc(c.motivo) : 'Disponible'}</p></div><button class="btn sm ${c.motivo ? 'ghost' : ''}" data-act="a-asignar:${p.id}:${c.repa.id}" ${c.motivo && c.motivo !== 'Ya rechazó este pedido' ? 'disabled' : ''}>Asignar</button></div>`).join('')}</div>` : ''}
      ${M.activo(p) ? `<div class="card"><h3>Cancelar pedido</h3><div class="chips">${['Sin repartidor disponible', 'El negocio no contesta', 'Posible fraude', 'Lo pidió el cliente', 'Accidente en el camino'].map((m) => chip(m, `a-motivo:${p.id}:${m}`, f[p.id] === m)).join('')}</div><button class="btn ghost sm" data-act="a-cancelar:${p.id}" ${f[p.id] ? '' : 'disabled'}>Cancelar con este motivo</button><p class="small muted" style="margin:0">Al cancelar, el motor reembolsa al cliente y repone a quien ya había pagado.</p></div>` : ''}
      <div class="card"><h3>Lo que pasó</h3><ol class="timeline">${p.historial.map((h) => `<li><time>${hora(h.t)}</time><span>${esc(h.texto)}</span></li>`).join('')}</ol></div>
      ${desglose(p.cot)}
      <div class="card"><h3>Cómo se movió el dinero</h3>${p.flujos.length ? p.flujos.map((x) => kv(`${esc(quien(p, x.de))} → ${esc(quien(p, x.a))}`, `${money(x.monto)} · ${esc(x.concepto)}`)).join('') : '<p class="small muted" style="margin:0">Todavía no se mueve dinero.</p>'}</div>
      <div class="card"><h3>Libro de movimientos</h3>${Object.keys(porCuenta).length ? Object.entries(porCuenta).map(([c, ms]) => `<div class="stack" style="gap:2px"><b class="small">${esc(nombreCuenta(c))}</b>${ms.map((m) => kv(esc(m.concepto), money(m.monto))).join('')}</div>`).join('') : '<p class="small muted" style="margin:0">Se registra cuando el pedido termina.</p>'}
        <p class="small muted" style="margin:0">Positivo: De Una le debe. Negativo: le debe a De Una. Las líneas “De Una · …” son ingresos y costos de De Una.</p></div>
      ${W.incidencias.filter((i) => i.pedidoId === p.id).map(cardReclamo).join('')}`;
  }
  function aDinero() {
    const f = M.resumenFinanzas(W), ing = f.lineas.filter((l) => l.monto > 0), cos = f.lineas.filter((l) => l.monto < 0), d = esDueno();
    return `<div class="hero"><span>Resultado de De Una (noviembre, hasta hoy)</span><b>${money(f.total)}</b><span>Ingresos menos promociones, bonos, garantías y reembolsos</span></div>
      <div class="kpis"><div class="kpi"><span>Efectivo en la calle</span><b>${money(f.efectivoEnCalle)}</b></div><div class="kpi"><span>Por pagar a repartidores</span><b>${money(f.porPagarRepas)}</b></div><div class="kpi"><span>Por depositar a negocios</span><b>${money(f.porDepositarNeg)}</b></div><div class="kpi"><span>Por cobrar a negocios</span><b>${money(f.porCobrarNeg)}</b></div></div>
      <div class="card"><h3>Ingresos</h3>${ing.map((l) => kv(l.n, money(l.monto))).join('') || '<p class="small muted" style="margin:0">Sin ingresos.</p>'}<h3 style="margin-top:6px">Costos</h3>${cos.map((l) => kv(l.n, money(l.monto))).join('') || '<p class="small muted" style="margin:0">Sin costos.</p>'}</div>
      <div class="card"><h3>Corte de repartidores</h3><p class="small muted" style="margin:0">Cada lunes: quien trae efectivo de De Una lo deposita; a quien se le debe, se le paga.</p>${f.repas.map((r) => `<div class="row between"><div><b class="small">${esc(r.nombre)}</b><p class="small muted" style="margin:0">${r.saldo < 0 ? `Debe entregar ${money(-r.saldo)}` : r.saldo > 0 ? `Se le deben ${money(r.saldo)}` : 'En cero'}${r.suspendido ? ' · suspendido' : ''}</p></div>${r.saldo < 0 ? `<button class="btn ghost sm" data-act="a-deposito:${r.id}" ${d ? '' : 'disabled'}>Registrar depósito</button>` : r.saldo > 0 ? `<button class="btn sm" data-act="a-pagarrepa:${r.id}" ${d ? '' : 'disabled'}>Pagar</button>` : ''}</div>`).join('')}</div>
      <div class="card"><h3>Depósitos y cobros a negocios</h3><p class="small muted" style="margin:0">Cada noche se deposita lo pagado en línea, menos mensualidad, anuncios y cargos.</p>${f.negs.map((n) => `<div class="row between"><div><b class="small">${esc(n.nombre)}</b><p class="small muted" style="margin:0">${n.saldo > 0 ? `Se le depositan ${money(n.saldo)}` : n.saldo < 0 ? `Debe ${money(-n.saldo)}` : 'En cero'} · ${esc(n.mens.texto)}</p></div>${n.saldo > 0 ? `<button class="btn sm" data-act="a-depositar:${n.id}" ${d ? '' : 'disabled'}>Depositar</button>` : n.saldo < 0 ? `<button class="btn ghost sm" data-act="a-pagoneg:${n.id}" ${d ? '' : 'disabled'}>Registrar pago</button>` : ''}</div>`).join('')}</div>
      ${d ? '' : nota('Como operador puedes ver el dinero, pero los pagos y depósitos los registra el dueño.')}`;
  }
  function aPersonas() {
    const t = UI.adm.personas, d = esDueno();
    const tabs = `<div class="chips">${[['solicitudes', `Solicitudes (${W.solicitudes.length})`], ['clientes', 'Clientes'], ['repartidores', 'Repartidores'], ['negocios', 'Negocios']].map(([k, x]) => chip(x, 'a-personas:' + k, t === k)).join('')}</div>`;
    if (t === 'solicitudes') return tabs + (W.solicitudes.length ? W.solicitudes.map((s) => {
      const falta = M.faltantes(s);
      return `<div class="card"><div class="row between"><h3>${esc(s.nombre)}</h3><span class="pill p-pago_pendiente">${s.tipo === 'negocio' ? 'Negocio' : 'Repartidor'}</span></div><div class="small muted">${esc(s.zona)}${s.giro ? ' · ' + esc(s.giro) : ''}${s.vehiculo ? ' · ' + esc(s.vehiculo) : ''}</div>
        ${M.docsRequeridos(s).map((k) => `<div class="doc"><span>${M.DOCS[k]}</span><span class="${s.docs[k] ? 'ok' : 'no'}">${s.docs[k] ? 'Recibido' : 'Falta'}</span></div>`).join('')}
        <div class="row-btns"><button class="btn ghost sm" data-act="a-solrech:${s.id}">Rechazar</button>${falta.length ? `<button class="btn ghost sm" style="flex:1" data-act="toast:Le pedimos por WhatsApp: ${esc(falta.map((k) => M.DOCS[k]).join(', '))}">Pedir lo que falta</button>` : ''}<button class="btn sm" style="flex:1" data-act="a-solapr:${s.id}">Aprobar</button></div></div>`;
    }).join('') : empty('bag', 'Sin solicitudes pendientes.'));
    if (t === 'clientes') return tabs + W.clientes.map((c) => {
      const niv = M.nivelCliente(W, c), s = M.saldo(W, 'cli:' + c.id), k = M.cuentasEnDispositivo(W, c.dispositivo);
      return `<div class="card"><div class="row between"><h3>${esc(c.nombre)}</h3><span class="pill ${niv.nivel === 'confiable' ? 'p-entregado' : niv.nivel === 'nuevo' ? 'p-listo' : 'p-no_entregado'}">${esc(niv.etiqueta)}</span></div>
        <div class="small muted">${esc(c.dir)}, ${esc(c.fracc)} · ${c.pedidosOk} pedidos · ${c.noShows} no recibidos · ${M.reclamosRecientes(W, c)} reclamos en 30 días${s ? ` · saldo ${money(s)}` : ''}${c.plus.activo ? ' · Plus' : ''}</div>
        ${k >= 3 ? `<div class="banner small"><b>Su celular tiene ${k} cuentas.</b> Puede ser alguien que busca repetir promos o volver después de no pagar.</div>` : ''}
        <div class="row-btns">${c.bloqueado ? `<button class="btn ghost sm" data-act="a-cli:${c.id}:desbloquear">Desbloquear</button>` : `<button class="btn ghost sm" data-act="a-cli:${c.id}:bloquear">Bloquear</button>`}${niv.nivel === 'restringido' && s >= 0 ? `<button class="btn ghost sm" data-act="a-cli:${c.id}:efectivo" ${d ? '' : 'disabled'}>Permitir efectivo otra vez</button>` : ''}</div></div>`;
    }).join('');
    if (t === 'repartidores') return tabs + W.repartidores.map((r) => {
      const s = M.saldo(W, 'repa:' + r.id), act = M.activoDe(W, r.id);
      return `<div class="card"><div class="row between"><h3>${esc(r.nombre)}${r.simulado ? ' <span class="tag-ad">simulado</span>' : ''}</h3><span class="pill ${r.suspendido ? 'p-no_entregado' : r.enLinea ? 'p-entregado' : 'p-cancelado'}">${r.suspendido ? 'Suspendido' : r.enLinea ? 'En línea' : 'Desconectado'}</span></div>
        <div class="small muted">${esc(r.zona)} · ${r.vehiculo} · ★ ${r.rating.toFixed(1)} · acepta ${Math.round(r.aceptacion * 100)} % · ${r.entregasHoy} entregas hoy · ${s < 0 ? `trae ${money(-s)}` : `se le deben ${money(s)}`}${act ? ` · en el pedido #${act.id}` : ''}</div>
        <div class="row-btns"><button class="btn ghost sm" data-act="a-repa:${r.id}:linea">${r.enLinea ? 'Desconectar' : 'Conectar'}</button></div></div>`;
    }).join('');
    return tabs + W.negocios.map((n) => {
      const ab = M.negocioAbierto(W, n), e = M.estadoMensualidad(W, n), mt = n.met;
      return `<div class="card"><div class="row between"><div class="row">${blogo(n, 34)}<h3>${esc(n.nombre)}</h3></div><span class="pill ${ab.ok ? 'p-entregado' : 'p-cancelado'}">${ab.ok ? 'Abierto' : esc(ab.motivo)}</span></div>
        <div class="small muted">${esc(n.fracc)} · ${esc(e.texto)} · ${mt.entregados} entregados · ${mt.expirados} sin responder · ★ ${n.rating.toFixed(1)}${n.anuncios.filter((x) => x.hasta >= M.diaActual(W)).map((x) => ` · anuncio ${x.tipo}`).join('')}</div>
        ${n.pausa === 'sin_respuesta' ? `<button class="btn ghost sm" data-act="a-reactivar:${n.id}">Reactivar</button>` : ''}</div>`;
    }).join('');
  }
  function aAjustes() {
    const cfg = W.config, d = esDueno();
    const num = (path, label, help, pre = '$', suf = '') => `<div class="tarifa"><div><b>${label}</b><p>${help}</p></div><label class="money-in">${pre}<input type="number" min="0" step="any" data-cfg="${path}" value="${path.split('.').reduce((o, k) => o[k], cfg)}" aria-label="${label}" ${d ? '' : 'disabled'}>${suf}</label></div>`;
    const sw = (path, label, help) => `<div class="row between"><div><b class="small">${label}</b><p class="small muted" style="margin:0">${help}</p></div><button class="switch" data-act="a-sw:${path}" aria-pressed="${path.split('.').reduce((o, k) => o[k], cfg)}" aria-label="${label}" ${d ? '' : 'disabled'}><span class="t"></span></button></div>`;
    return `<div class="card"><h3>¿Quién eres?</h3><div class="chips">${chip('Dueño', 'a-permiso:dueño', d)}${chip('Operador', 'a-permiso:operador', !d)}</div><p class="small muted" style="margin:0">El operador atiende pedidos y reclamos (devoluciones hasta ${money(cfg.limites.creditoOperador)}). Tarifas, pagos y límites solo los cambia el dueño. Todo queda en la bitácora.</p></div>
      <div class="card"><h3>Operación de hoy</h3>${sw('tarifas.lluvia.activa', 'Está lloviendo', `Sube el envío ${money(cfg.tarifas.lluvia.extra)}; todo va al repartidor`)}${sw('operacion.leySeca', 'Ley seca', 'No se vende alcohol en toda la app')}${sw('promos.bienvenida', 'Primer envío gratis', 'Lo paga De Una para atraer clientes')}</div>
      <div class="card" style="padding:4px 14px">${num('tarifas.mismo', 'Envío en el mismo fraccionamiento', 'Negocio y cliente en la misma zona')}${num('tarifas.cerca', 'Envío a zona cercana', 'Entre fraccionamientos vecinos')}${num('tarifas.lejos', 'Envío desde o hacia Huehuetoca centro', 'El viaje más largo')}${num('tarifas.mandado', 'Mandado', 'Tarifa fija')}${num('tarifas.servicio', 'Servicio De Una', 'Por pedido; lo ve el cliente antes de pagar')}${num('tarifas.repaPct', 'Parte del envío para el repartidor', 'El resto es de De Una', '', ' %')}${num('tarifas.pedidoPequeno.cargo', 'Cargo por pedido pequeño', `A compras de menos de ${money(cfg.tarifas.pedidoPequeno.umbral)}; va al repartidor`)}${num('tarifas.lluvia.extra', 'Extra por lluvia', 'Va al repartidor')}</div>
      <div class="card" style="padding:4px 14px">${num('negocios.mensualidad', 'Mensualidad del negocio', '0 % de comisión')}${num('anuncios.destacado', 'Anuncio destacado (7 días)', 'Sale primero en la lista')}${num('anuncios.carrusel', 'Anuncio en el carrusel (7 días)', 'Sale en la portada')}${num('plus.precio', 'De Una Plus al mes', `Envío gratis desde ${money(cfg.plus.envioGratisDesde)}, hasta ${cfg.plus.enviosMes} al mes`)}${num('promos.vecino', 'Premio por invitar a un vecino', 'Para cada uno')}${num('gas.precioMaxKg', 'Precio máximo del gas LP por kg', 'Lo publica la CNE cada semana para tu región', '$', '/kg')}</div>
      <div class="card" style="padding:4px 14px">${num('limites.efectivoNuevo', 'Efectivo para clientes nuevos', `En sus primeros ${cfg.limites.pedidosNuevo} pedidos`)}${num('limites.efectivoMax', 'Efectivo máximo por pedido', 'Arriba se paga por adelantado')}${num('limites.efectivoRepa', 'Efectivo máximo que trae un repartidor', 'Arriba ya no recibe pedidos en efectivo')}${num('limites.suspenderRepa', 'Efectivo para suspender', 'Se pausa su cuenta hasta que deposite')}${num('limites.adelantoMandado', 'Adelanto máximo en mandados', 'Lo que el repartidor paga con su dinero')}${num('limites.creditoOperador', 'Devolución máxima del operador', 'Más lo aprueba el dueño')}${num('limites.cancelTardiaPct', 'Pago al negocio si cancelan tarde', 'Del subtotal, con pago en línea', '', ' %')}</div>
      <div class="card"><h3>Bitácora</h3><p class="small muted" style="margin:0">Todo lo que hacen el dueño, los operadores y el sistema.</p><ol class="timeline">${W.bitacora.slice(0, 40).map((b) => `<li><time>${hora(b.t)}</time><span><b>${esc(b.quien)}</b> · ${esc(b.texto)}</span></li>`).join('')}</ol></div>
      <button class="btn ghost block" data-act="reiniciar">Reiniciar la demo</button>`;
  }

  /* ================================================================ */
  /* Render y acciones                                                  */
  /* ================================================================ */
  const ROLES = [{ id: 'cliente', n: 'Cliente', d: 'Pide, paga y sigue su pedido' }, { id: 'negocio', n: 'Negocio', d: 'Acepta, prepara y entrega' }, { id: 'repartidor', n: 'Repartidor', d: 'Toma viajes y entrega con código' }, { id: 'admin', n: 'Admin', d: 'Alertas, dinero y reglas' }];
  let deferredPrompt = null;
  function placeMoto() { const g = document.getElementById('moto'), p = document.getElementById('ruta'); if (!g || !p) return; const L = p.getTotalLength(), pt = p.getPointAtLength(L * (+g.dataset.p)); g.setAttribute('transform', `translate(${pt.x} ${pt.y})`); }
  function relojHTML(mini) {
    return mini ? `<span class="clock-mini"><b>${hora(W.reloj)}</b><button data-act="reloj:1">+1</button><button data-act="reloj:5">+5</button></span>`
      : `<div class="clock"><div><span class="eyebrow">Reloj de la demo</span><b>${hora(W.reloj)}</b></div><button data-act="reloj:1">+1 min</button><button data-act="reloj:5">+5 min</button><button data-act="reloj:10">+10 min</button></div>`;
  }
  function render() {
    document.getElementById('roles').innerHTML = ROLES.map((r) => `<button class="role" data-act="role:${r.id}" aria-pressed="${UI.role === r.id}"><b>${r.n}</b><span>${r.d}</span></button>`).join('');
    document.getElementById('demo-role').innerHTML = ROLES.map((r) => `<option value="${r.id}" ${r.id === UI.role ? 'selected' : ''}>${r.n}</option>`).join('');
    document.getElementById('reloj').innerHTML = relojHTML(false);
    document.getElementById('reloj-mini').innerHTML = relojHTML(true);
    const t = W.config.tarifas;
    document.getElementById('model').innerHTML = [['Negocio paga al mes, sin comisión', money(W.config.negocios.mensualidad)], ['Cliente paga por pedido (servicio)', money(t.servicio)], ['Envío por zona', `${money(t.mismo)}–${money(t.lejos)}`], ['Repartidor: envío + propina', `${t.repaPct} % + 100 %`], ['De Una Plus', `${money(W.config.plus.precio)} al mes`], ['Anuncios', `desde ${money(W.config.anuncios.destacado)} / semana`]].map(([a, b]) => `<div><span>${a}</span><b>${b}</b></div>`).join('');
    document.getElementById('phone').classList.toggle('wide', UI.role === 'admin' && !document.body.classList.contains('mobile'));
    const app = document.getElementById('app'), sc = app.querySelector('.scroll'), keep = sc ? sc.scrollTop : 0;
    app.innerHTML = UI.role === 'cliente' ? vCliente() : UI.role === 'negocio' ? vNegocio() : UI.role === 'repartidor' ? vRepa() : vAdmin();
    const sc2 = app.querySelector('.scroll');
    if (sc2 && render.keep) sc2.scrollTop = keep;
    render.keep = false;
    placeMoto();
  }
  const val = (id) => { const e = document.getElementById(id); return e ? e.value.trim() : ''; };
  function addCart(n, m) {
    const c = UI.cli, v = M.productoVendible(W, n, m);
    if (!v.ok) { toast(v.motivo); return; }
    if (c.cartNeg && c.cartNeg !== n.id && c.cart.length) { c.cart = []; toast('Vaciamos el carrito del otro negocio'); }
    c.cartNeg = n.id;
    const it = c.cart.find((x) => x.id === m.id);
    if (it) it.q++; else c.cart.push({ id: m.id, n: m.n, p: m.p, il: m.il, q: 1 });
  }
  function irPedido(p) { const c = UI.cli; c.orderId = p.id; c.screen = 'seguimiento'; if (p.negocioId) { UI.neg.id = p.negocioId; UI.neg.screen = 'pedidos'; UI.neg.tab = 'nuevo'; } }
  function setPath(obj, path, v) { const ks = path.split('.'); let o = obj; for (let i = 0; i < ks.length - 1; i++) o = o[ks[i]]; o[ks[ks.length - 1]] = v; }
  const getPath = (obj, path) => path.split('.').reduce((o, k) => o[k], obj);

  const A = {
    role: (r) => { UI.role = r; try { history.replaceState(null, '', '#' + r); } catch (e) { /* sin historial */ } },
    toast: (m) => toast(m),
    reloj: (m) => {
      const antes = Object.fromEntries(W.pedidos.map((p) => [p.id, p.estado]));
      const off = M.ofertaPara(W, UI.rep.id);
      M.avanzarReloj(W, +m);
      const cambios = W.pedidos.filter((p) => antes[p.id] && antes[p.id] !== p.estado).map((p) => `#${p.id}: ${PILL[p.estado].toLowerCase()}`);
      if (off && !M.ofertaPara(W, UI.rep.id) && off.asignacion.repaId !== UI.rep.id) cambios.unshift(`#${off.id}: la oferta pasó a otro repartidor`);
      toast(`Son las ${hora(W.reloj)}. ${cambios.length ? cambios.slice(0, 2).join(' · ') : 'Sin cambios en los pedidos'}`);
      render.keep = true;
    },
    reiniciar: () => { W = window.Datos.sembrar(M); UI.cli.cart = []; UI.cli.orderId = null; UI.adm.sel = null; UI.neg.form = {}; toast('Demo reiniciada: son las 13:00'); },
    // Cliente
    'c-onb': () => { UI.cli.onb++; },
    'c-step': (s) => { UI.cli.step = s; if (s === 'onb') UI.cli.onb = 0; },
    'c-sendcode': () => { yo().tel = val('c-tel') || yo().tel; UI.cli.step = 'code'; toast('Código enviado por WhatsApp'); },
    'c-registrar': () => {
      const cl = yo();
      cl.nombre = val('c-nombre') || cl.nombre; cl.fracc = val('c-fracc') || cl.fracc; cl.dir = val('c-dir') || cl.dir;
      const code = val('c-codigo');
      UI.cli.step = 'app'; UI.cli.screen = 'inicio';
      if (code) { const r = M.usarCodigoVecino(W, cl.id, code); toast(r.ok ? `Código de ${r.nombre} guardado: ganan $${W.config.promos.vecino} con tu primer pedido` : r.error); }
      else toast(M.bienvenidaElegible(W, cl) ? '¡Listo! Tu primer envío es gratis' : '¡Listo!');
    },
    'c-go': (s) => { UI.cli.screen = s; if (s === 'buscar') setTimeout(() => { const i = document.getElementById('c-q'); if (i) i.focus(); }, 30); },
    'c-cat': (k) => { if (['gas', 'agua', 'mandado'].includes(k)) { UI.cli.screen = k; UI.cli.pago = null; return; } UI.cli.cat = k; UI.cli.screen = 'cat'; },
    'c-q': (w) => { UI.cli.q = w; },
    'c-neg': (id) => { UI.cli.negId = id; UI.cli.screen = 'negocio'; },
    'c-mas': (id) => { const c = UI.cli, n = neg(c.screen === 'carrito' ? c.cartNeg : c.negId); addCart(n, n.menu.find((m) => m.id === +id)); render.keep = true; },
    'c-menos': (id) => { const c = UI.cli, it = c.cart.find((x) => x.id === +id); if (it) { it.q--; if (!it.q) c.cart = c.cart.filter((x) => x !== it); } render.keep = true; },
    'c-sust': (v) => { UI.cli.sust = v; render.keep = true; },
    'c-toggle': (k) => { UI.cli[k] = !UI.cli[k]; render.keep = true; },
    'c-tip': (v) => { UI.cli.tip = +v; render.keep = true; },
    'c-pago': (p) => { UI.cli.pago = p; render.keep = true; },
    'c-billete': (b) => { UI.cli.pagaCon = +b || null; render.keep = true; },
    'c-pedir': () => {
      const r = M.crearPedido(W, qCarrito());
      if (!r.ok) { toast(r.error); return; }
      const c = UI.cli; c.cart = []; c.cartNeg = null; c.nota = ''; c.mayorEdad = false; c.recetaFoto = false; c.pagaCon = null;
      irPedido(r.pedido);
      toast(r.pedido.estado === 'pago_pendiente' ? 'Falta tu transferencia para enviarlo' : 'Pedido enviado a ' + neg(r.pedido.negocioId).nombre);
    },
    'c-pedir-directo': (id) => {
      const c = UI.cli, items = id === 'gas' ? [{ id: c.gasItem, q: 1 }] : [{ id: 1, q: c.garrafones }];
      const r = M.crearPedido(W, { clienteId: c.id, negocioId: id, tipo: 'tienda', items, pago: c.pago });
      if (!r.ok) { toast(r.error); return; }
      irPedido(r.pedido); toast(id === 'gas' ? 'Pedido enviado a la gasera' : 'Pedido enviado a la purificadora');
    },
    'c-pedir-mandado': () => {
      const c = UI.cli, f = c.mand;
      const r = M.crearPedido(W, { clienteId: c.id, tipo: 'mandado', descripcion: 'Mandado: ' + f.que, origen: f.origen, lugar: f.lugar, presupuesto: f.presu, propina: c.tip, pago: 'efectivo' });
      if (!r.ok) { toast(r.error); return; }
      irPedido(r.pedido); toast(r.pedido.asignacion.repaId ? 'Un repartidor ya va a comprarlo' : 'Buscando repartidor para tu mandado');
    },
    'c-ver': (id) => { UI.cli.orderId = +id; UI.cli.screen = 'seguimiento'; },
    'c-simpago': (id) => { tx(id, 'confirmar_pago', {}, M.SISTEMA); },
    'c-ticket': (arg) => { const [id, v] = arg.split(':'); tx(id, v === 'si' ? 'aprobar_ticket' : 'rechazar_ticket', {}, yoCli()); },
    'c-rate': (arg) => { const [id, k, v] = arg.split(':'); (UI.cli.rate[id] = UI.cli.rate[id] || {})[k] = +v; render.keep = true; },
    'c-enviar-calif': (id) => { tx(id, 'calificar', UI.cli.rate[id] || {}, yoCli()); render.keep = true; },
    'c-reclamo': (id) => { UI.cli.orderId = +id; UI.cli.inc = { tipo: null, detalle: '', foto: false, monto: '' }; UI.cli.screen = 'reclamo'; },
    'c-inc': (arg) => { const [k, v] = arg.split(':'); if (k === 'foto') UI.cli.inc.foto = !UI.cli.inc.foto; else UI.cli.inc[k] = v; render.keep = true; },
    'c-enviar-inc': (id) => { const f = UI.cli.inc, r = M.abrirIncidencia(W, +id, yoCli(), { tipo: f.tipo, detalle: f.detalle, foto: f.foto, monto: +f.monto || 0 }); if (!r.ok) { toast(r.error); return; } UI.cli.screen = 'seguimiento'; toast('Recibimos tu reporte. Te respondemos en menos de 24 horas'); },
    'c-motivo': (m) => { UI.cli.motivo = m; render.keep = true; },
    'c-cancelar': (id) => { if (tx(id, 'cancelar', { motivo: UI.cli.motivo }, yoCli())) { UI.cli.sheet = null; UI.cli.motivo = null; } },
    'c-gasitem': (id) => { UI.cli.gasItem = +id; },
    'c-garr': (dlt) => { UI.cli.garrafones = Math.max(1, Math.min(10, UI.cli.garrafones + (+dlt))); },
    'c-sheet': (s) => { UI.cli.sheet = s || null; UI.cli.motivo = null; render.keep = true; },
    'c-fracc': (f) => { yo().fracc = f; render.keep = true; },
    'c-savedir': () => { yo().dir = val('c-dir2') || yo().dir; UI.cli.sheet = null; toast('Dirección guardada'); render.keep = true; },
    'c-install': async () => { if (!deferredPrompt) return; const p = deferredPrompt; deferredPrompt = null; UI.cli.sheet = null; p.prompt(); try { await p.userChoice; } catch (e) { /* cancelado */ } render(); },
    'c-share': (code) => { const msg = `¡Ya llegó De Una a la zona! Pide comida, gas y garrafones a tu casa. Usa mi código ${code} y ganamos $${W.config.promos.vecino} cada uno.`; try { navigator.clipboard.writeText(msg).then(() => toast('Invitación copiada. Pégala en WhatsApp'), () => toast(msg)); } catch (e) { toast(msg); } },
    'c-plus': () => { const cl = yo(); const r = cl.plus.activo ? M.cancelarPlus(W, cl.id) : M.suscribirPlus(W, cl.id); toast(r.ok ? (cl.plus.activo ? '¡Ya tienes Plus!' : 'Cancelaste Plus') : r.error); render.keep = true; },
    'c-adeudo': () => { const r = M.pagarAdeudo(W, UI.cli.id); toast(r.ok ? `Recibimos ${money(r.monto)}. Gracias` : r.error); },
    'c-salir': () => { UI.cli.step = 'onb'; UI.cli.onb = 0; },
    'neg-registro': () => { UI.role = 'negocio'; UI.neg.screen = 'registro'; UI.neg.solicitud = null; },
    'rep-registro': () => { UI.role = 'repartidor'; UI.rep.screen = 'registro'; UI.rep.solicitud = null; },
    // Negocio
    'n-go': (s) => { UI.neg.screen = s; },
    'n-tab': (t) => { UI.neg.tab = t; },
    'n-abierto': () => { const n = neg(UI.neg.id); n.abierto = !n.abierto; },
    'n-saturado': () => { const n = neg(UI.neg.id); n.saturado = !n.saturado; },
    'n-reactivar': () => { const n = neg(UI.neg.id); n.pausa = null; n.perdidos = 0; M.bit(W, { nombre: n.nombre }, 'Se reactivó desde su app'); toast('Listo: vuelves a aparecer en la app'); },
    nf: (arg) => {
      const [id, k, v] = arg.split(':'), f = UI.neg.form[id];
      if (k === 'agotado') { const i = +v; f.agotados = f.agotados.includes(i) ? f.agotados.filter((x) => x !== i) : f.agotados.concat(i); }
      else if (k === 'receta') f.recetaOk = !f.recetaOk;
      else if (k === 'prep') f.prep = +v;
      else if (k === 'rechazo' || k === 'cancelar') f[k] = f[k] === v ? null : v;
      else f[k] = v;
      render.keep = true;
    },
    'n-aceptar': (id) => { const f = UI.neg.form[id]; tx(id, 'aceptar', { prep: f.prep, agotados: f.agotados, decision: f.decision, recetaOk: f.recetaOk }, yoNeg()); render.keep = true; },
    'n-rechazar': (arg) => { const [id, m] = arg.split(/:(.+)/); tx(id, 'rechazar', { motivo: m }, yoNeg()); },
    'n-cancelar': (arg) => { const [id, m] = arg.split(/:(.+)/); tx(id, 'cancelar', { motivo: m }, yoNeg()); },
    'n-tx': (arg) => { const [id, acc] = arg.split(':'); tx(id, acc, {}, yoNeg()); render.keep = true; },
    'n-entregar': (id) => { if (tx(id, 'entregar', { pin: UI.rep.pin, ine: UI.rep.ine }, yoNeg())) { UI.rep.pin = ''; UI.rep.ine = false; } render.keep = true; },
    'n-toggle': (id) => { const m = neg(UI.neg.id).menu.find((x) => x.id === +id); m.on = !m.on; render.keep = true; },
    'n-addprod': () => { const nm = val('n-pn'), p = +val('n-pp'); if (!nm || !(p > 0)) { toast('Escribe nombre y precio'); return; } const n = neg(UI.neg.id); n.menu.push({ id: Date.now(), n: nm, d: '', p, il: n.il, on: true }); toast('Producto agregado'); },
    'n-pagar': () => { const n = neg(UI.neg.id), s = -M.saldo(W, 'neg:' + n.id); const r = M.registrarPagoNegocio(W, n.id, s > 0 ? s : n.factura.monto, { nombre: n.nombre }); toast(r.ok ? 'Pago recibido. Gracias' : r.error); },
    'n-anuncio': (k) => { const n = neg(UI.neg.id), r = M.comprarAnuncio(W, n.id, k, { nombre: n.nombre }); toast(r.ok ? 'Anuncio activo por 7 días. Se cobra de tu saldo' : r.error); render.keep = true; },
    nr: (arg) => { const [k, v] = arg.split(':'), f = UI.neg.reg; if (k === 'doc') f.docs[v] = !f.docs[v]; else if (k === 'giro') f.giro = v; else f[k] = !f[k]; render.keep = true; },
    'nr-enviar': () => {
      const f = UI.neg.reg;
      if (!f.nombre.trim()) { toast('Escribe el nombre del negocio'); return; }
      const s = M.crearSolicitud(W, { tipo: 'negocio', nombre: f.nombre.trim(), giro: f.giro, zona: f.zona, vendeAlcohol: f.alcohol, entregaPropia: f.propia, il: { restaurante: 'chicken', tiendita: 'basket', farmacia: 'bottle', gas: 'gas', agua: 'garrafon' }[f.giro], docs: { ...f.docs } });
      UI.neg.solicitud = s.id; toast(M.faltantes(s).length ? 'Solicitud enviada. Te faltan documentos' : 'Solicitud enviada. La revisamos en menos de 24 h');
    },
    // Repartidor
    'r-go': (s) => { UI.rep.screen = s; },
    'r-on': () => { const r = M.repartidor(W, UI.rep.id); r.enLinea = !r.enLinea; if (r.enLinea) M.revisarTiempos(W); },
    'r-tx': (arg) => { const [id, acc] = arg.split(':'); tx(id, acc, {}, yoRep()); render.keep = true; },
    'r-entregar': (id) => { if (tx(id, 'entregar', { pin: UI.rep.pin, ine: UI.rep.ine }, yoRep())) { UI.rep.pin = ''; UI.rep.ine = false; } render.keep = true; },
    'r-ine': () => { UI.rep.ine = !UI.rep.ine; render.keep = true; },
    'r-foto': () => { UI.rep.foto = !UI.rep.foto; render.keep = true; },
    'r-ticket': (id) => { if (tx(id, 'enviar_ticket', { monto: UI.rep.ticket, foto: UI.rep.foto }, yoRep())) { UI.rep.ticket = ''; UI.rep.foto = false; } },
    'r-deposito': () => { const s = -M.saldo(W, 'repa:' + UI.rep.id); const r = M.registrarDeposito(W, UI.rep.id, s, M.SISTEMA); toast(r.ok ? `Recibimos tu depósito de ${money(s)}` : r.error); },
    rr: (arg) => { const [k, v] = arg.split(':'), f = UI.rep.reg; if (k === 'doc') f.docs[v] = !f.docs[v]; else f[k] = v; render.keep = true; },
    'rr-enviar': () => { const f = UI.rep.reg; const s = M.crearSolicitud(W, { tipo: 'repartidor', nombre: f.nombre.trim() || 'Repartidor nuevo', zona: f.zona, vehiculo: f.vehiculo, docs: { ...f.docs } }); UI.rep.solicitud = s.id; toast('Solicitud enviada'); },
    // Admin
    'a-go': (s) => { UI.adm.screen = s; if (s !== 'pedidos') UI.adm.sel = null; },
    'a-ver': (arg) => { const [id, f] = String(arg).split(':'); UI.adm.screen = 'pedidos'; if (f === 'reclamos') { UI.adm.filtro = 'reclamos'; UI.adm.sel = null; } else UI.adm.sel = id ? +id : null; },
    'a-filtro': (f) => { UI.adm.filtro = f; },
    'a-tx': (arg) => { const [id, acc, monto] = arg.split(':'); tx(id, acc, monto ? { monto: +monto } : {}, yoAdm()); render.keep = true; },
    'a-asignar': (arg) => { const [id, rid] = arg.split(':'); tx(id, 'asignar', { repaId: rid }, yoAdm()); render.keep = true; },
    'a-motivo': (arg) => { const [id, m] = arg.split(/:(.+)/); UI.adm.motivo[id] = m; render.keep = true; },
    'a-cancelar': (arg) => { const [id, m] = String(arg).split(/:(.+)/); tx(id, 'cancelar', { motivo: m || UI.adm.motivo[id] }, yoAdm()); render.keep = true; },
    ar: (arg) => { const [id, k, v] = arg.split(':'); UI.adm.res[id][k] = v; render.keep = true; },
    'a-resolver': (arg) => {
      const [id, dec] = arg.split(':'), f = UI.adm.res[id];
      const r = M.resolverIncidencia(W, +id, yoAdm(), dec ? { decision: dec } : { decision: f.decision, monto: +f.monto, destino: f.destino, cargoA: f.cargoA, nota: f.nota });
      toast(r.ok ? 'Reclamo resuelto. Avisamos al cliente' : r.error); render.keep = true;
    },
    'a-deposito': (rid) => { const s = -M.saldo(W, 'repa:' + rid); const r = M.registrarDeposito(W, rid, s, yoAdm()); toast(r.ok ? `Depósito de ${money(s)} registrado` : r.error); render.keep = true; },
    'a-pagarrepa': (rid) => { const r = M.pagarRepartidor(W, rid, yoAdm()); toast(r.ok ? `Pago de ${money(r.monto)} registrado` : r.error); render.keep = true; },
    'a-depositar': (nid) => { const r = M.depositarNegocio(W, nid, yoAdm()); toast(r.ok ? `Depósito de ${money(r.monto)} registrado` : r.error); render.keep = true; },
    'a-pagoneg': (nid) => { const s = -M.saldo(W, 'neg:' + nid); const r = M.registrarPagoNegocio(W, nid, s, yoAdm()); toast(r.ok ? `Pago de ${money(s)} registrado` : r.error); render.keep = true; },
    'a-reactivar': (nid) => { const n = neg(nid); n.pausa = null; n.perdidos = 0; M.bit(W, yoAdm(), `Reactivó ${n.nombre}`); toast(`${n.nombre} vuelve a aparecer`); render.keep = true; },
    'a-personas': (t) => { UI.adm.screen = 'personas'; UI.adm.personas = t; },
    'a-solapr': (id) => { const r = M.aprobarSolicitud(W, id, yoAdm()); toast(r.ok ? 'Aprobado' : r.error); render.keep = true; },
    'a-solrech': (id) => { const r = M.rechazarSolicitud(W, id, yoAdm(), 'No cumple los requisitos'); toast(r.ok ? 'Solicitud rechazada' : r.error); render.keep = true; },
    'a-cli': (arg) => {
      const [id, acc] = arg.split(':'), c = M.cliente(W, id);
      if (acc === 'bloquear') { c.bloqueado = true; M.bit(W, yoAdm(), `Bloqueó a ${c.nombre}`); }
      if (acc === 'desbloquear') { c.bloqueado = false; M.bit(W, yoAdm(), `Desbloqueó a ${c.nombre}`); }
      if (acc === 'efectivo') { c.noShows = 0; c.cancelTardias = 0; M.bit(W, yoAdm(), `Le permitió efectivo otra vez a ${c.nombre}`); }
      render.keep = true;
    },
    'a-repa': (arg) => { const [id] = arg.split(':'), r = M.repartidor(W, id); r.enLinea = !r.enLinea; M.bit(W, yoAdm(), `${r.enLinea ? 'Conectó' : 'Desconectó'} a ${r.nombre}`); if (r.enLinea) M.revisarTiempos(W); render.keep = true; },
    'a-permiso': (p) => { UI.adm.permiso = p; M.bit(W, { nombre: p === 'dueño' ? 'Dueño' : 'Operador' }, 'Inició sesión en el panel'); },
    'a-sw': (path) => { if (!esDueno()) return; setPath(W.config, path, !getPath(W.config, path)); M.bit(W, yoAdm(), `Cambió "${path}" a ${getPath(W.config, path) ? 'sí' : 'no'}`); render.keep = true; },
  };

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (!b || b.disabled) return;
    if (b.classList.contains('sheet-bg') && e.target.closest('[data-stop]')) return;
    const s = b.dataset.act, i = s.indexOf(':');
    const k = i < 0 ? s : s.slice(0, i), arg = i < 0 ? '' : s.slice(i + 1);
    if (A[k]) { A[k](arg); render(); }
  });
  document.addEventListener('change', (e) => {
    const t = e.target, k = t.dataset.change;
    if (t.dataset.cfg) {
      if (!esDueno()) return;
      const v = Math.max(0, +t.value || 0);
      setPath(W.config, t.dataset.cfg, v);
      M.bit(W, yoAdm(), `Cambió "${t.dataset.cfg}" a ${v}`);
      M.revisarTiempos(W);
      render.keep = true; render();
      return;
    }
    if (!k) return;
    if (k === 'n-ver') { if (t.value === '__nuevo') { UI.neg.screen = 'registro'; UI.neg.solicitud = null; } else { UI.neg.id = t.value; UI.neg.screen = 'pedidos'; } }
    if (k === 'role') A.role(t.value);
    if (k === 'nr-zona') UI.neg.reg.zona = t.value;
    if (k === 'rr-zona') UI.rep.reg.zona = t.value;
    if (k === 'c-mand-origen') UI.cli.mand.origen = t.value;
    render.keep = true; render();
  });
  document.addEventListener('input', (e) => {
    const t = e.target;
    if (t.dataset.bind) {
      setPath(UI, t.dataset.bind, t.value);
      if (t.dataset.rerender) { const pos = t.selectionStart; render.keep = true; render(); const n = document.querySelector(`[data-bind="${t.dataset.bind}"]`); if (n) { n.focus(); try { n.setSelectionRange(pos, pos); } catch (er) { /* no aplica */ } } }
      return;
    }
    if (t.dataset.input === 'c-q') { UI.cli.q = t.value; const pos = t.selectionStart; render(); const i = document.getElementById('c-q'); i.focus(); i.setSelectionRange(pos, pos); }
  });

  const isMobile = () => isStandalone() || innerWidth < 860;
  function layout() { document.body.classList.toggle('mobile', isMobile()); render.keep = true; render(); }
  window.addEventListener('resize', () => { if (isMobile() !== document.body.classList.contains('mobile')) layout(); });
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; });
  window.addEventListener('appinstalled', () => { deferredPrompt = null; toast('De Una quedó instalada'); });
  const h0 = (location.hash || '').slice(1);
  if (ROLES.some((r) => r.id === h0)) UI.role = h0;
  window.addEventListener('hashchange', () => { const h = location.hash.slice(1); if (ROLES.some((r) => r.id === h) && h !== UI.role) { UI.role = h; render(); } });
  document.getElementById('brandbig').innerHTML = brandBig();
  document.getElementById('appicon').innerHTML = `<span class="appicon" style="display:block">${APPICON}</span>`;
  layout();
  window.deuna = { W: () => W, UI, render, M }; // para pruebas desde la consola
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) navigator.serviceWorker.register('sw.js').catch(() => { /* sin sw */ });
})();
