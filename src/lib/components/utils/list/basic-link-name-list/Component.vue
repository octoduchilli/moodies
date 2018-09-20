<template>
  <ul class="basic-link-name-list basic-list column">
    <li class="item flex" v-for="item in list" :key="item.id">
      <router-link class="link width" :to="item.path">
        {{item.name || ''}}
      </router-link>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'basic-link-name-list',
  props: ['list']
}
</script>

<style lang="scss" scoped>
  @import 'style.scss';
</style>
