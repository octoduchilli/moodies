<template>
  <div class="my-list row align-start" :style="{'padding-top': $route.fullPath !== '/account/my-list/show' && __window.width < 900 ? '120px' : null}">
    <filters-pannel v-if="$route.fullPath === '/account/my-list/show' || __window.width >= 900"/>
    <router-view/>
  </div>
</template>

<script>
import filtersPannel from '@/lib/pods/account/my-list/filters-pannel/Component'

export default {
  components: {
    filtersPannel
  },
  created () {
    this.$store.state.route.selected = 2
  },
  computed: {
    __window () {
      return this.$store.state.window
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'style.scss';
</style>
