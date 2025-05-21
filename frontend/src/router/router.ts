import { Router } from 'typecomposer'
import { LoginPage } from '../pages/login/LoginPage';
import { RegisterPage } from '../pages/register/RegisterPage';
import { AppPage } from '../pages/app/AppPage';
import { RouterGuardHome } from './RouterGuard';
import { ChatView } from '../views/chat/ChatView';
import { ProfileView } from '../views/profile/ProfileView';
import { ForgotPage } from '@/pages/forgot/ForgotPage';
import HomeView from '@/views/home/HomeView';
import { VerifyEmail } from '@/pages/register/VerifyEmail';
import { ResetPassword } from '@/pages/ResetPassword/ResetPassword';
import NotificationsView from '@/views/notifications/NotificationsView';

Router.create({
  routes: [
    {
      path: '/',
      guard: new RouterGuardHome(),
      component: AppPage,
      children: [
        { path: 'home', component: HomeView },
        { path: 'chat', component: ChatView },
        { path: 'profile', component: ProfileView },
        { path: 'notifications', component: NotificationsView },
        { path: Router.PATH_WILDCARD, redirect: 'home' },

      ]
    },
    {
      path: '/registerprofile',
      component: ForgotPage
    },
    {
      path: '/login',
      component: LoginPage
    },
    {
      path: "/verify-email",
      component: VerifyEmail
    },
    {
      path: '/register',
      component: RegisterPage
    },
    {
      path: '/reset-password',
      component: ResetPassword
    },

    {
      path: '/forgot',
      component: ForgotPage
    },
    {
      path: Router.PATH_WILDCARD,
      redirect: "/login"
    },

  ],
});