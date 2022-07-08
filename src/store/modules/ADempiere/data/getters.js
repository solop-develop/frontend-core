
// constants
import { DISPLAY_COLUMN_PREFIX } from '@/utils/ADempiere/dictionaryUtils'

// utils and helper methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

const getters = {
  /**
   * Used by datatables in tab children, record navigation in window, result in browser
   * @param {string} containerUuid
   */
  getDataRecordAndSelection: (state, getters) => (containerUuid) => {
    return state.recordSelection.find(itemRecord => {
      return itemRecord.containerUuid === containerUuid
    }) || {
      containerUuid,
      record: [],
      recordCount: 0,
      selection: [],
      pageNumber: 1,
      nextPageToken: undefined,
      originalNextPageToken: undefined,
      isLoadedContext: false,
      isLoaded: false
    }
  },
  getDataRecordsList: (state, getters) => (containerUuid) => {
    return getters.getDataRecordAndSelection(containerUuid).record
  },
  getDataRecordSelection: (state, getters) => (containerUuid) => {
    return getters.getDataRecordAndSelection(containerUuid).selection
  },

  /**
   * Getter converter selection data record in format
   * @param {string} containerUuid
   * @param {array}  selection
   * [{
   *    selectionId: keyColumn Value,
   *    selectionValues: [{ columnName, value }]
   * }]
   */
  getSelectionToServer: (state, getters, rootState, rootGetters) => ({
    containerUuid,
    selection = []
  }) => {
    const selectionToServer = []
    const withOut = ['isEdit', 'isSendToServer']

    if (isEmptyValue(selection)) {
      selection = getters.getDataRecordSelection(containerUuid)
    }

    if (isEmptyValue(selection)) {
      return selectionToServer
    }

    const { fieldsList, keyColumn } = rootGetters.getPanel(containerUuid)
    // reduce list
    const fieldsListSelection = fieldsList
      .filter(itemField => {
        return itemField.isIdentifier || itemField.isUpdateable
      })
      .map(itemField => {
        return itemField.columnName
      })

    selection.forEach(itemRow => {
      const records = []

      Object.keys(itemRow).forEach(key => {
        if (!key.startsWith(DISPLAY_COLUMN_PREFIX) && !withOut.includes(key)) {
          // evaluate metadata attributes before to convert
          if (fieldsListSelection.includes(key)) {
            records.push({
              columnName: key,
              value: itemRow[key]
            })
          }
        }
      })

      selectionToServer.push({
        selectionId: itemRow[keyColumn],
        selectionValues: records
      })
    })

    return selectionToServer
  },
  getContextInfoField: (state) => (contextInfoUuid, sqlStatement) => {
    return state.contextInfoField.find(info => {
      if ((info.contextInfoUuid === contextInfoUuid) && (info.sqlStatement === sqlStatement)) {
        return info
      }
    })
  }

}

export default getters
