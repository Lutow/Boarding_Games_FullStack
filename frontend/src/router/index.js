import { createRouter, createWebHistory } from 'vue-router';
import Main from '../views/Main.vue';
import Login from '../views/Log in.vue';
import GameList from '../views/Games.vue';

const routes = [{ path: '/login', name: 'Login', component: Login },
{ path: '/games', name: 'Games', component: GameList }, { path: '/', name: 'Main', component: Main }
];


export default createRouter({
  history: createWebHistory(),
  routes,
});


