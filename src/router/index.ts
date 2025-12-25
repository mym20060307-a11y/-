import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import Login from '../views/Login.vue';
import MainLayout from '../components/layout/MainLayout.vue';
import HomePage from '../views/HomePage.vue';
import RouteList from '../views/routes/RouteList.vue';
import BusList from '../views/buses/BusList.vue';
import DriverList from '../views/drivers/DriverList.vue';
import ScheduleCalendar from '../views/scheduling/ScheduleCalendar.vue';
import RealtimeMap from '../views/monitoring/RealtimeMap.vue';
import Dashboard from '../views/statistics/Dashboard.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guest: true },
  },
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/dashboard',
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: HomePage,
      },
      {
        path: 'routes',
        name: 'RouteList',
        component: RouteList,
      },
      {
        path: 'buses',
        name: 'BusList',
        component: BusList,
      },
      {
        path: 'drivers',
        name: 'DriverList',
        component: DriverList,
      },
      {
        path: 'scheduling',
        name: 'Scheduling',
        component: ScheduleCalendar,
      },
      {
        path: 'monitoring',
        name: 'Monitoring',
        component: RealtimeMap,
      },
      {
        path: 'statistics',
        name: 'Statistics',
        component: Dashboard,
      },
    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isGuest = to.matched.some((record) => record.meta.guest);

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (isGuest && authStore.isAuthenticated) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
