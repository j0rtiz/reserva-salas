// Configuration for your app

module.exports = function (ctx) {
  return {
    // app plugins (/src/plugins)
    plugins: [
      'i18n',
      'axios',
      'package',
      'vue-acl',
      'vue-async-data-2',
      'vuelidate',
      'paginate',
      'vue-the-mask'
    ],
    css: [
      'app.styl'
    ],
    extras: [
      ctx.theme.mat ? 'roboto-font' : null,
      'material-icons', // optional, you are not bound to it
      // 'ionicons',
      // 'mdi',
      'fontawesome'
    ],
    supportIE: true,
    build: {
      scopeHoisting: true,
      vueRouterMode: 'history',
      distDir: '../dev-test-ga/client',
      publicPath: '/',
      showProgress: true,
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack (cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules|quasar)/
        })
      },
      env: ctx.dev
        ? { // so on dev we'll have
          API: JSON.stringify('/api')
        }
        : { // and on build (production):
          API: JSON.stringify('../api')
        }
    },
    devServer: {
      // https: true,
      port: 7000,
      open: true, // opens browser window automatically
      proxy: {
        // proxy all requests starting with /api to jsonplaceholder
        '/api': {
          target: 'http://127.0.0.1:3001',
          changeOrigin: true
        }
      }
    },
    // framework: 'all' --- includes everything; for dev only!
    framework: {
      components: [
        'QBtn',
        'QCard',
        'QCardActions',
        'QCardMain',
        'QCardSeparator',
        'QCardTitle',
        'QInnerLoading',
        'QInput',
        'QItem',
        'QItemMain',
        'QItemSide',
        'QItemTile',
        'QLayout',
        'QLayoutDrawer',
        'QLayoutFooter',
        'QLayoutHeader',
        'QList',
        'QPage',
        'QPageContainer',
        'QRouteTab',
        'QSearch',
        'QScrollArea',
        'QTabs',
        'QTab',
        'QTabPane',
        'QToolbar',
        'QToolbarTitle',
        'QPopover',
        'QListHeader',
        'QItemSeparator',
        'QSelect',
        'QFab',
        'QFabAction',
        'QField',
        'QEditor',
        'QPageSticky',
        'QTable',
        'QTh',
        'QTr',
        'QTd',
        'QTableColumns',
        'QDatetime',
        'QCardMedia',
        'QPagination',
        'QUploader',
        'QIcon',
        'QCarousel',
        'QCarouselSlide',
        'QCarouselControl',
        'QBtnDropdown',
        'QAutocomplete',
        'QToggle',
        'QColor',
        'QRadio',
        'QModal',
        'QRating',
        'QPopupEdit',
        'QCheckbox',
        'QCollapsible',
        'QChipsInput',
        'QTooltip',
        'QOptionGroup',
        'QChip',
        'QResizeObservable',
        'QTree'
      ],
      directives: [
        'Ripple',
        'CloseOverlay'
      ],
      // Quasar plugins
      plugins: [
        'Notify',
        'Loading',
        'LocalStorage',
        'Dialog',
        'Screen',
        'ActionSheet'
      ],
      iconSet: ctx.theme.mat ? 'material-icons' : 'ionicons',
      i18n: 'pt-br' // Quasar language
    },
    animations: 'all', // --- includes all animations
    ssr: {
      pwa: false
    },
    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {},
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },
    cordova: {
      // id: 'org.cordova.quasar.app'
    },
    electron: {
      // bundler: 'builder', // or 'packager'
      extendWebpack (cfg) {
        // do something with Electron process Webpack cfg
      },
      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      },
      builder: {
        // https://www.electron.build/configuration/configuration

        // appId: 'quasar-app'
      }
    }
  }
}
