n## Use Cases: Report

## Open

### Menu Tree
Open a report from the menu tree:
1. Pull down the menu tree to **Manage Open Balances**.
2. Select the **Open Balances** report.

#### ZK Version:
<img :src="$withBase('/images/use-cases/report/open-menu-zk.gif')" alt="ZK Desktop" width="800px">

#### Vue Version:
<img :src="$withBase('/images/use-cases/report/open-menu-vue.gif')" alt="ZK Desktop" width="800px">


### Menu Browser
Open a report from the menu browser:

1. Pull down the menu tree.
2. In the search box at the top type **Open Balances**.
3. Select the report matching the result.

##### ZK Version:
<img :src="$withBase('/images/use-cases/report/open-search-menu.gif')" alt="ZK Desktop" width="800px">

##### Vue Version:
<img :src="$withBase('/images/use-cases/report/open-search-menu-vue.gif')" alt="ZK Desktop" width="800px">


### Recent Items
Open a report of recent items:

1. Locate the **Recent Items** dashboard.
2. Select any report or in case of using the quick search of the recent items table select the report matching the result.

##### ZK Version:
<img :src="$withBase('/images/use-cases/report/open-recent-item-zk.gif')" alt="ZK Desktop" width="800px">

##### Vue Version:
<img :src="$withBase('/images/use-cases/report/open-recient-item-vue.gif')" alt="ZK Desktop" width="800px">


### Relationships
Open a report from the same menu level relations:

ADempiere's ZK client does not have an equivalent feature.


### Steps to follow

1. Pull down the menu tree to **Manage Outstanding Balances**.
2. Select the **Open Balances to Date** report.
3.  Pull down the list from the Relationship menu in the upper right hand side of the window.
4. Locate and select the **Open Balances** report.



#### Vue Version:
<img :src="$withBase('/images/use-cases/report/open-relations-vue.gif')" alt="ZK Desktop" width="800px">


### Re Open Report from the Process History

Open a report from the **Process History** with the executed parameters of the selected report.

Currently the ADempiere ZK client does not have an equivalent feature.

##### Vue version:
1. Locate in the menu tree in **Historical Processes** and open it.
2. Select any report with parameters **Balance in Bank**.

<img :src="$withBase('/images/use-cases/report/open-process-activity.gif')" alt="ZK Desktop" width="800px">

## Loading
### Parameters
The parameters (fields) of the processes must be loaded when opening in case the report handles parameters according to each type of visualization.

1. Open the **Open Balances** report.
2. Note the different types of parameters: String, Yes and No, Date, Amount, List, Table.

##### ZK Version:
<img :src="$withBase('/images/use-cases/report/carga-params.gif')" alt="ZK Desktop" width="800px">

##### Vue Version:
<img :src="$withBase('/images/use-cases/report/load-params-vue.png')" alt="ZK Desktop" width="800px">


### Display
When loading all parameters with default value, or with mandatory are displayed on first load.

##### ZK Version:
Currently in the zk interface when opening a report in this case **Open Balances** loads all fields in the view. 
<img :src="$withBase('/images/use-cases/report/load-params.gif')" alt="ZK Desktop" width="800px">

##### Vue Version:
In the ADempiere-Vue interface opening a report in this case **Open Balances** only shows the fields with default value, or with mandatory.
Thus creating a more pleasant and minimalistic view for the user.
<img :src="$withBase('/images/use-cases/report/load-display.gif')" alt="ZK Desktop" width="800px">

### Mandatory

##### ZK Version:
1. Open the **Balance in Bank** report.
2. Mandatory fields show with a red asterisk (*) on the right side of their name.
<img :src="$withBase('/images/use-cases/report/load-mandatory-zk.png')" alt="ZK Desktop" width="800px">

##### Vue Version:
1. Open the **Balance in Bank** report.
2. Mandatory fields show with a red asterisk (*) to the right side of their name, and empty mandatory fields highlight with a red border above the field.
<img :src="$withBase('/images/use-cases/report/load-mandatory-vue.png')" alt="ZK Desktop" width="800px">


<!-- ### Read Only -->


### Default Value

Handle default value for different types of parameters.

##### Vue Version:
1. Open the **Payment Assignment** report.
2. Counter click on the parameter value and select **Preference Value**.
3. Note that the **Document Status** parameter has default value (CO = Complete).

<img :src="$withBase('/images/use-cases/report/load-defaul-value-zk.gif')" alt="ZK Desktop" width="800px">


##### Vue Version:
1. Open the **Payment Assignment** report.
2. Click on the parameter name and select **Information** or **Preference**.
3. Note that the **Document Status** parameter has default value (CO = Complete).

<img :src="$withBase('/images/use-cases/report/load-defaul-value-vue.gif')" alt="ZK Desktop" width="800px">

### Zoom in

In ADempiere you can currently access a window from a field that is in another field that is related, as shown below.


##### Vue version:
1. Open the **Payment Selection Detail** report.
2. Counter click on the **Charge** parameter and select **Find**.

<img :src="$withBase('/images/use-cases/report/carga-zoom-zk.gif')" alt="ZK Desktop" width="800px">

##### Vue Version:
1. Open the **Payment Selection Detail** report.
2. Counter click on the **Charge** parameter and select **Find**.

<img :src="$withBase('/images/use-cases/report/load-zoom-vue.gif')" alt="ZK Desktop" width="800px">

## Execution

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
