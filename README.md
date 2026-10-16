# Control de cordajes de tenis

Aplicación PWA para controlar las horas de uso de los cordajes de dos raquetas.

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub.
2. Descomprime este ZIP y sube **el contenido de la carpeta**, no el ZIP.
3. Confirma que la rama principal se llama `main`.
4. En GitHub entra en **Settings > Pages**.
5. En **Build and deployment > Source**, selecciona **GitHub Actions**.
6. Abre la pestaña **Actions** y espera a que termine `Deploy to GitHub Pages`.
7. La dirección de la app aparecerá en **Settings > Pages**.

## Instalar en Android

1. Abre la dirección publicada con Chrome.
2. Abre el menú de Chrome.
3. Pulsa **Instalar aplicación** o **Añadir a pantalla de inicio**.

## Uso local opcional

```bash
npm install
npm run dev
```

## Datos

Los datos se guardan localmente en el navegador del dispositivo. Exporta periódicamente el histórico CSV. Borrar los datos de Chrome puede borrar el historial de la aplicación.
