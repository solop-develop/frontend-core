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
  <div>
    <FullCalendar
      class="demo-app-calendar"
      :options="calendarOptions"
    >
      <template v-slot:eventContent="arg">
        <b>{{ arg.timeText }}</b>
        <i>{{ arg.event.title }}</i>
      </template>
    </FullCalendar>
  </div>
</template>

<script>
import lang from '@/lang'
import store from '@/store'
import {
  defineComponent,
  computed
  // ref
} from '@vue/composition-api'

// Components and Mixins
import FullCalendar from '@fullcalendar/vue'
import esLocale from '@fullcalendar/core/locales/es'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
// Constants
import { DEFAULT_RESOURCES, DEFAULT_EVENTS } from './data-resource-time'

// Utils and Helper Methods
import { translateDate } from '@/utils/ADempiere/formatValue/dateFormat'

export default defineComponent({
  name: 'ResourceTimelineView',

  components: {
    FullCalendar // make the <FullCalendar> tag available
  },

  setup() {
    /**
     * Ref
     */
    // const currentEvents = ref([])
    /**
     * Computed
     */
    const currentEvents = computed(() => {
      return store.getters.getListTasksEvents
    })

    const calendarOptions = computed(() => {
      return {
        expandRows: true,
        navLinks: true, // can click day/week names to navigate views
        selectable: true,
        nowIndicator: true,
        dayMaxEvents: true, // allow "more" link when too many
        timeZone: 'UTC',
        plugins: [resourceTimelinePlugin],
        headerToolbar: {
          left: 'today prev,next',
          center: 'title',
          right: 'resourceTimelineMonth,resourceTimelineYear'
        },
        initialView: 'resourceTimelineYear',
        scrollTime: '08:00',
        aspectRatio: 1.5,
        editable: true,
        resourceAreaHeaderContent: 'MAILING',
        resources: DEFAULT_RESOURCES,
        events: DEFAULT_EVENTS,
        select: handleDateSelect(),
        // eventClick: handleEventClick(),
        eventsSet: handleEvents()
      }
    })

    /**
     * Methods
     */

    function handleDateSelect(selectInfo) {
      if (!selectInfo) {
        return
      }
      // const title = prompt(lang.t('component.calendar.titleNewEvent'))
      const calendarApi = selectInfo.view.calendar
      calendarApi.unselect() // clear date selection
      // if (title) {
      //   calendarApi.addEvent({
      //     id: createEventId(),
      //     title,
      //     start: selectInfo.startStr,
      //     end: selectInfo.endStr,
      //     allDay: selectInfo.allDay
      //   })
      // }
    }

    function handleEventClick(clickInfo) {
      if (confirm(`${lang.t('component.calendar.deleteEventConfirm')} '${clickInfo.event.title}'`)) {
        clickInfo.event.remove()
      }
    }

    function handleEvents(events) {
      currentEvents.value = events
    }

    store.dispatch('getListTasksFromServer', {})

    return {
      // Ref
      currentEvents,
      // Computed
      calendarOptions,
      // Methods
      handleDateSelect,
      handleEventClick,
      handleEvents,
      translateDate,
      //
      esLocale,
      listPlugin,
      dayGridPlugin,
      timeGridPlugin,
      interactionPlugin
    }
  }
})
</script>

<style lang='scss'>
.demo-app {
  display: flex !important;
  height: 50vh;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;

  .demo-app-sidebar {
    width: 300px;
    line-height: 1.5;
    background: #eaf9ff;
    border-right: 1px solid #d3e2e8;
    h2 {
      margin: 0;
      font-size: 16px;
    }

    ul {
      overflow: auto;
      height: 89vh;
      padding: 0px 5px;
      margin: 0;
    }

    li {
      margin: 0.5em 0;
      padding: 0;
    }

    b { /* used for event dates/times */
      margin-right: 3px;
    }
  }

  .demo-app-main {
    flex-grow: 1;
    /* padding: 3em; */
    padding: 1em;

    .demo-app-sidebar-section {
      padding: 2em;
    }
  }

  .fc { /* the calendar root */
    /* max-width: 1100px; */
    margin: 0 auto;
    /* max-width: auto; */
    width: auto;
    height: 50%;
    overflow: auto;
    display: block;
  }
}

.custom-card-calendar {
  margin: 0px;
  cursor: pointer;
}
.custom-card-calendar:hover {
  background-color: #eaf5fe;
  border: 1px solid #36a3f7;
}
.fc-direction-ltr {
  direction: ltr;
  text-align: left;
  height: 85% !important;
}
</style>
