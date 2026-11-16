/* De Una Delivery · Generador de la marca
 *
 * Una sola fuente para el ícono (la bolsita feliz), el logotipo monolínea
 * "de una" y las piezas que usa la app. Corre con:
 *
 *   node marca/generar.js
 *
 * y escribe: icons/*.svg, marca/*.svg y js/marca.js. Los PNG se sacan de los
 * SVG (en Mac: qlmanage -t -s 512 -o icons icons/icon.svg).
 */
const fs = require('fs');
const path = require('path');
const raiz = path.join(__dirname, '..');

const COLOR = {
  naranja: '#EE6A1F', naranjaClaro: '#F7923A', naranjaProfundo: '#E05410', miel: '#F6A93B',
  chocolate: '#3B2416', chocolateClaro: '#5B3822', canela: '#8A4B2A', crema: '#FFF3E4', coral: '#FF8F6B',
};

/* Logotipo: letras monolínea de grosor 12 y puntas redondas, dibujadas a mano
   (no dependen de ninguna tipografía). Línea base en y=100, altura x de 40. */
const LETRAS = {
  de: '<circle cx="20" cy="80" r="14"/><path d="M34 40V94"/><path d="M53 80H81A14 14 0 1 0 70.6 93.5"/>',
  una: '<path d="M116 66V80A14 14 0 0 0 144 80M144 66V94"/><path d="M163 66V94M163 80A14 14 0 0 1 191 80V94"/><circle cx="224" cy="80" r="14"/><path d="M238 66V94"/>',
  delivery: '<path d="M0 0H5A10 10 0 0 1 5 20H0Z"/><path d="M35 0H23V20H35M23 10H32"/><path d="M43 0V20H54"/><path d="M62 0V20"/><path d="M70 0L77 20L84 0"/><path d="M104 0H92V20H104M92 10H101"/><path d="M112 20V0H118A5 5 0 0 1 118 10H112M118 10L124 20"/><path d="M132 0L139 10L146 0M139 10V20"/>',
};
const trazo = (color, w) => `fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
function logotipo({ de = COLOR.chocolate, una = COLOR.naranja, sub = COLOR.canela, conSub = true } = {}) {
  return `<g ${trazo(de, 12)}>${LETRAS.de}</g><g ${trazo(una, 12)}>${LETRAS.una}</g>` +
    (conSub ? `<g transform="translate(126 118) scale(.8)" ${trazo(sub, 4.6)}>${LETRAS.delivery}</g>` : '');
}

/* La bolsita: bolsa de papel café, con asa, borde de papel picado y carita feliz. */
function bolsita({ cuerpo = COLOR.chocolate, banda = COLOR.chocolateClaro, cara = COLOR.crema, sonrisa = COLOR.miel } = {}) {
  return `<g transform="rotate(-8 300 300)">` +
    `<path d="M238 202C238 126 362 126 362 202" fill="none" stroke="${cuerpo}" stroke-width="24" stroke-linecap="round"/>` +
    `<path d="M186 196H414L428 402Q430 428 404 428H196Q170 428 172 402Z" fill="${cuerpo}"/>` +
    `<path d="M196 252L184 398" stroke="#6E4528" stroke-width="10" stroke-linecap="round" opacity=".8"/>` +
    `<path d="M186 196H414L417 240L398 228L379 240L360 228L341 240L322 228L303 240L284 228L265 240L246 228L227 240L208 228L189 240L183 240Z" fill="${banda}"/>` +
    `<path d="M250 318Q266 298 282 318M318 318Q334 298 350 318" fill="none" stroke="${cara}" stroke-width="13" stroke-linecap="round"/>` +
    `<path d="M262 350Q300 392 338 350" fill="none" stroke="${sonrisa}" stroke-width="16" stroke-linecap="round"/>` +
    `<ellipse cx="238" cy="350" rx="16" ry="9" fill="${COLOR.coral}" opacity=".85"/><ellipse cx="362" cy="350" rx="16" ry="9" fill="${COLOR.coral}" opacity=".85"/>` +
    `</g>`;
}
const rayas = `<g stroke="${COLOR.crema}" stroke-width="22" stroke-linecap="round"><path d="M58 262H118M80 312H130M64 362H112"/></g>`;
const sombra = `<ellipse cx="306" cy="452" rx="128" ry="17" fill="#7A2E05" opacity=".22"/>`;
const destello = `<path d="M440 112l9 22 22 9-22 9-9 22-9-22-22-9 22-9z" fill="${COLOR.crema}"/>`;
const escena = rayas + sombra + bolsita() + destello;
const fondoDegradado = (id, rx) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${COLOR.naranjaClaro}"/><stop offset="1" stop-color="${COLOR.naranjaProfundo}"/></linearGradient><clipPath id="${id}c"><rect width="512" height="512" rx="${rx}"/></clipPath></defs><rect width="512" height="512" rx="${rx}" fill="url(#${id})"/><circle cx="120" cy="96" r="190" fill="#fff" opacity=".08" clip-path="url(#${id}c)"/>`;
// Para la app: sin degradados (los ids se repetirían en la página)
const fondoPlano = `<rect width="512" height="512" rx="116" fill="${COLOR.naranja}"/><path d="M116 0H330A260 260 0 0 1 0 330V116A116 116 0 0 1 116 0Z" fill="#fff" opacity=".1"/>`;

