<template>
  <ul class="basic-link-image-list-wrap basic-list wrap">
    <router-link class="link item column justi-center align-center" v-for="item in list" :key="item.id" :to="`/film/${item.id}`">
      <img class="item-image" :src="w500(item.url)" onerror="this.src = '/static/img/buttons/picture-white.png'; this.style.opacity = '.2'">
      <p class="item-name text-center">{{item.name}}</p>
    </router-link>
  </ul>
</template>

<script>
import imageMixin from '@/lib/mixins/image'

export default {
  name: 'basic-link-image-list-wrap',
  props: ['list'],
  mixins: [imageMixin]
}
</script>

<style lang="scss" scoped>
  @import 'style.scss';
</style>
