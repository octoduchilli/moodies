<template>
  <div class="discover-film-list column width height">
    <h1 class="text-center">{{list.totalResults}} films trouvés</h1>
    <list-wrap-with-buttons :list="__list"/>
    <basic-button v-if="list.page <= list.totalPages" style="margin: 20px auto" :button="button"/>
  </div>
</template>

<script>
import imageMixin from '@/lib/mixins/image'

export default {
  name: 'discover-film-list',
  props: ['list'],
  mixins: [imageMixin],
  data () {
    return {
      button: {
        click: false,
        label: 'Plus de films'
      }
    }
  },
  computed: {
    __window () {
      return this.$store.state.window
    },
    __list () {
      let films = this.list.items
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
  },
  watch: {
    '__window.scrollY' () {
      let window = this.__window
      let list = this.list
      let div = document.getElementsByClassName('discover-film-list')[0]
      let posYBot = div.offsetTop + div.offsetHeight

      if (posYBot - window.height <= window.height + window.scrollY && !list.isSearching && list.page <= list.totalPages) {
        this.list.page++
        list.isSearching = true
      }
    },
    'button.click' (click) {
      let list = this.list

      if (click && !list.isSearching) {
        this.list.page++
        list.isSearching = true
      }

      this.button.click = false
    }
  }
}
</script>

<style lang="scss" scoped>
  @import 'style.scss';
</style>
