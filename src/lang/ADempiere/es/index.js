/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com https://github.com/EdwinBetanc0urt
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import actionMenu from './actionMenu'
import businessPartner from './businessPartner'
import component from './component'
import field from './field'
import form from './form'
import orderList from './orderList'
import page from './page'
import process from './process'
import extensionFile from './extensionFile'
import fieldDisplayOptions from './fieldDisplayOptions'
import fieldOptions from './fieldOptions'
import recordManager from './recordManager'
import route from './route'
import smartBrowser from './smartBrowser'
import infoSearch from './fieldFormSearch'
import report from './report.js'
import window from './window'
import workflow from './workflow'
import operators from './operators.ts'

/**
 * Translations of Forms
 */
import actionNotice from './form/actionNotice'
import payrollActionNotice from './form/payrollActionNotice'
import pointOfSales from './form/pointOfSales'
import listStoreProduct from './form/listStoreProduct'
import timeControl from './form/timeControl'
import VPayPrint from './form/VPayPrint'
import issues from './form/issues'

export default {
  actionMenu,
  businessPartner,
  component,
  field,
  orderList,
  page,
  process,
  extensionFile,
  fieldDisplayOptions,
  infoSearch,
  fieldOptions,
  recordManager,
  route,
  smartBrowser,
  actionNotice,
  payrollActionNotice,
  pointOfSales,
  listStoreProduct,
  report,
  workflow,
  issues,
  operators,

  language: 'Idioma',
  timeControl,
  VPayPrint,
  notifications: {
    // simplex
    completed: 'Completado',
    loading: 'Cargando',
    succesful: ' Exitoso ',
    error: ' Error ',
    opened: 'Abierto',
    totalProcess: 'Total de Registros Procesador ',
    // search
    searching: 'Buscando registros en el servidor',
    succcessSearch: 'La búsqueda se ha realizado',
    searchWithOutRecords: 'La búsqueda finalizo sin resultados',
    errorSearch: 'La búsqueda no se ha completado',
    // process
    processing: 'Procesando',
    processExecuted: 'Ejecutado, ver histórico de procesos',
    processError: 'No fue ejecutado',
    //
    emptyValues: 'Parametro(s) con valores vacios',
    fieldCannotBeEmpty: 'El valor del campo no puede estar vacío',
    fieldMandatory: 'El campo es obligatorio',
    requestError: 'Error al ejecutar la petición',
    successChangeRole: 'El rol se ha cambiado',
    errorChangeRole: 'El rol no se ha cambiado',
    copySuccessful: 'Copiado',
    copyUnsuccessful: 'Error, no se puede copiar',
    actionToTake: 'Acción a realizar',
    mandatoryFieldMissing: 'Falta completar los campos ',
    updateFields: 'Se actualiza el registro con el campo ',
    updateSuccessfully: 'Cambios realizados exitosamente',
    invalidEmailFormat: 'Formato de correo electronico invalido',
    recordLocked: 'Este registro ha sido bloqueado',
    recordUnlocked: 'Este registro ha sido desbloqueado',
    noRoleAccess: 'Con su rol y configuración actuales, no puede ver esta información',
    errorPointOfSale: 'Sin punto de venta seleccionado',
    emptyPos: 'Este Usuario no tiene Ningún Terminal de PDV Asignado'
  },
  navbar: {
    badge: {
      Notifications: 'Notificaciones',
      activity: 'Flujos de Trabajos por Aprobar',
      link: 'Ir a Histórico de Procesos'
    },
    resetCache: 'Reiniciar Cache',
    logOut: 'Salir',
    dashboard: 'Panel de control',
    github: 'Github',
    theme: 'Tema',
    size: 'Tamaño global',
    profile: 'Perfil'
  },
  documentation: {
    documentation: 'Documentación',
    github: 'Repositorio Github',
    releases: 'Liberaciones',
    branches: 'Ramas',
    code: 'Código',
    issues: 'Asuntos',
    downloadZip: 'descargar  Zip',
    releaseNotes: 'Nota de Liberaciones',
    goRepository: 'Ir al Repositorio',
    seeDocumentation: 'Ver Documentación'
  },
  components: {
    documentation: 'Documentación',
    binaryButton: 'Subir archivo',
    binaryTip: 'Solo archivos con un tamaño menor a 500kb',
    imageError: 'La imagen excede los 2MB y no cumple con los formato validos!',
    contextMenuActions: 'Acciones',
    contextMenuReferences: 'Referencias',
    contextMenuDownload: 'Descargar',
    dialogCancelButton: 'Cancelar',
    dialogConfirmButton: 'Confirmar',
    filterableItems: 'Columnas Opcionales',
    searchRecord: 'Buscar Registro',
    fixedleItems: 'Columnas Fijas',
    switchActiveText: 'Si',
    switchInactiveText: 'No',
    todoList: 'Por Hacer'
  },
  grid: {
    recordAccess: {
      accessGranted: 'Acceso otorgado a los roles'
    }
  },
  views: {
    browser: 'Consulta Inteligente',
    smartBrowser: 'Consulta Inteligente',
    process: 'Proceso',
    window: 'Ventana',
    report: 'Reporte',
    workflow: 'Flujo de Trabajo',
    task: 'Tarea',
    form: 'Formulario',
    noProcess: 'No hay procesos en ejecución',
    logs: 'Resumen',
    log: 'Bitacora',
    seeReport: 'Ver Reporte',
    summary: 'Resumen',
    viewsHelp: 'Ayuda',
    searchCriteria: 'Criterio de Búsqueda',
    unsupportedSorry: 'Lo sentimos',
    unsupportedHeadline: 'Esta vista no está disponible actualmente',
    unsupportedInfo: 'Verifique que la vista sea compatible con esta versión, o haga clic en el botón a continuación para volver a la página de inicio',
    unsupportedButton: 'Volver al Panel de control',
    reportView: 'Vistas de Reporte',
    printFormat: 'Formatos de Impresión',
    drillTable: 'Entrar en Detalle'
  },
  table: {
    dataTable: {
      search: 'Buscar',
      selected: 'Seleccionados',
      nextRecord: 'Siguiente',
      previousRecord: 'Anteriror',
      recordsPage: 'Registros por Página',
      deleteSelection: 'Eliminar Registros Seleccionados',
      advancedQuery: 'Consulta Avanzada',
      exportZip: 'Exportar Zip',
      showAllColumns: 'Mostrar todas las Columnas',
      showMinimalistView: 'Mostrar Vista Minimalista',
      showOnlyMandatoryColumns: 'Mostrar Solo Columnas Obligatorias',
      showTableColumnsOnly: 'Mostrar Solo Columnas de la Tabla',
      showAllAvailableColumns: 'Mostrar Todas Columnas Disponibles',
      exportRecordTable: 'Exportar Registros Seleccionados',
      showTotal: 'Mostrar Totales',
      hiddenTotal: 'Ocultar Totales',
      batchEntry: 'Entrada por Lotes'
    },
    recentItems: {
      search: 'Filtrar por nombre, descripción o fecha',
      date: 'Fecha',
      name: 'Nombre',
      description: 'Descripción'
    }
  },
  profile: {
    aboutMe: 'Sobre Mi',
    recentItems: 'Artículos Recientes',
    favorites: 'Favoritos',
    PendingDocuments: 'Documentos Pendientes',
    recentItemsName: 'Nombre Ítems Recientes',
    role: 'Rol',
    availableRoles: 'Roles disponibles',
    currentRole: 'Rol actual',
    clientName: 'Nombre del cliente',
    description: 'Descripción',
    changeRole: 'Cambiar Rol',
    changeLanguage: 'Cambiar idioma',
    changeLanguagePlaceholder: 'Elija un idioma',
    activityLogs: 'Registros de Actividades',
    notice: 'Avisos',
    request: 'Solicitudes',
    workflowActivities: 'Flujos de Trabajo',
    systemInformation: {
      tabLabel: 'Información de Sistema',
      releaseNumber: 'Número de versión',
      backEndVersion: 'Versión del Back-End',
      dateVersion: 'Fecha Versión',
      proxyVersion: 'Versión del Proxy',
      deploymentName: 'Nombre de Implementación'
    }
  },
  window,
  data: {
    createRecordSuccessful: 'Nuevo registro creado con exito',
    createNewRecord: 'Modo nuevo registro',
    createRecordError: 'Error al crear nuevo registro',
    deleteRecordSuccessful: 'Registro eliminado exitosamente',
    deleteRecordError: 'Error al eliminar el regitro',
    exportRecord: 'Exportar Registro',
    noDescription: 'Sin Descripción',
    addDescription: 'Agregue una Descripción',
    recordAccess: {
      modeMobile: {
        accessRoles: 'Roles con Acceso',
        accessRolesIsReadonly: 'Roles con Acceso y Solo lectura',
        lockedRoles: 'Roles Bloqueados',
        lockedRolesIsDependentEntities: 'Roles Bloqueados con Entidades Dependientes'
      },
      actions: 'Acceso a Registros',
      availableRoles: 'Roles Disponibles',
      configRoles: 'Roles Configurados',
      isReadonly: 'Solo  Lectura',
      isDependentEntities: 'Entidades Dependientes',
      isLock: 'Bloquear',
      isUnlock: 'Desbloquear',
      isError: 'Error al '
    },
    selectionRequired: 'Debe seleccionar un registro',
    undo: 'Deshacer',
    notification: {
      lockRecord: 'El Registro fue Bloqueado',
      unlockRecord: 'El Registro fue Desbloqueado'
    },
    addNote: 'Agregar Nota',
    emptyNote: 'Este registro no posee ninguna nota',
    descriptionNote: 'Agregar Nota o Comentario al Registro'
  },
  quickAccess: {
    newRecord: 'Acceso Rápido para Crear Registro Nuevo',
    listRecords: 'Acceso Rápido para Listar los Registros',
    searchWithEnter: 'Pulse enter para realizar la busqueda del producto segun su Codigo, Nombre o UPC'
  },
  form: {
    ...form,
    pos: {
      title: 'Punto de Venta',
      priceList: 'Lista de Precio',
      releaseOrder: 'Liberar',
      applyDiscountOnOrder: 'Aplicar Descuento basado en Monto',
      fieldDiscountAmount: 'Monto de Descuento',
      salesDiscountOff: 'Aplicar Descuento en Venta',
      applyDiscountToAllLines: 'Aplicar Descuento a Todas las Lineas',
      returnProduct: 'Devolver Producto',
      createNewOrderRMA: 'Crear Nueva Orden desde el RMA',
      discountRate: '% Discounto',
      optionsPoinSales: {
        title: 'Opciones Rápidas del Punto de Ventas',
        emptyAvailablePaymentMethods: 'Éste Terminal no tiene Método de Pago configurado para permitir Reembolso',
        emptyAvailablePaymentMethodsRefudn: 'Éste Terminal no tiene Método de Pago configurado para permitir Reembolso Pendiente',
        emptyListCashSummary: 'No hay moviemineto en caja',
        salesOrder: {
          title: 'Orden de Venta',
          newOrder: 'Nueva Orden',
          ordersHistory: 'Histórico de Órdenes ',
          generateImmediateInvoice: 'Generar Factura Inmediata',
          completePreparedOrder: 'Completar Orden Preparada',
          cancelSaleTransaction: 'Anular Transacción de Venta',
          createPos: 'Crear Retiro de Punto de Venta',
          print: 'Imprimir Documento',
          preview: 'Ver Vista Previa',
          cancelOrder: 'Cancelar Orden',
          orderRemoved: 'Orden Borrada',
          copyOrder: 'Copiar Orden',
          newOrderFromRMA: 'Crear Nueva Orden desde RMA',
          createNewReturnOrder: 'Crear una nueva orden de devolución',
          confirmDelivery: 'Confirmar Entrega',
          deliverAllProducts: 'Entregar Todo',
          emptyProductDelivery: 'Producto no se Encuentra en la Orden'
        },
        cashManagement: {
          title: 'Gestión de Caja',
          cashOpening: 'Apertura',
          cashOpenBox: 'Caja Aperturada',
          cashwithdrawal: 'Retiro',
          transfer: 'Transferencia',
          moneyIncome: 'Ingreso',
          successfulCashWithdrawal: 'Retiro de caja exitoso',
          cashCloseBox: 'Caja Cerrada',
          closeBox: 'Cierre',
          detailedCloseBox: 'Cierre Detallado',
          assignSeller: 'Asignar vendedor',
          unassignSeller: 'Desasignar vendedor'
        },
        generalOptions: {
          title: 'Opciones Generales',
          changePos: 'Cambiar Punto de Venta',
          listProducts: 'Lista de Productos y Precios',
          changeWarehouseList: 'Cambiar de Almacén',
          changePriceList: 'Cambiar Lista de Precio',
          dateTo: 'Fecha Hasta',
          dateOrder: 'Fecha Orden',
          dateFrom: 'Fecha Desde',
          productQuery: 'Consulta de Producto'
        }
      },
      generalNotifications: {
        orderReleased: 'Orden Liberada: ',
        selectedOrder: 'Orden Seleccionada: '
      },
      tableProduct: {
        product: 'Producto',
        basePrice: 'Precio Base',
        baseQuantity: 'Cantidad Base',
        quantity: 'Cantidad',
        isQuantityFromOrderLine: 'Cantidad Completa de la Línea',
        uom: 'UM',
        unitOfMeasure: 'Unidad de Medida',
        baseMeasurementUnit: 'Unidad de Medida Base',
        options: 'Opciones',
        editQuantities: 'Editar Cantidades',
        pin: 'Ingrese Pin',
        remove: 'Eliminar',
        taxAmount: 'Impuesto',
        taxRate: '% Imp',
        displayDiscountAmount: 'Descuento',
        empty: 'Ingrese el nombre del producto, código o UPC',
        movementQuantity: 'Cantidad de Movimiento'
      },
      order: {
        order: 'Orden',
        seller: 'Vendedor',
        date: 'Fecha',
        subTotal: 'Sub-Total',
        type: 'Tipo',
        discount: '% Dcto',
        tax: 'Impuesto',
        total: 'Total',
        itemQuantity: 'Cantidad de Artículos',
        numberLines: 'Número de Líneas',
        pointSale: 'Punto de Venta',
        collect: 'Cobrar',
        collections: 'Cobros',
        campaign: 'Campaña',
        noCampaignSelected: 'Sin Campaña seleccionada',
        BusinessPartnerCreate: {
          phone: 'Telefono',
          businessPartner: 'Socio de Negocios',
          successfullyCreated: 'Socio de Negocio Creado Exitosamente',
          customerData: 'Datos del Cliente',
          addBillingAddress: 'Agregar Dirección de Facturación',
          billingAddress: 'Dirección de Facturación',
          shippingAddress: 'Dirección de Envío',
          withoutSetting: 'Sin Establecer',
          taxId: 'Identificación Fiscal',
          searchValue: 'Valor de la Búsqueda',
          address: {
            edit: 'Editar',
            selectAddress: 'Seleccionar Dirección',
            saveAddress: 'Dirección guardada',
            addNewAddress: 'Agregar Nueva Dirección',
            editAddress: 'Editar Dirección',
            billingAddress: 'Dirección de Facturación',
            shippingAddress: 'Dirección de Envió',
            managementDescription: 'Descripción de la Dirección',
            addressType: 'Tipo de Dirección',
            region: 'Región',
            city: 'Ciudad',
            address: 'Dirección',
            postCode: 'Código Postal'
          }
        }
      },
      collect: {
        orderTotal: 'Total de Orden',
        pending: 'Pendiente',
        payment: 'Pago',
        change: 'Cambio',
        totalInvoiced: 'Total Facturado',
        convertAmount: 'Convertir Cantidad',
        convertedAmount: 'Convertido',
        fullPayment: 'Cobro Completo',
        Currency: 'Moneda',
        dayRate: 'Tasa del Día',
        noDayRate: 'No se a generado una tasa del día para la moneda',
        refund: 'Reembolso',
        bankAcount: 'Cuenta Bancaria',
        isCashWith: 'Usar Fondos de Caja',
        collectionAgent: 'Agente Cobrador',
        paymentMethods: 'Métodos de Pago',
        paymentMethod: 'Método de Pago',
        customer: 'Cliente',
        invoceNr: 'Factura',
        orderNr: 'Numero de Orden',
        seller: 'Vendedor',
        currency: 'Moneda',
        amount: 'Monto',
        transferFunds: 'Transferir Fondos',
        emptyRate: 'Sin tasa de conversión a la fecha',
        TenderType: {
          directDeposit: 'Depósito Directo',
          creditCard: 'Tarjeta de Crédito',
          directDebit: 'Débito Directo',
          check: 'Cheque',
          creditNote: 'Nota de crédito',
          mobilePayment: 'Pago Móvil Interbancario',
          account: 'Cuenta',
          cash: 'Efectivo',
          zelle: 'Zelle'
        },
        overdrawnInvoice: {
          title: 'Factura Sobregirada',
          below: 'Factura quedará con un saldo abierto',
          above: 'Datos del Cliente',
          returned: 'Su vuelto es',
          coupon: 'Generar una Tarjeta de Regalo o Vale',
          returnMoney: 'Devolver dinero en otra forma de pago',
          adjustDocument: 'Desea Ajustar Documento',
          dailyLimit: 'Limite Diario',
          customerLimit: 'Limite Orden',
          available: 'Disponible',
          emptyPayment: 'Método de pago no soportado',
          emptyListPayment: 'No posee ningún método de pago asociado en esta opción',
          addPayment: 'Debe agregar un tipo de vuelto para completar la operación',
          amountLimitOrder: 'Monto Superior al Límite de la Orden',
          incompleteChange: 'Cambio Incompleto',
          fieldList: {
            code: 'Cedula',
            name: 'Nombre del Titular',
            accountType: 'Tipo de Cuenta',
            bank: 'Banco'
          }
        }
      },
      keyLayout: {
        noProducto: 'Producto no Disponible'
      },
      pinMessage: {
        pin: 'Ingrese Pin para ',
        authorized: 'Pin Autorizado',
        documentType: 'cambiar tipo de documento',
        warehouse: 'cambiar almacén',
        price: 'cambiar precio',
        qtyEntered: 'cambiar cantidad',
        updateQtyEntered: 'Cantidad Actualizada',
        updatePriceEntered: 'Precio Actualizado',
        updateDiscountEntered: 'Descuento Actualizado',
        priceList: 'cambiar lista de precio',
        discount: 'agregar descuento',
        delete: 'eliminar producto',
        addProduct: 'agregar producto',
        invoiceOpen: 'generar factura con un saldo abierto',
        newOrder: 'crear nueva orden'
      },
      orderRMA: {
        addProduct: 'Producto Agregado',
        deleteProduct: 'Producto Eliminado',
        updateProduct: 'Producto Actualizado',
        document: 'El Documento',
        process: 'Fue Procesado',
        createNewSubstituteOrder: 'Crear Nueva Orden Sustituta'
      }
    },
    byInvoice: {
      title: 'Pedidos Vendedor de Pasillo por Facturar',
      searchCompleteOrders: 'Sólo Completas',
      aisleSales: 'Ventas de Pasillo',
      label: 'Por Facturar',
      toDeliver: 'Por Entregar',
      toCollect: 'A Crédito',
      cancelled: 'Anuladas',
      closed: 'Cerradas',
      proposals: 'Propuestas',
      return: 'Devoluciones',
      salesRepresentative: 'Agente Comercial',
      onlyAllocated: 'Solo asignado al punto de venta actual',
      businessPartner: 'Socio de Negocio',
      copyShippingAddress: 'Copiar dirección para el envío',
      documentNo: 'Nro. Documento',
      emptyList: 'Utilice los filtros para realizar la busqueda de las ordenes'
    },
    guideSteps: {
      productValue: {
        description: 'Busca el producto segun su Codigo, Nombre o UPC'
      },
      businessPartner: {
        description: 'Mostrar Informacion del Socio de Negocios'
      },
      linesTable: {
        title: 'Lineas de la Orden',
        description: 'Listado de los Producto de la orden'
      },
      buttonPanelLeftPos: {
        title: 'Mostrar Panel Izquierdo',
        description: 'Despliega el panel de Opciones del Punto de Venta'
      },
      point: {
        description: 'Informacion del punto de venta actual'
      },
      buttonPanelRightPos: {
        title: 'Mostrar Panel Derecho',
        description: 'Despliega el panel de catalogo'
      },
      fieldListCollection: {
        title: 'Campos de la Cobranza',
        description: 'Grupo de Campo el cual posee. Monto, Moneda, Tipo de pago, Banco, Nro Referencia y Fecha'
      },
      buttonCollection: {
        title: 'Herramientas de la Cobranza',
        description: 'Compuesta por un conjunto de botonera que posee agregar, eliminar y porcesar'
      },
      cardCollection: {
        title: 'Panel de Pago',
        description: 'En este panel aparece un listado con las tarjeta de los pagos agregados'
      },
      infoInvoce: {
        title: 'Detalle de la Factura',
        description: 'Informacion de la Factura con el monto total, pendiente, cambio'
      },
      toolsPoint: {
        title: 'Herramientas del Punto de Venta'
      }
    },
    weight: 'Peso'
  }
}
