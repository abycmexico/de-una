# 7. El panel del dueño

El panel está pensado para que una sola persona opere la zona desde el celular: lo que necesita atención sale primero, y cada alerta trae el botón para resolverla.

## Pantallas

### En vivo
- **Números del día:** pedidos, ventas de los negocios, lo que ganó De Una con pedidos y el efectivo que hay en la calle.
- **Atiende esto:** las alertas, de la más grave a la menos grave (ver abajo).
- **En curso:** cada pedido activo con su estado, el repartidor y su nivel de riesgo.

### Pedidos
- **Filtros:** activos, reclamos, terminados y todos.
- **Detalle de cada pedido:**
  - Datos del cliente y su nivel de confianza.
  - Código de entrega e intentos fallidos.
  - Motivos de riesgo.
  - Línea de tiempo (quién hizo qué y a qué hora).
  - Desglose del cobro.
  - **Cómo se movió el dinero** (quién le pagó a quién) y el **libro de movimientos** de ese pedido.
- **Acciones:** confirmar transferencia, subir bono, asignar repartidor (con la lista de candidatos y por qué cada uno está o no disponible), autorizar sin código y cancelar con motivo.
- **Reclamos:** decidir si procede, cuánto devolver, cómo (saldo o transferencia) y quién lo paga (De Una, el negocio o el repartidor). En los casos de cliente ausente se puede confirmar o perdonar el adeudo.

### Dinero
- **Resultado de De Una:** cada ingreso y cada costo.
- **Efectivo en la calle**, por pagar a repartidores, por depositar a negocios y por cobrar a negocios.
- **Corte de repartidores:** registrar depósitos y pagos.
- **Depósitos y cobros a negocios**, con el estado de su mensualidad.

### Personas
- **Solicitudes:** documentos recibidos y faltantes. No se puede aprobar si falta algo.
- **Clientes:** nivel de confianza, pedidos, pedidos no recibidos, reclamos y cuentas en el mismo celular. Se puede bloquear, desbloquear o volver a permitir el efectivo.
- **Repartidores:** en línea, calificación, aceptación, entregas y efectivo. Se pueden conectar y desconectar.
- **Negocios:** abierto o pausado, mensualidad, servicio y anuncios. Se pueden reactivar.

### Ajustes
- Elegir si entras como **Dueño** u **Operador**.
- **Operación del día:** lluvia, ley seca y la promo de bienvenida.
- **Tarifas:** envíos por zona, mandado, servicio, parte del repartidor, pedido pequeño y lluvia.
- **Ingresos:** mensualidad, anuncios, Plus, premio de vecino y precio máximo del gas.
- **Límites antifraude:** efectivo de clientes nuevos, efectivo máximo, efectivo del repartidor, suspensión, adelanto de mandados, devolución máxima del operador y pago por cancelación tardía.
- **Bitácora.**

## Alertas

| Alerta | Cuándo sale | Qué puedes hacer |
|---|---|---|
| El negocio no responde | A los 3 min de un pedido nuevo | Llamarle o cancelar |
| Pedido sin repartidor | A los 5 min buscando | Subir el bono $10 o asignar a mano |
| Pago sin llegar | A los 10 min de una transferencia | Confirmarlo si ya está en el banco |
| Pedido atrasado | 10 min después de la hora prometida | Ver el pedido |
| Código equivocado 3 veces | Al tercer intento fallido | Autorizar sin código (tras llamar al cliente) o cancelar |
| Reclamo por resolver | Al abrirse un reclamo | Resolver |
| Cliente no recibió su pedido | Cuando se marca un cliente ausente | Confirmar o perdonar el adeudo |
| Repartidor con mucho efectivo | Cuando llega al 80 % del límite | Registrar su depósito |
| Mensualidad vencida | Desde el primer día de atraso | Registrar el pago |
| Negocio pausado | Cuando no contestó 2 pedidos seguidos | Reactivar después de hablar con él |
| Gas arriba del máximo | Si un precio pasa el tope oficial | Pedirle a la gasera que lo corrija |
| Varias cuentas en un celular | Con 3 o más cuentas | Revisar a esos clientes |

## Dueño y operador

| Puede… | Dueño | Operador |
|---|---|---|
| Atender pedidos, asignar, subir bono, cancelar | Sí | Sí |
| Resolver reclamos | Sí | Sí, hasta $100 |
| Registrar pagos, depósitos y cortes | Sí | No |
| Cambiar tarifas, límites y promos | Sí | No |
| Bloquear clientes | Sí | Sí |
| Volver a permitir el efectivo a un cliente | Sí | No |

Todo queda en la **bitácora** con hora y quién lo hizo, incluidas las acciones automáticas del sistema (pausas, suspensiones, reactivaciones).

## El reloj de la demo

Sirve para probar lo que pasa con el tiempo sin tener que esperar: avanza 1, 5 o 10 minutos y el motor aplica todos los tiempos límite. En la app real ese reloj es el reloj del servidor (ver [arquitectura](08-arquitectura.md)).
