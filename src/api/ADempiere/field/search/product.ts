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

// Get Instance for connection
import { request } from '@/utils/ADempiere/request'
import { isEmptyValue } from '@/utils/ADempiere/valueUtils.js'

// Constants
import { ROWS_OF_RECORDS_BY_PAGE } from '@/utils/ADempiere/tableUtils'

export function requestListProductCategories({
  filters,
  searchValue,
  //
  pageToken,
  pageSize = ROWS_OF_RECORDS_BY_PAGE
}) {
  return request({
    url: `/field/products/categories`,
    method: 'get',
    params: {
      is_only_active_records: true,
      //
      filters,
      search_value: searchValue,
      // Page Data
      page_token: pageToken,
      page_size: pageSize
    }
  })
}

export function requestListProductGroups({
  filters,
  searchValue,
  //
  pageToken,
  pageSize = ROWS_OF_RECORDS_BY_PAGE
}) {
  return request({
    url: `/field/products/groups`,
    method: 'get',
    params: {
      is_only_active_records: true,
      //
      filters,
      search_value: searchValue,
      // Page Data
      page_token: pageToken,
      page_size: pageSize
    }
  })
}

export function requestListProductClasess({
  filters,
  searchValue,
  //
  pageToken,
  pageSize = ROWS_OF_RECORDS_BY_PAGE
}) {
  return request({
    url: `/field/products/clasess`,
    method: 'get',
    params: {
      is_only_active_records: true,
      //
      filters,
      search_value: searchValue,
      // Page Data
      page_token: pageToken,
      page_size: pageSize
    }
  })
}

export function requestListProductClassifications({
  filters,
  searchValue,
  //
  pageToken,
  pageSize = ROWS_OF_RECORDS_BY_PAGE
}) {
  return request({
    url: `/field/products/classifications`,
    method: 'get',
    params: {
      is_only_active_records: true,
      //
      filters,
      search_value: searchValue,
      // Page Data
      page_token: pageToken,
      page_size: pageSize
    }
  })
}

export function requestListWarehouses({
  contextAttributesList,
  filters,
  searchValue,
  //
  pageToken,
  pageSize = ROWS_OF_RECORDS_BY_PAGE
}) {
  let contextAttributes = []
  if (!isEmptyValue(contextAttributesList)) {
    contextAttributes = contextAttributesList.map(attribute => {
      return {
        key: attribute.columnName,
        value: attribute.value
      }
    })
  }
  return request({
    url: `/field/products/warehouses`,
    method: 'get',
    params: {
      context_attributes: contextAttributes,
      is_only_active_records: true,
      //
      filters,
      search_value: searchValue,
      // Page Data
      page_token: pageToken,
      page_size: pageSize
    }
  })
}

export function requestGetPriceListVersion({
  priceListId,
  dateOrdered,
  dateInvoiced
}) {
  return request({
    url: `/field/products/prices-lists-versions/${priceListId}`,
    method: 'get',
    params: {
      // price_list_id: priceListId,
      date_ordered: dateOrdered,
      date_invoiced: dateInvoiced
    }
  })
}

export function requestListPricesListVersions({
  contextAttributesList,
  filters,
  searchValue,
  //
  pageToken,
  pageSize = ROWS_OF_RECORDS_BY_PAGE
}) {
  let contextAttributes = []
  if (!isEmptyValue(contextAttributesList)) {
    contextAttributes = contextAttributesList.map(attribute => {
      return {
        key: attribute.columnName,
        value: attribute.value
      }
    })
  }
  return request({
    url: `/field/products/prices-lists-versions`,
    method: 'get',
    params: {
      context_attributes: contextAttributes,
      is_only_active_records: true,
      //
      filters,
      search_value: searchValue,
      // Page Data
      page_token: pageToken,
      page_size: pageSize
    }
  })
}

