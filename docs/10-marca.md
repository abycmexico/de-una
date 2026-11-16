# 10. La marca

<img src="../marca/logo.png" alt="De Una Delivery" width="420">

**De Una Delivery.** El nombre viene de “¡de una!”: rápido, sin rodeos y con buena actitud. Es lo que dices cuando se te antoja algo y lo quieres ya.

## El ícono: la bolsita feliz

<img src="../marca/icono.png" alt="Ícono de De Una Delivery" width="160">

- **Una bolsa de papel café** con el borde picado: el pedido, recién salido del negocio de la esquina.
- **Carita contenta** (ojos cerrados de gusto, cachetes coral y sonrisa color miel): así llega tu pedido y así te sientes cuando llega.
- **Rayas de velocidad** a la izquierda y un **destello**: va de prisa, ¡de una!
- **Fondo naranja** en un cuadro redondeado, listo para la pantalla del celular.

Se distingue de Rappi (bigote, coral y blanco), de DiDi (una “D” naranja) y de Uber Eats (letras en negro y verde) porque usa **café como color principal** junto al naranja, y una mascota en lugar de una letra.

## El logotipo

Las letras de “de una” están **dibujadas a mano** con trazos redondos del mismo grosor, así que no dependen de ninguna tipografía. “de” va en chocolate y “una” en naranja; abajo, **DELIVERY** en letras pequeñas color canela.

| Versión | Archivo | Úsala en |
|---|---|---|
| Logo con ícono | `marca/logo.svg` / `marca/logo.png` | Fondos claros: lonas, volantes, documentos |
| Logo sobre chocolate | `marca/logo-oscuro.svg` / `marca/logo-oscuro.png` | Fondos oscuros, redes sociales, playeras |
| Solo letras | `marca/logotipo.svg` | Cuando el ícono ya aparece cerca |
| Ícono | `marca/icono.svg` / `marca/icono.png` | Foto de perfil, la app, sellos |
| Mascota sola | `marca/bolsita.svg` | Stickers, bolsas, ilustraciones |

Todo sale de un solo script: si cambias un color en `marca/generar.js` y corres `node marca/generar.js`, se actualizan el ícono de la app, los logos y las piezas que usa la app.

**No hagas esto:** estirar el logo, cambiarle los colores a otros que no sean los de abajo, ponerlo sobre fondos naranjas sin el ícono, o escribir “de una” con otra letra.

## Colores

| Nombre | Hex | Para qué |
|---|---|---|
| Naranja | `#EE6A1F` | Botones, lo que se puede tocar, acentos |
| Naranja claro | `#F7923A` | Degradados, el código de entrega |
| Miel | `#F6A93B` | Promociones, la sonrisa |
| Canela | `#8A4B2A` | Textos secundarios de marca, “DELIVERY” |
| Chocolate | `#3B2416` | Encabezados, la bolsita, fondos importantes |
| Casi negro café | `#2A170C` | Texto principal y texto sobre naranja |
| Crema | `#FBF4EC` | Fondo de la app |

**Reglas de contraste:**
- Sobre naranja, el texto va en **café oscuro**, no en blanco: se lee mejor (4.6:1) y nos distingue.
- Sobre chocolate, el texto va en **crema**.
- Para texto naranja pequeño sobre blanco se usa `#B5470C`, que es más oscuro.

La app tiene **modo oscuro** con fondos chocolate y el mismo naranja.

## Tipografía

- **Títulos:** Bricolage Grotesque (700–800), con personalidad y fácil de leer.
- **Texto:** Figtree (400–800), clara en pantallas chicas.
- **Logotipo:** dibujado a mano, no usa tipografía.

## Ilustraciones

Todas las ilustraciones (comida, tiendita, farmacia, gas, garrafón, moto, regalos) son propias, en estilo plano y cálido, con un **borde blanco de estampa** y una sombra suave. Eso las hace reconocibles y les da un toque de sticker que va con la mascota. Viven en `ilustraciones.js`; el borde lo pone el filtro `#sticker` de `index.html`.

Los íconos de la interfaz (inicio, buscar, pedidos, cuenta…) son de línea con un **relleno suave**. Cuando están activos, el relleno se vuelve naranja y aparece una píldora detrás.

## Tono de voz

- Cercano y directo, como un vecino que te hace el paro: “¿Se te antojó? ¡De una!”.
- Claro con el dinero: todos los cargos a la vista, sin letras chiquitas.
- Nunca regañón: los límites se explican con el motivo (“En tus primeros 3 pedidos el efectivo es para compras de hasta $400”).

## Pendiente antes de lanzar

- **Buscar la marca** en el IMPI antes de imprimir lonas, y registrarla. Ojo: en Ecuador existe una app de pagos llamada *Deuna*.
- Registrar los usuarios en redes sociales (por ejemplo, @deunadelivery) y el dominio.
