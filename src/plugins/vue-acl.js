import { AclInstaller, AclCreate, AclRule } from 'vue-acl'
export default ({ app, router, Vue }) => {
  Vue.use(AclInstaller)
  const aclcreate = new AclCreate({
    initial: 'public',
    notfound: '/login',
    router,
    acceptLocalRules: true,
    globalRules: {
      isAdmin: new AclRule('admin').generate(),
      isAuthenticated: new AclRule('authenticated').or('admin').generate(),
      isPublic: new AclRule('public').or('authenticated').or('admin').generate()
    }
  })
  Vue.use(aclcreate)
}