const svg = (vb, cuerpo, extra = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}"${extra}>${cuerpo}</svg>\n`;
const escribir = (rel, txt) => { fs.writeFileSync(path.join(raiz, rel), txt); console.log('escrito', rel); };

// Íconos de la app instalable
escribir('icons/icon.svg', svg('0 0 512 512', fondoDegradado('g', 116) + escena));
escribir('icons/maskable.svg', svg('0 0 512 512', fondoDegradado('m', 0) + `<g transform="translate(51 51) scale(.8)">${escena}</g>`));
escribir('icons/apple.svg', svg('0 0 512 512', fondoDegradado('a', 0) + `<g transform="translate(22 22) scale(.92)">${escena}</g>`));

// Logos para redes, lonas e impresos
escribir('marca/icono.svg', svg('0 0 512 512', fondoDegradado('i', 116) + escena));
escribir('marca/logo.svg', svg('0 0 420 150', `<g transform="translate(0 11) scale(.25)">${fondoDegradado('l', 116)}${escena}</g><g transform="translate(150 -10)">${logotipo()}</g>`));
escribir('marca/logo-oscuro.svg', svg('0 0 460 190', `<rect width="460" height="190" rx="28" fill="${COLOR.chocolate}"/><g transform="translate(20 31) scale(.25)">${fondoDegradado('o', 116)}${escena}</g><g transform="translate(170 10)">${logotipo({ de: COLOR.crema, una: COLOR.naranjaClaro, sub: COLOR.miel })}</g>`));
escribir('marca/logotipo.svg', svg('-7 33 258 104', logotipo()));
escribir('marca/bolsita.svg', svg('150 100 300 380', bolsita()));

// Piezas para la app (js/marca.js)
const MARCA = {
  colores: COLOR,
  letras: LETRAS,
  tile: svg('0 0 512 512', fondoPlano + escena, ' aria-hidden="true"').trim(),
  bolsita: svg('150 100 300 380', bolsita(), ' aria-hidden="true"').trim(),
  // La bolsita en el formato de las ilustraciones (64×64)
  bolsa64: `<g transform="translate(-30 -21) scale(.2)">${bolsita()}</g>`,
};
escribir('js/marca.js', `/* Generado por marca/generar.js: no editar a mano. */\n(function (r) { r.MARCA = ${JSON.stringify(MARCA)}; })(typeof self !== 'undefined' ? self : this);\n`);
