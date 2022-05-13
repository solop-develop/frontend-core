# Casos de Uso: Reporte

## Apertura

### Árbol de Menú
Aperturar un reporte dede el arbol de menú:
1. Desplegar el árbol de menu en **Gestión de Saldos Pendientes**.
2. Seleccionar el reporte **Saldos Abiertos**.

#### Versión ZK:
<img :src="$withBase('/images/use-cases/report/open-menu-zk.gif')" alt="ZK Desktop" width="100%">

#### Versión Vue:
<img :src="$withBase('/images/use-cases/report/open-menu-vue.gif')" alt="ZK Desktop" width="100%">



### Buscador del Menú
Aperturar un reporte desde el buscador del menú:

1. Desplegar el árbol de menu.
2. En el buscador de la parte superior escribir **Saldos Abiertos**.
3. Seleccionar el reporte coincidente con el resultado.

##### Versión ZK:
<img :src="$withBase('/images/use-cases/report/open-search-menu.gif')" alt="ZK Desktop" width="100%">

##### Versión Vue:
<img :src="$withBase('/images/use-cases/report/open-search-menu-vue.gif')" alt="ZK Desktop" width="100%">


### Ítems Recientes
Aperturar un reporte de ítems recientes:

1. Ubicar el tablero **Ítems Recientes**.
2. Seleccionar caulquier reporte o en caso de usar la busqueda rapida de la tabla de ítems recientes seeleccionar el reporte coincidente con el resultado.

##### Versión ZK:
<img :src="$withBase('/images/use-cases/report/open-recient-item-zk.gif')" alt="ZK Desktop" width="100%">

##### Versión Vue:
<img :src="$withBase('/images/use-cases/report/open-recient-item-vue.gif')" alt="ZK Desktop" width="100%">


### Relaciones
Aperturar un reporte desde las relaciones del mismo nivel del menú:

El cliente ZK de ADempiere no cuenta con una caracteristica equivalente.


### Pasos a seguir

1.  Desplegar el árbol de menú en **Gestión de Saldos Pendientes**
2.  Seleccione el reporte de **Saldos Abiertos a la Fecha**
3.  Desplegar la lista del el menú de relacciones, en la parte superior a la derecha de la ventana.
4. Ubicar y seleccionar el reporte **Saldos Abiertos**.



#### Versión Vue:
<img :src="$withBase('/images/use-cases/report/open-relations-vue.gif')" alt="ZK Desktop" width="100%">




### Re Abrir Reporte desde el Histórico Procesos

Aperturar un reporte el **Histórico Procesos** con los parámetros ejecutados del reporte seleccionado

Actualmente en el cliente ZK de ADempiere no cuenta con una caracteristica equivalente.

##### Versión Vue:
1. Ubicar en el árbol de menú en **Histórico Procesos** y abrirlo.
2. Seleccionar cualquier reporte con parametros **Saldo en Banco**.

<img :src="$withBase('/images/use-cases/report/open-process-activity.gif')" alt="ZK Desktop" width="100%">

## Carga
### Parámetros
Los parámetros (campos) de los procesos deben cargar al abrirse en el caso de que el reporte maneje parámetros segun cada tipo de visualizacion.

1. Abrir el reporte **Saldos Abiertos**.
2. Notese los diferentes tipos de parámetros: Cadena, Si y No, Fecha, Monto, Lista, Tabla.

##### Versión ZK:
<img :src="$withBase('/images/use-cases/report/carga-params-zk.png')" alt="ZK Desktop" width="100%">

##### Versión Vue:
<img :src="$withBase('/images/use-cases/report/carga-params-vue.png')" alt="ZK Desktop" width="100%">


### Visualización
Al cargar todos los parámetros con valor por defecto, o con obligatoriedad se visualizan en la primera carga.

##### Versión ZK:
Actualmente en la interfaz del zk al abrir un reporte en este caso **Saldos Abiertos** carga todos los campos en la vista 
<img :src="$withBase('/images/use-cases/report/carga-params-zk.gif')" alt="ZK Desktop" width="100%">

##### Versión Vue:
En la interfaz de ADempiere-Vue abrir un reporte en este caso **Saldos Abiertos** solo muestra los campos con valor por defecto, o con obligatoriedad.
Creando asi una vista mas agradable y minimalista para el usuario
<img :src="$withBase('/images/use-cases/report/carga-display.gif')" alt="ZK Desktop" width="100%">

### Obligatoriedad

##### Versión ZK:
1. Abrir el reporte **Saldo en Banco**.
2. Los campos obligatorios muestran con un asterisco (*) rojo al lado derecho de su nombre.
<img :src="$withBase('/images/use-cases/report/carga-mandatory-zk.png')" alt="ZK Desktop" width="100%">

##### Versión Vue:
1. Abrir el reporte **Saldo en Banco**.
2. Los campos obligatorios muestran con un asterisco (*) rojo al lado derecho de su nombre, y aquellos obligatorios vacios resaltan con un borde rojo sobre el campo.
<img :src="$withBase('/images/use-cases/report/carga-mandatory-vue.png')" alt="ZK Desktop" width="100%">


<!-- ### Solo Lectura -->


### Valor por Defecto

Manejar valor por defecto para los distintos tipos de parámetros.

