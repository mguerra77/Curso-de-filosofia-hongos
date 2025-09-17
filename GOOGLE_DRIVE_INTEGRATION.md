# Integración con Google Drive

## Descripción

El sistema ahora soporta tres tipos de videos:
- **YouTube**: Videos alojados en YouTube
- **Google Drive**: Videos alojados en Google Drive (RECOMENDADO)
- **Local**: Archivos de video subidos al servidor

## Configuración de Google Drive

### Paso 1: Subir el video a Google Drive

1. Ve a [Google Drive](https://drive.google.com)
2. Sube tu archivo de video
3. **Importante**: Configura los permisos de compartir:
   - Haz clic derecho en el archivo
   - Selecciona "Compartir"
   - Cambia a "Cualquier persona con el enlace puede ver"
   - Copia el enlace compartido

### Paso 2: Obtener la URL del video

La URL de Google Drive tendrá este formato:
```
https://drive.google.com/file/d/FILE_ID/view?usp=sharing
```

### Paso 3: Agregar el video al curso

1. Ve al panel de administración del curso
2. Haz clic en "Editar" en el video que deseas modificar
3. Selecciona "Google Drive" como tipo de video
4. Pega la URL completa de Google Drive
5. Guarda los cambios

## Ventajas de Google Drive

1. **No consume espacio del servidor**: Los videos se reproducen directamente desde Google Drive
2. **Mejor rendimiento**: Google Drive tiene CDN global para reproducción optimizada
3. **Fácil gestión**: Puedes organizar tus videos en carpetas de Drive
4. **Sin límites de tamaño**: No hay restricciones de espacio como en el servidor local
5. **Reproducción nativa**: El reproductor de Google Drive maneja diferentes formatos automáticamente

## Formatos soportados por Google Drive

Google Drive reproduce nativamente:
- MP4 (recomendado)
- MOV
- AVI
- WMV
- FLV
- WebM
- MKV

## Migración de la base de datos

Si ya tienes contenido existente, ejecuta la migración:

```bash
cd backend/migrations
python migrate_google_drive.py
```

Esta migración:
- Agrega los campos `video_type` y `drive_file_id` a la tabla `course_content`
- Detecta automáticamente el tipo de videos existentes basado en sus URLs
- Es segura y no elimina datos existentes

## Uso del sistema

### Para administradores:

1. **Agregar nuevo video**:
   - Sube el video a Google Drive
   - Configura permisos públicos
   - Copia la URL compartida
   - En el curso, selecciona "Google Drive" y pega la URL

2. **Editar video existente**:
   - Haz clic en el botón de edición (✏️)
   - Cambia el tipo a "Google Drive"
   - Pega la nueva URL
   - Guarda los cambios

### Para estudiantes:

- Los videos se reproducen automáticamente en el reproductor embebido
- No hay diferencia visible entre YouTube, Google Drive o videos locales
- Los controles de reproducción están disponibles en todos los formatos

## Troubleshooting

### El video no se reproduce:

1. **Verifica permisos**: Asegúrate de que el video esté configurado como "Cualquier persona con el enlace puede ver"
2. **URL correcta**: Verifica que la URL sea de Google Drive y contenga el ID del archivo
3. **Formato soportado**: Confirma que el archivo sea un formato de video válido

### Error "Video no disponible":

- El archivo puede haber sido eliminado de Google Drive
- Los permisos pueden haber cambiado
- La URL puede estar incorrecta

## Ejemplo de configuración

```json
{
  "title": "Introducción a la Filosofía de los Hongos",
  "video_url": "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/view",
  "video_type": "drive",
  "drive_file_id": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
}
```

El sistema extraerá automáticamente el `drive_file_id` de la URL y generará la URL de embebido adecuada.