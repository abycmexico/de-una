# 6. Antifraude: qué puede salir mal y cómo lo frenamos

Cada control está en el motor ([`js/motor.js`](../js/motor.js)) y casi todos tienen una prueba en [`pruebas/motor.test.js`](../pruebas/motor.test.js). Los montos se cambian en **Admin → Ajustes**.

## Clientes

| Fraude o problema | Cómo lo frenamos | Dónde |
|---|---|---|
| Pedido falso o de broma (nadie sale a recibir) | Teléfono verificado con código. En los primeros 3 pedidos, efectivo solo para compras de hasta $400. Espera de 10 min y 2 llamadas registradas. Si no sale: adeudo, solo pago por adelantado y dirección marcada. | `nivelCliente()`, `cliente_ausente` |
| Captura de transferencia falsa | El pedido no se manda al negocio hasta que el dinero **llega a la cuenta**. Ninguna pantalla acepta capturas. A los 15 min sin pago, se cancela solo. | `confirmar_pago` solo para el sistema o el admin |
| Abusar del primer envío gratis con otra cuenta | La promo se amarra al número, al celular **y** a la dirección. Una segunda cuenta en la misma casa o el mismo celular no la recibe. | `bienvenidaElegible()` |
| Varias cuentas en un celular | Alerta al dueño y más puntos de riesgo en cada pedido. Con riesgo alto, el efectivo se apaga. | `riesgo()`, `alertas()` |
| “No me llegó” cuando sí llegó | El pedido se cierra con el código del cliente. El reclamo sale marcado: “se entregó con el código del cliente”. | `abrirIncidencia()` |
| Reclamar siempre para sacar saldo | Foto obligatoria para faltantes, equivocados o en mal estado. Plazo de 24 h. Desde el tercer reclamo en 30 días, sale como sospechoso. | `abrirIncidencia()` |
| Invitarse a sí mismo (premio de vecino) | El código no vale para alguien con el mismo celular o la misma dirección. El premio llega hasta que el invitado **recibe** su primer pedido. Máximo 10 invitaciones al mes. | `usarCodigoVecino()`, `premioVecino()` |
| Cancelar cuando el negocio ya cocinó | Si pagó en línea, el negocio cobra el 50 % de los insumos. En efectivo, cuenta como cancelación tardía; con 2, solo puede pagar por adelantado. | `politicaCancelacion()` |
| Billetes falsos o falta de cambio | El cliente dice con cuánto paga y el repartidor lleva cambio. Compras de más de $800 se pagan por adelantado. | `pagaCon`, `efectivoMax` |
| Menores comprando alcohol | Confirma su edad al pedir y el repartidor revisa la INE al entregar. Sin esa revisión no se cierra el pedido. Ley seca y horario límite desde Ajustes. | `alcoholPermitido()`, `entregar` |
| Antibióticos sin receta | No se venden por la app (solo en mostrador). Para los medicamentos que piden receta, la farmacia revisa la foto antes de aceptar. | `productoVendible()`, `aceptar` |

## Repartidores

| Fraude o problema | Cómo lo frenamos | Dónde |
|---|---|---|
| Marcar entregado sin entregar | Sin el código del cliente no se cierra. Con 3 errores, alerta al dueño. | `entregar` |
| Quedarse con el efectivo | Con más de $500 de manda2 ya no recibe pedidos en efectivo; con más de $800 se suspende. Corte semanal con referencia. | `candidatos()`, `revisarCuentas()` |
| Inflar el ticket de un mandado | Foto obligatoria y el cliente aprueba el monto **antes** de que salga. Tope de $500. | `enviar_ticket`, `aprobar_ticket` |
| Inventar que el cliente no salió | Se registra la hora de llegada y cada llamada. No se puede marcar antes de 10 min ni sin 2 llamadas. El caso lo revisa el dueño. | `cliente_ausente` |
| Prestar la cuenta a otra persona | Selfie comparada con la INE al registrarse. A futuro, selfie al conectarse. | Alta, [arquitectura](08-arquitectura.md) |
| Aceptar y abandonar viajes | Su tasa de aceptación baja y eso lo manda al final de la fila. Si suelta un viaje, se le ofrece a otro. | `candidatos()`, `soltar` |
| Abrir la comida | Bolsa cerrada con el número de pedido; el cliente lo reporta con foto. | Reclamos |

## Negocios

| Fraude o problema | Cómo lo frenamos | Dónde |
|---|---|---|
| Pedirse a sí mismo para cobrar promos | Las promos se amarran a celular y dirección, y las del negocio las paga el propio negocio. | `bienvenidaElegible()`, `Dn` |
| Subir precios en la app | Política de precio de mostrador (sin comisión no hay motivo). Reporte del cliente y pausa si se repite. | [Negocios](05-negocios.md) |
| No contestar pedidos | Se cancela a los 5 min; con 2 seguidos, el negocio se pausa. | `revisarTiempos()` |
| No pagar la mensualidad | Se descuenta de sus depósitos. Con más de 7 días de atraso, se pausa. | `estadoMensualidad()` |
| Gas arriba del precio oficial | El producto se bloquea y el dueño recibe una alerta. | `precioGasOk()` |
| Vender sin permisos | Documentos obligatorios por giro antes de aprobar. | `docsRequeridos()` |

## Dentro de manda2 (operadores)

| Riesgo | Control | Dónde |
|---|---|---|
| Un operador regala saldo de más | Puede devolver hasta $100; más lo aprueba el dueño. | `resolverIncidencia()` |
| Cambios sin rastro | Todo cambio de ajustes, pago, depósito, asignación o autorización queda en la **bitácora** con hora y quién. | `bit()` |
| Cambiar tarifas o límites | Solo el dueño. | Admin → Ajustes |

## Riesgo por pedido

Cada pedido recibe un nivel de riesgo (`riesgo()`), que el dueño ve en el panel:

| Señal | Puntos |
|---|---|
| Cliente nuevo pagando en efectivo | 1 |
| Celular con 3 o más cuentas | 2 |
| 2 o más reclamos en 30 días | 2 |
| Dirección con un pedido no recibido | 3 |
| Más de $600 en efectivo | 1 |
| De noche (22:00 o más tarde), cliente nuevo, en efectivo | 1 |

Con 1 o 2 puntos el riesgo es **medio** y solo se muestra. Con 3 o más es **alto** y el efectivo se apaga: se paga por adelantado.
