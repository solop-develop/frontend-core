// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2023-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

// API Request Methods
import {
  listCustomers,
  updateOrder as changeCustomerOrder,
  UpdateCustomer,
  createCustomer
} from '@/api/ADempiere/form/VPOS'
import {
  listCountries,
  getCountries,
  listRegion,
  listCities
} from '@/api/ADempiere/field/locations'
// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { showMessage } from '@/utils/ADempiere/notification'
import { setComponentSequencePOSV } from '@/utils/ADempiere/dictionary/field/locationAddress'

const customers = {
  showCustomer: false,
  customers: [],
  recordCount: 0,
  currentCustomer: {},
  pageToken: '',
  fields: {
    code: '',
    identificationNumber: '',
    typePerson: '',
    taxPayer: false,
    taxpayerType: '',
    name: '',
    name2: '',
    email: '',
    phone: '',
    listCountries: [],
    listRegions: [],
    listCities: []
  },
  fieldsEdit: {
    code: '',
    identificationNumber: '',
    typePerson: '',
    taxPayer: false,
    taxpayerType: '',
    name: '',
    name2: '',
    email: '',
    phone: '',
    listCountries: [],
    listRegions: [],
    listCities: []
  },
  billingAddress: {
    posalCodeAdditional: '',
    countryId: undefined,
    regionId: undefined,
    cityId: undefined,
    locationName: '',
    postalCode: '',
    countries: {},
    cityLabel: '',
    longitude: '',
    reference: '',
    address1: '',
    address2: '',
    address3: '',
    address4: '',
    latitude: '',
    altitude: '',
    email: '',
    phone: ''
  },
  shippingAddress: {
    posalCodeAdditional: '',
    countryId: undefined,
    regionId: undefined,
    cityId: undefined,
    locationName: '',
    postalCode: '',
    countries: {},
    cityLabel: '',
    longitude: '',
    reference: '',
    address1: '',
    address2: '',
    address3: '',
    address4: '',
    latitude: '',
    altitude: '',
    email: '',
    phone: ''
  },
  addressEdit: {
    posalCodeAdditional: '',
    countryId: undefined,
    regionId: undefined,
    cityId: undefined,
    locationName: '',
    postalCode: '',
    countries: {},
    cityLabel: '',
    longitude: '',
    reference: '',
    address1: '',
    address2: '',
    address3: '',
    address4: '',
    latitude: '',
    altitude: '',
    email: '',
    phone: ''
  }
}

