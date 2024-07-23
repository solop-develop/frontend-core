/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanches@gmail.com https://github.com/elsiosanchez
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

const report = {
  clearParameters: {
    title: 'Limpiar Parámetros',
    description: 'Limpia los valores estableciendo los valores por defecto'
  },
  typeReport: 'Tipo de Reporte',
  reportViews: 'Vistas de Reporte',
  printFormats: 'Formatos de Impresión',
  reportOptions: 'Opciones del Reporte',
  preference: 'Preferencia',
  reportSettings: 'Configuración del Reporte',
  summary: 'Resumen',
  reportExportTypes: {
    ps: {
      name: 'ps - Archivo Postscript PS',
      description: 'ps - Archivo Postscript PS',
      type: 'ps'
    },
    xml: {
      name: 'xml - Archivo XML',
      description: 'xml - Archivo XML',
      type: 'xml'
    },
    pdf: {
      name: 'pdf - Archivo PDF Acrobat',
      description: 'pdf - Archivo PDF Acrobat',
      type: 'pdf'
    },
    html: {
      name: 'html - Archivo HTML',
      description: 'html - Archivo HTML',
      type: 'html'
    },
    txt: {
      name: 'txt - Archivo de texto delimitado por tabuladores',
      description: 'txt - Archivo de texto delimitado por tabuladores',
      type: 'txt'
    },
    ssv: {
      name: 'ssv - Archivo separado por punto y coma',
      description: 'ssv - Archivo separado por punto y coma',
      type: 'ssv'
    },
    csv: {
      name: 'csv - Archivo CSV de Excel',
      description: 'csv - Archivo CSV de Excel',
      type: 'csv'
    },
    xls: {
      name: 'xls - Archivo Excel',
      description: 'xls - Archivo Excel',
      type: 'xls'
    },
    xlsx: {
      name: 'xlsx - XLSX file',
      description: 'xlsx - XLSX file',
      type: 'xlsx'
    },
    arxml: {
      name: 'arxml - Archivo de Definición de Reporte ADempiere',
      description: 'arxml - Archivo de Definición de Reporte ADempiere',
      type: 'arxml'
    }
  },
  reportEnginer: {
    summation: 'Sumatoria (Σ):',
    average: 'Promedio (μ):',
    Count: 'Conteo (№):',
    min: 'Mínimo (↓):',
    max: 'Máximo (↑):',
    variance: 'Varianza (σ²):',
    standardDeviation: 'Desviación Estándar (σ):',
    share: 'Compartir / Descargar',
    optionsImport: {
      title: 'Opciones para Importar y Compartir',
      format: 'Opciones del Formato',
      actualPage: 'Página Actual',
      fullReport: 'Todo el Reporte',
      sendDownload: 'Enviar / Descargar',
      download: 'Descargar',
      send: 'Enviar',
      copyLink: 'Copiar Link',
      typeNotify: 'Tipo de Notificación',
      contactsSend: 'Contactos para Enviar'
    },
    printFormat: 'Formato de Impresión',
    viewReport: 'Vista del Informe',
    Detail: 'Ver Detallado',
    summary: 'Ver Resumido'
  }
}

export default report
