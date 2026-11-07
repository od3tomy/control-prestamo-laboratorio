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
3. Ingresar el PIN inicial: **`david`**.

Desde el panel de administración se pueden ver/editar registros, exportar a CSV/Excel/JSON, imprimir y generar el QR público en PDF.

## Compartir por QR

1. Entrar como administrador.
2. Abrir **Compartir formulario público**.
3. Configurar WhatsApp y/o correo.
4. Pegar la URL pública y pulsar **Actualizar QR**.
5. Pulsar **QR en PDF** para descargar el afiche con el código.

> El PDF incluido en el repositorio abre el formulario, pero aún no tiene un WhatsApp/correo configurado. Configura el contacto en el panel y genera un nuevo PDF para que las solicitudes te lleguen directamente.

## Google Sheets (trazabilidad)

1. Crea una hoja de cálculo en Google Sheets.
2. Abre **Extensiones → Apps Script** y pega el archivo [`google-apps-script/Code.gs`](google-apps-script/Code.gs).
3. Ejecuta la función `setup` una vez y autoriza los permisos. En el registro de ejecución aparecen el **TOKEN** y la URL de la hoja.
4. Implementa como **Aplicación web**:
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier persona**
5. Copia la URL del Web App (termina en `/exec`).
6. En la web entra como administrador, abre **Trazabilidad · Google Sheets**, pega la URL y el TOKEN, y pulsa **Guardar conexión**.
7. Pulsa **Sincronizar**. Desde ese momento cada formulario público se guarda automáticamente en la hoja y el Excel institucional se llena desde esos registros.
8. Genera un nuevo **QR/PDF** después de configurar la conexión: el enlace incluirá la URL de la API para que los usuarios guarden sus solicitudes.

Notas:

- La hoja es privada: los usuarios solo pueden agregar solicitudes; no pueden leer ni editar los registros.
- El **TOKEN** solo se guarda en el navegador del administrador. No lo compartas.
- Si tenías registros locales, usa **Subir locales** antes de sincronizar.
- Para que el enlace corto y los QR ya publicados también guarden en Sheets, fija la URL del Web App en la constante `SHEETS_API_URL` del HTML y vuelve a publicar.

## Datos

- Con Google Sheets conectado, la hoja es el registro central de trazabilidad.
- Sin Google Sheets, las solicitudes públicas se envían por WhatsApp/correo.
- El panel guarda una copia local de los registros para consulta y exportación.
- Usar **Respaldo** (JSON) para conservar los registros y **Restaurar** para importarlos en otro navegador.

## Archivos publicados

- `formulario_prestamo.html`
- `uam-acreditacion25_horizontal_COLOR.png`
- `QR_Control_Prestamo.pdf`
