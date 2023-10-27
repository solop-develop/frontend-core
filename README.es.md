<p align="center">
  <img width="320" src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Adempiere-logo.png">
</p>

<p align="center">
  <a href="https://github.com/vuejs/vue">
    <img src="https://img.shields.io/badge/vue-2.6.10-brightgreen.svg" alt="vue version">
  </a>
  <a href="https://github.com/ElemeFE/element">
    <img src="https://img.shields.io/badge/element--ui-2.15.3-brightgreen.svg" alt="element-ui">
  </a>
  <a href="https://hub.docker.com/r/erpya/adempiere-vue/">
    <img src="https://img.shields.io/docker/pulls/erpya/adempiere-vue.svg" alt="Docker Pulls">
  </a>
  <a href="https://github.com/adempiere/adempiere-vue/actions/workflows/publish.yml">
    <img src="https://github.com/adempiere/adempiere-vue/actions/workflows/publish.yml/badge.svg" alt="Publish GH Action">
  </a>
  <a href="https://github.com/adempiere/adempiere-vue/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-GNU/GPL%20(v3)-blue" alt="license">
  </a>
  <a href="https://github.com/adempiere/adempiere-vue/releases/latest">
    <img src="https://img.shields.io/github/release/adempiere/adempiere-vue.svg" alt="GitHub release">
  </a>
  <a href="https://gitter.im/adempiere/adempiere-vue">
    <img src="https://badges.gitter.im/Join%20Chat.svg" alt="Gitter">
  </a>
</p>


Español | [Inglés](./README.md)

## Introducción

