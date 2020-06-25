import VueRouter from 'vue-router';
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import Users from "./components/Users";
import { Form, HasError, AlertError } from 'vform';
import moment from "moment";
import VueProgressBar from 'vue-progressbar';
import Swal from 'sweetalert2';
import Developer from "./components/Developer";

require('./bootstrap');

window.Vue = require('vue');
Vue.use(VueRouter);

// gate start
import Gate from './Gate';
Vue.prototype.$gate = new Gate(window.user);
// gate end

// Sweet Alert start
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
// Sweet Alert end

// VForm start
window.Form = Form;
Vue.component(HasError.name, HasError);
Vue.component(AlertError.name, AlertError);
// VForm end

// progressbar start
Vue.use(VueProgressBar, {
    color: 'rgb(143, 255, 199)',
    failedColor: 'red',
    height: '4px'
});
// progressbar end

let routes = [
    { path: '/dashboard', component: Dashboard },
    { path: '/profile', component: Profile },
    { path: '/users', component: Users },
    { path: '/developer', component: Developer },
];



const router = new VueRouter({
    mode: 'history',
    routes // short for `routes: routes`
});

// vue global filter start
Vue.filter('ucFirst', (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
});

Vue.filter('myDate', (created) => {
   return moment(created).format('MMMM Do YYYY, h:mm:ss A');
});
// vue global filter end

// new vue instance
window.Fire = new Vue();

// passport vue component start
Vue.component(
    'passport-clients',
    require('./components/passport/Clients.vue').default
);

Vue.component(
    'passport-authorized-clients',
    require('./components/passport/AuthorizedClients.vue').default
);

Vue.component(
    'passport-personal-access-tokens',
    require('./components/passport/PersonalAccessTokens.vue').default
);
// passport vue component end

// Not Found Component start
Vue.component('not-found', require('./components/NotFound.vue').default);
// Not Found Component end

// Pagination Component
Vue.component('pagination', require('laravel-vue-pagination'));

const app = new Vue({
    el: '#app',
    router,
});
