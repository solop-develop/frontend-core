# Casos de Uso: Procesos

## Apertura

### Árbol de Menú
Aperturar un proceso dede el arbol de menú:
1. Desplegar el árbol de menu en **Relación con Socios del Negocio**.
2. Seleccionar el proceso **Envío Texto Correo Electrónico**.

##### Versión ZK:
<img :src="$withBase('/images/use-cases/process-opened-menu-zk.gif')" alt="ZK Desktop" width="800px">

##### Versión Vue:
<img :src="$withBase('/images/use-cases/process-opened-menu-vue.gif')" alt="ZK Desktop" width="800px">



### Buscador del Menú
Aperturar un proceso desde el buscador del menú:

1. Desplegar el árbol de menu.
2. En el buscador de la parte superior escribir **Envío Texto Correo Electrónico**.
3. Seleccionar el proceso coincidente con el resultado.

##### Versión ZK:
<video width="800px" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/process-menu-lookup-zk.mp4')">
  Your browser does not support the mp4 video tag.
</video>

##### Versión Vue:
1. Hacer clic en la lupa ubicada a la derecha de la cabecera.
2. En el buscador que se despliega escribir **Envío Texto Correo Electrónico**.
3. Seleccionar el proceso coincidente con el resultado.

<video width="800px" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/process-menu-lookup-vue.mp4')">
  Your browser does not support the mp4 video tag.
</video>



### Ítems Recientes
Aperturar un proceso de ítems recientes:

1. Ubicar el tablero **Ítems Recientes**.
2. Seleccionar caulquier proceso.

##### Versión Vue:
<video width="800px" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/process-recent-items-vue.mp4')">
  Your browser does not support the mp4 video tag.
</video>

### Relaciones
Aperturar un proceso desde las relaciones del mismo nivel del menú:

1. Desplegar el árbol de menú en **Relación con Socios del Negocio**.
2. Seleccionar la ventana **Información de Agentes de la Compañía**.
3. Desplegar la lista del el menú de relacciones, en la parte superior a la derecha de la ventana.
4. Ubicar y seleccionar el proceso **Envío Texto Correo Electrónico**.

##### Versión ZK:
El cliente ZK de ADempiere no cuenta con una caracteristica equivalente.

##### Versión Vue:
<video width="800px" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/process-relations-vue.mp4')">
  Your browser does not support the mp4 video tag.
</video>



### Proceso relacionado a la Ventana
Abrir los procesos asociados en la ventana:

##### Versión ZK:
1. Desplegar el árbol de menú en **Relación con Socios del Negocio**.
2. Seleccionar la ventana **Información de Agentes de la Compañía**.
3. Dar clic en el icono del engranaje, en la barra superior, para listar los procesos.
4. Seleccionar el proceso **Generar Token para Acceso de Terceros**

<video width="800px" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/process-window-zk.mp4')">
  Your browser does not support the mp4 video tag.
</video>

##### Versión Vue:
1. Desplegar el árbol de menú en **Relación con Socios del Negocio**.
2. Seleccionar la ventana **Información de Agentes de la Compañía**.
3. En la parte superior a la derecha listar, listar el menú de acciones.
4. Seleccionar el proceso **Generar Token para Acceso de Terceros**

<video width="800px" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/process-window-vue.mp4')">
  Your browser does not support the mp4 video tag.
</video>



### Re Abrir Proceso desde el Histórico Procesos

Aperturar un proceso el **Histórico Procesos** con los parámetros ejecutados del proceso seleccionado:

##### Versión ZK:
El cliente ZK de ADempiere no cuenta con una caracteristica equivalente.

##### Versión Vue:
1. Ubicar en el árbol de menú en **Histórico Procesos** y abrirlo.
2. Seleccionar cualquier proceso con parametros **Envío Texto Correo Electrónico**.
<video width="800px" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/process-relations-vue.mp4')">
  Your browser does not support the mp4 video tag.
</video>


## Carga
### Parámetros
Los parámetros (campos) de los procesos deben cargar al abrirse en el caso de que el proceso maneje parámetros segun cada tipo de visualizacion.

1. Abrir el proceso **Transferencia Bancaria**.
2. Notese los diferentes tipos de parámetros: Cadena, Si y No, Fecha, Monto, Lista, Tabla.

