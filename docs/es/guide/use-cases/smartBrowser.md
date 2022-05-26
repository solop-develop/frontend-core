# Casos de Uso: Navegador Inteligente (Smart Browser)

## Apertura

### Árbol de Menú
Abrir un reporte desde el árbol de menú:
1. Desplegar el árbol de menú en **Gestión del Sistema/Reglas Generales/Seguridad**.
2. Seleccionar el Navegador Inteligente **(Smart Browser)** > **Consulta de Usuarios/Contactos**.

#### Versión Escritorio ZK:
<img :src="$withBase('/images/use-cases/smartbrowser/open/open-menu-destok-zk.gif')" width="100%">

#### Versión Escritorio Vue:
<img :src="$withBase('/images/use-cases/smartbrowser/open/open-menu-destok-ui.gif')" width="100%">

#### Versión Móvil Vue:
<img :src="$withBase('/images/use-cases/smartbrowser/open/open-menu-mobile-ui.gif')" width="100%">



### Buscador del Menú
Abrir un reporte desde el buscador del menú:

2. En el buscador de la parte superior escribir **Consulta de Usuarios/Contactos**.
3. Seleccionar el Navegador Inteligente **(Smart Browser)** coincidente con el resultado.

#### Versión Escritorio ZK:
<img :src="$withBase('/images/use-cases/smartbrowser/open/open-search-menu-destok-zk.gif')" width="100%">

#### Versión Escritorio Vue:
<img :src="$withBase('/images/use-cases/smartbrowser/open/open-search-menu-destok-ui.gif')" width="100%">

#### Versión Móvil Vue:
<img :src="$withBase('/images/use-cases/smartbrowser/open/open-search-menu-mobile-ui.gif')" width="100%">


### Ítems Recientes
Abrir un Navegador Inteligente **(Smart Browser)** de ítems recientes:

1. Ubicar el tablero **Ítems Recientes**.
2. Seleccionar cualquier Navegador Inteligente **(Smart Browser)** o en caso de usar la búsqueda rápida de la tabla de ítems recientes seleccionar el Navegador Inteligente **(Smart Browser)** coincidente con el resultado.

##### Versión Escritorio ZK:
<img :src="$withBase('/images/use-cases/smartbrowser/open/open-recien-item-mobile-ui.gif')" width="100%">

##### Versión Escritorio Vue:
<img :src="$withBase('/images/use-cases/smartbrowser/open/open-recien-item-destok-ui.gif')" width="100%">

#### Versión Móvil Vue:
<img :src="$withBase('/images/use-cases/smartbrowser/open/open-recien-item-mobile-ui.gif')" width="100%">


### Relaciones
Abrir un Navegador Inteligente **(Smart Browser)** desde las relaciones del mismo nivel del menú:

El cliente ZK de ADempiere no cuenta con una característica.


### Pasos a seguir

1.  Desplegar el árbol de menú en **Gestión del Sistema/Reglas Generales/Seguridad**.
2.  Seleccione la ventana **Mi Perfil**
3.  Desplegar la lista del el menú de relaciones, en la parte superior a la derecha de la ventana.
4.  Ubicar y seleccionar el Navegador Inteligente **(Smart Browser)** >  **Consulta de Usuarios/Contactos**.



#### Versión Vue:
<img :src="$withBase('/images/use-cases/smartbrowser/open/open-relations-destok-ui.gif')" width="100%">

## Carga

### Parámetros
Los parámetros (campos) de los **Navegador Inteligente (Smart Browser)** se utiliza para realizar la busqueda de registro. Solo se mostrara los campos con valor por defecto, o con obligatoriedad.

1. Abrir el **Navegador Inteligente (Smart Browser)** **Procesar Órdenes en Lote**.
2. Nóte el parametro **Estado del Documento**

#### Versión Escritorio ZK:
<img :src="$withBase('/images/use-cases/smartbrowser/load/params-zk.png')" width="100%">

#### Versión Escritorio Vue:
<img :src="$withBase('/images/use-cases/smartbrowser/load/params.png')" width="100%">

#### Versión Móvil Vue:
<img :src="$withBase('/images/use-cases/smartbrowser/load/params-mobile-ui.gif')" width="100%">


### Visualización
Al cargar todos los parámetros con valor por defecto, o con obligatoriedad se visualizan en la primera carga.

#### Versión Escritorio ZK:
Actualmente en la interfaz del Zk al abrir un **Navegador Inteligente (Smart Browser)** en este caso **Procesar Órdenes en Lote** carga todos los campos en la vista 
<img :src="$withBase('/images/use-cases/smartbrowser/load/mandatory-zk.gif')" width="100%">

#### Versión Escritorio Vue:
En la interfaz de ADempiere-Vue abrir un **Navegador Inteligente (Smart Browser)** en este caso **Procesar Órdenes en Lote** solo muestra los campos con valor por defecto, o con obligatoriedad.

<img :src="$withBase('/images/use-cases/smartbrowser/load/mandatory-vue.gif')" width="100%">

