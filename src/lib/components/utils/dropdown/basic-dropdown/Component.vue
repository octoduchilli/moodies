<template>
  <div class="basic-dropdown">
    <div @click="dropdown.click ? dropdown.click = false : dropdown.click = true" class="label row align-center">
      <img class="label-image" src="/static/img/buttons/down-chevron-white.png" :style="{'transform': `rotate(${dropdown.click ? 0 : 90}deg)`}">
      <p class="label-name row align-center animated fadeIn"><span>{{dropdown.label}} - </span> {{dropdown.items[dropdown.choose].name}}</p>
    </div>
    <ul v-if="dropdown.click" class="items basic-list animated fadeIn scrollbar">
      <li @click="dropdown.choose = item.id" class="item" v-for="item in dropdown.items" :key="item.id">
        {{item.name}}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['dropdown']
}
</script>

<style lang="scss" scoped>
  @import 'style.scss';
</style>
