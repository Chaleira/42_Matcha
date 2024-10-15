import { Router } from 'typecomposer'
import { LoginPage } from '../pages/login/LoginPage';
import { RegisterPage } from '../pages/register/RegisterPage';
import { ForgotPage } from '../pages/forgot/ForgotPage';
import { HomeView } from '../views/home/HomeView';
import { AppPage } from '../pages/app/AppPage';
import { routerGuardHome } from './RouterGuard';
import { ChatView } from '../views/chat/ChatView';
import { ProfileView } from '../views/profile/ProfileView';

Router.create({
  history: 'hash',
  routes: [
    {
      path: '/',
      guard: routerGuardHome,
      component: AppPage,
      children: [
        { path: 'home', component: HomeView },
        { path: 'chat', component: ChatView },
        { path: 'profile', component: ProfileView },
      ]
    },
    {
      path: '/login',
      component: LoginPage
    },
    {
      path: '/register',
      component: RegisterPage
    },
    {
      path: '/forgot',
      component: ForgotPage
    }
  ],
});