#### Versión Móvil Vue:
<img :src="$withBase('/images/use-cases/smartbrowser/load/mandatory-mobile-ui.gif')" width="100%">

### Obligatoriedad

##### Versión ZK:
1. Abrir el reporte **Procesar Órdenes en Lote**.
2. Los campos obligatorios muestran con un asterisco (*) rojo al lado derecho de su nombre.
<img :src="$withBase('/images/use-cases/smartbrowser/load/display-zk.png')" width="100%">

##### Versión Vue:
1. Abrir el reporte **Procesar Órdenes en Lote**.
2. Los campos obligatorios muestran con un asterisco (*) rojo al lado derecho de su nombre, y aquellos obligatorios vacíos resaltan con un borde rojo sobre el campo.
<img :src="$withBase('/images/use-cases/smartbrowser/load/display-ui.gif')" width="100%">


### Registro

Es una tabla donde se encuentran los registros dependiendo de los parametros que se encuentre en el [**Criterio de Búsqueda**](#criterio-de-busqueda) 

#### Versión Escritorio ZK:
Actualmente en la interfaz del Zk al abrir un **Navegador Inteligente (Smart Browser)** en este caso **Procesar Órdenes en Lote** no se logra observar la tabla con registro de una forma dinamica
<img :src="$withBase('/images/use-cases/smartbrowser/load/search-record-zk.gif')" width="100%">

#### Versión Escritorio Vue:
En la interfaz de ADempiere-Vue abrir un **Navegador Inteligente (Smart Browser)** en este caso **Procesar Órdenes en Lote** la tabla con los registro se encuentra abajo el cual agregar un parametro en el [**Criterio de Búsqueda**](#criterio-de-busqueda)  podra obseervar como se filtran los registro de la tabla
<img :src="$withBase('/images/use-cases/smartbrowser/load/search-record-ui.gif')" width="100%">

#### Versión Móvil Vue:
En la interfaz de ADempiere-Vue abrir un **Navegador Inteligente (Smart Browser)** en este caso **Procesar Órdenes en Lote** la tabla con los registro se encuentra abajo el cual agregar un parametro en el [**Criterio de Búsqueda**](#criterio-de-busqueda) podra obseervar como se filtran los registro de la tabla
<img :src="$withBase('/images/use-cases/smartbrowser/load/search-record-ui-mobile.gif')" width="100%">


### Criterio de Búsqueda

Es a donde se encuentran los [**parametros**](#parametros) los cuales se toman encuenta para el filtrado de registro 

#### Versión Escritorio ZK:
Actualmente en la interfaz del Zk en el Criterio de Búsqueda muestra todos los parametros de busqueda y luego de selecionar los parametros hay que darle click al boton de Comenzar Busqueda. Tambien al traer registro se oculta. Tambien es dificil saber donde se puede despleglar de nuevo la opcion de Criterio de Búsqueda

<img :src="$withBase('/images/use-cases/smartbrowser/load/search-criteria-zk.gif')" width="100%">

#### Versión Escritorio Vue:
En la interfaz de ADempiere-Vue en el Criterio de Búsqueda muestra todos solo los parametros que sean [**obligatorio**](#obligatoriedad) o tengan un valor por defecto. Tambien si se requiere agregar mas parametros en la parte superior ubicado a la derecha hay una lista con los parametros disponibles
<img :src="$withBase('/images/use-cases/smartbrowser/load/search-criteria-ui-.gif')" width="100%">

#### Versión Móvil Vue:
En la interfaz de ADempiere-Vue en el Criterio de Búsqueda muestra todos solo los parametros que sean [**obligatorio**](#obligatoriedad) o tengan un valor por defecto. Tambien si se requiere agregar mas parametros en la parte superior ubicado a la derecha hay una lista con los parametros disponibles
<img :src="$withBase('/images/use-cases/smartbrowser/load/search-criteria-ui-mobile.gif')" width="100%">

:::tip <b>Notas:</b>
En la interfaz de ADempiere-Vue si en el Criterio de Búsqueda en el parametro pierda el foco o al precionar Enter realizara la busqueda automaticamente
:::
### Paginación
Si en la busqueda obtiene muchos registro deberia paginar
#### Versión Escritorio ZK:
Actualmente en la interfaz del Zk carga en la tabla toda la cantida de registro del resultado de la busqueda 
<img :src="$withBase('/images/use-cases/smartbrowser/load/paging-zk.gif')" width="100%">

#### Versión Escritorio Vue:
En la interfaz de ADempiere-Vue si el resultado de la busqueda obtiene muchos registro se muestra en la tabla el total de registro que se encontro y su cantidad de pagina para que la carga de registro no sea tan pesada
<img :src="$withBase('/images/use-cases/smartbrowser/load/')" width="100%">

#### Versión Móvil Vue:
En la interfaz de ADempiere-Vue si el resultado de la busqueda obtiene muchos registro se muestra en la tabla el total de registro que se encontro y su cantidad de pagina para que la carga de registro no sea tan pesada
<img :src="$withBase('/images/use-cases/smartbrowser/load/')" width="100%">

## Ejecución

### Parámetros
