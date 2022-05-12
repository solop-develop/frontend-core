# Proceso

El componente de "Proceso", Muestra una vista minimalista la cual está conformada de  múltiples parámetros con los cuales se utilizan para ejecutar el proceso actual. Este componente también cuenta con validaciones dinámicas y visualización de los campos.

#

## Procesos en Versión de Escritorio ADempiere-ZK

<img :src="$withBase('/images/components/process/zk.png')" alt="Procesos en Versión de Escritorio ZK" width="600px">

## Procesos en Versión Escritorio ADempiere-Vue

<img :src="$withBase('/images/components/process/vue.png')" alt="Procesos en Versión Escritorio" width="600px">

## Procesos en Versión Móvil ADempiere-Vue

<img :src="$withBase('/images/components/process/vue-mobile.png')" alt="Procesos en Versión Móvil" width="600px">

Dicho componente también cuenta con un menú ubicado en la parte superior alineado a la derecha. El cual está conformada por 3 opciones Ejecución, Relaciones y Referencias.


## **Menú del Componente Proceso**
<img :src="$withBase('/images/components/process/menu-process.png')" alt="Menu de Procesos en Versión Escritorio" width="800px">


  - **Ejecución:** Esta opción cuenta con todas las ejecuciones del proceso actual y se identifica con un fondo azul. Esta opción es tanto como de ejecución rápida como también una  lista desplegable con el nombre del proceso y descripción. Por defecto la acción principal de la lista de ejecución siempre esta de primera 
  <br>
  <img :src="$withBase('/images/components/process/menu-action.gif')" alt="Procesos en Versión Escritorio" width="800px">
  - **Relaciones:** Esta opción cuenta con todas las Ventanas, Procesos, Smart Browser y Reporte que estén relacionada con el proceso actual. En caso de tener relaciones esta opción cuenta con una lista desplegable el cual al seleccionar una opción redirigirá a la opción seleccionada  y esta opción se identifica con un fondo verde.
  <img :src="$withBase('/images/components/process/menu-releations.gif')" alt="Procesos en Versión Escritorio" width="800px">
  <br>
  - **Referencia:** Esta opción se encuentra deshabilitada para los procesos ya que no es relevante para su funcionamiento y esta opción se identifica con un fondo anaranjado.
  <img :src="$withBase('/images/components/process/menu-referens.gif')" alt="Procesos en Versión Escritorio" width="800px">

## Visualización de los campos

Para una vista más minimalista y sencilla los campos en el componente proceso aunque mantienen el mismo orden se encuentran ocultos por defectos al menos que el campo tenga un valor por defecto o sean obligatorio 

<img :src="$withBase('/images/components/process/field.gif')" width="800px">


## ¿Cómo se utiliza en la versión de Escritorio?

En la versión de escritorio debe llenar todos los campos obligatorio y dirigirse al menu para poder ejecutar el proceso

<img :src="$withBase('/images/components/process/run-process.gif')" />

## ¿Cómo se utiliza en la versión móvil?

En la versión de escritorio debe llenar todos los campos obligatorio y dirigirse al menu para poder ejecutar el proceso

<img :src="$withBase('/images/components/process/run-process-mobile.gif')"  width="800px"/>
