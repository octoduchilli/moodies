<template>
  <button @click="button.click ? button.click = false : button.click = true" class="basic-switch-button unselectable">{{button.label}}</button>
</template>

<script>
export default {
  props: ['button']
}
</script>

<style lang="scss" scoped>
  @import 'style.scss';
</style>
