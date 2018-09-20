import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/pods/Home'

import ShowFilm from '@/pods/film/show/Show-film'
import ShowPerson from '@/pods/person/show/Show-person'

import Library from '@/pods/library/Library'

import Profile from '@/pods/profile/Profile'
import ForgetPassword from '@/pods/profile/forget-password/Forget-password'
import SignIn from '@/pods/profile/sign-in/Sign-in'
import Register from '@/pods/profile/register/Register'

import Account from '@/pods/account/Account'
import Informations from '@/pods/account/informations/Informations'
import LogOut from '@/pods/account/log-out/Log-out'

import MyList from '@/pods/account/my-list/My-list'
import CreateList from '@/pods/account/my-list/create/Create'
import ShowList from '@/pods/account/my-list/show/Show'
import ModifList from '@/pods/account/my-list/modif/Modif'
import EditList from '@/pods/account/my-list/modif/edit/Edit'

import Community from '@/pods/community/Community'
import Users from '@/pods/community/users/Users'
import ShowUser from '@/pods/community/users/show/Show-user'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: '/',
      component: Home
    },
    {
      path: '/library',
      name: 'Library',
      component: Library
    },
    {
      path: '/film/:id',
      component: ShowFilm
    },
    {
      path: '/person/:id',
      component: ShowPerson
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      children: [
        {
          path: 'register',
          component: Register
        },
        {
          path: 'sign-in',
          component: SignIn
        },
        {
          path: 'forget-password',
          component: ForgetPassword
        }
      ]
    },
    {
      path: '/account',
      name: 'Account',
      component: Account,
      children: [
        {
          path: 'log-out',
          component: LogOut
        },
        {
          path: 'informations',
          component: Informations
        },
        {
          path: 'my-list',
          component: MyList,
          children: [
            {
              path: 'create',
              component: CreateList
            },
            {
              path: 'show',
              component: ShowList
            },
            {
              path: 'modif',
              component: ModifList
            },
            {
              path: 'modif/:id',
              component: EditList
            }
          ]
        }
      ]
    },
    {
      path: '/community',
      name: 'Community',
      component: Community,
      children: [
        {
          path: 'users',
          component: Users
        }
      ]
    },
    {
      path: '/users/:id',
      component: ShowUser
    }
  ]
})
