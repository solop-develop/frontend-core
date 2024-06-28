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

const smartBrowser = {
  clearFields: {
    title: 'Limpiar Criterios de Búsqueda',
    description: 'Limpia los valores estableciendo los valores por defecto'
  },
  smartBrowser: 'Consulta Inteligente',
  // dictionary
  dictionaryError: 'Error al cargar la definición de la consulta inteligente',
  // export
  exportAllRecords: {
    title: 'Exportar Todos Los Registros',
    description: 'Registros que coincidan con el criterio de búsqueda.',
    successful: 'Exportación exitosa',
    quantityExport: 'Cantidad de registros exportados: '
  },
  // process
  processAllRecords: {
    all: ' (TODOS)',
    title: 'Procesar Todos Los Registros',
    description: 'Procesar todos los registros que coincidan con el criterio de búsqueda.',
    withoutResults: 'No existe ningún registro con el criterio de búsqueda actual.'
  }
}

export default smartBrowser
