import VueRouter from 'vue-router';
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import Users from "./components/Users";
import { Form, HasError, AlertError } from 'vform';
import moment from "moment";
import VueProgressBar from 'vue-progressbar';
import Swal from 'sweetalert2';

require('./bootstrap');

window.Vue = require('vue');
Vue.use(VueRouter);

// Sweet Alert
window.Swal = Swal;
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

window.Toast = Toast;

// VForm
window.Form = Form;
Vue.component(HasError.name, HasError);
Vue.component(AlertError.name, AlertError);

// progressbar
Vue.use(VueProgressBar, {
    color: 'rgb(143, 255, 199)',
    failedColor: 'red',
    height: '4px'
});

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

// new vue instance
window.Fire = new Vue();

const app = new Vue({
    el: '#app',
    router,
});
