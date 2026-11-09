const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    '/deploy-api-proxy',
    createProxyMiddleware({
      target: 'https://api-cdn.deploy.com',
      changeOrigin: true,
      secure: true,
      pathRewrite: {
        '^/deploy-api-proxy': '',
      },
    })
  )
}
