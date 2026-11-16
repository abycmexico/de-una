# 0. Benchmark de la zona y la competencia

> Investigación del 16 de noviembre de 2026. Es la base de las decisiones de diseño de manda2.


Fecha: 16 nov 2026. Fuentes al final.

## 1. La zona

- **Atotonilco de Tula duplicó su población en 10 años**: 31,078 habitantes en 2010 y 62,470 en 2020 (+101 %). Casi todo ese crecimiento viene de fraccionamientos nuevos de vivienda económica (departamentos y casas de $400 a $650 mil, crédito Infonavit).
- **Del lado de Huehuetoca** (Edomex) están Casas Quma, Santa Teresa y El Dorado. La prensa los describe como fraccionamientos que crecieron más rápido que sus servicios: poco comercio, alumbrado y transporte.
- Fraccionamientos a cubrir (por confirmar en campo): **Toscana Alta, Casas Quma, Paseos de la Pradera, Atotonilco centro, Huehuetoca centro**. Ojo: se escribe *Quma*, no *Cuma*.
- **Rappi, DiDi Food y Uber Eats no publican cobertura** para Atotonilco de Tula ni Huehuetoca. Su cobertura es por polígonos. Hay que probar en campo con una dirección de cada fraccionamiento; lo más probable es que no lleguen o que haya muy pocos negocios.

**Qué significa para manda2**
1. El cliente típico es una familia joven que compró con crédito, trabaja fuera (CDMX, Tula, Huehuetoca, parque industrial) y regresa tarde. Está acostumbrada a pedir por WhatsApp y a Mercado Libre o Amazon, y muchos ya usaron Rappi o DiDi en la ciudad.
2. Lo que más le duele es la **distancia a todo**: gas, garrafón, farmacia y tiendita. Por eso gas y agua van en la portada, no escondidos.
3. Se paga mucho en efectivo y transferencia, así que la tarjeta puede esperar.
4. La señal es inestable en algunas zonas. Por eso conviene una app ligera e instalable desde el navegador (PWA), sin descargar 150 MB de la App Store.

## 2. La competencia

| | Rappi | DiDi Food | Uber Eats | **manda2** |
|---|---|---|---|---|
| Color | Coral / naranja | Naranja | Verde y negro | **Naranja + amarillo** |
| Comisión al restaurante | ~22–30 % + IVA | 30 % + IVA (bajó a 22 % en un acuerdo temporal) | Caso por caso, 15–30 % | **0 %, $399 al mes** |
| Gancho para el nuevo usuario | Cupones y Rappi Prime | Cupón de $100–150 en el primer pedido, envío gratis sin mínimo | $100 en el primer pedido con código | **Primer envío gratis + $30 al invitar a un vecino** |
| Gas y garrafones | No | No | No | **Sí, con aliados** |
| Mandados libres | Sí ("Rappi favor") | No | No | **Sí** |
| Cobertura en la zona | No confirmada | No confirmada | No confirmada | **Hecha para la zona** |

### Cómo se anuncian
- **Precio por delante:** "envío gratis", "$100 en tu primer pedido", "2x1". DiDi ganó México en 2019 con envíos de $10–18 y cupones en el lanzamiento.
- **Fechas y temporadas:** el Mundial 2026, "Viva México", "comida gratis los viernes de octubre", alianzas con marcas (OXXO, Starbucks).
- **Links de cupón que se comparten** en Promodescuentos, grupos de Facebook y WhatsApp. La gente caza cupones.
- **Tono:** cercano, con humor y memes, frases cortas ("¿Antojo? Pídelo").
- **Para negocios:** prometen ventas extra, y el pleito público es por las comisiones. Ahí manda2 tiene su mejor argumento.

### Lógica de app que el usuario ya conoce (y que copiamos para que no tenga que aprender nada)
1. **Arriba la dirección** ("Entregar en ▾") y un buscador grande.
2. **Iconos de categorías** en una fila (Restaurantes, Súper, Farmacia…).
3. **Carrusel de promociones** y un "Para ti" o "Lo más pedido".
4. **Tarjetas de negocio** con foto, ⭐, tiempo y costo de envío, y etiquetas ("Envío gratis", "Nuevo").
5. **Botón flotante del carrito** con el total.
6. **Pago:** dirección, forma de pago, **propina para el repartidor** (botones $0/$10/$15/$20, y el 100 % es para él), cupón y desglose.
7. **Seguimiento** con mapa, foto o nombre del repartidor, botón para escribirle y tiempo estimado.
8. **Calificar** al terminar.
9. **Barra inferior:** Inicio, Buscar, Pedidos, Cuenta.
10. **Bienvenida:** 3 pantallas que explican la app, luego registro con número y código de verificación. Nada de contraseñas.

