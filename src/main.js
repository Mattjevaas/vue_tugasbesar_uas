import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import vuetify from './plugins/vuetify';
import Axios from 'axios'
import Cookie from 'vue-cookie'
import VueSession from 'vue-session'
import * as VueGoogleMaps from "vue2-google-maps";

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyDzAhBGvOEwxIGLBwfda-yie4yzzsaImDM",
    libraries: "places" // necessary for places input
  }
});

Vue.use(VueSession)
Vue.prototype.$cookie = Cookie;
Vue.prototype.$http = Axios;
//Vue.prototype.$apiUrl = 'http://localhost/ci_tugasbesar_uas/index.php';
Vue.prototype.$apiUrl = 'http://api.digiprint.pw/index.php';


Vue.config.productionTip = false

new Vue({
  router,
  VueSession,
  vuetify,
  render: h => h(App),
  components: { App }
}).$mount('#app')
