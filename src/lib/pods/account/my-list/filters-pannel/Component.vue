<template>
  <div class="filters-pannel" :class="[__window.width > 500 ? 'row' : 'column']">
    <div class="filters-content align-center" :class="[__window.width < 500 ? 'row' : 'column']">
      <h1 class="text-center" v-if="__window.width > 500">Filtres</h1>
      <basic-switch-button class="margin-10" style="min-width: 90px; width: 90px; min-height: 40px" :button="buttons.moreFilters"/>
      <ul class="filters basic-list column align-center scrollbar">
        <li class="filter" :class="{'scale': filter.click}" @click="filter.click ? filter.click = false : filter.click = true; saveFilters()" @mouseover="filter.mouseover = true" @mouseout="filter.mouseover = false" v-for="filter in __filters" :key="filter.id">
          <div class="circle" :class="[{'scale': filter.mouseover && __window.width >= 700}, filter.mouseover && __window.width >= 700 ? `veil-background` : null, filter.click ? `normal-background` : null]" v-for="n in 2" :key="n['.key']"></div>
          <img v-if="filter.link" class="button-img" :src="`/static/img/buttons/${filter.link}-black.png`">
          <p v-if="filter.label" class="button-label">{{filter.label}}</p>
        </li>
      </ul>
    </div>
    <div v-if="buttons.moreFilters.click" class="more-filters scrollbar">
      <div class="flex justi-center align-center">
        <basic-input class="margin-20" style="min-width: 150px" :input="__user.filters.name"/>
      </div>
      <basic-dropdown style="width: 230px; margin: auto; padding: 5px 0;" :dropdown="__user.filters.genre"/>
      <basic-dropdown style="width: 230px; margin: auto; padding: 5px 0;" :dropdown="__user.filters.sort"/>
      <div class="flex justi-center align-center">
        <basic-button style="min-height: 40px; margin: 20px auto" :button="buttons.moreFiltersReset"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'filters-pannel',
  data () {
    return {
      filters: {
        view: {
          id: 1,
          mouseover: false,
          click: false,
          link: 'visibility-button',
          color: '#8ddd6d'
        },
        favorite: {
          id: 2,
          mouseover: false,
          click: false,
          link: 'star',
          color: 'yellow'
        },
        personalize: {
          mouseover: false,
          click: false,
          link: 'add',
          color: 'white'
        }
      },
      buttons: {
        moreFilters: {
          click: false,
          label: 'plus'
        },
        moreFiltersReset: {
          click: false,
          label: 'Réinitialiser'
        }
      },
      filtersStore: []
    }
  },
  mounted () {
    this.filtersStore = JSON.parse(JSON.stringify(this.__user.filters.created))

    setTimeout(() => {
      this.setColorFilters()
      this.setClickFilters()
    })
  },
  computed: {
    __window () {
      return this.$store.state.window
    },
    __user () {
      return this.$store.state.user
    },
    __filters () {
      let final = []
      let filters = this.filters
      let filtersStore = this.filtersStore

      for (let index in filters) {
        let filter = filters[index]

        final.push(filter)
      }

      filtersStore.forEach(_ => {
        final.splice(final.length - 1, 0, _)
      })

      return final
    }
  },
  watch: {
    '__user.filters.created' () {
      this.filtersStore = JSON.parse(JSON.stringify(this.__user.filters.created))
    },
    'buttons.moreFilters.click' (click) {
      if (click) {
        this.buttons.moreFilters.label = 'moins'
      } else {
        this.buttons.moreFilters.label = 'plus'
      }
    },
    'buttons.moreFiltersReset.click' (click) {
      if (click) {
        this.resetMoreFilters()
      }

      this.buttons.moreFiltersReset.click = false
    },
    '__filters' () {
      setTimeout(() => {
        this.setColorFilters()
      })
    },
    'filters.personalize.click' (click) {
      if (click) {
        this.$router.push('/account/my-list/create')
      }

      this.filters.personalize.click = false
    },
    '__user.filters.sort.choose' () {
      this.__user.filters.sort.click = false
    },
    '__user.filters.genre.choose' () {
      this.__user.filters.genre.click = false
    }
  },
  methods: {
    setColorFilters () {
      let filters = this.__filters

      for (let i = 0; i < filters.length; i++) {
        let filter = filters[i]
        let li = document.getElementsByClassName(`filter`)[i]

        if (li) {
          li.style.setProperty('--button-color-circle-bg', `${filter.color}`)
          li.style.setProperty('--button-color-veil-bg', `${filter.color}`)
          li.style.setProperty('--button-color-normal-bg', `${filter.color}`)
        }
      }
    },
    setClickFilters () {
      let filters = this.__filters
      let filtersClick = this.__user.filters.click

      filtersClick.forEach(filter => {
        let f = filters.find(_ => String(_.id) === String(filter.id))

        if (f) {
          filters.find(_ => String(_.id) === String(filter.id)).click = true
        }
      })
    },
    saveFilters () {
      let filters = this.__filters
      let final = []

      filters.forEach(filter => {
        if (filter.id && filter.click) {
          final.push({
            id: filter.id
          })
        }
      })

      this.__user.filters.click = final
    },
    resetMoreFilters () {
      let filters = this.__user.filters

      filters.sort.choose = 0
      filters.genre.choose = 0
      filters.name.text = ''
    }
  }
}
</script>

<style lang="scss" scoped>
  @import 'style.scss';
</style>
