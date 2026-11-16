# 8. Arquitectura

## Hoy: la maqueta

```
index.html          La página: estilos y esqueleto (PWA instalable)
ilustraciones.js    Ilustraciones propias (sin emojis)
js/motor.js         TODAS las reglas del negocio, sin pantallas
js/datos.js         Datos de ejemplo, generados pasando pedidos por el motor
js/app.js           Pantallas: dibujan y preguntan al motor
pruebas/            Pruebas automáticas del motor (node --test)
manifest.webmanifest, sw.js, icons/   Lo que la hace instalable y que funcione con mala señal
docs/               Esta documentación
```

Las tres reglas de diseño que hacen que esto escale:

1. **El motor manda.** Las pantallas nunca deciden si algo se puede hacer: llaman a `Motor.validar()` y muestran el motivo. Así una regla nueva se cambia en un solo lugar y no hay pantallas que se contradigan.
2. **Cada acción es una transición.** Todo cambio de un pedido pasa por `Motor.ejecutar(W, pedido, acción, quién, datos)`. Esa misma función será la del servidor.
3. **El dinero es un libro.** Nunca se guarda “cuánto debe Luis”: se guardan movimientos y el saldo se calcula. Así siempre se puede auditar de dónde salió cada peso.

El mundo `W` del motor ya tiene la forma de las tablas de la base de datos.

## Mañana: la app real (Supabase)

Se usaría Supabase, como en el portal de clientes de Abyc: base de datos Postgres, inicio de sesión por teléfono, tiempo real y funciones en el servidor.

### Tablas

| Tabla | Campos principales | Viene de |
|---|---|---|
| `zonas` | nombre, es_lejana | `config.zonas` |
| `config` | clave, valor (JSON), cambiado_por, cambiado_en | `W.config` |
| `clientes` | id (= usuario de auth), nombre, telefono, zona, direccion, dispositivo, pedidos_ok, no_shows, cancel_tardias, bloqueado, plus_activo, plus_envios_mes, referido_por, bienvenida_usada | `W.clientes` |
| `negocios` | id, nombre, giro, zona, entrega_propia, envio_gratis, abierto, saturado, pausa, horario, rating, permiso, color | `W.negocios` |
| `productos` | id, negocio_id, nombre, precio, ilustracion, activo, alcohol, receta, kg | `negocio.menu` |
| `repartidores` | id, nombre, zona, vehiculo, aprobado, en_linea, suspendido, rating, ofertas_recibidas, ofertas_aceptadas | `W.repartidores` |
| `pedidos` | id, tipo, cliente_id, negocio_id, entrega, estado, pago, paga_con, sustitucion, pin_hash, pin_intentos, prep, eta, repa_id, bono, cot (JSON), riesgo (JSON), creado_en… | `W.pedidos` |
| `pedido_items` | pedido_id, producto_id, nombre, precio, cantidad, removido | `pedido.items` |
| `ofertas` | pedido_id, repa_id, enviada_en, vence_en, respuesta | `pedido.asignacion` |
| `eventos_pedido` | pedido_id, hora, quien, texto | `pedido.historial` |
| `flujos` | pedido_id, de, a, monto, concepto | `pedido.flujos` |
| `movimientos` | id, cuenta, monto, concepto, pedido_id, hora | `W.movimientos` |
| `incidencias` | id, pedido_id, cliente_id, tipo, detalle, foto_url, monto, estado, sospechosa, motivos, resolucion | `W.incidencias` |
| `solicitudes` | id, tipo, nombre, giro, zona, vehiculo, docs (JSON con URLs) | `W.solicitudes` |
| `facturas_negocio` | negocio_id, mes, monto, vence, pagada | `negocio.factura` |
| `anuncios` | negocio_id, tipo, hasta | `negocio.anuncios` |
| `bitacora` | hora, quien, texto | `W.bitacora` |
| `promos_usadas` | tipo, clave (dirección o dispositivo) | `W.promoUsada` |

### Reglas en el servidor

