# Casos de Uso: Procesos

## Apertura

#### Árbol de Menú
Aperturar un proceso dede el arbol de menú:
1. Desplegar el árbol de menu en **Relación con Socios del Negocio**.
2. Seleccionar el proceso **Envío Texto Correo Electrónico**.

##### Versión ZK:
<img :src="$withBase('/images/use-cases/process-opened-menu-zk.gif')" alt="ZK Desktop" width="800px">

##### Versión Vue:
<img :src="$withBase('/images/use-cases/process-opened-menu-vue.gif')" alt="ZK Desktop" width="800px">



#### Buscador del Menú
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



#### Ítems Recientes
Aperturar un proceso de ítems recientes:

1. Ubicar el tablero **Ítems Recientes**.
2. Seleccionar caulquier proceso.

##### Versión Vue:
<video width="800px" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/process-recent-items-vue.mp4')">
  Your browser does not support the mp4 video tag.
</video>

#### Relaciones
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



#### Proceso relacionado a la Ventana
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



#### Re Abrir Proceso desde el Histórico Procesos

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
#### Parámetros
#### Validaciones Dinámicas
#### Visualización
#### Obligatoriedad
#### Solo Lectura
#### Valor por Defecto
#### Acercar



## Ejecución
#### Envio de Parámetros
#### Validación
#### Ejecución
#### Salida
#### Cierre del Proceso al Ejecutarse
Al comenzar la ejecución de un proceso, debe cerrar la vista actual.
1. Llenar los campos obligatorios (si los tiene).
2. Pulsar el boton **Ejecutar**.

##### Versión ZK:
<img :src="$withBase('/images/use-cases/process-run-close-zk.gif')" alt="ZK Desktop" width="800px">

##### Versión Vue:
<img :src="$withBase('/images/use-cases/process-run-close-vue.gif')" alt="ZK Desktop" width="800px">
