import Vue from "vue";
import { createPinia, PiniaVuePlugin } from "pinia";
import vuetify from "@/plugins/vuetify";

import App from "./App.vue";
import router from "./router";

import "@/assets/main.css";
import { store } from "@/stores/store";

Vue.use(PiniaVuePlugin);

new Vue({
  vuetify,
  router,
  pinia: createPinia(),
  render: (h) => h(App),
  store: store
}).$mount("#app");
