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

const window = {
  advancedQuery: {
    title: 'Consulta Avanzada',
    help: 'Realiza una búsqueda haciendo uso de rangos de valores, selección múltiple de valores, y operadores de comparación'
  },
  newRecord: 'Nuevo Registro',
  copyRecord: 'Copiar Registro',
  deleteRecord: 'Eliminar Registro',
  confirmDeleteRecord: '¿Está seguro de que quiere eliminar este registro?',
  cancel: 'Cancelar',
  confirm: 'Confirmar',
  undoNew: 'Descartar Nuevo Registro',
  containerInfo: {
    notes: 'Notas',
    emptyNote: 'No se puede crear una nota en blanco',
    issues: 'Solicitudes',
    accountingInformation: {
      title: 'Información Contable',
      selection: 'Selección'
    },
    changeLog: 'Actividad',
    workflowLog: 'Histórico de Flujo de Trabajo',
    changeDetail: 'Detalle del cambio',
    logWorkflow: {
      message: 'Mensaje',
      responsible: 'Responsable',
      workflowName: 'Nombre de estado del flujo de trabajo',
      timeElapsed: 'Tiempo transcurrido',
      addNote: 'Agregar Nota'
    },
    log: {
      changeHistory: 'Histórico de Cambios',
      column: 'Columna',
      created: 'Creado',
      createdBy: 'Creado Por',
      field: 'Campo',
      updated: 'Actualizado',
      updatedBy: 'Actualizado Por',
      newValue: 'Nuevo Valor',
      oldValue: 'Valor Antiguo',
      recordID: 'ID del Registro',
      recordUUID: 'UUID del Registro',
      tab: 'Pestaña',
      tableName: 'Nombre de la Tabla'
    },
    referenceRecords: 'Documentos Relacionados'
  },
  documentStatus: 'Estatus del Documento',
  callout: {
    error: 'Error En Callout'
  },
  toggleSingle: 'Cambiar Mono',
  multiRecord: 'Multi Registro',
  gridToggle: 'Cambiar mono/multi registro',
  recordValidation: {
    closeWindow: 'Cerrar Ventana',
    tab: 'Pestaña',
    field: 'Campo',
    value: 'Valor',
    discardChanges: 'Descartar Cambios',
    returnToWindow: 'Regresar a la Ventana'
  },
  tab: {
    sequenceTab: 'Pestaña de Sequencia'
  },
  toggleTabContentVisibility: 'Cambiar visibilidad del contenido de la pestaña'
}

export default window
