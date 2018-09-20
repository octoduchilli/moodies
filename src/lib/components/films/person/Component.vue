<template>
  <div class="person">
    <section class="row">
      <div class="half flex justi-center align-center">
        <img class="person-poster pointer" @click="images.selected === person.images.profiles.length - 1 ? images.selected = 0 : images.selected++" :src="w500(person.images.profiles[images.selected].file_path, null)" onerror="this.src = '/static/img/buttons/picture-white.png'; this.style.opacity = '.3'">
      </div>
      <div class="half column">
        <h1 class="title-detail">{{person.name}}</h1>
        <p v-if="person.birthday" class="normal-detail"><span>DATE DE NAISSANCE : </span>{{YMDtoDate(person.birthday)}}</p>
        <p v-if="person.place_of_birth" class="normal-detail"><span>LIEU DE NAISSANCE : </span>{{person.place_of_birth}}</p>
        <p v-if="person.deathday" class="normal-detail"><span>DUREE DE DECES : </span>{{YMDtoDate(person.deathday)}}</p>
        <p v-if="person.biography" class="biography normal-detail"><span>BIOGRAPHIE : </span>{{person.biography}}</p>
      </div>
    </section>
    <section class="column">
      <h1 class="title-detail margin-20-0">À également joué</h1>
      <basic-link-image-list-scroll :list="__castMovieList"/>
      <h1 class="title-detail margin-20-0">À contribué</h1>
      <basic-link-image-list-scroll :list="__crewMovieList"/>
    </section>
  </div>
</template>

<script>
import imageMixin from '@/lib/mixins/image'
import dateMixin from '@/lib/mixins/date'

export default {
  name: 'person',
  props: ['person'],
  mixins: [imageMixin, dateMixin],
  data () {
    return {
      images: {
        selected: 0
      }
    }
  },
  computed: {
    __castMovieList () {
      let cast = this.person.movie_credits.cast
      let final = []

      cast.forEach(_ => {
        final.push({
          id: _.credit_id,
          name: `${_.character} - ${_.title}`,
          url: _.poster_path,
          path: `/film/${_.id}`
        })
      })

      return final
    },
    __crewMovieList () {
      let crew = this.person.movie_credits.crew
      let final = []

      crew.forEach(_ => {
        final.push({
          id: _.credit_id,
          name: `${_.job} - ${_.title}`,
          url: _.poster_path,
          path: `/film/${_.id}`
        })
      })

      return final
    }
  }
}
</script>

<style lang="scss" scoped>
  @import 'style.scss';
</style>
