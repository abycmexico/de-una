/* De Una Delivery · Generador de la marca
 *
 * Una sola fuente para el logo, el ícono de la app y las piezas que usa la app.
 * Corre con:
 *
 *   node marca/generar.js
 *
 * y escribe icons/*.svg, marca/*.svg y js/marca.js. Los PNG se sacan de los
 * SVG (en Mac: qlmanage -t -s 1024 -o marca marca/logo.svg).
 *
 * El logo: "De Una" en letra script gruesa (azul tinta), un pin naranja que
 * llega volando (las dos chispas amarillas) y un subrayado ámbar. El ícono es
 * el mismo logo sobre un azulejo amarillo, con el pin en rojo.
 * Las letras vienen ya convertidas a trazos en marca/trazos.json.
 */
const fs = require('fs');
const path = require('path');
const raiz = path.join(__dirname, '..');
const T = require('./trazos.json');

const COLOR = {
  naranja: '#FF6410', rojo: '#FF3B16', amarillo: '#FFC21A', ambar: '#FFAA14',
  tinta: '#14203F', crema: '#FBF6F3', blanco: '#FFFFFF', naranjaTexto: '#C2410C',
};
const f = (n) => Math.round(n * 100) / 100;

/* Pin (gota) con la punta abajo: centro (cx, cy), radio r y punta en ty. */
function pin(cx, cy, r, ty) {
  const d = ty - cy, b = Math.acos(r / d), tx = r * Math.sin(b), y = cy + r * Math.cos(b);
  return `M${f(cx)} ${f(ty)}L${f(cx - tx)} ${f(y)}A${r} ${r} 0 1 1 ${f(cx + tx)} ${f(y)}Z`;
}
const circ = (cx, cy, r) => `M${f(cx - r)} ${f(cy)}a${r} ${r} 0 1 0 ${f(2 * r)} 0a${r} ${r} 0 1 0 ${f(-2 * r)} 0Z`;

/* Piezas en la retícula del logo (0–512 de ancho) */
const PIN = `${pin(342, 124, 46, 214)}${circ(342, 124, 17)}`;
const PIN_T = 'rotate(8 340 140)';
const CHISPAS = 'M424 104L446 78M430 142L466 126';
const SUB = 'M164 382C236 362 342 350 436 352C450 353 452 368 440 374C420 384 404 380 380 381C306 384 240 392 182 400C162 403 150 388 164 382Z';
// Grosor extra de las letras: "De" más fino para que no se tape la "e"
const GROSOR = { de: 6, una: 13, lema: 3 };

const letras = (c) =>
  `<path fill="${c}" stroke="${c}" stroke-width="${GROSOR.de}" stroke-linejoin="round" d="${T.de}"/>` +
  `<path fill="${c}" stroke="${c}" stroke-width="${GROSOR.una}" stroke-linejoin="round" d="${T.una}"/>`;
const pinG = (c) => `<g transform="${PIN_T}"><path fill="${c}" fill-rule="evenodd" d="${PIN}"/></g>`;
const chispas = (c) => `<path d="${CHISPAS}" fill="none" stroke="${c}" stroke-width="12" stroke-linecap="round"/>`;
const sub = (c) => `<path fill="${c}" d="${SUB}"/>`;
const lema = (c) => `<path fill="${c}" stroke="${c}" stroke-width="${GROSOR.lema}" stroke-linejoin="round" d="${T.lema}"/>`;

function logo({ tinta = COLOR.tinta, pinC = COLOR.naranja, chispa = COLOR.amarillo, subC = COLOR.ambar, conChispas = true, conSub = true } = {}) {
  return letras(tinta) + pinG(pinC) + (conChispas ? chispas(chispa) : '') + (conSub ? sub(subC) : '');
}
const VB = { logo: '44 60 440 352', lema: '44 60 440 416', compacto: '44 70 420 280' };

