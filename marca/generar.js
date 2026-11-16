/* De Una Delivery · Generador de la marca
 *
 * Una sola fuente para el ícono (el pin que es "!"), el logotipo "de una!" y
 * las piezas que usa la app. Corre con:
 *
 *   node marca/generar.js
 *
 * y escribe icons/*.svg, marca/*.svg y js/marca.js. Los PNG se sacan de los
 * SVG (en Mac: qlmanage -t -s 512 -o icons icons/icon.svg).
 *
 * La idea: un pin de ubicación con un punto debajo forma el signo "!" de
 * "¡De una!". Dice qué hacemos (te lo llevamos a tu ubicación) y cómo lo
 * hacemos (rápido, sin rodeos).
 */
const fs = require('fs');
const path = require('path');
const raiz = path.join(__dirname, '..');

const COLOR = {
  mandarina: '#FF6B1A', mandarinaClara: '#FF9A4D', mandarinaTexto: '#C2410C',
  noche: '#1C2340', tinta: '#141A2E', crema: '#FFF6EE', miel: '#FFB547', blanco: '#FFFFFF',
};
const f = (n) => Math.round(n * 100) / 100;

/* Pin (gota) con la punta abajo: centro (cx, cy), radio r y punta en ty. */
function pin(cx, cy, r, ty) {
  const d = ty - cy, b = Math.acos(r / d), tx = r * Math.sin(b), y = cy + r * Math.cos(b);
  return `M${f(cx)} ${f(ty)}L${f(cx - tx)} ${f(y)}A${r} ${r} 0 1 1 ${f(cx + tx)} ${f(y)}Z`;
}
const circ = (cx, cy, r) => `M${f(cx - r)} ${f(cy)}a${r} ${r} 0 1 0 ${f(2 * r)} 0a${r} ${r} 0 1 0 ${f(-2 * r)} 0Z`;

/* La marca en la retícula de 512: pin con hueco + punto. Centrada a lo alto. */
const MARCA = { pin: `${pin(256, 156, 80, 326)}${circ(256, 156, 31)}`, punto: circ(256, 394, 42) };
const marca = (color) => `<path fill="${color}" fill-rule="evenodd" d="${MARCA.pin}"/><path fill="${color}" d="${MARCA.punto}"/>`;

/* Logotipo: letras monolínea de grosor 13 y puntas redondas, dibujadas a mano
   (no dependen de ninguna tipografía). Línea base en y=100, altura x de 40.
   Termina con el mismo pin "!" del ícono. */
const LETRAS = {
  // Los trazos cortos en la base (M20 94H34, etc.) rellenan la unión de la panza con el palito.
  de: '<circle cx="20" cy="80" r="14"/><path d="M34 38V94M20 94H34"/><path d="M53 80H81A14 14 0 1 0 70.6 93.5"/>',
  una: '<path d="M116 66V80A14 14 0 0 0 144 80M144 66V94M130 94H144"/><path d="M163 66V94M163 80A14 14 0 0 1 191 80V94"/><circle cx="224" cy="80" r="14"/><path d="M238 66V94M224 94H238"/>',
  signo: `${pin(265, 47, 13.5, 79)}${circ(265, 47, 5.2)}`,
  signoPunto: circ(265, 91.5, 7.5),
  delivery: '<path d="M0 0H5A10 10 0 0 1 5 20H0Z"/><path d="M35 0H23V20H35M23 10H32"/><path d="M43 0V20H54"/><path d="M62 0V20"/><path d="M70 0L77 20L84 0"/><path d="M104 0H92V20H104M92 10H101"/><path d="M112 20V0H118A5 5 0 0 1 118 10H112M118 10L124 20"/><path d="M132 0L139 10L146 0M139 10V20"/>',
};
const trazo = (c, w) => `fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
function logotipo({ letras = COLOR.noche, signo = COLOR.mandarina, sub = COLOR.mandarina, conSub = true } = {}) {
  return `<g ${trazo(letras, 13)}>${LETRAS.de}${LETRAS.una}</g>` +
    `<path fill="${signo}" fill-rule="evenodd" d="${LETRAS.signo}"/><path fill="${signo}" d="${LETRAS.signoPunto}"/>` +
    (conSub ? `<g transform="translate(162 118) scale(.8)" ${trazo(sub, 4.6)}>${LETRAS.delivery}</g>` : '');
}
const LOGO_VB = '-7 30 292 107'; // caja del logotipo con DELIVERY

const azulejo = (fondo = COLOR.mandarina, tinta = COLOR.blanco, rx = 114) => `<rect width="512" height="512" rx="${rx}" fill="${fondo}"/>${marca(tinta)}`;
const svg = (vb, cuerpo, extra = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}"${extra}>${cuerpo}</svg>\n`;
const escribir = (rel, txt) => { fs.writeFileSync(path.join(raiz, rel), txt); console.log('escrito', rel); };
const centrada = (escala) => `<g transform="translate(${f(256 - 256 * escala)} ${f(256 - 256 * escala)}) scale(${escala})">${marca(COLOR.blanco)}</g>`;

