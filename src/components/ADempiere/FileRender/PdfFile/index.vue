<!--
  ADempiere-Vue (Frontend) for ADempiere ERP & CRM Smart Business Solution
  Copyright (C) 2018-Present E.R.P. Consultores y Asociados, C.A. www.erpya.com
  Contributor(s): Edwin Betancourt EdwinBetanc0urt@outlook.com https://github.com/EdwinBetanc0urt
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program. If not, see <https:www.gnu.org/licenses/>.
-->

<template>
  <embed
    class="pdf-content"
    :src="output"
    :type="mimeType"
    style="height:1000px;width:100%; position:relative;"
  >
</template>

<script>
import { defineComponent, computed } from '@vue/composition-api'

export default defineComponent({
  name: 'PDF-File',

  props: {
    src: {
      type: String,
      required: true
    },
    mimeType: {
      type: String,
      default: 'application/pdf'
    },
    // format: {
    //   type: String,
    //   required: true
    // },
    name: {
      type: String,
      default: undefined
    },
    stream: {
      type: [Object, Array, String],
      default: undefined
    }
  },
  setup(props) {
    // const byte_array = props.stream.encode()
    const base64 = props.stream
    const arrayBuffer = Uint8Array.from(atob(base64), c => c.charCodeAt(0))
    const blob = new Blob([arrayBuffer.buffer], { type: 'application/pdf;charset=utf-8' })
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = props.name
    const output = computed(() => {
      return link
    })

    return {
      output
    }
  }
})
</script>

<style lang="scss" scoped>
.pdf-content {
  width: 100%;
  height: 90%;
  padding-right: 10px;
}
</style>
