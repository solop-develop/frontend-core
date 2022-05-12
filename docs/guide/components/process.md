# Process

The "Process" component displays a minimalistic view which is made up of multiple parameters which are used to execute the current process. This component also has dynamic validations and visualization of the fields.

#

## ADempiere-ZK Desktop Version Processes

<img :src="$withBase('/images/components/process/zk.png')" alt="Procesos en Versión de Escritorio ZK" width="600px">

## ADempiere-Vue Desktop Version Processes

<img :src="$withBase('/images/components/process/vue.png')" alt="Procesos en Versión Escritorio" width="600px">

## ADempiere-Vue Mobile Version Processes

<img :src="$withBase('/images/components/process/vue-mobile.png')" alt="Procesos en Versión Móvil" width="600px">

This component also has a menu located on the top right side. It consists of 3 options: Execution, Relations and References.


## **Process Component Menu**
<img :src="$withBase('/images/components/process/menu-process.png')" alt="Menu de Procesos en Versión Escritorio" width="800px">


  - **Execution:** This option has all the executions of the current process and is identified with a blue background. This option is both a quick run and a drop-down list with the process name and description. By default the main action in the run list is always first. 
  <br>
  <img :src="$withBase('/images/components/process/menu-action.gif')" alt="Procesos en Versión Escritorio" width="800px">
  - **Relations:** This option has all the Windows, Processes, Smart Browser and Report that are related to the current process. In case of relationships this option has a drop-down list which when selecting an option will redirect to the selected option and this option is identified with a green background. 
  <img :src="$withBase('/images/components/process/menu-releations.gif')" alt="Procesos en Versión Escritorio" width="800px">
  <br>
  - **References:** This option is disabled for the processes as it is not relevant to their operation and this option is identified with an orange background.
  <img :src="$withBase('/images/components/process/menu-referens.gif')" alt="Procesos en Versión Escritorio" width="800px">

## Display Fields

For a more minimalist and simpler view, the fields in the process component, although they maintain the same order, are hidden by default unless the field has a default value or is mandatory. 

<img :src="$withBase('/images/components/process/field.gif')" width="800px">


## ¿How to use in the Desktop version?

In the desktop version you must fill in all the required fields and go to the menu to execute the process.

<img :src="$withBase('/images/components/process/run-process.gif')" />

## ¿How to use in the mobile version?

In the desktop version you must fill in all the required fields and go to the menu to execute the process.

<img :src="$withBase('/images/components/process/run-process-mobile.gif')"  width="800px"/>
