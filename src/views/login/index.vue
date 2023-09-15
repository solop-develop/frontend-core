<template>
  <div
    class="login-container"
  >
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <el-row>
        <el-col :span="3">
          <img
            :src="logo"
            class="image"
          >
        </el-col>
        <el-col :span="20">
          <div class="title-container">
            <h3 class="title">
              {{ $t('login.title') }}
            </h3>
            <lang-select class="set-language" />
          </div>
        </el-col>
      </el-row>

      <el-form-item prop="userName">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="userName"
          v-model="loginForm.userName"
          :placeholder="$t('page.login.userName')"
          name="userName"
          type="text"
          tabindex="1"
          autocomplete="on"
          @keyup.enter.native="jumpToPassword"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" :content="$t('page.login.capsLock')" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            :placeholder="$t('login.password')"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>
      <el-button
        :loading="loading || isLoadingLogin"
        type="primary"
        style="width:100%;"
        @click.native.prevent="handleLogin"
      >
        {{ $t('login.logIn') }}
      </el-button>
      <el-button
        v-for="(list, key) in listServices"
        :key="key"
        :loading="isLoadingLogin"
        :disabled="isLoadingLogin"
        style="width:100%;margin: 10px;display: flex;margin-left: 0px;"
      >
        <el-link
          :underline="false"
          :href="list.authorizationUri"
          style="margin-left: 5px;"
        >
          <p style="width:400px;margin: 0px;">
            <svg-icon :icon-class="list.svg" />
            {{ list.displayName }}
          </p>
        </el-link>
      </el-button>
      <el-button
        type="text"
        style="float: left"
        @click.native.prevent="pathRedirect('forgotPassword')"
      >
        {{ $t('route.forgotPassword') }}
      </el-button>
      <el-button
        type="text"
        style="float: right"
        @click.native.prevent="pathRedirect('userEnrollment')"
      >
        {{ $t('route.userEnrollment') }}
      </el-button>

      <div>
        <div class="tips">
          <span />
          <span />
        </div>
        <div class="tips">
          <span />
          <span />
        </div>
      </div>
    </el-form>

    <el-dialog :title="$t('login.thirdparty')" :visible.sync="showDialog">
      {{ $t('login.thirdpartyTips') }}
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog>
  </div>
</template>

<script>
// Components and Mixins
import loginMixin from './loginMixin.js'
import SocialSign from './components/SocialSignin'

// API Request Methods
import { services } from '@/api/ADempiere/open-id/services.js'

// Utils and Helper Methods
import { isEmptyValue } from '@/utils/ADempiere/valueUtils'

export default {
  name: 'Login',

  components: {
    SocialSign
  },

  mixins: [
    loginMixin
  ],

  data() {
    const validateUsername = (rule, value, callback) => {
      if ((value.trim()).length < 1) {
        callback(new Error(this.$t('page.login.noValidUser')))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error(this.$t('page.login.noValidPassword')))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        userName: '',
        password: '',
        roleUuid: '',
        organizationUuid: ''
      },
      loginRules: {
        userName: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      listServices: {},
      isLoadingLogin: false,
      default: 'dashboard'
    }
  },

  computed: {
    logo() {
      const { logoUrl } = this.$store.getters['user/getSystem']
      if (logoUrl) {
        return logoUrl
      }
      return 'https://avatars1.githubusercontent.com/u/1263359?s=200&v=4'
    }
  },

  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },

  created() {
    this.initialBasicServices()
    const { search } = window.location
    if (!isEmptyValue(search)) {
      const urlParams = new URLSearchParams(search)
      const state = urlParams.get('state')
      const code = urlParams.get('code')
      if (!isEmptyValue(state) && !isEmptyValue(code)) {
        this.loginAuthentication({
          state,
          code
        })
      }
    }
  },

  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    jumpToPassword() {
      this.$refs.password.focus()
    },
    handleLogin() {
      const query = this.$route.query.redirect
      const expr = '/'
      if (!this.isEmptyValue(query)) {
        this.loginForm = {
          ...this.loginForm,
          roleUuid: this.clientIdRedirect(query, expr),
          organizationUuid: this.organizationIdRedirect(query, expr)
        }
      }
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({
                path: this.redirect || '/',
                query: {
                  ...this.otherQuery,
                  action: this.$route.query.recordUuid
                }
              }, () => {})
            })
            .catch(error => {
              let message = this.$t('page.login.unexpectedError')
              if ([13, 500].includes(error.code)) {
                message = this.$t('page.login.invalidLogin')
              }

              this.$message.error(message)
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    clientIdRedirect(query, expr) {
      const redirect = query.split(expr)
      if (redirect[1] === this.default) {
        return
      }
      return redirect[1]
    },
    organizationIdRedirect(query, expr) {
      const redirect = query.split(expr)
      return redirect[2]
    },
    svgService(openId) {
      const { authorizationUri } = openId
      const searchInclude = authorizationUri.replace('https://', '')
      const index = searchInclude.search('.com/')
      let svg
      switch (true) {
        case searchInclude.slice(0, index).includes('microsoftonline'):
          svg = 'microsoft'
          break
        case searchInclude.slice(0, index).includes('google'):
          svg = 'google-gmail'
          break
        case searchInclude.slice(0, index).includes('github'):
          svg = 'github'
          break
        case searchInclude.slice(0, index).includes('gitlab'):
          svg = 'gitlab'
          break
        case searchInclude.slice(0, index).includes('discord'):
          svg = 'discord'
          break
      }
      return svg
    },
    loginAuthentication({ state, code }) {
      this.isLoadingLogin = true
      this.$store.dispatch('user/loginOpenId', {
        state,
        code
      })
        .then(() => {
          const { origin } = window.location
          window.location.pathname = ''
          window.location.search = ''
          window.location = origin
        })
        .catch(error => {
          let message = this.$t('page.login.unexpectedError')
          if ([13, 500].includes(error.code)) {
            message = this.$t('page.login.invalidLogin')
          }

          this.$message.error(message)
        })
        .finally(() => {
          this.isLoadingLogin = false
        })
    },
    initialBasicServices() {
      this.listAuthorization()
      this.info()
    },
    listAuthorization() {
      services()
        .then(response => {
          this.listServices = response.map(list => {
            return {
              ...list,
              svg: this.svgService(list)
            }
          })
        })
        .catch(error => {
          console.info(error)
        })
    },
    info() {
      this.$store.dispatch('user/system')
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 10px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
