export default ({ app, router, Vue }) => {
  Vue.prototype.$NodePackage = require('../../package.json')
}
