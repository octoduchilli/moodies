<template>
  <div class="modif-list column align-center width">
    <basic-button class="margin-20" :button="buttons.back"/>
    <p class="text-center margin-20">Sélectionnez la liste à modifier</p>
    <ul class="filters basic-list column align-center">
      <li class="modif-filter row align-center" @mouseover="filter.mouseover = true" @mouseout="filter.mouseover = false" v-for="filter in filtersStore" :key="filter.id">
        <select v-if="filter.position" @change="setPosition(filter)" v-model="filter.position" class="filter-position">
          <option v-for="n in filtersStore.length" :value="n" :key="n + filter.id">{{n}}</option>
        </select>
        <router-link class="link" :to="`/account/my-list/modif/${filter.id}`">
          <div class="circle" :class="[{'scale': filter.mouseover && __window.width >= 700}, filter.mouseover && __window.width >= 700 ? `veil-background` : null, filter.click ? `normal-background` : null]" v-for="n in 2" :key="n['.key']"></div>
          <p v-if="filter.label" class="button-label">{{filter.label}}</p>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { db } from '@/firebase'

export default {
  data () {
    return {
      buttons: {
        back: {
          click: false,
          label: 'RETOUR'
        }
      },
      filtersStore: []
    }
  },
  mounted () {
    this.filtersStore = JSON.parse(JSON.stringify(this.__user.filters.created))
    this.setColorFilters()
  },
  computed: {
    __window () {
      return this.$store.state.window
    },
    __user () {
      return this.$store.state.user
    }
  },
  watch: {
    '__user.filters.created' () {
      this.filtersStore = JSON.parse(JSON.stringify(this.__user.filters.created))
    },
    'filtersStore' () {
      setTimeout(() => {
        this.setColorFilters()
      })
    },
    'buttons.back.click' (click) {
      if (click) {
        this.$router.go(-1)
      }

      this.buttons.back.click = false
    }
  },
  methods: {
    setColorFilters () {
      let filters = this.filtersStore

      for (let i = 0; i < filters.length; i++) {
        let filter = filters[i]
        let li = document.getElementsByClassName(`modif-filter`)[i]

        if (li) {
          li.style.setProperty('--button-color-circle-bg', `${filter.color}`)
          li.style.setProperty('--button-color-veil-bg', `${filter.color}`)
          li.style.setProperty('--button-color-normal-bg', `${filter.color}`)
        }
      }
    },
    setPosition (filter) {
      let filters = this.filtersStore
      let f = filters.find(_ => (String(_.position) === String(filter.position)) && (String(_.id) !== String(filter.id)))

      let lastPosition = null

      for (let i = 1; i <= filters.length; i++) {
        let posIsDefined = filters.find(_ => String(_.position) === String(i))

        if (!posIsDefined) {
          lastPosition = i
        }
      }

      if (f) {
        db.ref(`users/${this.__user.infos.uid}/filters/${f.id}`).update({
          position: lastPosition
        })
        db.ref(`users/${this.__user.infos.uid}/filters/${filter.id}`).update({
          position: filter.position
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'style.scss';
</style>
