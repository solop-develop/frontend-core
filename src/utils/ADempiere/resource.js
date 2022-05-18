// ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
// Copyright (C) 2017-Present E.R.P. Consultores y Asociados, C.A.
// Contributor(s): Yamel Senih ysenih@erpya.com www.erpya.com
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

// This file allows generate util functions for handle arrays, resources and all
// related to upload to server side and downdload from server side to client side.
// Please add the necessary functions here:
import { config } from '@/utils/ADempiere/config'
import { getToken } from '@/utils/auth'

/**
 * Extract extension file from file name
 * @param {string} fileName
 * @returns
 */
export function getExtensionFromFile(fileName) {
  return fileName.split('.').pop()
}

// Merge two arrays and return merged array
export function mergeByteArray(currentArray, arrayToMerge) {
  const mergedArray = new currentArray.constructor(currentArray.length + arrayToMerge.length)
  mergedArray.set(currentArray)
  mergedArray.set(arrayToMerge, currentArray.length)
  return mergedArray
}

// Build a base 64 image from array
export function buildImageFromArray({
  contentType = 'image/*',
  bytesArray
}) {
  const binary = bytesArray.reduce((data, byte) => {
    return data + String.fromCharCode(byte)
  }, '')
  const b64encoded = btoa(binary)
  const buffer = 'data:' + contentType + ';base64,' + b64encoded
  return buffer
}

/**
 * Build a base 64 image from arrayBuffer
 * @author EdwinBetanc0urt <EdwinBetanc0urt@oulook.com>
 * @author elsiosanchez <Elsiosanches@gmail.com>
 * @param {array} arrayBuffer
 * @param {string} contentType
 * @returns {string} image as base64 encoded
 */
export function buildImageFromArrayBuffer({
  arrayBuffer,
  contentType = 'image/*'
}) {
  const bytesArray = new Uint8Array(arrayBuffer)
  return buildImageFromArray({
    bytesArray,
    contentType
  })
}

/**
 * Get path to get file
 * @author EdwinBetanc0urt <EdwinBetanc0urt@oulook.com>
 * @author elsiosanchez <Elsiosanches@gmail.com>
 * @param {string} file
 * @param {number} width
 * @param {number} height
 * @param {string} operation fit, resize
 * @returns {object} url, urn and uri with path to request
 */
export function getImagePath({
  file,
  width,
  height,
  operation = 'fit'
}) {
  const url = config.adempiere.images.url
  const urn = `img?&token=${getToken()}&action=${operation}&width=${width}&height=${height}&url=${file}`
  const uri = `${url}${urn}`

  return {
    url,
    urn,
    uri
  }
}

/**
 * Get path to get file
 * @author elsiosanchez <Elsiosanches@gmail.com>
 * @param {string} resourceUuid
 * @param {string} resourceName
 * @returns {object} url, urn and uri with path to request
 */

export function getResoursePath({
  resourceUuid,
  resourceName
}) {
  const url = config.adempiere.resource.url
  const urn = `resource?token=${getToken()}&resource_uuid=${resourceUuid}&resource_name=${resourceName}`
  const uri = `${url}${urn}`

  return {
    url,
    urn,
    uri
  }
}

/**
 * Generate blob file and data values
 * @param {string} mimeType
 * @param {array} outputStream
 * @returns {object}
 */
export function buildBlobAndValues({
  mimeType,
  outputStream
}) {
  const dataValues = Object.values(outputStream)
  const blobFile = new Blob([
    Uint8Array.from(dataValues)
  ], {
    type: mimeType
  })

  // const blobFile = new Blob(
  //   [outputStream],
  //   { type: mimeType }
  // )

  return {
    dataValues,
    blobFile
  }
}

/**
 * Build link from ouput report
 * @param {string} fileName
 * @param {string} mimeType
 * @param {array} outputStream
 * @param {boolean} isDownload
 * @returns link
 */
export function buildLinkHref({
  fileName,
  mimeType,
  outputStream,
  isDownload = false
}) {
  const { blobFile } = buildBlobAndValues({
    mimeType,
    outputStream
  })

  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blobFile)
  link.download = fileName

  // download report file
  if (isDownload) {
    link.click()
  }

  return link
}
