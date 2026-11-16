# 5. Negocios (restaurantes, tiendita, farmacia, gas y agua)

## Alta y documentos

Se registran desde la app y la solicitud llega a **Admin → Personas**. No se puede aprobar mientras falte un documento.

| Giro | Documentos |
|---|---|
| Todos | INE del dueño, comprobante de domicilio, cuenta CLABE para los depósitos |
| Gas LP | Además, permiso de distribución de la CNE |
| Farmacia y agua purificada | Además, aviso de funcionamiento (Cofepris) |
| Si vende alcohol | Además, licencia para vender alcohol |

Al aprobarlo se le genera su primera mensualidad, con 5 días para pagar.

## Recibir un pedido

- Tiene **5 minutos** para contestar.
- Ve cada producto y puede marcar los que **no hay**. Lo que pasa después depende de la preferencia del cliente (ver [pedido de punta a punta](02-pedido-de-punta-a-punta.md)).
- Elige el **tiempo de preparación**: 10, 20, 30 o 45 min. Con eso se calcula la hora que se le promete al cliente.
- **Farmacia:** si el pedido trae medicamento con receta, debe revisar la foto y confirmarla antes de aceptar.
- **Rechazar** pide un motivo.
- Si no contesta a tiempo, el pedido se cancela solo. Con 2 seguidos sin respuesta, el negocio **se pausa** para no quedar mal con los clientes. Lo reactiva él mismo cuando ya está atendiendo, o lo reactiva el dueño.

## Entregar al repartidor

El botón **Entregar** solo aparece cuando el pedido está listo **y** el repartidor ya llegó. La pantalla le dice al negocio qué hacer con el dinero:

- “Cobra $130 en efectivo a Luis”, si el cliente paga en efectivo.
- “Ya está pagado: lo recibes en tu depósito de esta noche”, si pagó en línea.

**Si no puede surtir un pedido ya aceptado**, cancela con motivo. Al cliente se le devuelve todo y, si ya había repartidor asignado, el negocio le paga $15 por el viaje perdido.

## Entrega propia (gaseras y purificadoras)

1. Marcan **Salió a entregar** y después **Llegamos al domicilio**.
2. Cierran con el **código del cliente**, igual que un repartidor.
3. Cobran ellos y le deben a manda2 solo el servicio ($7), que se descuenta de sus depósitos.

**Gas LP:**
- El precio de cada cilindro no puede pasar el **precio máximo oficial por kilo** que el dueño captura cada semana en Ajustes.
- Si lo pasa, el producto se bloquea y el dueño recibe una alerta (`precioGasOk()`).
- La entrega la hace siempre la gasera con su personal.

## Herramientas del negocio

| Herramienta | Para qué |
|---|---|
| Abierto / cerrado | Dejar de recibir pedidos un rato |
| Mucha demanda | Avisar a los clientes que hoy tarda más |
| Menú | Encender o apagar productos agotados y agregar nuevos |
| Dinero | Saldo, depósito de la noche, mensualidad, anuncios, movimientos y su tasa de aceptación |

## Precio de mostrador

En manda2 el negocio cobra lo mismo que en su local. Es parte de la promesa al cliente y es posible porque no hay comisión. Si un cliente reporta precios inflados, el dueño puede hablar con el negocio y, si se repite, pausarlo.

## Mensualidad

| Día | Qué pasa |
|---|---|
| 1 del mes | Se genera la mensualidad ($399) |
| Hasta el vencimiento | Se descuenta sola del depósito si el negocio tiene ventas pagadas en línea |
| Hasta 7 días de atraso | Sigue apareciendo; el dueño ve una alerta |
| Más de 7 días de atraso | Se pausa y deja de aparecer en la app. Se reactiva solo al pagar. |

## Anuncios

| Anuncio | Precio | Dónde sale |
|---|---|---|
| Destacado | $99 por 7 días | Primero en la lista de negocios |
| Carrusel | $199 por 7 días | En el carrusel de la portada |

Se cobran del saldo del negocio. En la app siempre dicen **“anuncio”**: es más honesto y PROFECO pide transparencia.

## En la maqueta

- Cambia de negocio con el selector de arriba a la derecha.
- La opción **+ Registrar negocio** muestra el alta completa.
