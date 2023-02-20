/**
* ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
* Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
* Contributor(s): Elsio Sanchez elsiosanchez@gmail.com https://github.com/elsiosanchez
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

const initState = {
  productAttribute: {},
  currentProductAttribute: {},
  showProductAttribute: false
}

const productAttribute = {
  state: initState,

  mutations: {
    setCurrentProductAttribute(state, attribute) {
      state.currentProductAttribute = attribute
    },
    setShowProductAttribute(state, show) {
      state.showProductAttribute = show
    }
  },

  actions: {

  },

  getters: {
    getCurrentProductAttribute: (state) => {
      return state.currentProductAttribute
    },
    getShowProductAttribute: (state) => {
      return state.showProductAttribute
    }
  }
}

export default productAttribute
