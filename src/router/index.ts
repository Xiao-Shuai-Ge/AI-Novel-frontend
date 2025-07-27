// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../views/HomePage.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomePage
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/LoginPage.vue')
    },
    {
        path: '/edit/:id',
        name: 'Edit',
        component: () => import('../views/EditPage.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router