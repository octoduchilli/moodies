<template>
  <button @click="button.click = true" class="basic-button unselectable">{{button.label}}</button>
</template>

<script>
export default {
  props: ['button']
}
</script>

<style lang="scss" scoped>
  @import 'style.scss';
</style>