export function requestListAttributeSets({
  contextAttributesList,
  filters,
  searchValue,
  //
  pageToken,
  pageSize = ROWS_OF_RECORDS_BY_PAGE
}) {
  let contextAttributes = []
  if (!isEmptyValue(contextAttributesList)) {
    contextAttributes = contextAttributesList.map(attribute => {
      return {
        key: attribute.columnName,
        value: attribute.value
      }
    })
  }
  return request({
    url: `/field/products/attribute-sets`,
    method: 'get',
    params: {
      context_attributes: contextAttributes,
      is_only_active_records: true,
      //
      filters,
      search_value: searchValue,
      // Page Data
      page_token: pageToken,
      page_size: pageSize
    }
  })
}

export function requestListVendors({
  contextAttributesList,
  filters,
  searchValue,
  //
  pageToken,
  pageSize = ROWS_OF_RECORDS_BY_PAGE
}) {
  let contextAttributes = []
  if (!isEmptyValue(contextAttributesList)) {
    contextAttributes = contextAttributesList.map(attribute => {
      return {
        key: attribute.columnName,
        value: attribute.value
      }
    })
  }
  return request({
    url: `/field/products/vendors`,
    method: 'get',
    params: {
      context_attributes: contextAttributes,
      is_only_active_records: true,
      //
      filters,
      search_value: searchValue,
      // Page Data
      page_token: pageToken,
      page_size: pageSize
    }
  })
}

export function requestListProducts({
  contextAttributes,
  filters = [],
  fieldId,
  processParameterId,
  browseFieldId,
  //
  // referenceUuid,
  searchValue,
  //
  tableName,
  columnName,
  columnId,
  // filters
  value,
  name,
  upc,
  sku,
  is_stocked,
  product_group_id,
  product_class_id,
  product_category_id,
  product_classification_id,
  price_list_version_id,
  warehouse_id,
  attribute_set_id,
  attribute_set_instance_id,
  vendor_id,
  //
  pageToken,
  pageSize = ROWS_OF_RECORDS_BY_PAGE,
  isWithoutValidation
}) {
  // filters = filters.map(attribute => {
  //   return {
  //     column_name: attribute.columnName,
  //     operator: attribute.operator,
  //     value: attribute.value
  //   }
  // })

  let url = '/field/products'
  switch (true) {
    case !isEmptyValue(fieldId):
      url = `/field/products/field/${fieldId}`
      break
    case !isEmptyValue(processParameterId):
      url = `/field/products/parameter/${processParameterId}`
      break
    case !isEmptyValue(browseFieldId):
      url = `/field/products/query-criteria/${browseFieldId}`
      break
    case !isEmptyValue(columnId):
      url = `/field/products/column/${columnId}`
      break
    case (!isEmptyValue(tableName) && !isEmptyValue(columnName)):
      url = `/field/products/table/${tableName}/${columnName}`
      break
  }

  return request({
    url,
    method: 'get',
    params: {
      context_attributes: contextAttributes,
      is_without_validation: isWithoutValidation,
      is_only_active_records: true,
      filters,
      //
      // reference_id: reference_id,
      search_value: searchValue,
      value,
      name,
      sku,
      upc,
      is_stocked,
      product_group_id,
      product_class_id,
      product_category_id,
      product_classification_id,
      price_list_version_id,
      warehouse_id,
      attribute_set_id,
      attribute_set_instance_id,
      vendor_id,
      // Page Data
      page_token: pageToken,
      page_size: pageSize
    }
  })
}

export function requestListWarehouseStocks({
  productId
}) {
  return request({
    url: `/field/products/${productId}/warehouse-stocks`,
    method: 'get'
  })
}

export function requestListSubstituteProducts({
  productId,
  priceList
}) {
  return request({
    url: `/field/products/${productId}/substitutes`,
    method: 'get',
    params: {
      price_list_version_id: priceList
    }
  })
}

export function requestListRelatedProducts({
  productId,
  priceList
}) {
  return request({
    url: `/field/products/${productId}/relateds`,
    method: 'get',
    params: {
      price_list_version_id: priceList
    }
  })
}

export function requestListAvailableToPromises({
  productId
}) {
  return request({
    url: `/field/products/${productId}/available-to-promises`,
    method: 'get'
  })
}

export function requestListVendorPurchases({
  productId
}) {
  return request({
    url: `/field/products/${productId}/vendor-purchases`,
    method: 'get'
  })
}
