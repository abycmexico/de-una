# 3. El dinero

manda2 usa un **modelo mixto**:

- **Pago en efectivo:** el repartidor le paga al negocio en la tienda y le cobra todo al cliente. El negocio tiene su dinero al momento.
- **Pago por transferencia o tarjeta:** el dinero llega a manda2, que le deposita al negocio cada noche.

Todo queda en un **libro de movimientos**: nadie tiene que acordarse de cuánto le debe a quién.

## Las fórmulas

```
Total que paga el cliente (T) = Productos (S) + Envío (E) + Lluvia (L) + Pedido pequeño (PP)
                               + Servicio (V) + Propina (P)
                               − Descuentos de manda2 (Dm) − Descuentos del negocio (Dn) − Saldo a favor (Dc)

Gana el repartidor (G)  = 85 % de E + L + PP + P + Bono
Gana el negocio         = S − Dn                   (con entrega propia: S + E + P − Dn)
Resultado de manda2     = V + 15 % de E − Dm − Bono
```

El saldo a favor (Dc) no es un costo nuevo: manda2 ya lo había contado como costo cuando lo regaló (por un reclamo o un premio de vecino).

## Cómo se mueve el dinero en cada caso

### Efectivo, con repartidor de manda2

```mermaid
sequenceDiagram
    participant R as Repartidor
    participant N as Negocio
    participant C as Cliente
    participant M as manda2
    R->>N: Paga los productos (S) al recoger
    C->>R: Paga el total (T) al recibir con su código
    Note over R,M: El repartidor se queda con lo suyo (G).<br/>Lo que cobró de más es de manda2 y queda como saldo en contra.
```

Ejemplo: Jorge compra $120 en Abarrotes Mary, con $25 de envío, $7 de servicio y $10 de propina. T = $162.

| Quién | Caja | Libro | Total |
|---|---|---|---|
| Pedro (repartidor) | −$120 a la tienda, +$162 del cliente = **+$42** | +$21.25 envío, +$10 propina, −$42 efectivo ajeno = **−$10.75** | **$31.25** (su ganancia) |
| Abarrotes Mary | +$120 | — | **$120** |
| manda2 | — | Pedro le debe $10.75 | **$10.75** ($7 de servicio + $3.75 del envío) |

### Pago en línea (transferencia o tarjeta)

```mermaid
sequenceDiagram
    participant C as Cliente
    participant M as manda2
    participant N as Negocio
    participant R as Repartidor
    C->>M: Transfiere el total con su referencia
    M-->>N: Deposita los productos (S) en el corte de la noche
    M-->>R: Paga su ganancia (G) en el corte del lunes
```

El repartidor no paga ni cobra nada. El pedido no le llega al negocio hasta que **el dinero esté en la cuenta**. No se aceptan capturas de pantalla, que son el fraude más común en México.

### Entrega propia (gas y agua)

La gasera o la purificadora cobra todo. Como el servicio de $7 es de manda2, queda en su libro y se descuenta en su siguiente depósito o con la mensualidad. Si el pago fue en línea, manda2 le deposita productos + envío + propina.

### Mandado

1. El repartidor compra con su dinero (hasta $500) y sube la foto del ticket.
2. El cliente aprueba el monto antes de que salga.
3. Al entregar, el repartidor cobra el ticket más el mandado.
4. El libro le reconoce lo que adelantó, así que solo le queda en contra la parte de manda2.

## El libro de movimientos

Cada movimiento tiene cuenta, monto, concepto y número de pedido. El signo siempre se lee desde manda2:

| Cuenta | Positivo | Negativo |
|---|---|---|
| `repa:<id>` | manda2 le debe al repartidor | El repartidor trae efectivo de manda2 |
| `neg:<id>` | manda2 le debe depositar al negocio | El negocio le debe (mensualidad, anuncios, cargos) |
| `cli:<id>` | Saldo a favor del cliente | Adeudo del cliente |
| `m2:<línea>` | Ingreso de manda2 | Costo de manda2 |

Líneas de manda2: `servicio`, `envio`, `mensualidad`, `anuncios`, `plus`, `adeudos`, `promos`, `bonos`, `garantia`, `reembolsos`.

## La regla de oro: el dinero siempre cuadra

Por cada pedido, lo que entra a la caja de manda2 menos lo que manda2 le debe a cada quien es igual a su resultado. Además:

- El repartidor siempre termina con exactamente su ganancia.
- El negocio siempre termina con exactamente su venta.

Las pruebas lo revisan pedido por pedido en todos los casos: efectivo, transferencia, entrega propia, mandado, promos, saldo a favor, cancelaciones, cliente ausente y reclamos (`cuadra()` en [`pruebas/motor.test.js`](../pruebas/motor.test.js)).

## Cortes

| Corte | Cuándo | Qué pasa |
|---|---|---|
| Negocios | Cada noche | Se deposita lo pagado en línea menos mensualidad, anuncios y cargos. Si la mensualidad estaba pendiente y alcanza, se marca como pagada. Si el saldo queda negativo, el negocio lo paga por transferencia. |
| Repartidores | Cada lunes | Si trae efectivo de manda2, lo deposita (OXXO o transferencia con su referencia `R-NOMBRE`). Si manda2 le debe, se le paga. |

## Límites de efectivo

| Regla | Monto | Para qué |
|---|---|---|
| Cliente nuevo (primeros 3 pedidos) | Compras de hasta $400 en efectivo | Que nadie pida $1,000 de comida falsa en su primera vez |
| Cualquier cliente | Compras de más de $800 se pagan por adelantado | Que el repartidor no adelante tanto dinero |
| Repartidor con más de $500 de manda2 | Solo recibe pedidos pagados en línea | Que el efectivo no se acumule en la calle |
| Repartidor con más de $800 | Se suspende hasta que deposite | Que nadie desaparezca con el dinero |
| Adelanto en mandados | Hasta $500 | Lo mismo, para mandados |

## Promociones: quién las paga

| Promo | La paga | Cuándo se registra |
|---|---|---|
| Primer envío gratis | manda2 | Al entregar. Si el pedido se cancela, la promo regresa. |
| Envío gratis de un negocio (por ejemplo, la pizzería) | El negocio | Al entregar, como cargo en su libro |
| Plus | manda2 | Al entregar |
| Invita a un vecino | manda2 ($30 + $30) | Cuando el invitado recibe su primer pedido |
| Saldo a favor por reclamo | A quien se le cargó el reclamo | Al resolverlo |

## Lo que todavía no hace el piloto

- **Pagos con tarjeta.** Están en el diseño (ver [arquitectura](08-arquitectura.md)), pero en el piloto se usan efectivo y transferencia.
- **Facturación (CFDI).**
- **Retenciones fiscales y alta en el IMSS de los repartidores.** Por ahora quedan fuera porque es un piloto; antes de crecer, hay que revisarlas con un contador (ver [reglas](09-reglas-y-cumplimiento.md)).
