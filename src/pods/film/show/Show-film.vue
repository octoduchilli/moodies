<template>
  <div class="show">
    <div class="buttons wrap justi-center">
      <basic-button class="margin-10" :button="buttons.back"/>
      <basic-link-button class="margin-10" :button="buttons.discover"/>
    </div>
    <film v-if="film" :film="film"/>
    <h1 v-else class="text-center margin-20">Un instant...</h1>
  </div>
</template>

<script>
import httpGetMixin from '@/lib/mixins/httpget'

export default {
  mixins: [httpGetMixin],
  data () {
    return {
      film: null,
      buttons: {
        back: {
          click: false,
          label: 'RETOUR'
        },
        discover: {
          path: '/library',
          label: `Découvrir d'autres films`
        }
      }
    }
  },
  created () {
    let id = this.$route.params.id

    this.fetchFilm(id)
  },
  watch: {
    'buttons.back.click' (click) {
      if (click) {
        this.$router.go(-1)
      }

      this.buttons.back.click = false
    },
    '$route.params.id' (id) {
      this.fetchFilm(id)
    }
  },
  methods: {
    fetchFilm (id) {
      this.film = null
      let history = this.$store.state.library.history

      window.scroll({
        top: 0,
        left: 0,
        behavior: 'auto'
      })

      this.httpGet(`https://api.themoviedb.org/3/movie/${id}?api_key=3836694fa8a7ae3ea69b5ff360b3be0b&language=fr&append_to_response=releases,recommendations,credits,videos`).then(_ => {
        this.film = _

        let index = history.items.findIndex(item => item.id === _.id)

        if (index !== -1) {
          history.items.splice(index, 1)
        }

        history.items.unshift({
          id: _.id,
          name: _.title,
          path: `/film/${_.id}`,
          logo: `/static/img/buttons/film-strip-white.png`
        })

        if (_.belongs_to_collection) {
          this.fetchCollection(_.belongs_to_collection.id)
        }
      })
    },
    fetchCollection (id) {
      this.httpGet(`https://api.themoviedb.org/3/collection/${id}?api_key=3836694fa8a7ae3ea69b5ff360b3be0b&language=fr-FR`).then(_ => {
        if (_ && _.parts) {
          _.parts.sort((a, b) => {
            return ('' + a.release_date).localeCompare(b.release_date)
          })

          this.$set(this.film, 'collection', _)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'style.scss';
</style>
