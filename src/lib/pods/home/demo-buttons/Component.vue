<template>
  <div class="demo-buttons">
    <h1 class="title border-title padding-15" v-if="i18n.title" v-html="i18n.title"></h1>
    <p class="under-title" v-if="i18n.underTitle" v-html="i18n.underTitle"></p>
    <ul class="buttons-options row no-list-style">
      <li @mouseover="button.mouseover = true; i18n.description = button.description" @mouseout="button.mouseover = false" v-for="button in buttons" :key="button.id">
        <div v-for="m in 3" :key="m['.key']" class="circle" :class="[button.mouseover ? `${button.circle.color}-background scale box-shadow` : null]"></div>
        <img :class="{'scale': button.mouseover}" :style="{'width': button.image.width ? `${ __window.width >= 900 ? button.image.width : button.image.width / 1.5}px` : null}" :src="button.mouseover ? button.image.after : button.image.before">
      </li>
    </ul>
    <p class="under-title" v-html="i18n.description"></p>
  </div>
</template>

<script>
export default {
  name: 'demo-buttons',
  props: ['i18n', 'buttons'],
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