/* Ícono: el logo sin chispas sobre amarillo, pin rojo y subrayado en tinta */
const ICONO_T = 'translate(14 28) scale(.95)';
const dentro = (escala) => `<g transform="translate(${f(256 - 256 * escala)} ${f(256 - 256 * escala)}) scale(${escala})"><g transform="${ICONO_T}">${logo({ pinC: COLOR.rojo, conChispas: false, subC: COLOR.tinta })}</g></g>`;
const azulejo = ({ fondo = COLOR.amarillo, tinta = COLOR.tinta, pinC = COLOR.rojo, subC = COLOR.tinta, rx = 114 } = {}) =>
  `<rect width="512" height="512" rx="${rx}" fill="${fondo}"/><g transform="${ICONO_T}">${logo({ tinta, pinC, subC, conChispas: false })}</g>`;

const svg = (vb, cuerpo, extra = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}"${extra}>${cuerpo}</svg>\n`;
const escribir = (rel, txt) => { fs.writeFileSync(path.join(raiz, rel), txt); console.log('escrito', rel); };

// Íconos de la app instalable
escribir('icons/icon.svg', svg('0 0 512 512', azulejo()));
escribir('icons/maskable.svg', svg('0 0 512 512', `<rect width="512" height="512" fill="${COLOR.amarillo}"/>${dentro(0.74)}`));
escribir('icons/apple.svg', svg('0 0 512 512', `<rect width="512" height="512" fill="${COLOR.amarillo}"/>${dentro(0.9)}`));

// Logos para redes, lonas e impresos
escribir('marca/logo.svg', svg(VB.logo, logo()));
escribir('marca/logo-lema.svg', svg(VB.lema, logo() + lema(COLOR.tinta)));
escribir('marca/logo-oscuro.svg', svg('14 30 500 476', `<rect x="14" y="30" width="500" height="476" rx="40" fill="${COLOR.tinta}"/>${logo({ tinta: COLOR.crema })}${lema(COLOR.crema)}`));
escribir('marca/logo-un-color.svg', svg(VB.logo, logo({ tinta: COLOR.tinta, pinC: COLOR.tinta, chispa: COLOR.tinta, subC: COLOR.tinta })));
escribir('marca/icono.svg', svg('0 0 512 512', azulejo()));
escribir('marca/icono-noche.svg', svg('0 0 512 512', azulejo({ fondo: COLOR.tinta, tinta: COLOR.crema, pinC: COLOR.naranja, subC: COLOR.amarillo })));
escribir('marca/simbolo.svg', svg('290 70 110 160', pinG(COLOR.naranja)));

// La bolsa de entrega con el pin (ilustración de mandados y pantallas vacías), en 64×64
const bolsa64 = `<path d="M24 20c0-7.5 3.6-11.5 8-11.5s8 4 8 11.5" fill="none" stroke="${COLOR.tinta}" stroke-width="3.6" stroke-linecap="round"/>` +
  `<path d="M12 20h40l-2.6 34.4a4 4 0 0 1-4 3.6H18.6a4 4 0 0 1-4-3.6Z" fill="${COLOR.naranja}"/>` +
  `<path d="M12 20h40l-.5 6.2H12.5Z" fill="#E0520A"/>` +
  `<path fill="${COLOR.amarillo}" fill-rule="evenodd" d="${pin(32, 37, 8, 50)}${circ(32, 37, 3)}"/>`;

// Piezas para la app (js/marca.js)
const PIEZAS = {
  colores: COLOR,
  trazos: { de: T.de, una: T.una, lema: T.lema },
  grosor: GROSOR,
  pin: PIN, pinT: PIN_T, chispas: CHISPAS, sub: SUB,
  vb: VB,
  tile: svg('0 0 512 512', azulejo(), ' aria-hidden="true"').trim(),
  bolsa64,
};
escribir('js/marca.js', `/* Generado por marca/generar.js: no editar a mano. */\n(function (r) { r.MARCA = ${JSON.stringify(PIEZAS)}; })(typeof self !== 'undefined' ? self : this);\n`);
