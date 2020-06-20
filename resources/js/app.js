require('./bootstrap');
import VueRouter from 'vue-router';
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";

window.Vue = require('vue');
Vue.use(VueRouter);


let routes = [
    { path: '/dashboard', component: Dashboard },
    { path: '/profile', component: Profile }
];



Vue.component('example-component', require('./components/ExampleComponent.vue').default);

const router = new VueRouter({
    routes // short for `routes: routes`
});


const app = new Vue({
    el: '#app',
    router,
});
