import { createRouter, createWebHistory } from 'vue-router';
import Main from '../views/Main.vue';
import Login from '../views/Log in.vue';
import GameList from '../views/Games.vue';
import Register from '../views/Register.vue';


const routes = [{ path: '/login', name: 'Login', component: Login },
{ path: '/games', name: 'Games', component: GameList }, { path: '/', name: 'Main', component: Main },
  { path: '/register', name: 'Register', component: Register },
];


export default createRouter({
  history: createWebHistory(),
  routes,
});

import Profile from '../components/Profile.vue'; // Import the Profile component
const profileRoute = {
  path: '/profile',
  name: 'Profile',
  component: Profile,
  meta: { requiresAuth: true }, // Optional authentication check
};

// Ensure you add this route to your routes array:
routes.push(profileRoute);



