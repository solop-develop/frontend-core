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

import { defineComponent, computed, onMounted, ref } from '@vue/composition-api'

import lang from '@/lang'
import router from '@/router'
import store from '@/store'

// Components and Mixins
import LoadingView from '@/components/ADempiere/LoadingView'

// Constants
import { REPORT_VIEWER_NAME } from '@/utils/ADempiere/constants/report'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { zoomIn } from '@/utils/ADempiere/coreUtils.js'
import { convertObjectToKeyValue } from '@/utils/ADempiere/valueFormat.js'
import { translateDateByLong } from '@/utils/ADempiere/formatValue/dateFormat'
import { copyToClipboard } from '@/utils/ADempiere/coreUtils.js'

export default defineComponent({
  name: 'ProcessActivity',

  components: {
    LoadingView
  },

  setup(props, { root }) {
    const processActivity = ref([])
    const recordCount = ref(0)
    const pageToken = ref('')
    const pageSize = ref(50)

    // process local is running
    const getterAllInExecution = computed(() => {
      return store.getters.getAllInExecution
    })

    // process local and send with response
    const getterAllFinishProcess = computed(() => {
      return store.getters.getAllFinishProcess
    })

    // session process from server
    const getterAllSessionProcess = computed(() => {
      return store.getters.getAllSessionProcess
    })

    // all process
    const getRunProcessAll = computed(() => {
      const processAll = [].concat(
        getterAllSessionProcess.value,
        getterAllInExecution.value,
        getterAllFinishProcess.value
      )
      const processAllReturned = []
      processAll.forEach(element => {
        // let processMetadataReturned = {}
        if (element !== undefined) {
          const processMetadataReturned = {}
          let infoMetadata = !isEmptyValue(element.output) ? findStoredReportUuid(element.uuid) : getProcessMetadata(element.uuid)
          if (!infoMetadata) {
            infoMetadata = {}
          }

          Object.assign(processMetadataReturned, element, infoMetadata)
          processMetadataReturned.parametersList = element.parametersList
          const indexRepeat = processAllReturned.findIndex(item => {
            return item.instanceUuid === element.instanceUuid && !isEmptyValue(element.instanceUuid)
          })
          if (indexRepeat > -1) {
            // update attributes in exists process to return
            // Object.assign(processAllReturned[indexRepeat], processMetadataReturned)
            const other = Object.assign(processMetadataReturned, processAllReturned[indexRepeat])
            processAllReturned[indexRepeat] = other
          }
          processAllReturned.push(processMetadataReturned)
        }
      })

      return processAllReturned.sort((a, b) => {
        // sort by most recently date
        return new Date(b.lastRun) - new Date(a.lastRun)
      })
    })
    const getProcessLog = computed(() => {
      return getRunProcessAll.value.filter(element => {
        const { is_error, is_processing } = element
        if (!isEmptyValue(is_error) && !isEmptyValue(is_processing)) {
          return element
        }
      })
    })
    const getProcessLogSuccess = computed(() => {
      return getProcessLog.value.filter(element => {
        const { is_error, isReport, is_processing } = element
        if ((!is_error && !is_processing) || (is_error && !is_processing && isReport && !isEmptyValue(element.instanceUuid))) {
          return element
        }
      })
    })
    const getProcessLogError = computed(() => {
      return getProcessLog.value.filter(element => {
        const { is_error, isReport, is_processing } = element
        if ((is_error && !is_processing && !isReport) || (is_error && !is_processing && isReport && isEmptyValue(element.instanceUuid))) {
          return element
        }
      })
    })
    const getProcessLogProcessing = computed(() => {
      return getProcessLog.value.filter(element => {
        const { is_processing } = element
        if (is_processing) {
          return element
        }
      })
    })

    const isLoadProcess = ref(true)
    onMounted(() => {
      store.dispatch('getSessionProcessFromServer', {
        pageToken: pageToken.value,
        pageSize: pageSize.value
      })
        .then(response => {
          pageToken.value = response.nextPageToken
          isLoadProcess.value = false
        })
        .catch(error => {
          console.error('Error getting process from server:', error)
          isLoadProcess.value = false
        })
        .finally(() => {
          isLoadProcess.value = false
        })
    })
    const getProcessMetadata = (uuid) => {
      return store.getters.getStoredProcess(uuid)
    }
    const findStoredReportUuid = (uuid) => {
      return store.getters.getStoredReport(uuid)
    }
    function handleCommand(activity) {
      console.log({ activity })
      if (activity.command === 'seeReport') {
        router.push({
          name: REPORT_VIEWER_NAME,
          params: {
            reportUuid: activity.uuid,
            instanceUuid: activity.instanceUuid,
            fileName: activity.output.fileName,
            name: activity.output.name
          }
        }, () => {})
      } else if (activity.command === 'zoomIn') {
        const parameters = isEmptyValue(activity.parametersList) ? activity.process_intance_parameters : activity.parameters
        if (activity.output) {
          zoomIn({
            uuid: activity.uuid,
            attributeValue: `report_${activity.id}`,
            attributeName: 'containerKey',
            params: {
              ...root.$route.query,
              ...parameters
            },
            query: {
              ...root.$route.query,
              ...parameters
            }
          })
          return
        }
        zoomIn({
          uuid: activity.uuid,
          attributeValue: `process_${activity.id}`,
          attributeName: 'containerKey',
          params: {
            ...root.$route.query,
            ...parameters
          },
          query: {
            ...root.$route.query,
            ...parameters
          }
        })
        setProcessParameters(activity.uuid, parameters)
      } else if (activity.command === 'copyLogs') {
        let logAsText = activity.summary
        if (isEmptyValue(logAsText) && activity.is_error) {
          logAsText = lang.t('route.withoutLog')
        }
        if (!isEmptyValue(activity.logs)) {
          logAsText += '\n\n'
          activity.logs.forEach(list => {
            logAsText += list.record_id + ': ' + list.log + '\n'
          })
        }
        copyLogs(logAsText)
      }
    }

    function setProcessParameters(containerUuid, parameters) {
      const attributes = convertObjectToKeyValue({
        object: parameters
      })
      store.dispatch('updateValuesOfContainer', {
        containerUuid,
        isOverWriteParent: true,
        attributes
      })
    }

    const checkStatus = ({ is_error, is_processing, output, isReport }) => {
      const status = {
        text: lang.t('notifications.completed'),
        type: 'success',
        color: '#67C23A'
      }
      // is executing
      if (is_processing) {
        status.text = lang.t('notifications.processing')
        status.type = 'info'
        status.color = '#909399'
        return status
      }
      // is with error
      if (is_error) {
        status.text = lang.t('notifications.error')
        status.type = 'danger'
        status.color = '#F56C6C'
        return status
      }
      // is completed
      return status
    }

    const generateTitle = (title) => {
      const hasKey = lang.te('page.processActivity.' + title)
      if (hasKey) {
        // $t : this method from vue-i18n, inject in @/lang/index.js
        const translatedTitle = lang.t('page.processActivity.' + title)
        return translatedTitle
      }
      return title
    }
    const findTranslation = (title) => {
      const hasKey = lang.te('views.' + title)
      if (hasKey) {
        // $t : this method from vue-i18n, inject in @/lang/index.js
        const translatedTitle = lang.t('views.' + title)
        return translatedTitle
      }
      return title
    }

    const currentKey = ref(0)
    const showkey = (value) => {
      if (value === currentKey.value) {
        currentKey.value = 999
      } else {
        currentKey.value = value
      }
    }

    const copyLogs = (text) => {
      copyToClipboard({
        text: text,
        isShowMessage: true
      })
    }

    return {
      processActivity,
      recordCount,
      pageToken,
      isLoadProcess,
      currentKey,
      pageSize,
      // computeds
      getRunProcessAll,
      getProcessLog,
      getProcessLogSuccess,
      getProcessLogError,
      getProcessLogProcessing,
      // methods
      showkey,
      copyLogs,
      checkStatus,
      generateTitle,
      handleCommand,
      findTranslation,
      translateDateByLong,
      setProcessParameters
    }
  }
})
