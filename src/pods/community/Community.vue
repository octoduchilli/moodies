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
    <div class="margin-20 column align-start">
      <h1 class="text-center padding-10" style="width: calc(100% - 20px)">Communauté de Moodies</h1>
      <h2 class="padding-10 margin-0">Retrouvez votre profil et ceux de vos amis</h2>
      <p class="padding-10 margin-0">Pour retrouver votre profil dans la liste des utilisateurs de Moodies nous vous invitons à définir votre pseudo.</p>
      <router-link to="/account/informations" class="link color-yellow hover-bg-yellow padding-10" style="margin: 10px 0;">
        Définissez votre pseudo ici !
      </router-link>
      <basic-button class="margin" :button="buttons.toSearch"/>
    </div>
    <div v-if="__community.last.film.user && __community.last.rate.user && __community.last.favorite.user && __community.last.film.film && __community.last.rate.film && __community.last.favorite.film" class="margin-20 column align-center text-center">
      <h2 class="padding-10 margin-0">Les dernières activités</h2>
      <div class="last-activity wrap justi-center">
        <div class="activity column align-center margin-10">
          <div class="row align-center">
            <router-link :to="`/users/${__community.last.favorite.user.pseudoLower}`" class="pseudo link flex justi-center align-center" style="margin-right: 15px">
              {{__community.last.favorite.user.pseudoBase}}
            </router-link>
            <p style="font-size: 14px">a ajouté en favoris</p>
          </div>
          <router-link class="film link flex align-center justi-center height" :to="`/film/${__community.last.favorite.film.id}`">
            <img :src="w500(__community.last.favorite.film.poster_path)" class="film-poster" onerror="this.src = '/static/img/buttons/picture-white.png'; this.style.opacity = '.2'">
            <p v-if="__community.last.favorite.film.title">{{__community.last.favorite.film.title}}</p>
          </router-link>
          <p style="font-size: 13px"><span style="color: grey; font-size: 12px">le </span>{{__community.last.favorite.createdAt | moment("Do MMMM YYYY à H:mm")}}</p>
        </div>
        <div class="activity column align-center margin-10">
          <div class="row align-center">
            <router-link :to="`/users/${__community.last.film.user.pseudoLower}`" class="pseudo link flex justi-center align-center" style="margin-right: 15px">
              {{__community.last.film.user.pseudoBase}}
            </router-link>
            <p style="font-size: 14px">s'est intéressé à</p>
          </div>
          <router-link class="film link flex align-center justi-center height" :to="`/film/${__community.last.film.film.id}`">
            <img :src="w500(__community.last.film.film.poster_path)" class="film-poster" onerror="this.src = '/static/img/buttons/picture-white.png'; this.style.opacity = '.2'">
            <p v-if="__community.last.film.film.title">{{__community.last.film.film.title}}</p>
          </router-link>
          <p style="font-size: 13px"><span style="color: grey; font-size: 12px">le </span>{{__community.last.film.createdAt | moment("Do MMMM YYYY à H:mm")}}</p>
        </div>
        <div class="activity column align-center margin-10">
          <div class="row align-center">
            <router-link :to="`/users/${__community.last.rate.user.pseudoLower}`" class="pseudo link flex justi-center align-center" style="margin-right: 15px">
              {{__community.last.rate.user.pseudoBase}}
            </router-link>
            <p style="font-size: 14px">a noté {{__community.last.rate.value / 2}} / 5</p>
          </div>
          <router-link class="film link flex align-center justi-center height" :to="`/film/${__community.last.rate.film.id}`">
            <img :src="w500(__community.last.rate.film.poster_path)" class="film-poster" onerror="this.src = '/static/img/buttons/picture-white.png'; this.style.opacity = '.2'">
            <p v-if="__community.last.rate.film.title">{{__community.last.rate.film.title}}</p>
          </router-link>
          <p style="font-size: 13px"><span style="color: grey; font-size: 12px">le </span>{{__community.last.rate.votedAt | moment("Do MMMM YYYY à H:mm")}}</p>
        </div>
      </div>
    </div>
    <h2 class="padding-10 margin-0">Faite votre recherche</h2>
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
    this.$router.push('/community/users')

    let last = this.__community.last

    db.ref('community/last/film').on('value', lastfilm => {
      lastfilm = lastfilm.val()
      last.film.createdAt = lastfilm.createdAt

      db.ref(`community/users/${lastfilm.uid}`).once('value', user => {
        last.film.user = user.val()
      })

      db.ref(`films/added/${lastfilm.id}`).once('value', film => {
        last.film.film = film.val()
      })
    })

    db.ref('community/last/rate').on('value', lastrate => {
      lastrate = lastrate.val()
      last.rate.value = lastrate.value
      last.rate.votedAt = lastrate.votedAt

      db.ref(`community/users/${lastrate.uid}`).once('value', user => {
        last.rate.user = user.val()
      })

      db.ref(`films/added/${lastrate.id}`).once('value', film => {
        last.rate.film = film.val()
      })
    })

    db.ref('community/last/favorite').on('value', lastfavorite => {
      lastfavorite = lastfavorite.val()
      last.favorite.createdAt = lastfavorite.createdAt

      db.ref(`community/users/${lastfavorite.uid}`).once('value', user => {
        last.favorite.user = user.val()
      })

      db.ref(`films/added/${lastfavorite.id}`).once('value', film => {
        last.favorite.film = film.val()
      })
    })
  },
  computed: {
    __user () {
      return this.$store.state.user
    },
    __community () {
      return this.$store.state.community
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'style.scss';
</style>
