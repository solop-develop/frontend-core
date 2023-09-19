/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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

const workflowActivity = {
  title: 'Sus Actividades de Flujo de Trabajo',
  filtersSearch: {
    history: 'Registros históricos',
    forward: 'Re-enviar',
    user: 'Usuario',
    approve: 'Aprobar',
    workFlowDiagram: 'Diagrama del Flujo de Trabajo',
    seeFlowDiagram: 'Ver Diagrama de Flujo'
  },
  table: {
    priority: 'Prioridad',
    node: 'Nodo'
  },
  guide: {
    table: {
      title: 'Lista de Flujos de trabajos por aprobar',
      description: 'Seleccione al menos uno para ver el detalle y responsable de aprobación. De igual manera puede decidir si aprueba, rechaza o redirecciona el mismo'
    },
    workflow: {
      title: 'Flujo de Trabajo',
      description: 'Diagrama del ciclo de vida del flijo de trabajo. El Nodo resaltado es el que se encuentra actualmente a la espera de verificación'
    },
    workflowLogs: {
      title: 'Bitacora de Cambios',
      description: 'Linea de tiempo del flujo de trabajo'
    }
  }
}

export default workflowActivity