// Íconos de la app instalable
escribir('icons/icon.svg', svg('0 0 512 512', azulejo()));
escribir('icons/maskable.svg', svg('0 0 512 512', `<rect width="512" height="512" fill="${COLOR.mandarina}"/>${centrada(0.78)}`));
escribir('icons/apple.svg', svg('0 0 512 512', `<rect width="512" height="512" fill="${COLOR.mandarina}"/>${centrada(0.9)}`));

// Logos para redes, lonas e impresos
escribir('marca/icono.svg', svg('0 0 512 512', azulejo()));
escribir('marca/icono-noche.svg', svg('0 0 512 512', azulejo(COLOR.noche, COLOR.mandarina)));
escribir('marca/simbolo.svg', svg('76 60 360 392', marca(COLOR.mandarina)));
escribir('marca/logotipo.svg', svg(LOGO_VB, logotipo()));
escribir('marca/logo.svg', svg('0 0 640 180', `<g transform="translate(16 16) scale(.289)">${azulejo()}</g><g transform="translate(190 -26) scale(1.5)">${logotipo()}</g>`));
escribir('marca/logo-oscuro.svg', svg('0 0 680 220', `<rect width="680" height="220" rx="32" fill="${COLOR.noche}"/><g transform="translate(36 36) scale(.289)">${azulejo()}</g><g transform="translate(210 -6) scale(1.5)">${logotipo({ letras: COLOR.crema, signo: COLOR.mandarina, sub: COLOR.mandarinaClara })}</g>`));
escribir('marca/logo-vertical.svg', svg('0 0 420 420', `<g transform="translate(130 24) scale(.3125)">${azulejo()}</g><g transform="translate(70 196) scale(.95)">${logotipo()}</g>`));
escribir('marca/logo-un-color.svg', svg('0 0 640 180', `<g transform="translate(16 16) scale(.289)">${azulejo(COLOR.tinta, COLOR.blanco)}</g><g transform="translate(190 -26) scale(1.5)">${logotipo({ letras: COLOR.tinta, signo: COLOR.tinta, sub: COLOR.tinta })}</g>`));

// La bolsa de entrega con el logo (para la ilustración de mandados y pantallas vacías), en 64×64
const bolsa64 = `<path d="M24 20c0-7.5 3.6-11.5 8-11.5s8 4 8 11.5" fill="none" stroke="${COLOR.noche}" stroke-width="3.6" stroke-linecap="round"/>` +
  `<path d="M12 20h40l-2.6 34.4a4 4 0 0 1-4 3.6H18.6a4 4 0 0 1-4-3.6Z" fill="${COLOR.mandarina}"/>` +
  `<path d="M12 20h40l-.5 6.2H12.5Z" fill="#E4580C"/>` +
  `<path fill="#fff" fill-rule="evenodd" d="${pin(32, 35.5, 7, 45.5)}${circ(32, 35.5, 2.7)}"/><path fill="#fff" d="${circ(32, 50.6, 3.6)}"/>`;

// Piezas para la app (js/marca.js)
const PIEZAS = {
  colores: COLOR,
  letras: LETRAS,
  logoVB: LOGO_VB,
  tile: svg('0 0 512 512', azulejo(), ' aria-hidden="true"').trim(),
  simbolo: MARCA,
  bolsa64,
};
escribir('js/marca.js', `/* Generado por marca/generar.js: no editar a mano. */\n(function (r) { r.MARCA = ${JSON.stringify(PIEZAS)}; })(typeof self !== 'undefined' ? self : this);\n`);
