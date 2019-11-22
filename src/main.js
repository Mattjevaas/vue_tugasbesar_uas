import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import vuetify from './plugins/vuetify';
import Axios from 'axios'
import Cookie from 'vue-cookie'
import VueSession from 'vue-session'

Vue.use(VueSession)
Vue.prototype.$cookie = Cookie;
Vue.prototype.$http = Axios;
Vue.prototype.$apiUrl = 'http://localhost/ci_tugasbesar_uas/index.php';

Vue.config.productionTip = false

new Vue({
  router,
  VueSession,
  vuetify,
  render: h => h(App),
  components: { App }
}).$mount('#app')
