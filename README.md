# Control de préstamo de laboratorio, equipos y/o elementos

Formulario web para el registro de solicitudes de préstamo, devoluciones y trazabilidad de laboratorio, equipos y/o elementos. Código institucional **GAF-FOR-127**.

## URL pública

La página está publicada en:

`https://od3tomy.github.io/control-prestamo-laboratorio/`

Formulario directo para compartir por QR:

`https://od3tomy.github.io/control-prestamo-laboratorio/formulario_prestamo.html?publico=1`

Enlace corto para escribir en el celular:

`https://is.gd/DfdQaw`

Afiche PDF con el QR:

`https://od3tomy.github.io/control-prestamo-laboratorio/QR_Control_Prestamo.pdf`

Archivos locales listos para escanear:

- `QR_Control_Prestamo.png` (640 × 640)
- `QR_Control_Prestamo.pdf`
- `QR_Control_Prestamo_Corto.png` (592 × 592)
- `QR_Control_Prestamo_Corto.pdf`

## Acceso administrador

1. Abrir el formulario.
2. Pulsar **Administrador** en la cabecera (en móvil aparece como **Admin**).
3. Ingresar el PIN inicial: **`tomy`**.

Desde el panel de administración se pueden ver/editar registros, exportar a CSV/Excel/JSON, imprimir y generar el QR público en PDF.

## Compartir por QR

1. Entrar como administrador.
2. Abrir **Compartir formulario público**.
3. Configurar WhatsApp y/o correo.
4. Pegar la URL pública y pulsar **Actualizar QR**.
5. Pulsar **QR en PDF** para descargar el afiche con el código.

> El PDF incluido en el repositorio abre el formulario, pero aún no tiene un WhatsApp/correo configurado. Configura el contacto en el panel y genera un nuevo PDF para que las solicitudes te lleguen directamente.

## Datos

- Los registros del administrador se guardan en el navegador (localStorage).
- Las solicitudes públicas no se almacenan en el dispositivo del usuario: se envían por WhatsApp/correo.
- Usar **Respaldo** (JSON) para conservar los registros y **Restaurar** para importarlos en otro navegador.

## Archivos publicados

- `formulario_prestamo.html`
- `uam-acreditacion25_horizontal_COLOR.png`
- `QR_Control_Prestamo.pdf`
