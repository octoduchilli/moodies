<template>
  <div class="film column">
    <section class="row">
      <div class="half flex justi-center align-center animated fadeIn" :style="{'background-image': __window.width > 500 ? `url('${w500(film.poster_path, null)}')` : null}" style="background-size: cover; background-repeat: no-repeat; background-position: center; border-radius: 15px">
        <div class="veil"></div>
        <img class="film-poster" :src="w500(film.poster_path, null)" onerror="this.src = '/static/img/buttons/picture-white.png'; this.style.opacity = '.3'">
      </div>
      <div class="half column">
        <h1 class="title-detail">{{film.title}}</h1>
        <div class="normal-detail">
          <user-buttons :film="film" flexDirection="row"/>
        </div>
        <div class="normal-detail wrap align-center">
          <div @click="!__user.uid ? $router.push('/profile/sign-in') : null" class="column" :style="{'opacity': __user.uid ? '1' : '.3'}">
            <basic-rate :rate="rate"/>
            <p class="margin-10" v-if="voted">Vote pris en compte !</p>
            <p class="margin-0" style="font-size: 11px; color: grey; margin-left: 10px" v-if="voted">Le total des votes et la note globale du film peut mettre du temps à s'actualiser.</p>
          </div>
          <p class="margin-10">{{film.vote_average / 2}} / 5 Étoiles</p>
          <p class="margin-10" style="color: lightgrey">{{film.vote_count}} Votes</p>
        </div>
        <ul class="film-genres normal-detail no-list-style padding-0" v-if="film.genres">
          <span>GENRES : </span>
          <li class="genre-name margin-10" v-for="genre in film.genres" :key="genre['.key']">{{genre.name}}</li>
        </ul>
        <p v-if="film.release_date" class="normal-detail"><span>DATE DE SORTIE : </span>{{YMDtoDate(__frenchRelease)}}</p>
        <p v-if="film.runtime" class="normal-detail"><span>DUREE DU FILM : </span>{{minToHM(film.runtime)}}</p>
        <p v-if="film.overview" class="synopsis normal-detail"><span>SYNOPSIS : </span>{{film.overview}}</p>
      </div>
    </section>
    <section v-if="!onlyFirstPart" class="column">
      <basic-switch-button style="margin: 20px auto; width: 190px" v-if="film.videos" :button="buttons.trailer.show"/>
      <div class="trailers" v-if="buttons.trailer.show.click">
        <ul v-if="!trailer.key" class="trailers-list basic-list column">
          <li class="trailer" v-if="item.site === 'YouTube'" v-for="item in film.videos.results" :key="item.id" @click="trailer.key = item.key">{{item.name}}</li>
        </ul>
        <div v-else class="column align-center">
          <iframe class="video" :src="`https://www.youtube.com/embed/${trailer.key}`" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
          <basic-button class="margin-20" style="width: 210px" :button="buttons.trailer.back"/>
        </div>
      </div>
      <h1 class="title-detail margin-20-0" v-if="__collection">{{film.collection.name}}</h1>
      <basic-link-image-list-scroll v-if="__collection" :list="__collection"/>
      <h1 class="title-detail margin-20-0">Films recommandés pour ce titre</h1>
      <basic-link-image-list-scroll :list="__recommendations"/>
      <h1 class="title-detail margin-20-0">Casting</h1>
      <basic-link-image-list-scroll :list="__castList"/>
      <h1 class="title-detail margin-20-0">Équipe</h1>
      <basic-link-image-list-scroll :list="__crewList"/>
    </section>
  </div>
</template>

<script>
import imageMixin from '@/lib/mixins/image'
import dateMixin from '@/lib/mixins/date'
import httpGetMixin from '@/lib/mixins/httpget'

import { db } from '@/firebase'

export default {
  name: 'film',
  mixins: [imageMixin, dateMixin, httpGetMixin],
  props: ['film', 'onlyFirstPart'],
  data () {
    return {
      buttons: {
        trailer: {
          show: {
            click: false,
            label: `Trailers et vidéos (${this.film.videos.results.length})`
          },
          back: {
            click: false,
            label: 'Retour à la liste'
          }
        }
      },
      rate: {
        click: false,
        value: {
          mouseover: null,
          base: null
        }
      },
      trailer: {
        key: null
      },
      voted: false
    }
  },
  created () {
    this.checkVote()
  },
  computed: {
    __window () {
      return this.$store.state.window
    },
    __user () {
      return this.$store.state.user
    },
    __frenchRelease () {
      let film = this.film
      let final = null

      film.releases.countries.forEach(_ => {
        if (_.iso_3166_1 === 'FR') {
          final = _.release_date
        }
      })

      return final || this.film.release_date
    },
    __recommendations () {
      let recommendations = this.film.recommendations.results
      let final = []

      recommendations.forEach(_ => {
        final.push({
          id: _.id,
          name: _.title,
          url: _.poster_path,
          path: `/film/${_.id}`
        })
      })

      return final
    },
    __castList () {
      let cast = this.film.credits.cast
      let final = []

      cast.forEach(_ => {
        final.push({
          id: _.credit_id,
          name: `${_.character} - ${_.name}`,
          url: _.profile_path,
          path: `/person/${_.id}`
        })
      })

      return final
    },
    __crewList () {
      let cast = this.film.credits.crew
      let final = []

      cast.forEach(_ => {
        final.push({
          id: _.credit_id,
          name: `${_.job} - ${_.name}`,
          url: _.profile_path,
          path: `/person/${_.id}`
        })
      })

      return final
    },
    __collection () {
      let collection = this.film.collection
      let final = []

      if (collection) {
        collection.parts.forEach(_ => {
          final.push({
            id: _.id,
            name: _.title,
            url: _.poster_path,
            path: `/film/${_.id}`
          })
        })
      }

      if (final.length === 0) {
        return null
      }

      return final
    }
  },
  watch: {
    '__user.uid' () {
      this.checkVote()
    },
    'buttons.trailer.back.click' (click) {
      if (click) {
        this.trailer.key = null
      }

      this.buttons.trailer.back.click = false
    },
    'rate.click' (click) {
      if (click) {
        let date = new Date()
        let film = this.film

        this.voted = false

        setTimeout(() => {
          this.$http.post(`https://api.themoviedb.org/3/movie/${this.film.id}/rating?api_key=3836694fa8a7ae3ea69b5ff360b3be0b&guest_session_id=${this.__user.guestTmdb}`, {value: this.rate.value.base}).then(_ => {
            this.voted = true

            db.ref(`users/${this.__user.uid}/rate/${this.film.id}`).update({
              votedAt: date.toString(),
              value: this.rate.value.base
            })
            db.ref(`films/added/${film.id}`).set({
              id: film.id,
              title: film.title,
              poster_path: film.poster_path,
              runtime: film.runtime,
              popularity: film.popularity,
              genres: film.genres,
              release_date: film.releases.countries.find(_ => String(_.iso_3166_1) === 'FR') ? film.releases.countries.find(_ => String(_.iso_3166_1) === 'FR').release_date : film.release_date
            })
          })
        }, 300)
      }

      this.rate.click = false
    }
  },
  methods: {
    checkVote () {
      db.ref(`users/${this.__user.uid}/rate/${this.film.id}`).once('value', snap => {
        if (!snap.val()) {
          this.rate.value.mouseover = 0
          this.rate.value.base = 0
        } else {
          this.rate.value.mouseover = snap.val().value
          this.rate.value.base = snap.val().value
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import 'style.scss';
</style>
