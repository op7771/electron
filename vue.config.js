module.exports = {
  // apiUrl: process.env.NODE_ENV === 'production'
  //   ? 'http://cardian.nbnl.co'
  //   : 'http://localhost:8080',
  devServer: {
    port: 3000
  },
  pluginOptions: {
    moment: {
      locales: [
        ''
      ]
    }
  }
}
