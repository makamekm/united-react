'use strict'
var proxy = require("http-proxy-middleware");

module.exports = {
  plugins: [
    'gatsby-plugin-typescript',
    'gatsby-plugin-layout',
    'gatsby-plugin-styled-jsx',
    'gatsby-plugin-react-helmet'
  ],
  developMiddleware: app => {
    app.use(
      "/api/",
      proxy({
        target: "http://localhost:3000",
        secure: false,
        pathRewrite: {
          "/api/": "",
        },
      })
    )
  },
}
