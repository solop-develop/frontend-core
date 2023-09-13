/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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
 * along with this program. If not, see <https:www.gnu.org/licenses/>.
 */

import { defineComponent, computed, ref } from '@vue/composition-api'

import store from '@/store'

// API Request Methods
import {
  requestResource,
  deleteResourceReference,
  sendAttachmentDescription,
  sendAttachmentDescriptionHeader
} from '@/api/ADempiere/user-interface/component/resource'

// Components and Mixins
import FileRender from '@/components/ADempiere/FileRender/index.vue'
import LoadingView from '@/components/ADempiere/LoadingView/index.vue'
import UploadResource from './uploadResource.vue'
import PanelFooter from '@/components/ADempiere/PanelFooter/index.vue'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { showMessage } from '@/utils/ADempiere/notification.js'
import {
  buildLinkHref,
  formatFileSize,
  getImagePath,
  getImageFromContentType
} from '@/utils/ADempiere/resource.js'

export default defineComponent({
  name: 'AttachmentManager',

  components: {
    FileRender,
    LoadingView,
    PanelFooter,
    UploadResource
  },

  props: {
    tableName: {
      type: String,
      default: ''
    },
    containerManager: {
      type: Object,
      default: () => {}
    },
    recordId: {
      type: Number,
      default: 0
    },
    recordUuid: {
      type: String,
      default: ''
    },
    isSelectable: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    // Ref
    const dialogImageUrl = ref('')
    const isLoadeDialogFileUrl = ref(false)
    const dialogVisible = ref(false)
    const disabled = ref(false)
    const pdfAttachment = ref([])
    const imageAttachment = ref([])
    const isList = ref(false)
    const imageKey = ref(0)
    const addMessage = ref('')
    const addDescription = ref('')
    const isShowMessage = ref(false)
    const isEditHeard = ref(false)
    const resourceDescription = ref('')

    // Computed

    const isMobile = computed(() => {
      return store.getters.device === 'mobile'
    })

    const attachmentList = computed({
      set(value) {
        store.commit('setListAttachment', value)
      },
      get() {
        const storedResourcesList = store.getters.getListAttachment
        if (isEmptyValue(storedResourcesList)) {
          return []
        }
        return storedResourcesList.map(element => {
          return {
            ...element,
            src: getSurceFile(element),
            isShowMessage: false
          }
        })
      }
    })

    const previewList = computed(() => {
      return attachmentList.value.map(file => file.src)
    })

    const resourceReference = computed({
      set(value) {
        store.commit('setResourceReference', value)
      },
      get() {
        return store.getters.getResourceReference
      }
    })

    const currentAttachment = computed(() => {
      return store.getters.getAttachment
    })

    // Methods

    /**
     * Handle Removeya esta actualizado solop
     * @param {Object} file
     */
    const handleRemove = (file) => {
      deleteResourceReference({
        resourceUuid: file.uuid,
        resourceName: file.file_name
      }).then(() => {
        const resourceReferencesList = attachmentList.value.filter(resourceReference => {
          return resourceReference.uuid !== file.uuid ||
            resourceReference.file_name !== file.file_name
        })
        attachmentList.value = resourceReferencesList
      })
    }

    /**
     * Handle Picture Card Preview
     * @param {Object} file
     */
    const handlePictureCardPreview = (file) => {
      imageKey.value = attachmentList.value.findIndex(list => list.src === file.src)
      // if (file.content_type.includes('application/pdf')) {
      isLoadeDialogFileUrl.value = true
      dialogImageUrl.value = handleDownload(file, false)
      dialogVisible.value = true
    }

    /**
     * Handle Download
     * @param {Object} file
     * @param {Boolean} isDownload
     */
    const handleDownload = async(file, isDownload = true) => {
      let link
      if (file.content_type.includes('image')) {
        const imagen = await fetch(file.src)
        const imagenblob = await imagen.blob()
        const imageURL = URL.createObjectURL(imagenblob)
        link = document.createElement('a')
        link.href = imageURL
        link.download = file.name
        link.click()
        return
      }

      requestResource({
        resourceUuid: file.uuid,
        resourceName: file.file_name
      }).then(response => {
        buildLinkHref({
          fileName: file.name,
          mimeType: file.content_type,
          outputStream: response, // response.data
          isDownload: true
        })
      })
    }

    /**
     * Get Surce File
     * @param {Object} file
     */
    function getSurceFile(file) {
      if (file.content_type.includes('image')) {
        return getImageFromSource(file).uri
      }
      return getImageFromContentType({
        contentType: file.content_type,
        fileName: file.file_name
      })
    }

    /**
     * Image From Source
     * @param {Object} file
     */
    const getImageFromSource = (file) => {
      const image = getImagePath({
        file: file.file_name,
        width: 900,
        height: 500
      })
      return image
    }

    /**
     * Current Filed
     * @param {Object} file
     */

    function isCurrent(file) {
      if (!props.isSelectable) {
        return false
      }
      if (isEmptyValue(resourceReference.value)) {
        return false
      }
      return resourceReference.value.id === file.id
    }

    /**
     * Add Message
     */
    function sendMessage(file) {
      const { id } = file
      sendAttachmentDescription({
        id,
        textMessage: addMessage.value,
        description: addDescription.value
      })
        .then(() => {
          showMessage({
            type: 'success',
            message: 'OK',
            showClose: true
          })
          loadAttachment()
        })
        .catch(error => {
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
        .finally(() => {
          closeMessage(file)
        })
    }

    /**
     * Clean Message
     */

    function cleanMessage() {
      addMessage.value = ''
    }

    /**
     * Close Message
     */

    function closeMessage(file) {
      cleanMessage()
      file.isShowMessage = false
      isShowMessage.value = file.isShowMessage
    }

    /**
     * Open Message
     */

    function openMessage(file) {
      file.isShowMessage = true
      isShowMessage.value = file.isShowMessage
      addMessage.value = file.text_message
      addDescription.value = file.description
    }

    /**
     * Refrest Attachment
     */

    function loadAttachment() {
      props.containerManager['getAttachment']({
        tableName: props.tableName,
        recordId: props.recordId,
        recordUuid: props.recordUuid
      })
    }

    /**
     * Add Description in Header
     */

    function addAttachmentDescriptionHeader() {
      const { id, attachment_uuid } = currentAttachment.value
      sendAttachmentDescriptionHeader({
        id,
        uuid: attachment_uuid,
        textMessage: resourceDescription.value
      })
        .then(response => {
          console.log({ response })
        })
        .catch(error => {
          showMessage({
            type: 'error',
            message: error.message,
            showClose: true
          })
        })
        .finally(() => {
          isEditHeard.value = false
          loadAttachment()
        })
    }

    /**
     * Update Description Header
     */

    function updateDescriptionHeader(description) {
      isEditHeard.value = true
      resourceDescription.value = description
    }

    /**
     * Clean Description Header
     */

    function clearDescriptionHeader() {
      resourceDescription.value = ''
    }

    /**
     * Close Note
     */

    function closeNote() {
      store.dispatch('showLogs', {
        show: false
      })
    }

    return {
      // Ref
      isList,
      disabled,
      addMessage,
      isEditHeard,
      addDescription,
      isShowMessage,
      dialogVisible,
      pdfAttachment,
      dialogImageUrl,
      imageAttachment,
      currentAttachment,
      resourceDescription,
      isLoadeDialogFileUrl,
      // Computed
      isMobile,
      imageKey,
      previewList,
      attachmentList,
      resourceReference,
      // Methods
      isCurrent,
      closeNote,
      openMessage,
      sendMessage,
      cleanMessage,
      closeMessage,
      handleRemove,
      handleDownload,
      formatFileSize,
      clearDescriptionHeader,
      updateDescriptionHeader,
      handlePictureCardPreview,
      addAttachmentDescriptionHeader
    }
  }
})
