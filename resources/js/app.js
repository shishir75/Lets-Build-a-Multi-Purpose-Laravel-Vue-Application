import VueRouter from 'vue-router';
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import Users from "./components/Users";
import moment from "moment";

require('./bootstrap');

window.Vue = require('vue');
Vue.use(VueRouter);

import { Form, HasError, AlertError } from 'vform';

window.Form = Form;
Vue.component(HasError.name, HasError);
Vue.component(AlertError.name, AlertError);


let routes = [
    { path: '/dashboard', component: Dashboard },
    { path: '/profile', component: Profile },
    { path: '/users', component: Users }
];



const router = new VueRouter({
    mode: 'history',
    routes // short for `routes: routes`
});

// vue global filter
Vue.filter('ucFirst', (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
});

Vue.filter('myDate', function(created)  {
   return moment(created).format('MMMM Do YYYY, h:mm:ss A');
});

const app = new Vue({
    el: '#app',
    router,
});
