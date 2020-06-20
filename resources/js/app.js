import VueRouter from 'vue-router';
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import Users from "./components/Users";

require('./bootstrap');

window.Vue = require('vue');
Vue.use(VueRouter);


let routes = [
    { path: '/dashboard', component: Dashboard },
    { path: '/profile', component: Profile },
    { path: '/users', component: Users }
];



const router = new VueRouter({
    mode: 'history',
    routes // short for `routes: routes`
});


const app = new Vue({
    el: '#app',
    router,
});