## 3. Decisiones para manda2

1. **Color naranja de comida** con amarillo para promociones y café oscuro para el texto. Se siente "antojo" sin copiar el coral de Rappi.
2. **Misma lógica que Rappi y DiDi** (la lista de arriba), para que el nuevo usuario la use sin pensar.
3. **Gas y agua en la portada**, con botón grande. Es lo que ninguna otra app tiene en la zona.
4. **Promo de bienvenida:** primer envío gratis (lo absorbe manda2, ~$25 por cliente) y **"Invita a un vecino: $30 para los dos"**. Es más barato que los $100–150 de DiDi y crece por grupos de WhatsApp del fraccionamiento.
5. **App instalable (PWA):** se abre con un link, sale el aviso "Agrega manda2 a tu inicio" y queda con su ícono como cualquier app, sin App Store ni Play Store.
6. **Mensaje para negocios:** "Vende sin que te quiten el 30 %". Es el dolor número uno de los restaurantes con las apps grandes.

## 4. Ideas de publicidad para el lanzamiento
- Lona y volante con QR en la entrada de cada fraccionamiento: **"¿Se te acabó el gas? Pídelo desde tu celular. Primer envío gratis."**
- Publicaciones en los grupos de Facebook y WhatsApp de vecinos de cada fraccionamiento, con un código por fraccionamiento (TOSCANA, QUMA) para medir de dónde llegan.
- Reels cortos con humor local ("Cuando vives en Toscana Alta y el tianguis es hasta el domingo").
- Promos de temporada: Mundial, quincena y "Viernes de antojo".
- Para negocios: visita en persona con la calculadora "Esto le pagaste a Rappi este mes vs. $399".

## Fuentes
- DataMéxico, Atotonilco de Tula: https://www.economia.gob.mx/datamexico/es/profile/geo/atotonilco-de-tula
- Citypopulation, Atotonilco de Tula: https://citypopulation.de/en/mexico/admin/hidalgo/13013__atotonilco_de_tula
- Posta, fraccionamientos sin servicios en Edomex: https://www.posta.com.mx/edomex/expansion-inmobiliaria-sin-regulacion-en-edomex-fraccionamientos-que-surgen-sin-servicios-/vl2078720
- Vivanuncios, departamento en Toscana Alta: https://www.vivanuncios.com.mx/a-venta-departamento/fraccionamiento-paseos-de-la-pradera/departamento-en-primer-piso-en-toscana-alta-acepto-infonavit/146360107
- Chilango, costo real de pedir por app: https://www.chilango.com/comida/comida-a-domicilio-en-cdmx-2/
- Mercado Pago, comparativa de apps de delivery: https://www.mercadopago.com.mx/blog/comparativa-apps-delivery-food-trucks
- El CEO, baja de comisiones: https://elceo.com/tecnologia/baja-de-comisiones-de-apps-de-delivery-llega-tarde-y-es-insuficiente-restaurantes/
- Xataka, cupón Uber Eats: https://www.xataka.com.mx/seleccion/cupon-uber-eats-diciembre-2025-100-pesos-regalo-mexico-para-comida-a-domicilio
- Expansión, lanzamiento de DiDi Food: https://expansion.mx/tecnologia/2019/11/06/didi-food-arranca-con-descuentos-sus-operaciones-cmdx
- Expansión, envío de DiDi a $10: https://expansion.mx/tecnologia/2019/12/12/didi-food-baja-el-precio-de-entrega-a-10-pesos
- Expansión, Mundial y delivery: https://expansion.mx/tecnologia/2026/05/20/consumo-futbolero-dispara-160-pedidos-de-cerveza-delivery
- Promodescuentos, cupones de DiDi Food: https://www.promodescuentos.com/ofertas/didi-food-nuevo-cupon-de-envio-gratis-30-pesos-de-descuento-en-tu-pedido-sin-minimo-de-compra-1181852
- Forbes, apps mexicanas contra DiDi, Uber Eats y Rappi: https://www.forbes.com.mx/negocios-25-apps-mexicanas-preparan-su-debut-para-competir-con-didi-food-uber-eats-y-rappi/
- Rappi, comunicado sobre propinas: https://caracoltv.brightspotcdn.com/30/da/49d9f1ab406c882d232ceb507834/rappi-statement-huelga-repartidores-barranquilla-2-de-marzo-de-2022.docx.pdf
