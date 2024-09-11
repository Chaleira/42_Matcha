import { Router } from 'typecomposer'
import { LoginPage } from '../pages/login/LoginPage';
import { RegisterPage } from '../pages/register/RegisterPage';
import { ForgotPage } from '../pages/forgot/ForgotPage';
import { HomeView } from '../views/home/HomeView';
import { AppPage } from '../pages/app/AppPage';

Router.create({
  history: 'hash',
  routes: [
    {
      path: '/',
      component: AppPage,
      children: [
        { path: 'home', component: HomeView },
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