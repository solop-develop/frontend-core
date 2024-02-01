/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
 * Contributor(s): Elsio Sanchez elsiosanchez15@outlook.com https://github.com/elsiosanchez
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

import Vue from 'vue'

// API Request Methods
import {
  updateAddressRequest,
  createAddressRequest,
  listCountriesRequest,
  getCountryRequest,
  getLocationAddressRequest,
  listRegionsRequest,
  listCitiesRequest
} from '@/api/ADempiere/field/location-address.ts'

// Utils and Helper Methods
import { showMessage } from '@/utils/ADempiere/notification'
import { setComponentSequence } from '@/utils/ADempiere/dictionary/field/locationAddress'

const emptyField = {
  id: undefined,
  uuid: '',
  display_value: '',
  //
  country_id: undefined,
  country_name: '',
  region_id: undefined,
  region_name: '',
  city: '',
  city_id: undefined,
  city_name: '',
  //
  address1: '',
  address2: '',
  address3: '',
  address4: '',
  //
  postal_code: '',
  posal_code_additional: '',
  reference: '',
  //
  altitude: '',
  longitude: '',
  latitude: ''
}

const locations = {
  emptyField,
  field: {
    ...emptyField
  },
  countriesDefinitions: {},
  countriesList: [],
  listRegions: [],
  listCities: []
}

export default {
  state: locations,

  mutations: {
    setCurrentAddressLocation(state, addressLocation) {
      state.field = addressLocation
    },
    setAttributeFieldLocations(state, {
      attribute,
      value
    }) {
      state.field[attribute] = value
    },
    setLocationAddressCountryDefinition(state, country) {
      Vue.set(state.countriesDefinitions, country.id, country)
    },
    setLocationAddressCountriesList(state, list) {
      state.countriesList = list
    },
    setListRegions(state, list) {
      state.listRegions = list
    },
    setListCities(state, list) {
      state.listCities = list
    },
    clearAddressLocation(state, payload) {
      state.field = payload
    }
  },

  actions: {
    clearAddressLocation({ state, commit, rootGetters }) {
      const emptyField = state.emptyField

      // session country as default value
      const sessionCountryId = rootGetters.getSessionContextCountrytId

      commit('clearAddressLocation', {
        ...emptyField,
        country_id: sessionCountryId
      })
    },

    /**
     * Get Countries
     */
    getCountryDefinitionFromServer({
      commit
    }, {
      countryId
    }) {
      return new Promise(resolve => {
        getCountryRequest({
          id: countryId
        })
          .then(response => {
            const countryDefintion = {
              ...response,
              secuenceComponent: setComponentSequence(response)
            }
            commit('setLocationAddressCountryDefinition', countryDefintion)
            resolve(countryDefintion)
          })
          .catch(error => {
            showMessage({
              message: error.message,
              type: 'error'
            })
            resolve(error)
          })
      })
    },
    /**
     * Locations List
     */
    getCountriesListFromServer({
      commit
    }) {
      return new Promise(resolve => {
        listCountriesRequest({})
          .then(response => {
            const { countries } = response

            commit('setLocationAddressCountriesList', countries)

            resolve(countries)
          })
          .catch(error => {
            showMessage({
              message: error.message,
              type: 'error'
            })
            resolve(error)
          })
      })
    },

    getRegionsListFromServer({
      commit,
      getters
    }) {
      return new Promise(resolve => {
        const countryId = getters.getAttributeFieldLocations({
          attribute: 'country_id'
        })
        listRegionsRequest({
          countryId
        })
          .then(response => {
            const { regions } = response
            commit('setListRegions', regions)
            resolve(regions)
          })
          .catch(error => {
            showMessage({
              message: error.message,
              type: 'error'
            })
            resolve(error)
          })
      })
    },

    getCitiesListFromServer({
      commit,
      getters
    }) {
      return new Promise(resolve => {
        const countryId = getters.getAttributeFieldLocations({
          attribute: 'country_id'
        })
        const regionId = getters.getAttributeFieldLocations({
          attribute: 'region_id'
        })
        listCitiesRequest({
          countryId,
          regionId
        })
          .then(response => {
            const { cities } = response
            commit('setListCities', cities)
            resolve(cities)
          })
          .catch(error => {
            showMessage({
              message: error.message,
              type: 'error'
            })
            resolve(error)
          })
      })
    },

    /**
     * Get Location (Address)
     */
    getLocationAddressFromServer({
      commit
    }, {
      locationId
    }) {
      return new Promise(resolve => {
        getLocationAddressRequest({
          id: locationId
        })
          .then(response => {
            commit('setCurrentAddressLocation', response)
            resolve(response)
          })
          .catch(error => {
            resolve(error)
          })
      })
    },

    /**
     * Create Location (Address)
     */
    newLocation({
      commit,
      getters
    }) {
      return new Promise(resolve => {
        const {
          country_id,
          region_id,
          city_id,
          city,
          address1,
          address2,
          address3,
          address4,
          postal_code,
          posal_code_additional,
          latitude,
          longitude,
          altitude,
          reference
        } = getters.getFieldLocations
        createAddressRequest({
          countryId: country_id,
          regionId: region_id,
          cityId: city_id,
          cityLabel: city,
          address1,
          address2,
          address3,
          address4,
          postalCode: postal_code,
          posalCodeAdditional: posal_code_additional,
          latitude,
          longitude,
          altitude,
          reference
        })
          .then(response => {
            commit('setCurrentAddressLocation', response)
            resolve(response)
          })
          .catch(error => {
            showMessage({
              message: error.message,
              type: 'error'
            })
            resolve(error)
          })
      })
    },

    /**
     * Update Location (Address)
     */
    updateLocation({
      commit,
      getters
    }, {
      locationId
    }) {
      return new Promise(resolve => {
        const {
          country_id,
          region_id,
          city_id,
          city,
          address1,
          address2,
          address3,
          address4,
          postal_code,
          posal_code_additional,
          latitude,
          longitude,
          altitude,
          reference
        } = getters.getFieldLocations
        updateAddressRequest({
          id: locationId,
          countryId: country_id,
          regionId: region_id,
          cityId: city_id,
          cityLabel: city,
          address1,
          address2,
          address3,
          address4,
          postalCode: postal_code,
          posalCodeAdditional: posal_code_additional,
          latitude,
          longitude,
          altitude,
          reference
        })
          .then(response => {
            commit('setCurrentAddressLocation', response)
            resolve(response)
          })
          .catch(error => {
            showMessage({
              message: error.message,
              type: 'error'
            })
            resolve(error)
          })
      })
    }
  },

  getters: {
    getStoredAddressLocation: (state) => {
      return state.field
    },
    getAttributeFieldLocations: (state) => ({ attribute }) => {
      return state.field[attribute]
    },
    getStoredAddressLocationCountries: (state, getters) => {
      return state.countriesList || []
    },
    getListRegions: (state) => {
      return state.listRegions
    },
    getListCities: (state) => {
      return state.listCities
    },
    getFieldLocations: (state) => {
      return state.field
    },
    getStoredCountryDefinition: (state) => (id) => {
      return state.countriesDefinitions[id] || {}
    }
  }
}
