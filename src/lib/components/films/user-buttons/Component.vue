<template>
  <ul :style="{'opacity': __user.uid ? 1 : 0.3}" :class="[flexDirection]" class="user-buttons scrollbar basic-list align-center">
    <li class="user-button" :class="[`${film.id}-user-button`, {'scale': button.click}]" @click="!__user.uid ? redirectSignIn() : button.link === 'add-64' ? redirectCreateList() : button.click ? (button.click = false, updateDb(button.id, false)) : (button.click = true, updateDb(button.id, true))" @mouseover="button.mouseover = true" @mouseout="button.mouseover = false" v-for="button in __buttons" :key="button.id">
      <div class="circle" :class="[{'scale': button.mouseover && __window.width >= 700}, button.mouseover && __window.width >= 700 ? `veil-background` : null, button.click ? `normal-background` : null]" v-for="n in 2" :key="n['.key']"></div>
      <img v-if="button.link" class="button-img" :src="`/static/img/buttons/${button.link}-black.png`">
      <p v-if="button.label" class="button-label">{{button.label}}</p>
    </li>
  </ul>
</template>

<script>
import { db } from '@/firebase'
import httpgetMixin from '@/lib/mixins/httpget'

export default {
  name: 'user-buttons',
  props: ['film', 'flexDirection'],
  mixins: [httpgetMixin],
  data () {
    return {
      buttons: {
        view: {
          id: 1,
          mouseover: false,
          click: false,
          link: 'visibility-button',
          color: '#8ddd6d'
        },
        favorite: {
          id: 2,
          mouseover: false,
          click: false,
          link: 'star',
          color: 'yellow'
        },
        personalize: {
          mouseover: false,
          click: false,
          link: 'add-64',
          color: 'white'
        }
      },
      filtersStore: []
    }
  },
  mounted () {
    setTimeout(() => {
      this.setColorButtons()
      this.syncButton()
    })
    this.filtersStore = JSON.parse(JSON.stringify(this.__user.filters.created))
  },
  computed: {
    __window () {
      return this.$store.state.window
    },
    __user () {
      return this.$store.state.user
    },
    __buttons () {
      let final = []
      let buttons = this.buttons
      let filtersStore = this.filtersStore

      for (let index in this.buttons) {
        let button = buttons[index]

        final.push(button)
      }

      filtersStore.forEach(_ => {
        final.splice(final.length - 1, 0, _)
      })

      return final
    },
    __buttonsForSave () {
      let buttons = this.__buttons
      let final = []

      buttons.forEach(button => {
        if (button.click) {
          final.push({
            id: button.id
          })
        }
      })

      if (final.length === 0) {
        return null
      }

      return final
    },
    __filtersStore () {
      return this.__user.filters.created
    }
  },
  watch: {
    '__user.filters.created' (filters) {
      this.filtersStore = JSON.parse(JSON.stringify(this.__user.filters.created))
    },
    '__buttons' (buttons) {
      setTimeout(() => {
        this.setColorButtons()
        this.syncButton()
      }, 300)
    }
  },
  methods: {
    redirectSignIn () {
      this.$router.push('/profile/sign-in')
    },
    redirectCreateList () {
      this.$router.push('/account/my-list/create')
    },
    async updateDb (idButton, clickButton) {
      let user = this.__user
      let buttons = this.__buttonsForSave
      let film = null
      let date = new Date()

      await this.httpGet(`https://api.themoviedb.org/3/movie/${this.film.id}?api_key=3836694fa8a7ae3ea69b5ff360b3be0b&language=fr&append_to_response=releases,recommendations,credits`).then(_ => {
        film = _
      })

      db.ref(`users/${user.uid}/films/${film.id}`).set(buttons)

      if (idButton === 2) {
        if (clickButton && user.pseudo) {
          db.ref(`community/last/favorite`).set({
            uid: this.__user.uid,
            id: film.id,
            createdAt: date.toString()
          })
        }

        db.ref(`users/${this.__user.uid}/last/favorite`).set({
          id: film.id,
          createdAt: date.toString(),
          buttons: buttons
        })
      } else {
        if (user.pseudo) {
          db.ref(`community/last/film`).set({
            uid: this.__user.uid,
            id: film.id,
            createdAt: date.toString()
          })
        }

        db.ref(`users/${this.__user.uid}/last/film`).set({
          id: film.id,
          createdAt: date.toString(),
          buttons: buttons
        })
      }

      db.ref(`films/added/${film.id}`).set({
        id: film.id,
        title: film.title,
        poster_path: film.poster_path,
        runtime: film.runtime,
        popularity: film.popularity,
        genres: film.genres,
        release_date: film.releases.countries.find(_ => String(_.iso_3166_1) === 'FR') ? film.releases.countries.find(_ => String(_.iso_3166_1) === 'FR').release_date : film.release_date
      })
    },
    syncButton () {
      let film = this.__user.buttons.find(_ => String(_.id) === String(this.film.id))

      if (film) {
        let buttons = this.__buttons

        buttons.forEach(_ => {
          _.click = false
        })

        film.buttons.forEach(button => {
          let b = buttons.find(_ => String(_.id) === String(button.id))

          if (b) {
            b.click = true
          }
        })
      }
    },
    setColorButtons () {
      let buttons = this.__buttons

      for (let i = 0; i < buttons.length; i++) {
        let button = buttons[i]
        let li = document.getElementsByClassName(`${this.film.id}-user-button`)[i]

        if (li) {
          li.style.setProperty('--button-color-circle-bg', `${button.color}`)
          li.style.setProperty('--button-color-veil-bg', `${button.color}`)
          li.style.setProperty('--button-color-normal-bg', `${button.color}`)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import 'style.scss';
</style>
