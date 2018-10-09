module.exports = {
  head: {
    title: "Express Auth",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "Authorise yourself" }
    ]
  },
  loading: { color: "#812747" },
  build: {
    extend(config, { isDev, isClient }){
      config.node = { fs: "empty", child_process: "empty" }
    }
  },
  modules: [
    "@nuxtjs/axios"
  ],
  axios: {
    baseURL: "/",
    proxyHeaders: false,
    credentials: false
  }
}
