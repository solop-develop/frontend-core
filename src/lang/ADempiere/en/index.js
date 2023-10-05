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
import extensionFile from './extensionFile'
import fieldDisplayOptions from './fieldDisplayOptions'
import fieldOptions from './fieldOptions'
import process from './process'
import recordManager from './recordManager'
import route from './route'
import smartBrowser from './smartBrowser'
import infoSearch from './fieldFormSearch'
import report from './report.js'
import window from './window'
import workflow from './workflow'
import issues from './form/issues'
/**
 * Translations of Forms
 */
import actionNotice from './form/actionNotice'
import payrollActionNotice from './form/payrollActionNotice'
import pointOfSales from './form/pointOfSales'
import listStoreProduct from './form/listStoreProduct'
import timeControl from './form/timeControl'
import VPayPrint from './form/VPayPrint'

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
  timeControl,
  VPayPrint,
  report,
  workflow,
  issues,

  language: 'Language',
  notifications: {
    // simplex
    completed: 'Completed',
    loading: 'Loading',
    succesful: ' Successful ',
    error: ' Error ',
    opened: 'Opened',
    totalProcess: 'Total Processor Records ',
    // search
    searching: 'Searching records on the server',
    succcessSearch: 'The search has been made',
    searchWithOutRecords: 'The search ended without results',
    errorSearch: 'The search has not been completed',
    // process
    processing: 'Processing',
    processExecuted: 'Executed, see process logs',
    processError: 'Was not executed',
    //
    emptyValues: 'Parameter(s) empty value',
    fieldCannotBeEmpty: 'The field value cannot be empty',
    fieldMandatory: 'The field is mandatory',
    requestError: 'Error executing the request',
    successChangeRole: 'The role has been changed',
    errorChangeRole: 'The role has not been changed',
    copySuccessful: 'Copied',
    copyUnsuccessful: 'Error, unable to copy',
    actionToTake: 'Action to Take',
    mandatoryFieldMissing: 'Missing fill in the fields ',
    updateFields: 'The record is updated with the field ',
    updateSuccessfully: 'Successfully made changes',
    invalidEmailFormat: 'Invalid email format',
    recordLocked: 'This record has been locked',
    recordUnlocked: 'This record has been unlocked',
    noRoleAccess: 'With your current role and settings, you cannot view this information',
    errorPointOfSale: 'No point of sale selected',
    emptyPos: 'This User has no Assigned POS Terminal'
  },
  navbar: {
    badge: {
      Notifications: 'Notifications',
      activity: 'Worflow for Approval',
      link: 'Go to Procces Logs'
    },
    resetCache: 'Cache Reset',
    dashboard: 'Dashboard',
    github: 'Github',
    logOut: 'Log Out',
    profile: 'Profile',
    theme: 'Theme',
    size: 'Global Size'
  },
  documentation: {
    documentation: 'Documentation',
    github: 'Github Repository',
    releases: 'Releases',
    branches: 'Branches',
    code: 'Code',
    issues: 'Issues',
    downloadZip: 'Download Zip',
    releaseNotes: 'Release Notes',
    goRepository: 'go to repository',
    seeDocumentation: 'See documentation'
  },
  components: {
    documentation: 'Documentation',
    binaryButton: 'Upload file',
    binaryTip: 'Only files with a size smaller than 500kb',
    imageError: 'The image exceeds 2MB and does not comply with the valid formats!',
    contextMenuActions: 'Actions',
    contextMenuReferences: 'References',
    contextMenuDownload: 'Download',
    dialogCancelButton: 'Cancel',
    dialogConfirmButton: 'Confirm',
    filterableItems: 'Optional Columns',
    searchRecord: 'Search Record',
    fixedleItems: 'Fixed Columns',
    switchActiveText: 'Yes',
    switchInactiveText: 'Not',
    todoList: 'Todo List'
  },
  grid: {
    recordAccess: {
      accessGranted: 'Access granted for roles'
    }
  },
  views: {
    browser: 'Smart Browser',
    smartBrowser: 'Smart Browser',
    process: 'Process',
    window: 'Window',
    report: 'Report',
    workflow: 'Workflow',
    task: 'Task',
    form: 'Form',
    noProcess: 'Not process running',
    logs: 'Summary',
    log: 'Summary',
    seeReport: 'See Report',
    summary: 'Summary',
    viewsHelp: 'Help',
    searchCriteria: 'Search Criteria',
    unsupportedSorry: 'Sorry',
    unsupportedHeadline: 'This view is currently unavailable',
    unsupportedInfo: 'Please check that the view is supported in this version, or click the button below to return to the homepage',
    unsupportedButton: 'Back to dashboard',
    reportView: 'Report Views',
    printFormat: 'Print Formats',
    drillTable: 'Drill Down'
  },
  table: {
    dataTable: {
      search: 'Search',
      selected: 'Selected',
      nextRecord: 'Next',
      previousRecord: 'Previous',
      recordsPage: 'Records Page',
      deleteSelection: 'Delete Selected Records',
      advancedQuery: 'Advanced Query',
      exportZip: 'Export Zip',
      showAllColumns: 'Show All Columns',
      showMinimalistView: 'Show Minimalist View',
      showOnlyMandatoryColumns: 'Show Only Mandatory Columns',
      showTableColumnsOnly: 'Show Table Columns Only',
      showAllAvailableColumns: 'Show All Available Columns',
      exportRecordTable: 'Export Selected Records',
      showTotal: 'Show Totals',
      hiddenTotal: 'Hidden Totals',
      batchEntry: 'Batch Entry'
    },
    recentItems: {
      search: 'Filter by name, description or date',
      date: 'Date',
      name: 'Name',
      description: 'Description'
    }
  },
  profile: {
    aboutMe: 'About Me',
    recentItems: 'Recent Items',
    favorites: 'Favorites',
    PendingDocuments: 'Pending Documents',
    recentItemsName: 'Name Recent Items',
    role: 'Role',
    availableRoles: 'Available roles',
    currentRole: 'Current role',
    clientName: 'Client name',
    description: 'Description',
    changeRole: 'Change role',
    changeLanguage: 'Change language',
    changeLanguagePlaceholder: 'Choose a language',
    activityLogs: 'Activity Logs',
    notice: 'Notice',
    request: 'Request',
    workflowActivities: 'Workflow Activities',
    systemInformation: {
      tabLabel: 'System Information',
      releaseNumber: 'Release',
      backEndVersion: 'Back-End Version',
      dateVersion: 'Date Versión',
      proxyVersion: 'Proxy Version',
      deploymentName: 'Deployment Name'
    }
  },
  window,
  data: {
    createRecordSuccessful: 'New record created successfully',
    createNewRecord: 'Mode New record',
    createRecordError: 'Error creating new record',
    deleteRecordSuccessful: 'Record deleted successfully',
    deleteRecordError: 'Error deleting record',
    exportRecord: 'Export Record',
    noDescription: 'No Description',
    addDescription: 'Add Description',
    recordAccess: {
      modeMobile: {
        accessRoles: 'Access Roles',
        accessRolesIsReadonly: 'Roles with Access and Read Only',
        lockedRoles: 'Locked Roles',
        lockedRolesIsDependentEntities: 'Locked Roles with Dependent Entities'
      },
      actions: 'Record Access',
      configRoles: 'Roles Configurados',
      availableRoles: 'Roles Configured',
      isReadonly: 'Reading Only',
      isDependentEntities: 'Dependent Entities',
      isLock: 'Block',
      isUnlock: 'Unblock',
      isError: 'Error on '
    },
    selectionRequired: 'You must select a record',
    undo: 'Undo',
    notification: {
      lockRecord: 'The Registry was Locked',
      unlockRecord: 'Registry was Unlocked'
    },
    addNote: 'Add Note',
    emptyNote: 'Este registro no posee ninguna nota',
    descriptionNote: 'Add Note or Comment to Record'
  },
  operators: {
    compareSearch: 'Compare the Search',
    operator: 'Comparison operator',
    EQUAL: 'Equal to "="',
    NOT_EQUAL: 'Not equal to "<>"',
    LIKE: 'Like "~"',
    NOT_LIKE: 'Not like "!~"',
    GREATER: 'Greater than ">"',
    GREATER_EQUAL: 'Greater than equal to ">="',
    LESS: 'Less than "<"',
    LESS_EQUAL: 'Less than equal to "<="',
    BETWEEN: 'Between ">-<"',
    NOT_BETWEEN: 'Not between "<->"',
    NOT_NULL: 'Is not null',
    NULL: 'Is null',
    IN: 'Include "()"',
    NOT_IN: 'Not include "!()"'
  },
  quickAccess: {
    newRecord: 'Quick Access to Create New Record',
    listRecords: 'Quick Access to List All Records',
    searchWithEnter: 'Press enter to search for the product by Product Code, Name or UPC'
  },
  form: {
    ...form,
    pos: {
      title: 'POS',
      priceList: 'Price List',
      releaseOrder: 'Release It',
      applyDiscountOnOrder: 'Apply Discount Based on Amount',
      fieldDiscountAmount: 'Discount Amount',
      salesDiscountOff: 'Apply Discount on Sale',
      applyDiscountToAllLines: 'Apply Discount to All Lines',
      returnProduct: 'Return Product',
      createNewOrderRMA: 'Create New Order from RMA',
      discountRate: '% Descuent',
      optionsPoinSales: {
        title: 'Quick Point of Sales Options',
        emptyAvailablePaymentMethodsRefudn: 'This Terminal does not have a Payment Method configured to allow Pending Refund',
        emptyAvailablePaymentMethods: 'This Terminal does not have a Payment Method configured to allow Refund',
        emptyListCashSummary: 'There is no cash movement',
        salesOrder: {
          title: 'Sale Order',
          newOrder: 'New Order',
          ordersHistory: 'Orders History',
          generateImmediateInvoice: 'Generate Immediate Invoice',
          completePreparedOrder: 'Complete Prepared Order',
          cancelSaleTransaction: 'Cancel Sale Transaction',
          createPos: 'Create Point of Sale Withdrawal',
          print: 'Print Document',
          preview: 'View Preview',
          cancelOrder: 'Cancel Order',
          orderRemoved: 'Order Deleted',
          copyOrder: 'Copy Order',
          newOrderFromRMA: 'Create New Order From RMA',
          createNewReturnOrder: 'Create a new return order',
          confirmDelivery: 'Confirm Delivery',
          deliverAllProducts: 'Deliver all products',
          emptyProductDelivery: 'Product not in Order'
        },
        cashManagement: {
          title: 'Cash Management',
          cashOpening: 'Opening',
          closeBox: 'Close',
          assignSeller: 'Assign seller',
          unassignSeller: 'Unassign Seller',
          transfer: 'Transfer',
          moneyIncome: 'Income',
          cashOpenBox: 'Cashbox Opened',
          cashwithdrawal: 'Withdrawal',
          successfulCashWithdrawal: 'Cash withdrawal successful',
          cashCloseBox: 'Cashbox Closed',
          detailedCloseBox: 'Detailed Closing'
        },
        generalOptions: {
          title: 'General Options',
          changePos: 'Change Point of Sale',
          listProducts: 'Change Point of Sale',
          changeWarehouseList: 'Change Warehouse',
          changePriceList: 'Change Price List',
          dateTo: 'Date To',
          dateOrder: 'Date Order',
          dateFrom: 'Date From',
          productQuery: 'Product Query'
        }
      },
      generalNotifications: {
        orderReleased: 'Order was released: ',
        selectedOrder: 'Selected Order: '
      },
      tableProduct: {
        product: 'Product',
        quantity: 'Quantity',
        isQuantityFromOrderLine: 'Complete Quantity of the Line',
        basePrice: 'Base Price',
        baseQuantity: 'Base Quantity',
        uom: 'UOM',
        unitOfMeasure: 'Unit of Measure',
        options: 'Options',
        editQuantities: 'Edit Quantities',
        pin: 'Insert Pin',
        remove: 'Remove',
        taxAmount: 'Tax',
        taxRate: '% Imp',
        displayDiscountAmount: 'Discount',
        empty: 'Enter the product name, code or UPC',
        movementQuantity: 'Movement Quantity'
      },
      order: {
        order: 'Order',
        seller: 'Seller',
        date: 'Date',
        subTotal: 'Sub-Total',
        type: 'Type',
        discount: '% Dcto',
        tax: 'Tax',
        total: 'Total',
        itemQuantity: 'Item Quantity',
        numberLines: 'Number of Lines',
        pointSale: 'Point of Sale',
        collect: 'Collect',
        collections: 'Cobros',
        campaign: 'Campaign',
        noCampaignSelected: 'No Campaign selected',
        BusinessPartnerCreate: {
          phone: 'Phone',
          businessPartner: 'Business Partner',
          successfullyCreated: 'Business Partner Successfully Created',
          customerData: 'Customer Data',
          addBillingAddress: 'Add Billing Address',
          billingAddress: 'Billing Address',
          shippingAddress: 'Shipping Address',
          withoutSetting: 'Without Setting',
          taxId: 'Tax Identification',
          searchValue: 'Search Value',
          address: {
            edit: 'Edit',
            selectAddress: 'Select Address',
            saveAddress: 'Save Address',
            addNewAddress: 'Add New Address',
            editAddress: 'Edit Address',
            billingAddress: 'Billing Address',
            shippingAddress: 'Shipping Address',
            managementDescription: 'Address Description',
            addressType: 'Address Type',
            region: 'Region',
            city: 'City',
            address: 'Address',
            postCode: 'Post Code'
          }
        }
      },
      collect: {
        orderTotal: 'Order Total',
        pending: 'Pending',
        payment: 'Payment',
        change: 'Change',
        totalInvoiced: 'Total Invoiced',
        convertAmount: 'Convert Quantity',
        convertedAmount: 'Converted',
        fullPayment: 'Full Payment',
        dayRate: 'Day Rate',
        noDayRate: 'No daily rate has been generated for the currency',
        refund: 'Refund',
        paymentMethods: 'Payment Methods',
        paymentMethod: 'Payment Method',
        customer: 'Customer',
        invoceNr: 'Invoce',
        orderNr: 'Document',
        seller: 'Seller',
        currency: 'Currency',
        amount: 'Amount',
        bankAcount: 'Bank Acount',
        isCashWith: 'Use Cash Funds',
        collectionAgent: 'Collection Agent',
        transferFunds: 'Transfer Funds',
        emptyRate: 'No conversion rate to date',
        Currency: 'Currency',
        TenderType: {
          directDeposit: 'Direct Deposit',
          creditCard: 'Credit Card',
          directDebit: 'Direct Debit',
          check: 'Check',
          creditNote: 'Credit Note',
          mobilePayment: 'Interbank mobile payment',
          account: 'Account',
          cash: 'Cash',
          zelle: 'Zelle'
        },
        overdrawnInvoice: {
          title: 'OverdrawnInvoice',
          below: 'Invoice will remain with an open balance',
          above: 'Customer Details',
          returned: 'Your change is',
          coupon: 'Generate a Gift Card or Vale',
          returnMoney: 'Return money in another form of payment',
          adjustDocument: 'You want to Adjust Document',
          dailyLimit: 'Daily Limit',
          customerLimit: 'Order Limit',
          available: 'Available',
          emptyPayment: 'Unsupported payment method',
          emptyListPayment: 'You do not have any payment method associated with this option',
          addPayment: 'You must add a change type to complete the operation',
          amountLimitOrder: 'Amount greater than the limit of the Order',
          incompleteChange: 'Incomplete Change',
          fieldList: {
            code: 'Cedula',
            name: 'Holder Name',
            accountType: 'Account Type',
            bank: 'Bank'
          }
        }
      },
      keyLayout: {
        noProducto: 'Product not Avilable'
      },
      pinMessage: {
        pin: 'Enter Pin for ',
        documentType: 'change document type',
        warehouse: 'change warehouse',
        price: 'change price',
        qtyEntered: 'change quantity',
        updateQtyEntered: 'Updated Quantity',
        updatePriceEntered: 'Updated Price',
        updateDiscountEntered: 'Updated Discount',
        priceList: 'change price list',
        discount: 'add discount',
        delete: 'delete product',
        addProduct: 'add product',
        invoiceOpen: 'generate invoice with an open balance',
        newOrder: 'create new order'
      },
      orderRMA: {
        addProduct: 'Product Added',
        deleteProduct: 'Deleted Product',
        updateProduct: 'Update Product',
        document: 'The Document',
        process: 'Was Processed',
        createNewSubstituteOrder: 'Create New Substitute Order'
      }
    },
    byInvoice: {
      title: 'Aisle Vendor Orders to be Invoiced',
      searchCompleteOrders: 'Completed',
      aisleSales: 'Sales Aisle',
      label: 'Invoiced',
      toDeliver: 'Delivered',
      toCollect: 'On Credit',
      cancelled: 'Voided',
      closed: 'Closed',
      proposals: 'Proposals',
      return: 'Returns',
      salesRepresentative: 'Sales Agent',
      onlyAllocated: 'Only allocated to current point of sales',
      businessPartner: 'Business Partner',
      copyShippingAddress: 'Copy shipping address',
      documentNo: 'Document No',
      emptyList: 'Use the filters to search for orders'
    },
    guideSteps: {
      productValue: {
        description: 'Search for the product by Product Code, Name or UPC'
      },
      businessPartner: {
        description: 'Show Business Partner Information'
      },
      linesTable: {
        title: 'Order Lines',
        description: 'Order Product Listing'
      },
      buttonPanelLeftPos: {
        title: 'Show Left Panel',
        description: 'Display the Point of Sale Options panel'
      },
      point: {
        description: 'Current point of sale information'
      },
      buttonPanelRightPos: {
        title: 'Show Right Panel',
        description: 'Displays the catalog panel'
      },
      fieldListCollection: {
        title: 'Collection Fields',
        description: 'Field Group which has. Amount, Currency, Payment Type, Bank, Reference No. and Date'
      },
      buttonCollection: {
        title: 'Collection Tools',
        description: 'Composed of a set of buttons that allows you to add, delete and process'
      },
      cardCollection: {
        title: 'Payment Panel',
        description: 'In this panel you can see a list with the cards of the added payments'
      },
      infoInvoce: {
        title: 'Invoice Detail',
        description: 'Invoice information with total amount, pending, change'
      },
      toolsPoint: {
        title: 'Point of Sale Tools'
      }
    },
    weight: 'Weight'
  }
}
