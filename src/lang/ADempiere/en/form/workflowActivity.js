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
  title: 'Your Workflow Activities',
  filtersSearch: {
    history: 'History records',
    forward: 'Re-send',
    user: 'User',
    approve: 'Approve',
    workFlowDiagram: 'Work Flow Diagram',
    seeFlowDiagram: 'See Flow Diagram'
  },
  table: {
    priority: 'Priority',
    node: 'Node'
  },
  guide: {
    table: {
      title: 'Workflow List to be approved',
      description: 'Select at least one to see the detail and responsible for approval. You can also decide whether to approve, reject or redirect it'
    },
    workflow: {
      title: 'Workflow',
      description: 'Workflow life cycle diagram. The highlighted Node is the one currently awaiting verification'
    },
    workflowLogs: {
      title: 'Change Log',
      description: 'Workflow timeline'
    }
  }
}

export default workflowActivity
