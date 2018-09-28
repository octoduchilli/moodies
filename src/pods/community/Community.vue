<template>
  <div class="community column align-center" :style="{'padding-top': !__user.pseudo && __user.uid ? null : '60px'}">
    <header v-if="!__user.pseudo && __user.uid" class="community-header width row justi-center align-center">
      <p class="text-center">
        Vous n'avez pas encore de
        <router-link to="/account/informations" class="link padding-10">
          pseudo
        </router-link>
      </p>
    </header>
    <div v-if="__routePath === '/community/users'" class="margin-20 column align-start">
      <h1 class="text-center padding-10" style="width: calc(100% - 20px)">Communauté de Moodies</h1>
      <h2 class="padding-10 margin-0">Retrouvez votre profil et ceux de vos amis</h2>
      <p class="padding-10 margin-0">Pour retrouver votre profil dans la liste des utilisateurs de Moodies nous vous invitons à définir votre pseudo.</p>
      <router-link to="/account/informations" class="link color-yellow hover-bg-yellow padding-10" style="margin: 10px 0;">
        Définissez votre pseudo ici !
      </router-link>
      <basic-button class="margin" :button="buttons.toSearch"/>
    </div>
    <div v-if="__routePath === '/community/users'" class="margin-20 column align-center text-center">
      <h2 class="padding-10 margin-0">Les dernières activités - <router-link class="link" style="text-decoration: underline" to="/community/activity">Voir en détails</router-link></h2>
      <div class="last-activity wrap justi-center">
        <div class="activity column align-center margin-10" v-for="activity in __allLastActivity" :key="activity.name">
          <router-link :to="`/community/activity#${activity.name}`" v-if="activity.total" class="total link flex align-center justi-center">
            <p class="text-center margin-0">{{activity.total}}</p>
          </router-link>
          <div class="row align-center margin-5">
            <div class="div-pseudo" style="margin-right: 15px">
              <router-link :to="`/users/${activity.object.user.pseudoLower}`" class="pseudo link flex justi-center align-center">
                {{activity.object.user.pseudoBase}}
              </router-link>
              <div class="pseudo-bg" :class="`${activity.object.user.pseudoLower}-pseudo-bg-community`"></div>
            </div>
            <p style="font-size: 14px">{{activity.sentence}}</p>
          </div>
          <router-link class="film link flex align-center justi-center height" :to="`/film/${activity.object.film.id}`">
            <img :src="w500(activity.object.film.poster_path)" class="film-poster" onerror="this.src = '/static/img/buttons/picture-white.png'; this.style.opacity = '.2'">
            <p v-if="activity.object.film.title">{{activity.object.film.title}}</p>
          </router-link>
          <p style="font-size: 13px"><span style="color: grey; font-size: 12px">le </span>{{activity.object.createdAt || activity.object.votedAt | moment("Do MMMM YYYY à H:mm")}}</p>
        </div>
      </div>
    </div>
    <h2 v-if="__routePath === '/community/users'" class="padding-10 margin-0">Faite votre recherche</h2>
    <router-view/>
  </div>
</template>

<script>
import { db } from '@/firebase'
import imageMixin from '@/lib/mixins/image'

