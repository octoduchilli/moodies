<template>
  <div class="history-pannel column">
    <h1 class="text-center margin">Historique de vos recherches</h1>
    <ul class="history-items row basic-list scrollbar">
      <router-link class="item link row align-center" :to="item.path" v-for="item in __history.items" :key="item.id" :style="{'min-width': `${(item.name.length * 10) > 200 ? 200 : (item.name.length * 10) < 100 ? 100 : (item.name.length * 10)}px`}">
        <img class="item-logo" :src="item.logo">
        <p class="item-name">{{item.name}}</p>
      </router-link>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'history-pannel',
  computed: {
    __history () {
      return this.$store.state.library.history
    }
  }
}
</script>

<style lang="scss" scoped>
  @import 'style.scss';
</style>
