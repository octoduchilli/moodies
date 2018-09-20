<template>
  <ul class="list-wrap-with-buttons basic-list wrap">
    <li class="row align-center" v-for="item in list" :key="item.id">
      <router-link class="item link item column justi-center align-center" :to="`/film/${item.id}`">
        <img class="item-image" :src="w500(item.url)" onerror="this.src = '/static/img/buttons/picture-white.png'; this.style.opacity = '.2'">
        <p class="item-name text-center">{{item.name}}</p>
      </router-link>
      <user-buttons :style="__window.width < 500 ? 'max-height: 150px' : 'max-height: 200px'" :film="item" flexDirection="column"/>
    </li>
  </ul>
</template>

<script>
import imageMixin from '@/lib/mixins/image'

export default {
  name: 'basic-link-image-list-wrap',
  props: ['list'],
  mixins: [imageMixin],
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
