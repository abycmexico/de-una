# 1. Modelo de negocio

De Una es una app de pedidos hecha para una sola zona: Toscana Alta, Casas Quma, Paseos de la Pradera, Atotonilco centro y Huehuetoca centro. Junta en un lugar lo que en los fraccionamientos nuevos queda lejos: comida, tiendita, farmacia, **gas, garrafones** y mandados.

> Todos los montos de este documento son los valores por defecto del piloto. El dueño los cambia desde **Admin → Ajustes** y el motor los aplica al momento.

## La propuesta, en una frase para cada quien

| Para | La promesa | Por qué es creíble |
|---|---|---|
| **Cliente** | Lo que ocupas, a tu puerta, al mismo precio que en el local. | De Una no cobra comisión a los negocios, así que no tienen por qué subir precios. Todos los cargos se ven antes de pagar. |
| **Negocio** | Vende a domicilio sin regalar el 30 % de cada venta. | Pagas $399 al mes, vendas 10 o 500 pedidos. Te depositamos cada noche. |
| **Repartidor** | Gana en tu propio fraccionamiento, cerca de tu casa. | Te quedas con el 85 % del envío, el 100 % de la propina y los extras por lluvia y por pedido pequeño. Si el cliente no sale, se te repone todo. |
| **Socio o inversionista** | Una red local difícil de copiar: gas, agua y negocios de la zona en una sola app. | Ingreso fijo (mensualidades) más un margen por pedido. Las reglas y el dinero ya están probados en el motor. |

## Cómo gana dinero De Una

| Ingreso | Quién lo paga | Monto por defecto | Notas |
|---|---|---|---|
| Mensualidad | Negocio | $399 al mes | 0 % de comisión por pedido. Se descuenta de sus depósitos. |
| Servicio por pedido | Cliente | $7 | Se muestra en el desglose antes de pagar. |
| Parte del envío | Cliente (vía envío) | 15 % del envío | El 85 % es del repartidor. |
| De Una Plus | Cliente | $49 al mes | Envío gratis en pedidos desde $150, hasta 8 al mes. |
| Anuncios | Negocio | $99 destacado / $199 carrusel por 7 días | Siempre se marca como **anuncio**. |

Lo que **no** es ingreso de De Una, aunque lo pague el cliente:

| Cargo | A quién va |
|---|---|
| Propina | 100 % al repartidor. Es opcional. |
| Extra por lluvia ($10) | 100 % al repartidor. Se activa desde Ajustes cuando llueve o hay alta demanda. |
| Cargo por pedido pequeño ($10 si la compra es menor a $100) | 100 % al repartidor, para que el viaje le convenga. |

Lo que De Una **paga** para crecer:

| Costo | Cuándo |
|---|---|
| Promo de bienvenida | El primer envío de cada cliente nuevo (tope $45). Una vez por número, celular y dirección. |
| Invita a un vecino | $30 para cada uno cuando el invitado recibe su primer pedido. |
| Envíos de Plus | El envío completo de cada pedido con Plus. |
| Bonos a repartidores | Cuando nadie toma un pedido y el dueño sube el bono. |
| Garantía | Lo que se le repone al repartidor cuando el cliente no sale, y compensaciones por viajes cancelados. |

## Un pedido, peso por peso

Ana pide 2 órdenes de pastor en Tacos El Atlante (los dos están en Toscana Alta), paga en efectivo y deja $15 de propina. Es su primer pedido.

| Concepto | Monto |
|---|---|
| Productos | $130 |
| Envío (mismo fraccionamiento) | $25 |
| Servicio | $7 |
| Propina | $15 |
| Bienvenida: primer envío gratis | −$25 |
| **Total que paga Ana** | **$152** |

| Quién | Recibe | Cómo |
|---|---|---|
| Tacos El Atlante | $130 | En efectivo, del repartidor, al entregarle la bolsa |
| Luis (repartidor) | $36.25 | $21.25 del envío (85 %) + $15 de propina |
| De Una | −$14.25 | $7 de servicio + $3.75 del envío − $25 de la promo |

En un pedido normal, sin promo, De Una gana **$7 + 15 % del envío**: entre $10.75 y $13.75 por pedido.

## Por qué al negocio le conviene

