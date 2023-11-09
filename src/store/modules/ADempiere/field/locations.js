/**
 * ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
 * Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
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

// API Request Methods
import {
  updateAddress,
  createAddress,
  listCountries,
  getCountries,
  getAddress,
  listRegion,
  listCities
} from '@/api/ADempiere/field/locations'
// Utils and Helper Methods
// import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'
import { showMessage } from '@/utils/ADempiere/notification'
import { setComponentSequence } from '@/utils/ADempiere/dictionary/field/locationAddress'

const locations = {
  field: {
    countryId: undefined,
    regionId: undefined,
    cityId: undefined,
    cityLabel: '',
    address1: '',
    address2: '',
    address3: '',
    address4: '',
    postalCode: '',
    posalCodeAdditional: '',
    latitude: '',
    longitude: '',
    altitude: '',
    reference: '',
    id: undefined
  },
  countries: {},
  listCountry: [],
  listRegions: [],
  listCities: []
}

export default {
  state: locations,
  mutations: {
    setAttributeFieldLocations(state, {
      attribute,
      value
    }) {
      state.field[attribute] = value
    },
    setListCountries(state, list) {
      state.listCountry = list
    },
    setListRegions(state, list) {
      state.listRegions = list
    },
    setListCities(state, list) {
      state.listCities = list
    },
    setCountries(state, country) {
      state.countries = country
    }
  },
  actions: {
    /**
     * Locations List
     */
    listofCountries({
      commit
    }) {
      return new Promise(resolve => {
        listCountries({})
          .then(response => {
            const { countries } = response
            commit('setListCountries', countries)
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
    listofRegions({
      commit,
      getters
    }) {
      return new Promise(resolve => {
        const countryId = getters.getAttributeFieldLocations({
          attribute: 'countryId'
        })
        listRegion({
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
    listOfCities({
      commit,
      getters
    }) {
      return new Promise(resolve => {
        const countryId = getters.getAttributeFieldLocations({
          attribute: 'countryId'
        })
        const regionId = getters.getAttributeFieldLocations({
          attribute: 'regionId'
        })
        listCities({
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
     * Get Countries
     */
    countries({
      commit
    }, {
      countryId
    }) {
      return new Promise(resolve => {
        getCountries({
          id: countryId
        })
          .then(response => {
            commit('setCountries', {
              response,
              secuenceComponent: setComponentSequence(response)
            })
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
     * Get Location (Address)
     */
    location({
      commit,
      dispatch
    }, {
      locationId
    }) {
      return new Promise(resolve => {
        getAddress({
          id: locationId
        })
          .then(response => {
            commit('setCountries', response)
            dispatch('setAttributeLocations', response)
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
      getters,
      dispatch
    }) {
      return new Promise(resolve => {
        const {
          countryId,
          regionId,
          cityId,
          cityLabel,
          address1,
          address2,
          address3,
          address4,
          postalCode,
          posalCodeAdditional,
          latitude,
          longitude,
          altitude,
          reference
        } = getters.getFieldLocations
        createAddress({
          countryId,
          regionId,
          cityId,
          cityLabel,
          address1,
          address2,
          address3,
          address4,
          postalCode,
          posalCodeAdditional,
          latitude,
          longitude,
          altitude,
          reference
        })
          .then(response => {
            commit('setCountries', response)
            dispatch('setAttributeLocations', response)
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
      getters,
      dispatch
    }, {
      locationId
    }) {
      return new Promise(resolve => {
        const {
          countryId,
          regionId,
          cityId,
          cityLabel,
          address1,
          address2,
          address3,
          address4,
          postalCode,
          posalCodeAdditional,
          latitude,
          longitude,
          altitude,
          reference
        } = getters.getFieldLocations
        updateAddress({
          id: locationId,
          countryId,
          regionId,
          cityId,
          cityLabel,
          address1,
          address2,
          address3,
          address4,
          postalCode,
          posalCodeAdditional,
          latitude,
          longitude,
          altitude,
          reference
        })
          .then(response => {
            dispatch('setAttributeLocations', response)
            commit('setCountries', response)
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
    setAttributeLocations({
      commit
    }, locations) {
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
          postal_code_additional
        } = locations
        commit('setAttributeFieldLocations', {
          attribute: 'countryId',
          value: country_id
        })
        commit('setAttributeFieldLocations', {
          attribute: 'regionId',
          value: region_id
        })
        commit('setAttributeFieldLocations', {
          attribute: 'cityId',
          value: city_id
        })
        commit('setAttributeFieldLocations', {
          attribute: 'city',
          value: city
        })
        commit('setAttributeFieldLocations', {
          attribute: 'address1',
          value: address1
        })
        commit('setAttributeFieldLocations', {
          attribute: 'address2',
          value: address2
        })
        commit('setAttributeFieldLocations', {
          attribute: 'address3',
          value: address3
        })
        commit('setAttributeFieldLocations', {
          attribute: 'address4',
          value: address4
        })
        commit('setAttributeFieldLocations', {
          attribute: 'PosalCodeAdditional',
          value: postal_code_additional
        })
        commit('setAttributeFieldLocations', {
          attribute: 'postalCode',
          value: postal_code
        })
      })
    }
  },
  getters: {
    getAttributeFieldLocations: (state) => ({ attribute }) => {
      return state.field[attribute]
    },
    getListCountries: (state) => {
      return state.listCountry
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
    getCountries: (state) => {
      return state.countries
    }
  }
}
