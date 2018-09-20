<template>
  <input v-if="!lazy" class="basic-input" :type="input.type" v-model="input.text" :placeholder="input.placeholder">
  <input v-else class="basic-input" :type="input.type" v-model.lazy="input.text" :placeholder="input.placeholder">
</template>

<script>
export default {
  props: ['input', 'lazy']
}
</script>

<style lang="scss" scoped>
  @import 'style.scss';
</style>
