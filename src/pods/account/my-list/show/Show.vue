<template>
  <div class="show-list column align-center width">
    <nav class="nav-top-show-list row justi-center align-center">
      <ul class="buttons-list basic-list row align-center">
        <li :style="{'border-radius': __user.view.type === 'poster' || __user.view.type === 'poster-buttons' ? '5px' : null}" class="button" @click="__user.view.type = 'poster'">
          <img class="button-logo" src="/static/img/buttons/picture-2-white.png">
        </li>
        <li :style="{'border-radius': __user.view.type === 'title' ? '5px' : null}" class="button" @click="__user.view.type = 'title'; buttons.showButtons.on = false">
          <img class="button-logo" src="/static/img/buttons/list-with-dots-white.png">
        </li>
      </ul>
    </nav>
    <div v-if="__user.view.type === 'poster' || __user.view.type === 'poster-buttons'" class="wrap align-center justi-cente pad-left">
      <p class="margin-10">Afficher les boutons : </p>
      <basic-on-off-button class="margin-10" :button="buttons.showButtons"/>
    </div>
    <ul class="actived-filters-list basic-list justi-center" :class="[__window.width > 500 ? 'wrap' : 'column align-center']">
      <p class="text-center flex justi-center align-center" v-if="__activedFilters.length > 0">Liste triée selon :</p>
      <li @mouseover="actived.mouseover = true" @mouseout="actived.mouseover = false" @click="actived.choice.choose + 1 === 4 ? actived.choice.choose = 1 : actived.choice.choose++" :style="{'background': actived.mouseover ? actived.color : null}" class="actived-filter" v-for="actived in __activedFilters" :key="actived.id">
        <p class="actived-filter-name unselectable" :style="{'color': actived.mouseover ? actived.color : null}">{{actived.name}} - {{actived.choice.content[actived.choice.choose - 1].name}}</p>
      </li>
    </ul>
    <basic-link-image-list-wrap class="pad-left" v-if="__user.view.type === 'poster'" :list="__list"/>
    <list-wrap-with-buttons class="pad-left" v-if="__user.view.type === 'poster-buttons'" :list="__list"/>
    <basic-link-name-list class="pad-left" v-if="__user.view.type === 'title'" :list="__list"/>
    <basic-button class="margin-20" v-if="__list.length !== __user.films.actived.length" :button="buttons.nextPage"/>
  </div>
</template>

<script>
export default {
  data () {
    return {
      buttons: {
        nextPage: {
          click: false,
          label: 'Page suivante'
        },
        showButtons: {
          on: false,
          label: 'show-button'
        }
      },
      nextPage: false
    }
  },
  created () {
    if (this.__user.view.type === 'poster-buttons') {
      this.buttons.showButtons.on = true
    }
  },
  computed: {
    __window () {
      return this.$store.state.window
    },
    __body () {
      return this.$store.state.body
    },
    __user () {
      return this.$store.state.user
    },
    __list () {
      return this.__user.films.actived.slice(0, this.__window.width > 500 ? (30 * this.$store.state.user.view.page) : (10 * this.$store.state.user.view.page))
    },
    __activedFilters () {
      return this.__user.filters.actived
    }
  },
  watch: {
    '__window.scrollY' () {
      let window = this.__window
      let body = this.__body

      if ((window.scrollY + window.height * 2) > body.height) {
        this.nextPage = true
      }
    },
    'nextPage' (val) {
      if (val) {
        this.$store.state.user.view.page++
      }
    },
    '__list' () {
      setTimeout(() => {
        this.nextPage = false
      })
    },
    '__user.filters.click' () {
      this.$store.state.user.view.page = 1
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'auto'
      })
    },
    '__user.view.type' () {
      this.$store.state.user.view.page = 1
    },
    'buttons.nextPage.click' (click) {
      if (click) {
        this.nextPage = true
      }

      this.buttons.nextPage.click = false
    },
    'buttons.showButtons.on' (on) {
      if (on) {
        this.__user.view.type = 'poster-buttons'
      } else if (this.__user.view.type === 'poster-buttons') {
        this.__user.view.type = 'poster'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'style.scss';
</style>