export default {
  state: customers,
  mutations: {
    setShowCustomerList(state, show) {
      state.showCustomer = show
    },
    setCustomerCount(state, recordCount) {
      state.recordCount = recordCount
    },
    setCustomerPageToken(state, pageToken) {
      state.pageToken = pageToken
    },
    setCustomersList(state, list) {
      state.customers = list
    },
    setAttributeFieldCustomer(state, {
      attribute,
      value
    }) {
      state.fields[attribute] = value
    },
    setAttributeFieldCustomerEdit(state, {
      attribute,
      value
    }) {
      state.fieldsEdit[attribute] = value
    },
    setFieldCustomerEdit(state, editCustomer) {
      state.fieldsEdit = {
        ...state.fieldsEdit,
        ...editCustomer
      }
    },
    setAttributeFieldLocationsCustomers(state, {
      typeLocations,
      attribute,
      value
    }) {
      state[typeLocations][attribute] = value
    },
    setAttributeEditAddress(state, {
      attribute,
      value
    }) {
      state.addressEdit[attribute] = value
    },
    setValuesEditAddress(state, editAddress) {
      state.addressEdit = editAddress
    }
  },
  /**
   * Customers
   */
  actions: {
    /**
     * Get List Customers
     * @params {String} SearchValue
     * @params {Number} PageSize
     */
    searchCustomersList({
      commit
    }, {
      searchValue,
      name,
      email,
      value,
      pageSize = 15,
      pageToken
    }) {
      return new Promise(resolve => {
        listCustomers({
          pageSize,
          pageToken,
          searchValue,
          name,
          email,
          value
        })
          .then(response => {
            const {
              record_count,
              customers,
              next_page_token
            } = response
            commit('setCustomerCount', record_count)
            commit('setCustomersList', customers)
            commit('setCustomerPageToken', next_page_token)
            resolve(customers)
          })
          .catch(error => {
            console.warn(`Product List: ${error.message}. Code: ${error.code}.`)
            showMessage({
              type: 'error',
              message: error.message,
              showClose: true
            })
            resolve([])
          })
      })
    },
    /**
     * Fields Locations Customer
     * countriesCustomers -> List All Countris
     * citiesCustomers -> List All cities
     * regionsCustomers -> List All Countris
     * countrieCustomers -> Get Countrie the Fields Customers
     */
    countriesCustomers({
      commit
    }, typeLocations) {
      return new Promise(resolve => {
        listCountries({})
          .then(response => {
            const { countries } = response
            commit('setAttributeFieldCustomer', {
              attribute: 'listCountries',
              value: countries
            })
            resolve(countries)
          })
          .catch(error => {
            let message = error.message
            if (!isEmptyValue(error.response) && !isEmptyValue(error.response.data.message)) {
              message = error.response.data.message
            }

            showMessage({
              type: 'error',
              message,
              showClose: true
            })
            resolve(error)
          })
      })
    },
    citiesCustomers({
      commit,
      getters
    }, typeLocations) {
      return new Promise(resolve => {
        const countryId = getters.getAttributeFieldLocationsCustomers({
          typeLocations: typeLocations,
          attribute: 'countryId'
        })
        const regionId = getters.getAttributeFieldLocationsCustomers({
          typeLocations: typeLocations,
          attribute: 'regionId'
        })
        listCities({
          countryId,
          regionId
        })
          .then(response => {
            const { cities } = response
            commit('setAttributeFieldCustomer', {
              attribute: 'listCities',
              value: cities
            })
            resolve(cities)
          })
          .catch(error => {
            let message = error.message
            if (!isEmptyValue(error.response) && !isEmptyValue(error.response.data.message)) {
              message = error.response.data.message
            }

            showMessage({
              type: 'error',
              message,
              showClose: true
            })
            resolve(error)
          })
      })
    },
    countrieCustomers({
      commit
    }, {
      countryId,
      typeLocations
    }) {
      return new Promise(resolve => {
        getCountries({
          id: countryId
        })
          .then(response => {
            commit('setAttributeFieldLocationsCustomers', {
              typeLocations,
              attribute: 'countries',
              value: {
                ...response,
                secuenceComponent: setComponentSequencePOSV(response)
              }
            })
            resolve(response)
          })
          .catch(error => {
            let message = error.message
            if (!isEmptyValue(error.response) && !isEmptyValue(error.response.data.message)) {
              message = error.response.data.message
            }

            showMessage({
              type: 'error',
              message,
              showClose: true
            })
            resolve(error)
          })
      })
    },
    regionsCustomers({
      commit,
      getters
    }, typeLocations) {
      return new Promise(resolve => {
        const countryId = getters.getAttributeFieldLocationsCustomers({
          typeLocations: typeLocations,
          attribute: 'countryId'
        })
        listRegion({
          countryId
        })
          .then(response => {
            const { regions } = response
            commit('setAttributeFieldCustomer', {
              attribute: 'listRegions',
              value: regions
            })
            resolve(regions)
          })
          .catch(error => {
            let message = error.message
            if (!isEmptyValue(error.response) && !isEmptyValue(error.response.data.message)) {
              message = error.response.data.message
            }

            showMessage({
              type: 'error',
              message,
              showClose: true
            })
            resolve(error)
          })
      })
    },
    /**
     * Change Business Partner in Order
     */
    changeCustomerOrder({
      getters,
      dispatch
    }, customerId) {
      return new Promise(resolve => {
        const pos = getters.getVPOS
        const order = getters.getCurrentOrder
        if (isEmptyValue(order)) resolve({})
        if (order.document_status.value !== 'DR') {
          resolve({})
        }
        changeCustomerOrder({
          posId: pos.id,
          orderId: order.id,
          customer_id: customerId
        })
          .then(response => {
            dispatch('overloadOrder', { order: response })
            resolve(response)
          })
          .catch(error => {
            console.warn(`Change Business Partner in Order: ${error.message}. Code: ${error.code}.`)
            let message = error.message
            if (!isEmptyValue(error.response) && !isEmptyValue(error.response.data.message)) {
              message = error.response.data.message
            }

            showMessage({
              type: 'error',
              message,
              showClose: true
            })
            resolve(error)
          })
      })
    },
    /**
     * Create New Business Partner
     */
    createCustomer({
      getters,
      dispatch
    }, {
      additionalAttributes,
      addresses
    }) {
      return new Promise(resolve => {
        const pos = getters.getVPOS
        const order = getters.getCurrentOrder
        const value = getters.getAttributeFieldCustomer({
          attribute: 'code'
        })
        const name = getters.getAttributeFieldCustomer({
          attribute: 'name'
        })
        const lastName = getters.getAttributeFieldCustomer({
          attribute: 'name2'
        })
        createCustomer({
          additionalAttributes,
          addresses,
          name,
          posId: pos.id,
          value,
          lastName
        })
          .then(response => {
            if (!isEmptyValue(order)) {
              dispatch('changeCustomerOrder', response.id)
            }
            resolve(response)
          })
          .catch(error => {
            console.warn(`Change Business Partner in Order: ${error.message}. Code: ${error.code}.`)
            let message = error.message
            if (!isEmptyValue(error.response) && !isEmptyValue(error.response.data.message)) {
              message = error.response.data.message
            }

            showMessage({
              type: 'error',
              message,
              showClose: true
            })
            resolve(error)
          })
      })
    },
    /**
     * Clear Data Form Business Partner
     */
    clearDataFormCustomer({
      state
    }) {
      return new Promise(resolve => {
        const address = {
          posalCodeAdditional: '',
          countryId: undefined,
          regionId: undefined,
          cityId: undefined,
          locationName: '',
          postalCode: '',
          countries: {},
          cityLabel: '',
          longitude: '',
          address1: '',
          address2: '',
          address3: '',
          address4: '',
          latitude: '',
          altitude: '',
          reference: ''
        }
        state.fields = {
          code: '',
          identificationNumber: '',
          typePerson: '',
          taxPayer: false,
          taxpayerType: '',
          name: '',
          name2: '',
          email: '',
          phone: '',
          listCountries: [],
          listRegions: [],
          listCities: []
        }
        state.billingAddress = address
        state.shippingAddress = address
        resolve()
      })
    },
    UpdateCustomer({ getters, dispatch }, {
      additionalAttributes,
      addresses
    }) {
      return new Promise(resolve => {
        const pos = getters.getVPOS
        const value = getters.getAttributeFieldCustomerEdit({
          attribute: 'code'
        })
        const name = getters.getAttributeFieldCustomerEdit({
          attribute: 'name'
        })
        const lastName = getters.getAttributeFieldCustomerEdit({
          attribute: 'name2'
        })
        const email = getters.getAttributeFieldCustomerEdit({
          attribute: 'email'
        })
        const phone = getters.getAttributeFieldCustomerEdit({
          attribute: 'phone'
        })
        const listAddresses = addresses.map(list => {
          return {
            ...list,
            email,
            phone
          }
        })
        const order = getters.getCurrentOrder
        UpdateCustomer({
          additionalAttributes,
          addresses: listAddresses,
          name,
          posId: pos.id,
          id: order.customer.id,
          value,
          lastName
        })
          .then(response => {
            // if (!isEmptyValue(order)) {
            //   dispatch('changeCustomerOrder', response.id)
            // }
            dispatch('overloadOrder', { order })
            resolve(response)
          })
          .catch(error => {
            console.warn(`Update Business Partner in Order: ${error.message}. Code: ${error.code}.`)
            let message = error.message
            if (!isEmptyValue(error.response) && !isEmptyValue(error.response.data.message)) {
              message = error.response.data.message
            }

            showMessage({
              type: 'error',
              message,
              showClose: true
            })
            resolve(error)
          })
      })
    }
  },
  getters: {
    getCustomersList: (state) => {
      return state.customers
    },
    getCustomerCount: (state) => {
      return state.recordCount
    },
    getCustomerPageToken: (state) => {
      return state.pageToken
    },
    getShowCustomerList: (state) => {
      return state.showCustomer
    },
    getAttributeFieldCustomer: (state) => ({ attribute }) => {
      return state.fields[attribute]
    },
    getAttributeFieldCustomerEdit: (state) => ({ attribute }) => {
      return state.fieldsEdit[attribute]
    },
    getAttributeFieldLocationsCustomers: (state) => ({ typeLocations, attribute }) => {
      return state[typeLocations][attribute]
    },
    getAttributeBillingAddress(state) {
      return state.billingAddress
    },
    getAttributeShippingAddress(state) {
      return state.shippingAddress
    },
    getAttributeEditAddress(state) {
      return state.addressEdit
    },
    getAttributeAddressEdit: (state) => ({ attribute }) => {
      return state.addressEdit[attribute]
    }
  }
}
