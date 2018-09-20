<template>
  <div @click="button.on ? button.on = false : button.on = true" class="basic-on-off-button flex pointer" :style="{'background': button.on ? 'lightgreen' : 'red'}">
    <div class="switch flex justi-center align-center" :style="{'transform' : `scale(1.15) translateX(${button.on ? '35' : '0'}px)`}">
      <img class="switch-logo unselectable" :class="[`${button.label}-switch-logo`]" :src="`/static/img/buttons/${button.on ? 'checked-green' : 'cancel-red'}.png`">
    </div>
  </div>
</template>

<script>
export default {
  props: ['button'],
  watch: {
    'button.on' (on) {
      let doc = document.getElementsByClassName(`${this.button.label}-switch-logo`)[0]

      if (on) {
        doc.classList.add('switch-anim-rotate-left')

        setTimeout(() => {
          doc.classList.remove('switch-anim-rotate-left')
        }, 500)
      } else {
        doc.classList.add('switch-anim-rotate-right')

        setTimeout(() => {
          doc.classList.remove('switch-anim-rotate-right')
        }, 500)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import 'style.scss';
</style>
