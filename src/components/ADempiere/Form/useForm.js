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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { computed, ref } from '@vue/composition-api'

import store from '@/store'

// constants
import { containerManager } from '@/utils/ADempiere/dictionary/form'

// utils and helper methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'
import { createFieldFromDefinition, createFieldFromDictionary } from '@/utils/ADempiere/lookupFactory'

export default function useForm({
  containerUuid,
  metadata,
  fieldsListDefinition
}) {
  const isLoaded = ref(false)
  const fieldsList = ref([])
  const panelMetadata = ref({})

  const getterPanel = computed(() => {
    return store.getters.getPanel(containerUuid)
  })

  function generateFieldsList() {
    let sequence = 0
    const incrementSequence = (newValue) => {
      if (newValue) {
        sequence = newValue
      }
      sequence = sequence + 10
      return sequence
    }

    if (metadata) {
      return new Promise(resolve => {
        const additionalAttributes = {
          containerUuid,
          isEvaluateValueChanges: false,
          panelType: 'form'
        }

        const fieldsListFromDictionary = []
        const fieldsListFromMetadata = []

        fieldsListDefinition.forEach(fieldElement => {
          if (fieldElement.isFromDictionary) {
            // set sequence
            if (fieldElement.overwriteDefinition) {
              if (isEmptyValue(fieldElement.overwriteDefinition.sequence)) {
                fieldElement.overwriteDefinition.sequence = incrementSequence()
              } else {
                incrementSequence(fieldElement.overwriteDefinition.sequence)
              }
            } else {
              fieldElement.overwriteDefinition = {}
              fieldElement.overwriteDefinition.sequence = incrementSequence()
            }

            fieldsListFromDictionary.push(
              createFieldFromDictionary({
                ...fieldElement,
                ...additionalAttributes
              })
            )
          } else {
            // set sequence
            if (fieldElement.definition) {
              if (isEmptyValue(fieldElement.definition.sequence)) {
                fieldElement.definition.sequence = incrementSequence()
              } else {
                incrementSequence(fieldElement.definition.sequence)
              }
            } else {
              fieldElement.definition = {}
              fieldElement.definition.sequence = incrementSequence()
            }

            fieldsListFromMetadata.push(
              createFieldFromDefinition({
                ...fieldElement,
                ...additionalAttributes
              })
            )
          }
        })
        let fieldsListGenerated = fieldsListFromMetadata

        if (isEmptyValue(fieldsListFromDictionary)) {
          fieldsList.value = fieldsListGenerated
          resolve(fieldsList)
          isLoaded.value = true
        } else {
          Promise.all(fieldsListFromDictionary)
            .then(responsefields => {
              fieldsListGenerated = fieldsListGenerated.concat(responsefields)
              fieldsList.value = fieldsListGenerated
              resolve(fieldsList.value)
              isLoaded.value = true
            })
        }
      })
    }
  }

  /**
   * Vuex suscription
   * @override
   */
  async function getPanel() {
    let panel = getterPanel.value
    if (!isEmptyValue(panel)) {
      if (isEmptyValue(panel.fieldsList)) {
        await generateFieldsList()
        store.dispatch('changeFormAttribute', {
          containerUuid,
          attributeName: 'fieldsList',
          attributeValue: fieldsList.value
        })
        panel = getterPanel.value
      }
      fieldsList.value = panel.fieldsList
      isLoaded.value = true
      panelMetadata.value = panel
    } else {
      await generateFieldsList()
      store.dispatch('addPanel', {
        ...metadata,
        isCustomForm: true,
        uuid: containerUuid,
        panelType: 'form',
        fieldsList: fieldsList.value
      })
        .then(responsePanel => {
          fieldsList.value = responsePanel.fieldsList

          store.dispatch('changeFormAttribute', {
            containerUuid,
            attributeName: 'fieldsList',
            attributeValue: fieldsList.value
          })
          panelMetadata.value = responsePanel
          // runAfterLoadPanel()
        })
        .finally(() => {
          isLoaded.value = true
        })
    }
  }

  getPanel()

  return {
    fieldsList,
    generateFieldsList,
    containerManager,
    panelMetadata
  }
}
