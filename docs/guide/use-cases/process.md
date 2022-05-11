# Use Cases: Process

## Opening

### Menu Tree
Open a process from the menu tree:
1. Expand the menu tree in **Business Partner Relationship**.
2. Select the **Send Text Email** process.

##### Zk Version:
<img :src="$withBase('/images/use-cases/process-opened-menu-zk.gif')" alt="ZK Desktop" width="800px">

##### Vue Version:
<img :src="$withBase('/images/use-cases/process-opened-menu-vue.gif')" alt="ZK Desktop" width="800px">



### Menu Lookup
Open a process from the menu Lookup:

1. Display the menu tree.
2. In the search engine at the top, type **Send Text Email**.
3. Select the process that matches the result.

##### Zk Version:
<video width="800px" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/process-menu-lookup-zk.mp4')">
  Your browser does not support the mp4 video tag.
</video>

##### Vue Version:
1. Click on the magnifying glass located to the right of the header.
2. In the search engine that appears type **Send Text Email**.
3. Select the process that matches the result.

<video width="800px" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/process-menu-lookup-vue.mp4')">
  Your browser does not support the mp4 video tag.
</video>



### Recent Items
Open a recent items process:

1. Locate the **Recent Items** dashboard.
2. Select any process.

##### Vue Version:
<video width="800px" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/process-recent-items-vue.mp4')">
  Your browser does not support the mp4 video tag.
</video>

### Relations
Open a process from the relationships of the same menu level:

1. Expand the menu tree under **Business Partner Relationship**.
2. Select the **Company Agent Information** window.
3. Expand the list of the relationship menu, in the upper right part of the window.
4. Locate and select the **Send Text Email** process.

##### Zk Version:
ADempiere Zk client does not have an equivalent feature.

##### Vue Version:
<video width="800px" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/process-relations-vue.mp4')">
  Your browser does not support the mp4 video tag.
</video>



### Process related to the Window
Open the associated processes in the window:

##### Zk Version:
1. Display the menu tree under **Business Partner Relationship**.
2. Select the **Company Agent Information** window.
3. Click on the gear icon in the top bar to list the processes.
4. Select the **Generate Token for Third Party Access** process.

<video width="800px" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/process-window-zk.mp4')">
  Your browser does not support the mp4 video tag.
</video>

##### Vue Version:
1. Display the menu tree under **Business Partner Relationship**. 2.
2. Select the **Company Agent Information** window.
3. In the top right list, list the actions menu.
4. Select the **Generate Token for Third Party Access** process.

<video width="800px" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/process-window-vue.mp4')">
  Your browser does not support the mp4 video tag.
</video>



### Reopen Process from Process Log

Open a process in the **Processes Log** with the executed parameters of the selected process:

##### Zk Version:
ADempiere Zk client does not have an equivalent feature.

##### Vue Version:
1. Locate in the menu tree under **Historical Processes** and open it.
2. Select any process with parameters **Send Text Email**.
<video width="800px" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/process-relations-vue.mp4')">
  Your browser does not support the mp4 video tag.
</video>


## Load

### Parameters
The parameters (fields) of the processes must load when opening in the case that the process handles parameters according to each type of visualization.

1. Open the **Bank Transfer** process.
2. Note the different types of parameters: String, Yes and No, Date, Amount, List, Table.

##### Zk Version:
<img :src="$withBase('/images/use-cases/process-parameters-zk.png')" alt="ZK Desktop" width="800px">

##### Vue Version:
<img :src="$withBase('/images/use-cases/process-parameters-vue.png')" alt="ZK Desktop" width="800px">


### Dynamic Validations
For the selectable fields (List, Table and Direct Table), the results must be filtered when this parameter has any dynamic validation.

1. Open the **Bank Transfer** process.
2. List the values of the **Bank Account From** field.
3. Select a value.
4. List the values of the **Bank Account To** field and verify that the value selected in the previous field is excluded from the result.

##### Zk Version:
<video width="800px" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/process-dynamic-validation-zk.mp4')">
  Your browser does not support the mp4 video tag.
</video>

##### Vue Version:
<video width="800px" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/process-dynamic-validation-vue.mp4')">
  Your browser does not support the mp4 video tag.
</video>



### Displayed
1. All parameters with default or mandatory values are displayed at the first load.


### Mandatory

##### Zk Version:
1. Open the **Bank Transfer** process.
2. Mandatory fields are shown with a red asterisk (*) on the right side of their name.
<img :src="$withBase('/images/use-cases/process-mandatory-zk.png')" alt="ZK Desktop" width="800px">

##### Vue Version:
1. Open the **Bank Transfer** process.
2. Mandatory fields are shown with a red asterisk (*) to the right of their name, and empty mandatory fields are highlighted with a red border above the field.
<img :src="$withBase('/images/use-cases/process-mandatory-vue.png')" alt="ZK Desktop" width="800px">


<!-- ### Reading Only -->


###Default Value

Manage default values for the different types of parameters.

##### Vue Version:
1. Open the **Bank Transfer** process.
2. Click opposite on the parameter value and select **Preference Value**.
3. Note that the **Payment Type** parameter has a default value (A = Direct Deposit).

<video width="800px" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/process-default-value-zk.mp4')">
  Your browser does not support the mp4 video tag.
</video>

##### Vue Version:
1. Open the **Bank Transfer** process.
2. Click on the parameter name and select **Information**.
3. Note that the **Statement Date** parameter and **Payment Type** parameter have default values and are properly set in the parameters.

<video width="800px" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/process-default-value-vue.mp4')">
  Your browser does not support the mp4 video tag.
</video>

<!-- #### Zoom In -->



## Execution

### Validation
The following validations must be ensured in order to execute a process:

* All mandatory fields must have values.
* If it is a process associated to a window, it is not allowed to be executed in a new record.
* If it is a process associated to an intelligent query it must have at least one selected row.

<video width="800px" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/process-validate-mandatory-vue.mp4')">
  Your browser does not support the mp4 video tag.
</video>


### Execution
1. Display the menu tree in **Business Partner Relationship**.
2. Select the **Send Text Email** process.
3. Fill in the fields.
4. Execute in the action menu.


### Closing the Process on Execution
When starting the execution of a process, you must close the current view.

<video width="800px" controls>
  <source type="video/mp4" :src="$withBase('/images/use-cases/process-run-vue.mp4')">
  Your browser does not support the mp4 video tag.
</video>

### Output
The output is visible at the end of the process execution, as a notification, however it can be displayed in the process history.

<img :src="$withBase('/images/use-cases/process-log-vue.png')" alt="Vue Desktop" width="800px">
