<template>
  <div class="user-activity column align-center">
    <basic-button :button="buttons.back"/>
    <div class="margin-10 wrap justi-center">
      <div v-if="last.favorite" class="activity column align-center margin-10">
        <p>a ajouté en favoris</p>
        <router-link class="film link flex align-center justi-center height" :to="`/film/${last.favorite.id}`">
          <img :src="w500(last.favorite.poster_path)" class="film-poster" onerror="this.src = '/static/img/buttons/picture-white.png'; this.style.opacity = '.2'">
          <p v-if="last.favorite.title">{{last.favorite.title}}</p>
        </router-link>
        <p style="font-size: 13px"><span style="color: grey; font-size: 12px">le </span>{{last.favorite.createdAt | moment("Do MMMM YYYY à H:mm")}}</p>
      </div>
      <div v-if="last.film" class="activity column align-center margin-10">
        <p>{{last.film.buttons ? 'a ajouté/modifié' : 'a supprimé'}}</p>
        <router-link class="film link flex align-center justi-center height" :to="`/film/${last.film.id}`">
          <img :src="w500(last.film.poster_path)" class="film-poster" onerror="this.src = '/static/img/buttons/picture-white.png'; this.style.opacity = '.2'">
          <p v-if="last.film.title">{{last.film.title}}</p>
        </router-link>
        <p style="font-size: 13px"><span style="color: grey; font-size: 12px">le </span>{{last.film.createdAt | moment("Do MMMM YYYY à H:mm")}}</p>
      </div>
      <div v-if="last.rate" class="activity column align-center margin-10">
        <p>a noté {{last.rate.value / 2}} / 5</p>
        <router-link class="film link flex align-center justi-center height" :to="`/film/${last.rate.id}`">
          <img :src="w500(last.rate.poster_path)" class="film-poster" onerror="this.src = '/static/img/buttons/picture-white.png'; this.style.opacity = '.2'">
          <p v-if="last.rate.title">{{last.rate.title}}</p>
        </router-link>
        <p style="font-size: 13px"><span style="color: grey; font-size: 12px">le </span>{{last.rate.votedAt | moment("Do MMMM YYYY à H:mm")}}</p>
      </div>
    </div>
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
        back: {
          click: false,
          label: 'RETOUR'
        }
      },
      last: {
        film: null,
        rate: null,
        favorite: null
      }
    }
  },
  created () {
    let pseudoLower = this.$route.params.id

    db.ref('community/users').orderByChild('pseudoLower').equalTo(pseudoLower).once('value', snap => {
      snap.forEach(_ => {
        db.ref(`users/${_.val().id}/last`).once('value', last => {
          last = last.val()

          if (last.film) {
            db.ref(`films/added/${last.film.id}`).once('value', film => {
              this.last.film = Object.assign({}, last.film, film.val())
            })
          }

          if (last.rate) {
            db.ref(`films/added/${last.rate.id}`).once('value', rate => {
              this.last.rate = Object.assign({}, last.rate, rate.val())
            })
          }

          if (last.favorite) {
            db.ref(`films/added/${last.favorite.id}`).once('value', favorite => {
              this.last.favorite = Object.assign({}, last.favorite, favorite.val())
            })
          }
        })
      })
    })
  },
  watch: {
    'buttons.back.click' (click) {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'style.scss';
</style>
