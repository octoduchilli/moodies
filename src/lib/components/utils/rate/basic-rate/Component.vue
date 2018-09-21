<template>
  <div class="basic-rate">
    <ul class="stars basic-list row">
      <li class="black-star" v-for="n in 5" :key="n + '-black'">
        <img src="/static/img/buttons/star-black.png" alt=" ">
      </li>
    </ul>
    <ul @mouseout="rate.value.mouseover = rate.value.base" class="stars basic-list row">
      <li @mouseover="rate.value.mouseover = n" @click="rate.value.base = n; rate.click = true" :style="{'opacity': rate.value.mouseover < n ? '0' : '1'}" class="yellow-star" :class="[n % 2 === 0 ? 'right-part' : 'left-part']" v-for="n in 10" :key="n + '-yellow'">
        <img src="/static/img/buttons/star-yellow.png" alt=" ">
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ['rate'],
  name: 'basic-rate',
  watch: {
    'rate.click' (val) {
      this.rate.click = val
    }
  }
}
</script>

<style lang="scss" scoped>
  @import 'style.scss';
</style>
