<template>
  <div class="activity column align-center width">
    <basic-link-button class="margin-10" style="width: 200px" :button="buttons.backToUsers"/>
    <p class="text-center margin-5">Les listes suivantes sont automatiquement rafraichies à partir du moment où vous visitez la page communauté. L'historique des activités n'est valable que le temps de votre session sur Moodies :</p>
    <p class="text-center margin-0">Moodies sauvegarde uniquement la dernière activité pour chaque branche.</p>
    <div class="column align-center width">
      <div :id="last.name" :class="last.background" class="div-list-activity column width align-center margin-10" v-for="last in __lastList" :key="last.title">
        <h1 class="margin-5 text-center">{{last.title}} - ({{last.list.length}})</h1>
        <p class="text-center padding-10">{{last.description}}</p>
        <ul class="list-activity wrap basic-list justi-center">
          <li class="item column align-center margin-10" v-for="activity in last.list" :key="activity.id">
            <div class="row align-center margin-5">
              <div class="div-pseudo">
                <router-link :to="`/users/${activity.user.pseudoLower}`" class="pseudo link flex justi-center align-center">
                  {{activity.user.pseudoBase}}
                </router-link>
                <div class="pseudo-bg" :class="`${activity.user.pseudoLower}-pseudo-bg-community`"></div>
              </div>
              <p style="font-size: 14px; margin-left: 15px" v-if="activity.value">a noté {{activity.value / 2}} / 5</p>
            </div>
            <router-link class="film link flex align-center justi-center height" :to="`/film/${activity.film.id}`">
              <img :src="w500(activity.film.poster_path)" class="film-poster" onerror="this.src = '/static/img/buttons/picture-white.png'; this.style.opacity = '.2'">
              <p v-if="activity.film.title">{{activity.film.title}}</p>
            </router-link>
            <p style="font-size: 13px"><span style="color: grey; font-size: 12px">le </span>{{activity.createdAt || activity.votedAt | moment("Do MMMM YYYY à H:mm:ss")}}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import imageMixin from '@/lib/mixins/image'

export default {
  mixins: [imageMixin],
  data () {
    return {
      buttons: {
        backToUsers: {
          click: false,
          path: '/community/users',
          label: 'Retour à la communauté'
        }
      }
    }
  },
  mounted () {
    let last = this.__lastList

    last.forEach(_ => {
      _.list.forEach(_ => {
        this.setColorPseudo(_.user)
      })
    })
  },
  computed: {
    __community () {
      return this.$store.state.community
    },
    __lastList () {
      let last = this.__community.last
      let final = []

      final.push({
        list: last.favorites,
        title: 'Favoris',
        description: 'Les utilisateurs ayant récemment ajoutés en favoris',
        name: 'favorites',
        background: 'orange'
      })

      final.push({
        list: last.films,
        title: 'Films',
        description: 'Les utilisateurs ayant récemment ajoutés, modifiés ou supprimés',
        name: 'films',
        background: 'plum'
      })

      final.push({
        list: last.rates,
        title: 'Notes',
        description: 'Les utilisateurs ayant récemment notés',
        name: 'rates',
        background: 'lightgreen'
      })

      return final
    }
  },
  watch: {
    '__lastList' (last) {
      setTimeout(() => {
        last.forEach(_ => {
          _.list.forEach(_ => {
            this.setColorPseudo(_.user)
          })
        })
      }, 200)
    }
  },
  methods: {
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