- `ejecutar_accion(pedido_id, accion, datos)`: una función del servidor (Edge Function o función de Postgres) que corre el mismo `validar()` y `aplicar()` del motor dentro de una **transacción**. Las pantallas no pueden cambiar `pedidos.estado` directamente.
- `crear_pedido(...)` recalcula la cotización en el servidor. **Nunca** confía en el total que manda el celular.
- El código de entrega se guarda cifrado (`pin_hash`). Solo el cliente dueño del pedido puede leerlo.
- `movimientos` solo se escribe desde el servidor y nunca se edita ni se borra. Una corrección es un movimiento nuevo.

### Seguridad por rol (Row Level Security)

| Rol | Puede leer | Puede escribir |
|---|---|---|
| Cliente | Sus pedidos, su saldo, negocios y productos públicos | Crear pedidos, reclamos y calificaciones (vía funciones) |
| Negocio | Sus pedidos (sin el teléfono completo del cliente), su menú, su saldo | Su menú y su estado; acciones de sus pedidos (vía funciones) |
| Repartidor | Ofertas para él y su viaje activo (la dirección completa solo después de aceptar), su saldo | Acciones de su viaje (vía funciones) |
| Operador | Todo, menos ajustes de dinero | Acciones de pedidos y reclamos hasta su límite |
| Dueño | Todo | Todo; cada cambio va a la bitácora |

### Tiempos límite

En la maqueta el reloj se adelanta a mano. En la app real, una tarea programada (`pg_cron`, cada minuto) llama a `revisar_tiempos()`, que es el mismo `revisarTiempos()` del motor: cancela pagos que no llegaron, pedidos sin respuesta y pasa las ofertas vencidas.

### Tiempo real y avisos

- **Supabase Realtime** en `pedidos` y `ofertas`: el cliente ve su pedido avanzar, el negocio escucha pedidos nuevos y el repartidor, sus ofertas.
- **Avisos push de la PWA** (Web Push). En iPhone funcionan con la app instalada en la pantalla de inicio.
- **WhatsApp** para lo crítico: código de inicio de sesión, pedido nuevo para un negocio que no tiene la app abierta, adeudos.
- **Llamadas enmascaradas:** el negocio y el repartidor llaman por medio de manda2 y nadie ve el número completo.

### Pagos

| Etapa | Cómo |
|---|---|
| Piloto | Efectivo y transferencia SPEI a una CLABE de manda2, con referencia `M2-<pedido>`. El dueño confirma el pago cuando lo ve en el banco. |
| Siguiente | Cobro con tarjeta y OXXO por una pasarela (por ejemplo, Mercado Pago). El aviso de la pasarela llama a `confirmar_pago` solo. |
| Después | CLABE única por pedido para que las transferencias se confirmen solas. |

### Mapa y ubicación

- **Piloto:** zonas fijas y tiempos por zona (`VIAJE_MIN`).
- **Siguiente:** ubicación del repartidor en vivo (geolocalización de la PWA) y validar que esté a menos de 100 m del domicilio para marcar “Llegué” y “Cliente ausente”.

## Hoja de ruta

| Fase | Qué incluye | Sale cuando |
|---|---|---|
| 1. Maqueta (hoy) | Todas las reglas, los cuatro roles y las pruebas | Ya |
| 2. Piloto real | Supabase, inicio de sesión por WhatsApp, pedidos reales, panel del dueño, cortes manuales, 10 negocios y 3 repartidores | Cuando haya 10 negocios firmados |
| 3. Pagos en línea | Pasarela de tarjeta y OXXO, depósitos automáticos | Con 20 pedidos al día |
| 4. Crecer | Mapa en vivo, dos pedidos por viaje, pedidos programados, selfie al conectarse, facturación | Con 40 pedidos al día |

## Cómo correr las pruebas

```bash
node --test
```

Corre las 23 pruebas del motor: precios, estados, tiempos límite, asignación, efectivo, promos, reclamos, cancelaciones, mensualidades y que **el dinero cuadre** en cada caso.
