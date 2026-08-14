const ThemeColorReplacer = require('webpack-theme-color-replacer')
const forElementUI = require('webpack-theme-color-replacer/forElementUI')
const TerserPlugin = require('terser-webpack-plugin')
const WorkboxWebpackPlugin = require('workbox-webpack-plugin')

// 拼接路径
const resolve = dir => require('path').join(__dirname, dir)

// 增加环境变量
process.env.VUE_APP_VERSION = require('./package.json').version
process.env.VUE_APP_BUILD_TIME = require('dayjs')().format('YYYY-M-D HH:mm:ss')

// 基础路径 注意发布之前要先修改这里
let publicPath = process.env.VUE_APP_PUBLIC_PATH || '/'
// 设置不参与构建的库
let externals = {}

const intlTarget = process.env.VUE_APP_API || 'http://localhost:8090'

let proxyTable = {
  '/api': {
    target: intlTarget,
    logLevel: 'debug',
    changeOrigin: true
  },
  '/bus/jgt/intl': {
    target: intlTarget,
    logLevel: 'debug',
    changeOrigin: true
  },
  '/labrador-gateway': {
    target: intlTarget,
    logLevel: 'debug',
    changeOrigin: true
  }
}

process.env.BRANCH_HASH = process.env.BRANCH_HASH || 'unknown'
module.exports = {
  publicPath,
  lintOnSave: true,
  transpileDependencies: ['element-ui'],
  devServer: {
    publicPath,
    open: process && process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8088,
    https: false,
    hotOnly: false,
    proxy: proxyTable,
    before: app => {}
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import '~@/assets/style/public.scss';`,
        sassOptions: {
          outputStyle: 'expanded'
        }
      }
    },
    extract: {
      ignoreOrder: true
    }
  },
  configureWebpack: config => {
    const configNew = {
      plugins: []
    }
    if (process.env.NODE_ENV === 'production') {
      if (process.env.VUE_APP_DEMO === 'N') {
        externals['highlight.js'] = 'hljs'
      }
      configNew.externals = externals
      configNew.performance = {
        maxAssetSize: 20000000,
        maxEntrypointSize: 40000000
      }
      configNew.optimization = {
        minimizer: [
          new TerserPlugin({
            parallel: 4,
            terserOptions: {
              compress: {
                warnings: true,
                drop_debugger: true,
                pure_funcs: ['console.log', 'console.info']
              }
            }
          })
        ]
      }
      configNew.optimization.splitChunks = {
        chunks: 'all',
        minSize: 30000,
        maxSize: 500000,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: '~',
        automaticNameMaxLength: 30,
        name: true,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            minChunks: 2,
            reuseExistingChunk: true
          },
          element: {
            chunks: 'all',
            name: `element-ui`,
            test: /[\\/]element-ui[\\/]/,
            priority: 11
          },
          echarts: {
            chunks: 'all',
            name: `echarts`,
            test: /[\\/]echarts[\\/]/,
            priority: 10
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      }
    }
    if (process.env.NODE_ENV === 'development') {
      configNew.devServer = {
        disableHostCheck: true
      }
    }
    configNew.plugins.push(new WorkboxWebpackPlugin.GenerateSW({
      cacheId: 'jgt-intl-pwa',
      maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
      swDest: 'service-worker.js',
      disableDevLogs: true,
      exclude: ['config.js'],
      runtimeCaching: [
        {
          urlPattern: /config\.js/,
          handler: 'NetworkFirst'
        }
      ]
    }))
    return configNew
  },
  chainWebpack: config => {
    config.plugin('define').tap(args => {
      args[0]['process.env'].BRANCH_HASH = JSON.stringify(process.env.BRANCH_HASH)
      return args
    })
    config.plugins
      .delete('prefetch')
      .delete('preload')
    config.resolve
      .symlinks(true)
    config
      .plugin('theme-color-replacer')
      .use(ThemeColorReplacer, [{
        fileName: 'css/theme-colors.[contenthash:8].css',
        matchColors: [
          ...forElementUI.getElementUISeries(process.env.VUE_APP_ELEMENT_COLOR)
        ],
        externalCssFiles: ['./node_modules/element-ui/lib/theme-chalk/index.css'],
        changeSelector: forElementUI.changeSelector
      }])

    if (process.env.VUE_APP_DEMO === 'Y') {
      config.module
        .rule('md-loader')
        .test(/\.md$/)
        .use('vue-loader')
        .loader('vue-loader')
        .options({
          compilerOptions: {
            preserveWhitespace: false
          }
        })
        .end()
        .use('md-loader')
        .loader('md-loader')
        .end()
    } else {
      config.module
        .rule('md')
        .test(/\.md$/)
        .use('text-loader')
        .loader('text-loader')
        .end()
    }

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .include
      .add(resolve('src/assets/svg-icons/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'd2-[name]'
      })
      .end()
    const imagesRule = config.module.rule('images')
    imagesRule
      .test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
      .exclude
      .add(resolve('src/assets/svg-icons/icons'))
      .end()
    config.module
      .rule('pdf')
      .test(/\.pdf$/)
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'files/[name].[contenthash:8].[ext]'
      })
      .end()
    config.resolve.alias
      .set('@api', resolve('src/api'))
      .set('@module', resolve('src/views/business/components'))
    const entry = config.entry('app')
    if (process.env.VUE_APP_BUILD_MODE !== 'NOMOCK') {
      entry
        .add('@/mock')
        .end()
    }
    if (process.env.npm_config_report) {
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    }
    config.module
      .rule('eslint')
      .use('eslint-loader')
      .loader('eslint-loader')
      .tap(options => {
        options.fix = true
        return options
      })
  },
  productionSourceMap: false,
  pluginOptions: {
    i18n: {
      locale: 'zh-chs',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true
    }
  }
}
