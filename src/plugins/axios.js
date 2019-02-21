import axios from 'axios'
import { Notify } from 'quasar'

const AxiosCatchMixin = {
  methods: {
    AxiosCatch (Err) {
      const erro = Err.response.data.error.message.charAt(0).toUpperCase() + Err.response.data.error.message.substring(1)
      return Notify.create({
        type: 'negative',
        timeout: 1000,
        message: erro
      })
    }
  }
}

export default ({ Vue }) => {
  Vue.prototype.$axios = axios.create({
    baseURL: process.env.API
  })
  Vue.mixin(AxiosCatchMixin)
}
