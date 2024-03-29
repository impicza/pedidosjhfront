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
    router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js')
  })
  // Vue.use(require('@websanova/vue-auth'), {
  //   parseUserData: function (data) {
  //     return data.whatever
  //   }
  // })
  // Vue.axios.defaults.baseURL = 'http://jhsoft.test/api'
  Vue.axios.defaults.baseURL = 'http://192.168.1.82/jhsoft/public/'
}
