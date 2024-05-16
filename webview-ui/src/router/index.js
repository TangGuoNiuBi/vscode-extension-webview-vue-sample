import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Mainbox from '../views/Mainbox.vue'

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/mainbox',
        name: 'mainbox',
        component: Mainbox
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})

export default router