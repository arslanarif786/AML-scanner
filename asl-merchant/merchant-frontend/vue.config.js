const Dotenv = require('dotenv-webpack');
module.exports = {
  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false
    }
  },
  configureWebpack: {
    plugins: [new Dotenv()],
  },
  transpileDependencies: [
    'quasar'
  ]
}
