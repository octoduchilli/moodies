<template>
  <ul class="basic-link-image-list-scroll row scrollbar basic-list text-center">
    <li class="item" v-for="item in list" :key="item.id">
      <router-link class="link flex align-center justi-center height" :to="item.path">
        <img :src="w500(item.url)" class="item-image" onerror="this.src = '/static/img/buttons/picture-white.png'; this.style.opacity = '.2'">
        <p v-if="item.name">{{item.name}}</p>
      </router-link>
    </li>
  </ul>
</template>

<script>
import imageMixin from '@/lib/mixins/image'

export default {
  name: 'basic-link-image-list-scroll',
  props: ['list'],
  mixins: [imageMixin]
}
</script>

<style lang="scss" scoped>
  @import 'style.scss';
</style>
