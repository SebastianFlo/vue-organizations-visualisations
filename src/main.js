import Vue from 'vue';
import App from './App.vue';
import BootstrapVue from 'bootstrap-vue'

import store from './store.vue';
import filters from './filters.vue';

import './assets/d3.min.js';
import './assets/sankey.js';

Vue.use(BootstrapVue);


new Vue({
  el: '#app',
  render: h => h(App)
})
