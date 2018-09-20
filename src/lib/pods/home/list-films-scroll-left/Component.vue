<template>
  <div :id="id" class="list-films-scroll-left">
    <h1 class="title padding-15" v-html="i18n.title"></h1>
    <h1 class="under-title" v-if="i18n.underTitle" v-html="i18n.underTitle"></h1>
    <ul class="list-films row padding-0 no-list-style scrollbar">
      <li v-if="film.poster_path" class="film-card pointer row" v-for="film in films" :key="film['.key']">
        <img @click="showFilm.id = film.id" class="poster" :src="w500(film.poster_path, null)">
      </li>
    </ul>
    <div v-if="showFilm.title">
      <film :film="showFilm" :onlyFirstPart="true"/>
      <div class="wrap justi-center">
        <basic-button class="margin-10" :button="buttons.back"/>
        <basic-link-button class="margin-10" :button="buttons.redirect"/>
      </div>
    </div>
  </div>
</template>

<script>
import imageMixin from '@/lib/mixins/image'
import httpGetMixin from '@/lib/mixins/httpget'

export default {
  mixins: [imageMixin, httpGetMixin],
  props: ['id', 'films', 'i18n'],
  data () {
    return {
      showFilm: {
        id: null
      },
      buttons: {
        back: {
          click: false,
          label: 'RETOUR'
        },
        redirect: {
          path: null,
          label: 'VOIR LA FICHE COMPLETE'
        }
      }
    }
  },
  watch: {
    'showFilm.id' (id) {
      this.buttons.redirect.path = `/film/${this.showFilm.id}`

      if (id) {
        this.showFilm = {
          id: id
        }
        setTimeout(() => {
          this.httpGet(`https://api.themoviedb.org/3/movie/${id}?api_key=3836694fa8a7ae3ea69b5ff360b3be0b&language=fr&append_to_response=releases,recommendations,credits,videos`).then(_ => {
            this.showFilm = _
          })
        }, 500)
      }
    },
    'buttons.back.click' (click) {
      if (click) {
        this.showFilm = {
          id: null
        }

        window.scroll({
          top: document.querySelector(`#${this.id}`).offsetTop - 125,
          left: 0,
          behavior: 'auto'
        })
      }

      this.buttons.back.click = false
    }
  }
}
</script>

<style lang="scss" scoped>
  @import 'style.scss';
</style>