export default {
  mixins: [imageMixin],
  data () {
    return {
      buttons: {
        toSearch: {
          click: false,
          label: 'C\'est parti !'
        }
      }
    }
  },
  created () {
    this.$store.state.route.selected = 4
    if (this.__routePath === '/community') {
      this.$router.push('/community/users')
    }

    let last = this.__community.last

    if (!this.__community.start) {
      db.ref('community/last/film').on('value', async _ => {
        _ = _.val()

        let createdAt = _.createdAt
        let film = null
        let user = null

        await db.ref(`films/added/${_.id}`).once('value', _ => {
          film = _.val()
        })

        await db.ref(`community/users/${_.uid}`).once('value', _ => {
          user = _.val()
        })

        last.films.push({
          createdAt: createdAt,
          film: film,
          user: user
        })

        setTimeout(() => {
          this.setColorPseudo(user)
        })
      })

      db.ref('community/last/rate').on('value', async _ => {
        _ = _.val()

        let votedAt = _.votedAt
        let value = _.value
        let film = null
        let user = null

        await db.ref(`films/added/${_.id}`).once('value', _ => {
          film = _.val()
        })

        await db.ref(`community/users/${_.uid}`).once('value', _ => {
          user = _.val()
        })

        last.rates.push({
          votedAt: votedAt,
          value: value,
          film: film,
          user: user
        })

        setTimeout(() => {
          this.setColorPseudo(user)
        })
      })

      db.ref('community/last/favorite').on('value', async _ => {
        _ = _.val()

        let createdAt = _.createdAt
        let film = null
        let user = null

        await db.ref(`films/added/${_.id}`).once('value', _ => {
          film = _.val()
        })

        await db.ref(`community/users/${_.uid}`).once('value', _ => {
          user = _.val()
        })

        last.favorites.push({
          createdAt: createdAt,
          film: film,
          user: user
        })

        setTimeout(() => {
          this.setColorPseudo(user)
        })
      })
      this.__community.start = true
    }
  },
  mounted () {
    this.setColorAllLast()
  },
  computed: {
    __user () {
      return this.$store.state.user
    },
    __community () {
      return this.$store.state.community
    },
    __routePath () {
      return this.$route.fullPath
    },
    __allLastActivity () {
      let last = this.__community.last
      let film = last.films[last.films.length - 1]
      let rate = last.rates[last.rates.length - 1]
      let favorite = last.favorites[last.favorites.length - 1]
      let final = []

      if (film && rate && favorite) {
        final.push({
          name: 'favorites',
          total: last.favorites.length > 1 ? last.favorites.length : null,
          object: favorite,
          sentence: 'a ajouté en favoris'
        })

        final.push({
          name: 'films',
          total: last.films.length > 1 ? last.films.length : null,
          object: film,
          sentence: `s'est intéressé à`
        })

        final.push({
          name: 'rates',
          total: last.rates.length > 1 ? last.rates.length : null,
          object: rate,
          sentence: `a noté ${rate.value / 2} / 5`
        })
      }

      return final
    }
  },
  watch: {
    'buttons.toSearch.click' (click) {
      if (click) {
        window.scroll({
          top: document.getElementsByClassName('search')[0].offsetTop - 120,
          left: 0,
          behavior: 'smooth'
        })
      }

      this.buttons.toSearch.click = false
    },
    '__routePath' () {
      setTimeout(() => {
        this.setColorAllLast()
      })
    }
  },
  methods: {
    setColorAllLast () {
      let last = this.__community.last
      let film = last.films[last.films.length - 1]
      let rate = last.rates[last.rates.length - 1]
      let favorite = last.favorites[last.favorites.length - 1]

      if (film && rate && favorite) {
        this.setColorPseudo(film.user)
        this.setColorPseudo(rate.user)
        this.setColorPseudo(favorite.user)
      }
    },
    setColorPseudo (user) {
      let divs = document.getElementsByClassName(`${user.pseudoLower}-pseudo-bg-community`)

      for (let index in divs) {
        let div = divs[index]

        if (typeof div === 'object' && user.color) {
          let rgb = this.hex2rgb(user.color)
          div.style.background = `linear-gradient(to bottom, rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1), rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0) 75%)`
        } else if (typeof div === 'object') {
          div.style.background = `linear-gradient(to bottom, rgba(255, 255, 0, 1), rgba(255, 255, 0, 0) 75%)`
        }
      }
    },
    hex2rgb (hex) {
      return ['0x' + hex[1] + hex[2] | 0, '0x' + hex[3] + hex[4] | 0, '0x' + hex[5] + hex[6] | 0]
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'style.scss';
</style>
