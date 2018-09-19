import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import session from './session'
Vue.use(Vuex)
export default function () {
  const Store = new Vuex.Store({
    modules: {
      session
    },
    plugins: [createPersistedState()]
  })
  return Store
}