##### Versión ZK:
<img :src="$withBase('/images/use-cases/process-parameters-zk.png')" alt="ZK Desktop" width="800px">

##### Versión Vue:
<img :src="$withBase('/images/use-cases/process-parameters-vue.png')" alt="ZK Desktop" width="800px">


### Validaciones Dinámicas
Para los campos de seleccionables (Lista, Tabla y Tabla Directa), deben filtrarse los resultados cuando dicho parámetro tenga alguna validación dinámica.

1. Abrir el proceso **Transferencia Bancaria**.
2. Listar los valores del campo **Cuenta Bancaria Desde**.
3. Seleccionar un valor.
4. Listar los valores del campo **Cuenta Bancaria Para** y verificar que el valor seleccionado en el campo anterior se excluye del resultado.

##### Versión ZK:
<video width="800px" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/process-dynamic-validation-zk.mp4')">
  Your browser does not support the mp4 video tag.
</video>

##### Versión Vue:
<video width="800px" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/process-dynamic-validation-vue.mp4')">
  Your browser does not support the mp4 video tag.
</video>



### Visualización
1. Todos los parámetros con valor por defecto, o con obligatoriedad se visualizan en la primera carga.


### Obligatoriedad

##### Versión ZK:
1. Abrir el proceso **Transferencia Bancaria**.
2. Los campos obligatorios muestran con un asterisco (*) rojo al lado derecho de su nombre.
<img :src="$withBase('/images/use-cases/process-mandatory-zk.png')" alt="ZK Desktop" width="800px">

##### Versión Vue:
1. Abrir el proceso **Transferencia Bancaria**.
2. Los campos obligatorios muestran con un asterisco (*) rojo al lado derecho de su nombre, y aquellos obligatorios vacios resaltan con un borde rojo sobre el campo.
<img :src="$withBase('/images/use-cases/process-mandatory-vue.png')" alt="ZK Desktop" width="800px">


<!-- ### Solo Lectura -->


### Valor por Defecto

Manejar valor por defecto para los distintos tipos de parámetros.

##### Versión Vue:
1. Abrir el proceso **Transferencia Bancaria**.
2. Hacer clic contrario en el valor del parámetro y seleccionar **Valor de Preferencia**.
3. Observe que el parámetro **Tipo de Pago** tiene valor por defecto (A = Deposito Directo).

<video width="800px" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/process-default-value-zk.mp4')">
  Your browser does not support the mp4 video tag.
</video>

##### Versión Vue:
1. Abrir el proceso **Transferencia Bancaria**.
2. Hacer clic en el nombre del parámetro y seleccionar **Información**.
3. Observe que el parámetro **Fecha de Estado de Cuenta** y parámetro **Tipo de Pago** tienen valores por defectos y debidamente establecidos en los parámetros.

<video width="800px" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/process-default-value-vue.mp4')">
  Your browser does not support the mp4 video tag.
</video>

<!-- #### Acercar -->



## Ejecución

### Validación
Se deben asegurar las siguientes validaciones para poder ejecutar un proceso:

* Todos los campos obligatorios deben tener valores.
* Si es proceso asociado a una ventana no permite ejecutarse en un nuevo registro.
* Si es proceso asociado a una consulta inteligente debe tener minímo una fila selecionada.

<video width="800px" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/process-validate-mandatory-vue.mp4')">
  Your browser does not support the mp4 video tag.
</video>


### Ejecución
1. Desplegar el árbol de menu en **Relación con Socios del Negocio**.
2. Seleccionar el proceso **Envío Texto Correo Electrónico**.
3. Llenar los campos.
4. Ejecutar en el menu de acciones.


### Cierre del Proceso al Ejecutarse
Al comenzar la ejecución de un proceso, debe cerrar la vista actual.

<video width="800px" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/process-run-vue.mp4')">
  Your browser does not support the mp4 video tag.
</video>

### Salida
La salida es visuble al culminar la ejecucion del proceso, como notificación, sin embargo puede visualizarse en el historico de procesos.

<img :src="$withBase('/images/use-cases/process-log-vue.png')" alt="Vue Desktop" width="800px">