[adempiere-vue](https://github.com/adempiere/adempiere-vue) es una nueva UI para [ADempiere ERP, CRM & SCM](https://github.com/adempiere/adempiere)]. Está basada en [vue](https://github.com/vuejs/vue) y usa [element-ui](https://github.com/ElemeFE/element) como conjunto de herramientas de interfaz de usuario.

![POS Image](docs/.vuepress/public/images/forms/point-of-sales/pos-es.png)

Este es una gran UI para [ADempiere ERP, CRM & SCM](https://github.com/adempiere/adempiere) basada en lo último desarrollado por vue, construido con i18n para manejo multi-idioma, plantillas para aplicaciones de negocio y muchas características asombrosas. Este proyecto es derivado de [Vue-Element-Admin](https://github.com/PanJiaChen/vue-element-admin) originalmente escrito por [PanJiaChen / 花裤衩](https://github.com/PanJiaChen) sobre [licencia MIT](https://github.com/PanJiaChen/vue-element-admin/blob/master/LICENSE) y cambiado a [licencia GNU/GPL v3](https://github.com/adempiere/adempiere-vue/blob/master/LICENSE) por [Yamel Senih](https://github.com/yamelsenih) después de derivar el proyecto y con permisos del autor original [PanJiaChen / 花裤衩](https://github.com/PanJiaChen) en el reporte ["Extend as GNU/Gpl v3 License #1434"](https://github.com/PanJiaChen/vue-element-admin/issues/1434).

[adempiere-vue](https://github.com/adempiere/adempiere-vue) usa como RPC (Llamado a Procedimientos Remotos)[gRPC](https://grpc.io/) como [server](https://github.com/adempiere/adempiere-gRPC-Server).

- [Vista Prévia de la Aplicación](https://vue-develop.solopcloud.com/)

  - **Usuario**: `GardenAdmin`
  - **Contraseña**: `GardenAdmin`

- [Documentación](https://adempiere.github.io/adempiere-vue-site/)

- [Canal de Gitter](https://gitter.im/adempiere/adempiere-vue)

- [Para Donaciones](https://www.paypal.me/YamelSenih)

- [Enlace de Wiki](http://wiki.adempiere.io/ADempiere_ERP)

- [Derivado De](https://github.com/PanJiaChen/vue-element-admin)

**La versión actual `v1.0+` está construida con `vue-cli`. Si encuentra algún problema, por favor escriba un [reporte de error](https://github.com/adempiere/adempiere-vue/issues/new).**

**Este proyecto no está soportado para versiones muy viejas de navegadores (e.g. IE).**

## Preparación

Necesita instalar [node](https://nodejs.org/) y [git](https://git-scm.com/) localmente. El proyecto está basado en [ES2015+](https://es6.ruanyifeng.com/), [vue](https://cn.vuejs.org/index.html), [vuex](https://vuex.vuejs.org/zh-cn/), [vue-router](https://router.vuejs.org/zh-cn/), [vue-cli](https://github.com/vuejs/vue-cli) , [gRPC](https://grpc.io/) y [element-ui](https://github.com/ElemeFE/element).
Entendiendo y aprendiendo acerca de lo anterior le ayudará a conocer el proyecto.

[![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/PanJiaChen/vue-element-admin/tree/CodeSandbox)

<p align="center">
  <img width="900" src="https://wpimg.wallstcn.com/a5894c1b-f6af-456e-82df-1151da0839bf.png">
</p>

## Corriendo Contenedores de Docker

### Requerimientos Mínimos

Para usar la imagen de Docker debes usar la versión 3.0 o superior de Docker.

Construye la Imagen de docker (solo para desarrollo):
```bash
docker build -t solopcloud/adempiere-vue:dev -f ./Dockerfile .
```

Descarga de Imagen:
```bash
docker pull solopcloud/adempiere-vue
```

Ejecución de Contenedor:
```bash
docker run -it \
	--name adempiere-vue \
	-p 80:80 \
	-e API_URL="http://localhost:8085" \
	-e TZ="America/Caracas" \
	solopcloud/adempiere-vue
```

O facilmente ejecutar el contenedor usando `docker-compose` con el siguiente comando:
```bash
docker-compose up
```

### Variables de entorno para la configuración

 * `PUBLIC_PATH`: Tendrás que establecer publicPath si planeas desplegar tu sitio bajo una sub-ruta, por ejemplo GitHub Pages. Si planeas desplegar tu sitio en `https://adempiere-vue.github.io/bar/`, entonces publicPath debe establecerse en `/bar/`. En la mayoría de los casos, utilice `/`.
 
 * `API_URL`: Indica la dirección URL del servidor con el que se comunicará por defecto el cliente web [Proxy-Adempiere-Api](https://github.com/adempiere/proxy-adempiere-api), el valor por defecto es `http://localhost:8085/api/adempiere/`.

 * `TASK_MANAGER_URL`: Indica la dirección URL del API RESTFul para el mangejador de tareas [ADempiere-Business-Processors](https://github.com/adempiere/adempiere-business-processors) y [`dKron`](https://dkron.io/), el valor por defecto es `http://localhost:8085`.

 * `TZ`: (Time Zone) Indica el huso horario a establecer en el contenedor basado en nginx, el valor por defecto es `America/Caracas` (UTC -4:00).

> **Nota**
> Si no cambias los valores de esta variable de entorno, no es necesario indicarlo en el comando `docker run`, por defecto colocará el valor que se encuentra predeterminado.


## Patrocinantes

<a href="http://erpya.com/">
  <img alt="ERP Consultores y Asociados" width="250px" src="https://erpya.com/wp-content/uploads/2017/11/ERP-logotipo-H-color.png" />
</a>
<a href="http://westfalia-it.com/">
  <img width="150px" src="http://westfalia-it.com/wp-content/uploads/2021/04/logo_.gif" />
</a>
<a href="http://openupsolutions.com/">
  <img width="250px" src="https://openupsolutions.com/wp-content/uploads/2021/08/logo-openup-horizontal.jpg" />
</a>

Sea un patrocinante y coloque su logo en nuestro LEEME en GitHub con un enlace directo a su sitio web. [Sea un Patrocinante](https://www.paypal.me/YamelSenih)

## Características

```
- Iniciar / Cerrar Sesión

- Permisos de Autenticación
  - Permisos basado en ADempiere
  - Página de Permisos
  - Directivas de permisos
  - Página de configuración de permisos
  - Autenticación por dos pasos

- Construcción Multi-entorno
  - Desarrollo (dev)
  - sit
  - Escenario de pruebas (stage),
  - Producción (prod)

- Características Globales
  - I18n
  - Temas dinámicos
  - Menu lateral dinámico (soporte a rutas multi-nivel)
  - Barra de rutas dinámica
  - Tags-view (Pestañas de página, Soporta operación de clic derecho)
  - Svg Sprite
  - Datos de simulación con Mock
  - Pantalla completa
  - Menu lateral responsivo

- Editor
  - Editor de Texto Enriquecido
  - Editor Markdown
  - Editor JSON

- Excel
  - Exportación a Excel
  - Carga de Excel
  - Visualización de Excel
  - Exportación como ZIP

- Tabla
  - Tabla Dinámica
  - Tabla con Arrastrar y Soltar
  - Tabla de edición en línea

- Páginas de Error
  - 401
  - 404

- Componentes
  - Carga de Avatar
  - Botón para subir al inicio
  - Arrastrar y Soltar (Diaglogo)
  - Arrastrar y Soltar (Seleccionar)
  - Arrastrar y Soltar (Kanban)
  - Arrastrar y Soltar (Lista)
  - Panel de división
  - Componente para soltar archivos
  - Adhesión de objetos
  - Contador hasta

- Soporte a ADempiere
  - Ventana
  - Proceso
  - Reporte
  - Consulta Inteligente
  - Formulario
  - Flujo de Trabajo

- Ejemplo Avanzado
- Registro de Errores
- Tablero de indicadores
- Página de Guías
- ECharts (Gráficos)
- Portapapeles
- Convertidor de Markdown a HTML
```

## Iniciando

Use [gRPC ADempiere Server](https://github.com/adempiere/adempiere-gRPC-Server) como proveedor de gRPC.

```bash
# Habilita https para instalar los paquetes
git config --global url."https://".insteadOf git://

# clone el proyecto
git clone -b experimental https://github.com/solop-develop/frontend-core.git

# vaya al directorio clonado
cd frontend-core

# instale las dependencias (yarn install --frozen-lockfile)
yarn ci

# corra el proyecto como desarrollador
yarn dev
```

Automáticamente se abrirá el siguiente enlace en su navegador http://localhost:9527

## Construcción

```bash
# Construcción para entornos de prueba
yarn build:stage

# Construcción para entornos de producción
yarn build:prod
```

## Avanzado

```bash
# Vista previa con efectos de entorno
yarn preview

# Vista previa  con efectos + análisis de recursos estáticos
yarn preview --report

# Chequeo de formato de código
yarn lint

# Chequeo de formato de código y auto-corrección
yarn lint --fix
```

Vaya a [Documentación](https://adempiere.github.io/adempiere-vue/es/guide/essentials/deploy.html#compilar) para mayor información.


## Registro de Cambios

Los cambios detallados por cada liberación se encuentran en [notas de liberación](https://github.com/adempiere/adempiere-vue/releases).

## Demostración en línea

[Vista Prévia de la Aplicación](https://vue-develop.solopcloud.com/)

  - **Usuario**: `GardenAdmin`
  - **Contraseña**: `GardenAdmin`

## Donación

Si este proyecto es de mucha ayuda para ti, puedes ayudar a hacer una mejor UI

[dona por Paypal](https://www.paypal.me/YamelSenih)

### Some Contributors
Gracias por todo el esfuerzo para mejorar este gran proyecto. Los siguientes son algunas de las compañías que aportaron monetariamente para ayudarnos a hacer un mejor software.

<table>
  <tbody>
    <tr>
      <td align="center" valign="middle">
        <a href="www.vdevsoft.com">
          <img
            src="https://user-images.githubusercontent.com/2333092/110265373-c2cafb00-7f91-11eb-84de-2aba7f2c2024.jpg"
            alt="vDevSoft"
            width="150"
          >
        </a>
      </td>
    </tr>
  </tbody>
</table>

## Navegadores Soportados

Navegadores modernos e Internet Explorer 10+.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)</br>Safari |
| --------- | --------- | --------- | --------- |
| IE10, IE11, Edge | últimas 2 versiones | últimas 2 versiones | últimas 2 versiones |

## Licencia

[GNU/GPL v3](https://github.com/adempiere/adempiere-vue/blob/master/LICENSE)

## Licencia Prévia
[MIT](./PREVIOUS-LICENSE)

## Contribuidores Iniciales

- [Yamel Senih](https://github.com/yamelsenih)
- [Raúl Muñoz](https://github.com/Raul-mz)
- [Edwin Betancourt](https://github.com/EdwinBetanc0urt)
- [Leonel Matos](https://github.com/leonel1524)
- [Elsio Sanchez](https://github.com/elsiosanchez)
