import axios from 'axios'
import VueAxios from 'vue-axios'
import VueAuth from '@websanova/vue-auth'

export default ({ Vue }) => {
  Vue.prototype.$axios = axios
  Vue.use(VueAxios, axios)
  Vue.use(VueAuth, {
    auth: {
      request (req, token) {
        this.options.http._setHeaders.call(this, req, { Authorization: 'Bearer ' + token })
      },
      response: function (res) {
        return (res.data.data || {}).token
      }
    },
    http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
    router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
    notFoundRedirect: false,
    rolesVar: 'role',
    registerData: { url: 'auth/register', method: 'POST', redirect: '/' },
    refreshData: { url: 'auth/refresh', method: 'GET', enabled: true, interval: 5 }
  })
  Vue.axios.defaults.baseURL = 'http://pedidosjh.test/api'
  // Vue.axios.defaults.baseURL = 'http://192.168.1.82/jhsoft/public/'

  // Vue.axios.interceptors.response.use(function (response) {
  //   if (response.data.error === 'Unauthorized') {
  //     localStorage.removeItem('default_auth_token')
  //     document.location.reload()
  //   }
  //   return response
  // }, function (error) {
  //   if (error.response.status === 401) {
  //     console.log('tokenExpired')
  //     Vue.auth.refresh()
  //   }
  // })
}
