let _Vue = null
module.exports = class Router {
  constructor({ mode, routes }) {
    this.mode = mode
    this.routes = routes
    this.data = _Vue.observable({
      current: '/'
    })
  }

  init() {
    this.initRouteMap(this.routes)
    this.initComponent()
    this.initEvent()
  }

  static install(vue) {
    if (Router.install.installed) return
    _Vue = vue
    Router.install.installed = true
    const self = this
    _Vue.mixin({
      beforeCreate() {
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router
          this.$options.router.init()
        }
      }
    })
  }

  initRouteMap(routes) {
    this.routeMap = routes.reduce((obj, cur) => {
      obj[cur.path] = cur.component
      return obj
    }, {})
  }

  initComponent() {
    const self = this
    _Vue.component('router-link', {
      props: ['to'],
      // template: '<a :href="to"><slot></slot></a>'
      render(h) {
        return h(
          'a',
          {
            attrs: {
              href: this.to
            },
            on: {
              click: this.clickHandler
            }
          },
          [this.$slots.default]
        )
      },
      methods: {
        clickHandler(e) {
          history.pushState({}, '', this.to)
          this.$router.data.current = this.to
          e.preventDefault()
        }
      }
    })

    _Vue.component('router-view', {
      render(h) {
        const component = self['routeMap'][self.data.current]
        return h(component)
      }
    })
  }

  initEvent() {
    window.addEventListener('popstate', () => {
      this.data.current = window.location.pathname
    })
  }
}
