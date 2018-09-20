<template>
  <div class="search-name-list wrap justi-center width height">
    <div class="half column align-end">
      <div class="column">
      <h1 class="text-center">Films - ({{lists.film.items.length}})</h1>
      <p class="text-center pointer margin" style="text-decoration: underline" @click="__name.view.type === 'title' ?  __name.view.type = 'poster' : __name.view.type = 'title'">{{__name.view.type === 'poster' ? 'Afficher les titres' : 'Afficher les posters'}}</p>
      <ul v-if="__name.view.type === 'title'" class="items basic-list">
        <router-link class="item link row align-center" v-for="item in lists.film.items" :key="item.id" :to="`/film/${item.id}`">
          <img class="item-logo" src="/static/img/buttons/film-strip-white.png" alt=" ">
          <p class="item-name">{{item.title}}</p>
        </router-link>
      </ul>
      <basic-link-image-list-wrap v-if="__name.view.type === 'poster'"  :list="__filmsList"/>
      </div>
    </div>
    <div class="half column align-start">
      <div class="column">
      <h1 class="text-center">Personnalités - ({{lists.person.items.length}})</h1>
      <ul class="items basic-list">
        <router-link class="item link row align-center" v-for="item in lists.person.items" :key="item.id" :to="`/person/${item.id}`">
          <img class="item-logo" src="/static/img/buttons/user-male-white.png" alt=" ">
          <p class="item-name">{{item.name}}</p>
        </router-link>
      </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'search-name-list',
  props: ['lists'],
  computed: {
    __name () {
      return this.$store.state.library.search.name
    },
    __filmsList () {
      let films = this.lists.film.items
      let final = []

      films.forEach(_ => {
        final.push({
          id: _.id,
          name: _.title,
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
