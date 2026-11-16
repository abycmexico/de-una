# 4. Repartidores

## Alta

1. Se registran desde la app: nombre, zona donde viven, vehículo y documentos.
2. Documentos que se piden (`docsRequeridos()`):
   - **Siempre:** INE y una selfie que se compara con la INE, para que nadie preste su cuenta.
   - **En moto o auto, además:** licencia de manejo y tarjeta de circulación.
3. La solicitud llega a **Admin → Personas → Solicitudes**. El sistema **no deja aprobar** mientras falte un documento. El dueño puede pedir lo que falta por WhatsApp.
4. Antes de aprobar, se les llama.

## Cómo se asigna un viaje

Cuando el negocio acepta un pedido, el motor arma la lista de candidatos (`candidatos()`) y le ofrece el viaje al mejor.

**Quedan fuera:**

| Motivo | Por qué |
|---|---|
| Desconectado | No está trabajando |
| Suspendido | Trae más de $800 de efectivo sin entregar |
| Ocupado | Ya tiene un pedido (en el piloto, uno a la vez) |
| Trae más de $500 de efectivo | Solo recibe pedidos pagados en línea |
| Ya rechazó este pedido | No se le vuelve a ofrecer, salvo que el dueño suba el bono |

**Entre los que quedan, gana el de menos puntos:**

```
puntos = distancia × 30 + (5 − calificación) × 20 + (1 − aceptación) × 20 + entregas de hoy × 2
```

- **Distancia:** 0 si es de la misma zona que el negocio, 1 si es una zona vecina y 2 si es hacia o desde Huehuetoca centro.
- **Calificación y aceptación:** premian al que trabaja bien.
- **Entregas de hoy:** reparten el trabajo para que no se lo lleve todo el mismo.

## La oferta

- El repartidor ve cuánto gana (desglosado), de dónde a dónde va y qué pasa con el dinero:
  - “Pagas $130 en la tienda y cobras $147 al cliente.”
  - “Ya está pagado: no pagas ni cobras nada.”
- Tiene **1 minuto** para aceptar. Si no contesta o rechaza, pasa al siguiente.
- Su tasa de aceptación baja y eso pesa en futuras asignaciones.
- Si nadie lo toma en 5 minutos, el dueño recibe una alerta y puede:
  - **Subir el bono** ($10 por defecto, lo paga manda2). Se le vuelve a ofrecer a todos, incluso a quien ya había rechazado.
  - **Asignar a mano.**

## El viaje

1. **Llegué a la tienda.** Desde ese momento la tienda puede entregarle.
2. Pide el pedido por número y nombre del cliente. Si el cliente pagó en efectivo, **paga los productos en la tienda**. Revisa que la bolsa venga cerrada.
3. La tienda confirma la entrega desde su app.
4. **Llegué al domicilio.** Al cliente le llega el aviso.
5. Escribe el **código del cliente**. Si el pedido trae alcohol, además confirma que revisó su INE.
6. Si el cliente no sale: llama 2 veces desde la app, espera 10 minutos y marca **“El cliente no sale”**. Se le repone lo que pagó en tienda y se le paga el viaje.

Puede **soltar el viaje** antes de recoger el pedido (por ejemplo, si se le ponchó la llanta). Se le ofrece a otro y su aceptación baja.

## Lo que gana

| Concepto | Para el repartidor |
|---|---|
| Envío | 85 % |
| Extra por lluvia | 100 % |
| Cargo por pedido pequeño | 100 % |
| Propina | 100 % |
| Bono de manda2 | 100 % |
| Viaje cancelado cuando ya iba en camino | $15 de compensación |
| Cliente que no sale | Se le repone la compra y se le paga el viaje |

En **Repartidor → Dinero** ve lo que ganó hoy, cuánto le debe manda2 o cuánto efectivo trae de manda2, y cada movimiento.

## Mandados

1. El cliente escribe qué necesita, dónde y cuánto cree que cueste (máximo $500 en el piloto).
2. El repartidor compra con su dinero y sube la foto y el total del ticket.
3. El cliente lo aprueba antes de que salga. Si no está de acuerdo, se abre un reclamo y manda2 lo revisa.
4. Al entregar, cobra el ticket más el mandado.

## En la maqueta

- **Luis** lo manejas tú.
- **Pedro y Memo** son simulados: aceptan solos y avanzan un paso por cada minuto del reloj de la demo.
- Desde **Admin → Personas → Repartidores** puedes conectarlos o desconectarlos para probar qué pasa cuando no hay nadie.
