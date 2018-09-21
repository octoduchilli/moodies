<template>
  <div id="app">
    <header class="main-header row animated" :class="[header.position === 'absolute' ? header.class.absolute : header.class.fixed]">
      <nav v-if="__window.width > 1000" class="main-nav row">
        <router-link v-show="header.position === 'fixed'" class="link" to="/">
          <img class="logo" src="/static/img/logo/no-bars.png">
        </router-link>
        <ul class="nav-links basic-list row">
          <li @click="$store.state.route.selected = 0" class="nav-link">
            <router-link class="link" :class="{'link-active': __route.selected === 0}" to="/">ACCUEIL</router-link>
          </li>
          <li @click="$store.state.route.selected = 1" class="nav-link">
            <router-link class="link" :class="{'link-active': __route.selected === 1}" to="/library">BIBLIOTHÈQUE</router-link>
          </li>
          <li @click="$store.state.route.selected = 2" class="nav-link">
            <router-link class="link" :class="{'link-active': __route.selected === 2}" to="/account/my-list/show">MA LISTE</router-link>
          </li>
          <li @click="$store.state.route.selected = 3" class="nav-link">
            <router-link class="link" :class="{'link-active': __route.selected === 3}" to="/profile/sign-in">PROFIL</router-link>
          </li>
          <li @click="$store.state.route.selected = 4" class="nav-link">
            <router-link class="link" :class="{'link-active': __route.selected === 4}" to="/community/users">COMMUNAUTÉ</router-link>
          </li>
        </ul>
      </nav>
      <nav v-else class="main-nav row">
        <ul class="nav-links basic-list row">
          <li @click="$store.state.route.selected = 0" class="nav-link">
            <router-link class="link" :class="{'link-active': __route.selected === 0}" to="/"><img class="link-img" src="/static/img/header/home.png" alt="ACCUEIL"></router-link>
          </li>
          <li @click="$store.state.route.selected = 1" class="nav-link">
            <router-link class="link" :class="{'link-active': __route.selected === 1}" to="/library"><img class="link-img" src="/static/img/header/book.png" alt="BIBLIOTHÈQUE"></router-link>
          </li>
          <li @click="$store.state.route.selected = 2" class="nav-link">
            <router-link class="link" :class="{'link-active': __route.selected === 2}" to="/account/my-list/show"><img class="link-img" src="/static/img/header/clipboards.png" alt="MA LISTE"></router-link>
          </li>
          <li @click="$store.state.route.selected = 3" class="nav-link">
            <router-link class="link" :class="{'link-active': __route.selected === 3}" to="/profile/sign-in"><img class="link-img" src="/static/img/header/avatar.png" alt="PROFIL"></router-link>
          </li>
          <li @click="$store.state.route.selected = 4" class="nav-link">
            <router-link class="link" :class="{'link-active': __route.selected === 4}" to="/community/users"><img class="link-img" src="/static/img/header/community.png" alt="COMMUNAUTÉ"></router-link>
          </li>
        </ul>
      </nav>
    </header>
    <router-view/>
  </div>
</template>

<script>
import { db } from '@/firebase'
import firebase from 'firebase'

import httpGetMixin from '@/lib/mixins/httpget'

