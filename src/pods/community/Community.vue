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
    <div v-if="last.film.user && last.rate.user && last.film.film && last.rate.film" class="margin-20 column align-center text-center">
      <h2 class="padding-10 margin-0">Les dernières activités</h2>
      <div class="last-activity wrap justi-center">
        <div class="column margin-10">
          <div class="activity column align-center">
            <div class="pseudo flex justi-center align-center">
              {{last.film.user.pseudoBase}}
            </div>
            <p>S'est intéressé à</p>
            <router-link class="film link flex align-center justi-center height" :to="`/film/${last.film.film.id}`">
              <img :src="w500(last.film.film.poster_path)" class="film-poster" onerror="this.src = '/static/img/buttons/picture-white.png'; this.style.opacity = '.2'">
              <p v-if="last.rate.film.title">{{last.film.film.title}}</p>
            </router-link>
            <p><span style="color: grey; font-size: 14px">le </span>{{last.film.createdAt | moment("Do MMMM YYYY à H:mm")}}</p>
          </div>
        </div>
        <div class="column margin-10">
          <div class="activity column align-center">
            <div class="pseudo flex justi-center align-center">
              {{last.rate.user.pseudoBase}}
            </div>
            <p>À noté {{last.rate.value / 2}} / 5</p>
            <router-link class="film link flex align-center justi-center height" :to="`/film/${last.rate.film.id}`">
              <img :src="w500(last.rate.film.poster_path)" class="film-poster" onerror="this.src = '/static/img/buttons/picture-white.png'; this.style.opacity = '.2'">
              <p v-if="last.rate.film.title">{{last.rate.film.title}}</p>
            </router-link>
            <p><span style="color: grey; font-size: 14px">le </span>{{last.rate.votedAt | moment("Do MMMM YYYY à H:mm")}}</p>
          </div>
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
      },
      last: {
        film: {
          film: null,
          user: null,
          createdAt: null
        },
        rate: {
          film: null,
          user: null,
          value: null,
          votedAt: null
        }
      }
    }
  },
  created () {
    this.$store.state.route.selected = 4
    this.$router.push('/community/users')

    db.ref('community/last/film').once('value', lastfilm => {
      lastfilm = lastfilm.val()
      this.last.film.createdAt = lastfilm.createdAt

      db.ref(`community/users/${lastfilm.uid}`).once('value', user => {
        this.last.film.user = user.val()
      })

      db.ref(`films/added/${lastfilm.id}`).once('value', film => {
        this.last.film.film = film.val()
      })
    })

    db.ref('community/last/rate').once('value', lastrate => {
      lastrate = lastrate.val()
      this.last.rate.value = lastrate.value
      this.last.rate.votedAt = lastrate.votedAt

      db.ref(`community/users/${lastrate.uid}`).once('value', user => {
        this.last.rate.user = user.val()
      })

      db.ref(`films/added/${lastrate.id}`).once('value', film => {
        this.last.rate.film = film.val()
      })
    })
  },
  computed: {
    __user () {
      return this.$store.state.user
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
