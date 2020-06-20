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



const router = new VueRouter({
    mode: 'history',
    routes // short for `routes: routes`
});


const app = new Vue({
    el: '#app',
    router,
});
