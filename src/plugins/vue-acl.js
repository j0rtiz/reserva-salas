import { AclInstaller, AclCreate, AclRule } from 'vue-acl'
export default ({ app, router, Vue }) => {
  Vue.use(AclInstaller)
  const aclcreate = new AclCreate({
    initial: 'unauthenticated',
    notfound: '/login',
    router,
    acceptLocalRules: true,
    globalRules: {
      isEveryone: new AclRule('unauthenticated').or('authenticated').or('admin').generate(),
      isAuthenticated: new AclRule('authenticated').or('admin').generate(),
      isAdmin: new AclRule('admin').generate()
    }
  })
  Vue.use(aclcreate)
}
