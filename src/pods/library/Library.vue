<template>
  <div class="library">
    <history-pannel/>
    <div :class="[__window.width > 800 ? 'row' : 'column']">
      <search-pannel :pannel="__library.search"/>
      <index v-if="__library.index"/>
      <div v-else class="column align-center width">
        <h1 class="text-center" v-if="__library.search.isSearching">Un instant...</h1>
        <h1 class="text-center" v-if="!__library.search.isSearching && __library.search.input.text && __library.search.film.items.length === 0 && __library.search.person.items.length === 0 && __library.search.discover.items.length === 0">Aucun résultat pour {{__library.search.input.text}}</h1>
        <search-name-list v-if="(__library.search.film.items.length > 0 && !__library.search.isSearching) || (__library.search.person.items.length > 0 && !__library.search.isSearching)" :lists="__library.search"/>
        <discover-film-list v-if="__library.search.discover.items.length > 0" :list="__library.search.discover"/>
      </div>
    </div>
  </div>
</template>

<script>
import historyPannel from '@/lib/pods/library/history-pannel/Component'
import searchPannel from '@/lib/pods/library/search-pannel/Component'
import searchNameList from '@/lib/pods/library/search-name-list/Component'
import discoverFilmList from '@/lib/pods/library/discover-film-list/Component'
import index from '@/lib/pods/library/index/Component'

export default {
  components: {
    searchPannel,
    historyPannel,
    searchNameList,
    discoverFilmList,
    index
  },
  created () {
    this.$store.state.route.selected = 1
  },
  destroyed () {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'auto'
    })
  },
  computed: {
    __window () {
      return this.$store.state.window
    },
    __library () {
      return this.$store.state.library
    }
  },
  watch: {
    '__library.search.isSearching' () {
      this.__library.index = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'style.scss';
</style>
