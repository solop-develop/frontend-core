<template>
  <div id="appMain" :class="styleForm">
    <span v-if="isMobile">
      <navbar />
      <tags-view />
    </span>
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" style="/*height: 100% !important;*/width: 100% !important;display: contents;" />
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import Navbar from '@/layout/components/Navbar'
import TagsView from '@/layout/components/TagsView'

export default {
  name: 'AppMain',

  components: {
    Navbar,
    TagsView
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    },
    styleForm() {
      if (this.$route.meta.uuid === '8e4265c6-fb40-11e8-a479-7a0060f0aa01') {
        return 'app-main-from'
      }
      return 'app-main'
    },
    isMobile() {
      return this.$store.state.app.device === 'mobile'
    }
  },

  created() {
    // this.readRouteParameters()
  },

  methods: {
    readRouteParameters() {
      this.$store.dispatch('permantLink/setLinkOpened', {
        fullPath: this.$route.fullPath,
        query: {
          ...this.$route.query
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  // max-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: auto;
}

.app-main-from {
  width: 100%;
  position: relative;
  overflow: auto;
}

.fixed-header+.app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 85px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
