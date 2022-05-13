# Casos de Uso: Reporte

## Apertura

### Árbol de Menú
Aperturar un reporte dede el arbol de menú:
1. Desplegar el árbol de menu en **Gestión de Saldos Pendientes**.
2. Seleccionar el reporte **Saldos Abiertos**.

#### Versión ZK:
<img :src="$withBase('/images/use-cases/report/open-menu-zk.gif')" alt="ZK Desktop" width="800px">

#### Versión Vue:
<img :src="$withBase('/images/use-cases/report/open-menu-vue.gif')" alt="ZK Desktop" width="800px">



### Buscador del Menú
Aperturar un reporte desde el buscador del menú:

1. Desplegar el árbol de menu.
2. En el buscador de la parte superior escribir **Saldos Abiertos**.
3. Seleccionar el reporte coincidente con el resultado.

##### Versión ZK:
<img :src="$withBase('/images/use-cases/report/open-search-menu.gif')" alt="ZK Desktop" width="800px">

##### Versión Vue:
<img :src="$withBase('/images/use-cases/report/open-search-menu-vue.gif')" alt="ZK Desktop" width="800px">


### Ítems Recientes
Aperturar un reporte de ítems recientes:

1. Ubicar el tablero **Ítems Recientes**.
2. Seleccionar caulquier reporte o en caso de usar la busqueda rapida de la tabla de ítems recientes seeleccionar el reporte coincidente con el resultado.

##### Versión ZK:
<img :src="$withBase('/images/use-cases/report/open-recient-item-zk.gif')" alt="ZK Desktop" width="800px">

##### Versión Vue:
<img :src="$withBase('/images/use-cases/report/open-recient-item-vue.gif')" alt="ZK Desktop" width="800px">


### Relaciones
Aperturar un reporte desde las relaciones del mismo nivel del menú:

El cliente ZK de ADempiere no cuenta con una caracteristica equivalente.


### Pasos a seguir

1.  Desplegar el árbol de menú en **Gestión de Saldos Pendientes**
2.  Seleccione el reporte de **Saldos Abiertos a la Fecha**
3.  Desplegar la lista del el menú de relacciones, en la parte superior a la derecha de la ventana.
4. Ubicar y seleccionar el reporte **Saldos Abiertos**.



#### Versión Vue:
<img :src="$withBase('/images/use-cases/report/open-relations-vue.gif')" alt="ZK Desktop" width="800px">




### Re Abrir Reporte desde el Histórico Procesos

Aperturar un reporte el **Histórico Procesos** con los parámetros ejecutados del reporte seleccionado

Actualmente en el cliente ZK de ADempiere no cuenta con una caracteristica equivalente.

##### Versión Vue:
1. Ubicar en el árbol de menú en **Histórico Procesos** y abrirlo.
2. Seleccionar cualquier reporte con parametros **Saldo en Banco**.

<img :src="$withBase('/images/use-cases/report/open-process-activity.gif')" alt="ZK Desktop" width="800px">

## Carga
### Parámetros
Los parámetros (campos) de los procesos deben cargar al abrirse en el caso de que el reporte maneje parámetros segun cada tipo de visualizacion.

1. Abrir el reporte **Saldos Abiertos**.
2. Notese los diferentes tipos de parámetros: Cadena, Si y No, Fecha, Monto, Lista, Tabla.

##### Versión ZK:
<img :src="$withBase('/images/use-cases/report/carga-params-zk.png')" alt="ZK Desktop" width="800px">

##### Versión Vue:
<img :src="$withBase('/images/use-cases/report/carga-params-vue.png')" alt="ZK Desktop" width="800px">


### Visualización
Al cargar todos los parámetros con valor por defecto, o con obligatoriedad se visualizan en la primera carga.

##### Versión ZK:
Actualmente en la interfaz del zk al abrir un reporte en este caso **Saldos Abiertos** carga todos los campos en la vista 
<img :src="$withBase('/images/use-cases/report/carga-params-zk.gif')" alt="ZK Desktop" width="800px">

