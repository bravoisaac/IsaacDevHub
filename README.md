# Portafolio Profesional

Aplicacion web de portafolio personal desarrollada con Angular, Ionic y Capacitor. Presenta el perfil profesional de Isaac Daniel Bravo Melo, su stack tecnico, experiencia, proyectos destacados, repositorios de GitHub y canales de contacto.

![Inicio del portafolio](docs/images/home.png)

## Secciones

- **Inicio:** presentacion profesional, resumen de experiencia, acciones principales y diamante 3D interactivo para navegar por el portafolio.
- **Perfil:** descripcion profesional, stack principal, disponibilidad, formacion y certificaciones.
- **Stack:** tecnologias agrupadas por backend, frontend, datos, cloud, automatizacion y gestion.
- **Experiencia:** trayectoria aplicada en soporte TI, desarrollo, bases de datos y automatizacion de procesos.
- **Proyectos:** casos destacados y repositorios publicos cargados desde GitHub.
- **Contacto:** formulario de contacto y enlaces directos a correo, telefono y GitHub.

## Capturas

### Perfil

![Perfil profesional](docs/images/perfil.png)

### Stack tecnico

![Stack tecnico](docs/images/stack.png)

### Proyectos

![Proyectos](docs/images/proyectos.png)

### Contacto

![Contacto](docs/images/contacto.png)

## Tecnologias

- Angular 20
- Ionic 8
- Capacitor 8
- TypeScript
- SCSS
- Ionicons
- GitHub API
- EmailJS API

## Funcionalidades principales

- Navegacion por rutas internas: `/home`, `/perfil`, `/stack`, `/experiencia`, `/proyectos`, `/github` y `/contacto`.
- Diamante 3D interactivo en la pantalla inicial.
- Carga automatica de repositorios publicos desde GitHub.
- Filtros de proyectos por lenguaje.
- Formulario de contacto integrado con EmailJS.
- Diseno responsive para escritorio y dispositivos moviles.
- CV descargable desde `src/assets/CV_Isaac_Bravo_FullStack.pdf`.

## Instalacion

Clona el repositorio e instala las dependencias:

```bash
npm install
```

Ejecuta la aplicacion en modo desarrollo:

```bash
npm start
```

Por defecto, Angular levanta la app en:

```text
http://localhost:4200/
```

## Scripts disponibles

```bash
npm start
```

Inicia el servidor de desarrollo.

```bash
npm run build
```

Genera la version de produccion en la carpeta `www`.

```bash
npm test
```

Ejecuta las pruebas configuradas con Karma y Jasmine.

```bash
npm run lint
```

Ejecuta el linter configurado para el proyecto.

## Estructura del proyecto

```text
src/
  app/
    home/
      home.page.html
      home.page.scss
      home.page.ts
    app.routes.ts
  assets/
    hero-portfolio.png
    CV_Isaac_Bravo_FullStack.pdf
docs/
  images/
    home.png
    perfil.png
    stack.png
    proyectos.png
    contacto.png
```

## Build

Para compilar la aplicacion:

```bash
npm run build
```

La salida se genera en:

```text
www/
```

