<template>
  <router-link class="basic-link-button link unselectable" :to="button.path">
    {{button.label}}
  </router-link>
</template>

<script>
export default {
  props: ['button']
}
</script>

<style lang="scss" scoped>
  @import 'style.scss';
</style>