##### Versión Vue:
1. Abrir el reporte **Asignación de Pago**.
2. Hacer clic contrario en el valor del parámetro y seleccionar **Valor de Preferencia**.
3. Observe que el parámetro **Document Status** tiene valor por defecto (CO = Completo).

<img :src="$withBase('/images/use-cases/report/carga-defaul-value-zk.gif')" alt="ZK Desktop" width="100%">


##### Versión Vue:
1. Abrir el reporte **Asignación de Pago**.
2. Hacer clic en el nombre del parámetro y seleccionar **Información** o **Preferencia**.
3. Observe que el parámetro **Document Status** tiene valor por defecto (CO = Completo).

<img :src="$withBase('/images/use-cases/report/carga-defaul-value-vue.gif')" alt="ZK Desktop" width="100%">

### Acercar

En ADempiere actualmente se puede acceder a una ventana desde un campo que está en otro que está relacionado, como se muestra a continuación.


##### Versión Vue:
1. Abrir el reporte **Detalle de Selección de Pagos**.
2. Hacer clic contrario en el parámetro **Cargo** y seleccionar **Acercar**.

<img :src="$withBase('/images/use-cases/report/carga-zoom-zk.gif')" alt="ZK Desktop" width="100%">

##### Versión Vue:
1. Abrir el reporte **Detalle de Selección de Pagos**.
2. Hacer clic contrario en el parámetro **Cargo** y seleccionar **Acercar**.

<img :src="$withBase('/images/use-cases/report/carga-zoom-vue.gif')" alt="ZK Desktop" width="100%">

## Ejecución

### Parámetros
Los parámetros (campos) de los procesos deben cargar al abrirse en el caso de que el reporte maneje parámetros segun cada tipo de visualizacion.

1. Abrir el reporte **Saldos Abiertos**.
2. Notese los diferentes tipos de parámetros: Cadena, Si y No, Fecha, Monto, Lista, Tabla.

##### Versión ZK:
<img :src="$withBase('/images/use-cases/report/run/run-params-zk.gif')" alt="ZK Desktop" width="100%">

##### Versión Vue:
<img :src="$withBase('/images/use-cases/report/run/run-params-vue.gif')" alt="ZK Desktop" width="100%">

### Validación
Se deben asegurar las siguientes validaciones para poder ejecutar un reporte:

* Todos los campos obligatorios deben tener valores.
* Si es reporte asociado a una ventana no permite ejecutarse en un nuevo registro.

##### Versión Vue:
<img :src="$withBase('/images/use-cases/report/run/run-validation-vue.gif')" alt="ZK Desktop" width="100%">

### Ejecución
1. Desplegar el árbol de menu en **Gestión de Saldos Pendientes**.
2. Seleccionar el reporte **Saldos Abiertos**.
3. Llenar los campos.
4. Ejecutar en el menu de acciones.

##### Versión Vue:
<img :src="$withBase('/images/use-cases/report/run/run-validation-vue.gif')" alt="ZK Desktop" width="100%">

### Descargar

Actualmente en la interfaz de ADempiere ZK si ejecuto un reporte en formato PDF y se requiere descargarlo en EXCEL debe volver a ejecutar el reporte en el formato de EXCEL y luego hacer click en la opción de descargar

En la interfaz de ADempiere-Vue si ejecuto un reporte en HTML y se requiere descargarlo no es necesario volver a ejecutar el reporte con el formato que se desea descargar. En la parte inferior del titulo del reporte posicionado al izquierda tiene la opción de descargarlo en cualquier tipo de formato

##### Versión ZK:
<img :src="$withBase('/images/use-cases/report/run/run-download-zk.gif')" alt="ZK Desktop" width="100%">

##### Versión Vue:
<img :src="$withBase('/images/use-cases/report/run/run-download-vue.gif')" alt="ZK Desktop" width="100%">

### Cambiar Parámetros

Actualmente en la interfaz de ADempiere ZK no se puede cambiar de parámetros en el contenedor del visor de reporte

##### Versión Vue:
<img :src="$withBase('/images/use-cases/report/run/run-download-vue.gif')" alt="ZK Desktop" width="100%">

### Cambiar Formato de Impresión

Se requiere que desde el visor de reporte se pueda cambiar formato de impresión para generar nuevo reporte

##### Versión ZK:
<img :src="$withBase('/images/use-cases/report/run/run-print-format-zk.gif')" alt="ZK Desktop" width="100%">

##### Versión Vue:
<img :src="$withBase('/images/use-cases/report/run/run-print-format-vue.gif')" alt="ZK Desktop" width="100%">


#### Cambiar Extensión de Archivo

Se requiere que desde el visor de reporte se pueda cambiar la extensión del archivo para generar nuevo reporte

##### Versión ZK:
<img :src="$withBase('/images/use-cases/report/run/run-change-file-extension-zk.gif')" alt="ZK Desktop" width="100%">

##### Versión Vue:
<img :src="$withBase('/images/use-cases/report/run/run-change-file-extension-vue.gif')" alt="ZK Desktop" width="100%">


### Drill Down

Se requiere que desde el visor de reporte se pueda cambiar Vista de Reporte para generar nuevo reporte

##### Versión ZK:
<img :src="$withBase('/images/use-cases/report/run/run-drill-down-zk.gif')" alt="ZK Desktop" width="100%">

##### Versión Vue:
<img :src="$withBase('/images/use-cases/report/run/run-drill-down-vue.gif')" alt="ZK Desktop" width="100%">