| Ventas por app al mes | Comisión de 27 % (apps grandes) | De Una | Ahorro |
|---|---|---|---|
| $1,500 | $405 | $399 | $6 |
| $5,000 | $1,350 | $399 | $951 |
| $15,000 | $4,050 | $399 | $3,651 |

Desde unos $1,500 al mes de ventas por la app, De Una ya le sale más barato que una app con comisión, y la diferencia crece con cada venta. El ejemplo usa 27 %, a la mitad del rango de 22–30 % + IVA reportado en México (ver [benchmark](00-benchmark-de-la-zona.md)).

## De Una Plus: cuánto cuesta y por qué vale

Cada envío gratis le cuesta a De Una el envío completo: el 85 % que se le paga al repartidor más el 15 % que deja de ganar.

| Envíos gratis que usa el cliente al mes | Costo para De Una (envío de $25) | Paga el cliente | Servicio que sigue cobrando De Una | Resultado |
|---|---|---|---|---|
| 2 | $50 | $49 | $14 | +$13 |
| 4 | $100 | $49 | $28 | −$23 |
| 8 (tope) | $200 | $49 | $56 | −$95 |

Plus es una herramienta de lealtad: la persona que paga Plus pide más seguido y en pedidos más grandes (mínimo $150). Hay que vigilar el uso promedio; si pasa de 3 envíos al mes, sube el mínimo a $200 o baja el tope a 6. Todo se cambia desde Ajustes.

## Escenario del piloto (no es promesa, es para planear)

Supuestos al mes 3: 25 negocios pagando, 40 pedidos al día, envío promedio de $30, ticket de $180, 60 clientes con Plus que usan 3 envíos al mes, 6 anuncios por semana y 150 clientes nuevos al mes.

| Línea | Cálculo | Al mes |
|---|---|---|
| Mensualidades | 25 × $399 | $9,975 |
| Servicio | 1,200 pedidos × $7 | $8,400 |
| Parte del envío | 1,200 × 15 % × $30 | $5,400 |
| Plus | 60 × $49 | $2,940 |
| Anuncios | 6 × $99 × 4.3 semanas | $2,554 |
| **Ingresos** | | **$29,269** |
| Promo de bienvenida | 150 × $30 | −$4,500 |
| Envíos de Plus | 60 × 3 × $30 | −$5,400 |
| Garantías y reembolsos | 1 % de lo vendido ($216,000) | −$2,160 |
| **Resultado antes de gastos fijos** | | **$17,209** |

Los gastos fijos (servidor, mensajes de WhatsApp, publicidad, tu tiempo) van aparte. La línea que más mueve el resultado es el número de negocios que pagan la mensualidad.

## Cómo convencer a cada uno (guion corto)

**Al negocio:**
> “¿Cuánto le pagaste a Rappi o DiDi el mes pasado? Con De Una pagas $399 fijos, sin comisión. Te llegan pedidos de tus vecinos de Toscana y Quma, cobras lo mismo que en tu mostrador y te depositamos cada noche lo que se pagó en línea. Si no te funciona, cancelas.”

**Al repartidor:**
> “Repartes en tu propio fraccionamiento. Te quedas con el 85 % del envío y toda la propina. Si llueve, el extra es tuyo. Si el cliente no sale, esperas 10 minutos, le llamas dos veces y te reponemos todo. Sin el código del cliente no se cierra el pedido, así que nadie puede decir que no llegó.”

**Al cliente:**
> “Tacos, tiendita, farmacia, gas y garrafones, sin salir del fracc. Mismo precio que en el local, todos los cargos a la vista y tu primer envío gratis. Invita a un vecino y ganan $30 cada uno.”

## Qué medir en el piloto

| Métrica | Meta del piloto | Dónde se ve |
|---|---|---|
| Negocios pagando | 25 al mes 3 | Admin → Dinero |
| Pedidos al día | 40 al mes 3 | Admin → En vivo |
| Tiempo promedio de entrega | Menos de 40 min | Motor: `kpis()` |
| Pedidos cancelados | Menos de 8 % | Motor: `kpis()` |
| Negocios que contestan a tiempo | Más de 95 % | Panel de cada negocio |
| Reclamos por cada 100 pedidos | Menos de 3 | Admin → Pedidos → Reclamos |
| Efectivo en la calle | Menos de $500 por repartidor | Admin → Dinero |
