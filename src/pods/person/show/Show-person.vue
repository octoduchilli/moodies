<template>
  <div class="show">
    <div class="buttons wrap justi-center">
      <basic-button class="margin-10" :button="buttons.back"/>
      <basic-link-button class="margin-10" :button="buttons.discover"/>
    </div>
    <person v-if="person" :person="person"/>
    <h1 v-else class="text-center margin-20">Un instant...</h1>
  </div>
</template>

<script>
import httpGetMixin from '@/lib/mixins/httpget'

export default {
  mixins: [httpGetMixin],
  data () {
    return {
      person: null,
      buttons: {
        back: {
          click: false,
          label: 'RETOUR'
        },
        discover: {
          path: '/library',
          label: `Découvrir d'autres personnalités`
        }
      }
    }
  },
  created () {
    let id = this.$route.params.id

    this.fetchPerson(id)
  },
  watch: {
    'buttons.back.click' (click) {
      if (click) {
        this.$router.go(-1)
      }

      this.buttons.back.click = false
    },
    '$route.params.id' (id) {
      this.fetchPerson(id)
    }
  },
  methods: {
    fetchPerson (id) {
      this.film = null
      let history = this.$store.state.library.history

      window.scroll({
        top: 0,
        left: 0,
        behavior: 'auto'
      })

      this.httpGet(`https://api.themoviedb.org/3/person/${id}?api_key=3836694fa8a7ae3ea69b5ff360b3be0b&language=fr-FR&append_to_response=images,movie_credits`).then(_ => {
        this.person = _

        let index = history.items.findIndex(item => item.id === _.id)

        if (index !== -1) {
          history.items.splice(index, 1)
        }

        history.items.unshift({
          id: _.id,
          name: _.name,
          path: `/person/${_.id}`,
          logo: `/static/img/buttons/user-male-white.png`
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'style.scss';
</style>