export default {
  mixins: [httpGetMixin],
  data () {
    return {
      header: {
        position: 'absolute',
        class: {
          absolute: 'fadeIn absolute-header no-background',
          fixed: 'fadeInDown fixed-header'
        }
      }
    }
  },
  created () {
    this.$store.state.window.height = window.innerHeight
    this.$store.state.window.width = window.innerWidth
    this.$store.state.window.scrollY = window.scrollY

    this.$store.state.body.height = document.body.clientHeight
    this.$store.state.body.width = document.body.clientWidth

    window.addEventListener('resize', event => {
      this.$store.state.window.height = window.innerHeight
      this.$store.state.window.width = window.innerWidth
      this.$store.state.window.scrollY = window.scrollY

      this.$store.state.body.height = document.body.clientHeight
      this.$store.state.body.width = document.body.clientWidth
    })

    window.addEventListener('scroll', event => {
      this.$store.state.window.scrollY = window.scrollY
      this.$store.state.body.height = document.body.clientHeight
      this.$store.state.body.width = document.body.clientWidth

      if (this.$route.fullPath === '/') {
        this.checkPositionHeader()
      }
    })

    this.checkRoute(this.$route)

    this.$store.state.user.tryConnect = true

    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        this.resetUser()

        this.$store.state.user.tryConnect = false
      } else {
        let guestTmdb = null

        this.$http.get('https://api.themoviedb.org/3/authentication/guest_session/new?api_key=3836694fa8a7ae3ea69b5ff360b3be0b').then(response => {
          guestTmdb = response.body.guest_session_id
        })

        db.ref('users/' + user.uid + '/infos').on('value', profile => {
          profile = profile.val()

          user = {
            uid: user.uid,
            email: user.email.toLowerCase().trim(),
            pseudo: profile ? profile.pseudo : null,
            firstname: profile ? profile.firstname : null,
            lastname: profile ? profile.lastname : null,
            guestTmdb: guestTmdb
          }

          this.$store.commit('user', user)

          this.$store.state.user.tryConnect = false
        })

        db.ref(`users/${user.uid}/filters`).on('value', filters => {
          let final = []

          filters = filters.val()

          for (let index in filters) {
            let a = filters[index]

            a.click = false
            a.mouseover = false
            final.push(a)
          }

          let i = 0

          final.forEach(filter => {
            i++
            if (!filter.position) {
              db.ref(`users/${user.uid}/filters/${filter.id}`).update({
                position: i
              })
            }
          })

          final.sort((a, b) => {
            return a.position - b.position
          })

          this.$store.state.user.filters.created = final

          db.ref(`community/users/${user.uid}`).update({
            id: user.uid,
            filters: final.length,
            inverseFilters: 9999999999999 - final.length,
            activity: Date.now(),
            inverseActivity: 9999999999999 - Date.now()
          })
        })

        db.ref('users/' + user.uid + '/films').on('value', films => {
          let idFilms = []

          films = films.val()

          for (let index in films) {
            let attr = films[index]
            idFilms.push({
              id: index,
              buttons: attr
            })
          }

          this.$store.state.user.buttons = idFilms

          idFilms.forEach(_ => {
            let film = this.$store.state.user.films.all.find(film => String(film.id) === String(_.id))

            if (!film) {
              db.ref(`films/added/${_.id}`).once('value', film => {
                if (film.val()) {
                  this.$store.state.user.films.all.push(film.val())
                }
              })
            }
          })

          db.ref(`community/users/${user.uid}`).update({
            id: user.uid,
            films: idFilms.length,
            inverseFilms: 9999999999999 - idFilms.length,
            activity: Date.now(),
            inverseActivity: 9999999999999 - Date.now()
          })
        })

        this.httpGet('https://api.themoviedb.org/3/authentication/guest_session/new?api_key=3836694fa8a7ae3ea69b5ff360b3be0b').then(_ => {
          this.__user.guestTmdb = _.guest_session_id
        })
      }
    })
  },
  computed: {
    __window () {
      return this.$store.state.window
    },
    __route () {
      return this.$store.state.route
    },
    __user () {
      return this.$store.state.user
    }
  },
  watch: {
    '$route' (route) {
      this.checkRoute(route)
    },
    '__user.buttons' (buttons) {
      let user = this.__user

      for (let i = 0; i < user.films.all.length; i++) {
        let film = user.films.all[i]

        let find = buttons.find(_ => String(_.id) === String(film.id))

        if (!find) {
          user.films.all.splice(i, 1)
        }
      }
    }
  },
  methods: {
    checkRoute (route) {
      let header = this.header

      if (route.fullPath !== '/') {
        header.position = 'fixed'
      } else {
        this.checkPositionHeader()
      }
    },
    checkPositionHeader () {
      let window = this.__window
      let header = this.header

      let headerHeight = 60

      if (window.scrollY + headerHeight >= window.height) {
        header.position = 'fixed'
      } else {
        header.position = 'absolute'
      }
    },
    resetUser () {
      this.$store.commit('fullResetUser')
    }
  }
}
</script>

<style lang="scss">
@import 'static/scss/animate.scss';
@import 'static/scss/base.scss';
@import 'static/scss/form.scss';

.main-header {
  height: 60px;
  width: 100%;

  font-family: 'Julius Sans One', sans-serif;

  background: rgba(60, 60, 60, .9);

  z-index: 9999;

  .logo {
    width: 210px;
    height: 60px;
  }

  .main-nav {
    width: 100%;

    .nav-links {
      justify-content: space-around;
      align-items: center;

      height: 100%;
      width: 100%;

      .nav-link {
        position: relative;

        letter-spacing: 3px;

        .link {
          text-shadow: 0 1px 5px #fff;

          font-size: 20px;

          padding: 5px 10px;

          &:hover, &.hover {
            color: yellow;

            text-shadow: 0 1px 5px yellow;
          }

          .link-img {
            height: 30px;
            width: 30px;
          }
        }
      }
    }
  }
}

.absolute-header {
  position: absolute;
  top: calc(100vh - 60px);
  left: 0;
}

.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
}

.no-background {
  background: none;
}

.link-active::after {
  content: "";

  position: absolute;
  bottom: -5px;
  left: -1px;

  width: 100%;
  height: 1px;

  background: white;
  animation: selected-nav-anim .4s ease;
}

.link-active::before {
  content: "";
  position: absolute;
  top: -5px;
  right: 1px;

  width: 100%;
  height: 1px;

  background: white;
  animation: selected-nav-anim .4s ease;
}

@keyframes selected-nav-anim {
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
}
</style>