##### Versión Vue:
En la interfaz de ADempiere-Vue abrir un reporte en este caso **Saldos Abiertos** solo muestra los campos con valor por defecto, o con obligatoriedad.
Creando asi una vista mas agradable y minimalista para el usuario
<img :src="$withBase('/images/use-cases/report/carga-display.gif')" alt="ZK Desktop" width="800px">

### Obligatoriedad

##### Versión ZK:
1. Abrir el reporte **Saldo en Banco**.
2. Los campos obligatorios muestran con un asterisco (*) rojo al lado derecho de su nombre.
<img :src="$withBase('/images/use-cases/report/carga-mandatory-zk.png')" alt="ZK Desktop" width="800px">

##### Versión Vue:
1. Abrir el reporte **Saldo en Banco**.
2. Los campos obligatorios muestran con un asterisco (*) rojo al lado derecho de su nombre, y aquellos obligatorios vacios resaltan con un borde rojo sobre el campo.
<img :src="$withBase('/images/use-cases/report/carga-mandatory-vue.png')" alt="ZK Desktop" width="800px">


<!-- ### Solo Lectura -->


### Valor por Defecto

Manejar valor por defecto para los distintos tipos de parámetros.

##### Versión Vue:
1. Abrir el reporte **Asignación de Pago**.
2. Hacer clic contrario en el valor del parámetro y seleccionar **Valor de Preferencia**.
3. Observe que el parámetro **Document Status** tiene valor por defecto (CO = Completo).

<img :src="$withBase('/images/use-cases/report/carga-defaul-value-zk.gif')" alt="ZK Desktop" width="800px">


##### Versión Vue:
1. Abrir el reporte **Asignación de Pago**.
2. Hacer clic en el nombre del parámetro y seleccionar **Información** o **Preferencia**.
3. Observe que el parámetro **Document Status** tiene valor por defecto (CO = Completo).

<img :src="$withBase('/images/use-cases/report/carga-defaul-value-vue.gif')" alt="ZK Desktop" width="800px">

### Acercar

En ADempiere actualmente se puede acceder a una ventana desde un campo que está en otro que está relacionado, como se muestra a continuación.


##### Versión Vue:
1. Abrir el reporte **Detalle de Selección de Pagos**.
2. Hacer clic contrario en el parámetro **Cargo** y seleccionar **Acercar**.

<img :src="$withBase('/images/use-cases/report/carga-zoom-zk.gif')" alt="ZK Desktop" width="800px">

##### Versión Vue:
1. Abrir el reporte **Detalle de Selección de Pagos**.
2. Hacer clic contrario en el parámetro **Cargo** y seleccionar **Acercar**.

<img :src="$withBase('/images/use-cases/report/carga-zoom-vue.gif')" alt="ZK Desktop" width="800px">

## Ejecución

<!--### Validación
Se deben asegurar las siguientes validaciones para poder ejecutar un reporte:

* Todos los campos obligatorios deben tener valores.
* Si es reporte asociado a una ventana no permite ejecutarse en un nuevo registro.
* Si es reporte asociado a una consulta inteligente debe tener minímo una fila selecionada.

<video width="800px" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/process-validate-mandatory-vue.mp4')">
  Your browser does not support the mp4 video tag.
</video>


### Ejecución
1. Desplegar el árbol de menu en **Relación con Socios del Negocio**.
2. Seleccionar el reporte **Envío Texto Correo Electrónico**.
3. Llenar los campos.
4. Ejecutar en el menu de acciones.


### Cierre del Reporte al Ejecutarse
Al comenzar la ejecución de un reporte, debe cerrar la vista actual.

<video width="800px" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/process-run-vue.mp4')">
  Your browser does not support the mp4 video tag.
</video>

### Salida
La salida es visuble al culminar la ejecucion del reporte, como notificación, sin embargo puede visualizarse en el historico de procesos.

<img :src="$withBase('/images/use-cases/process-log-vue.png')" alt="Vue Desktop" width="800px">

--->
