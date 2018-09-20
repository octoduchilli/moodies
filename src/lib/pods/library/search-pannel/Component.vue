<template>
  <div class="search-pannel column align-center">
    <h1 class="text-center">Recherches</h1>
    <div class="title-name-search column align-center">
      <p class="text-center orange margin-0">par titres et noms : </p>
      <basic-input class="margin-20" :lazy="__window.width > 800 ? false : true" :input="pannel.input"/>
    </div>
    <div class="discover-search column align-center">
      <p class="text-center plum margin-0">ou par genres et années : </p>
      <basic-dropdown class="margin-20" :dropdown="pannel.dropdowns.genre"/>
      <basic-dropdown class="margin-20" :dropdown="pannel.dropdowns.year"/>
      <basic-dropdown class="margin-20" :dropdown="pannel.dropdowns.sort"/>
      <basic-button class="margin-20" :button="buttons.discover"/>
    </div>
  </div>
</template>

<script>
import httpgetMixin from '@/lib/mixins/httpget'

export default {
  name: 'search-pannel',
  props: ['pannel'],
  mixins: [httpgetMixin],
  data () {
    return {
      buttons: {
        discover: {
          click: false,
          label: 'Rechercher'
        }
      }
    }
  },
  computed: {
    __window () {
      return this.$store.state.window
    }
  },
  watch: {
    'buttons.discover.click' (click) {
      if (click) {
        this.fetchDropdowns()
      }

      this.buttons.discover.click = false
    },
    'pannel.input.text' (text) {
      if (text) {
        this.fetchInput(text)
      }
    },
    'pannel.dropdowns.genre.choose' () {
      this.pannel.dropdowns.genre.click = false
    },
    'pannel.dropdowns.year.choose' () {
      this.pannel.dropdowns.year.click = false
    },
    'pannel.dropdowns.sort.choose' () {
      this.pannel.dropdowns.sort.click = false
    },
    'pannel.discover.page' (page) {
      if (page > 1) {
        this.fetchNextPage(page)
      }
    }
  },
  methods: {
    reset () {
      let pannel = this.pannel

      pannel.film.items = []
      pannel.person.items = []
      pannel.discover.items = []
    },
    async fetchInput (text) {
      let pannel = this.pannel

      pannel.isSearching = true

      this.reset()

      await this.httpGet(`https://api.themoviedb.org/3/search/movie?api_key=3836694fa8a7ae3ea69b5ff360b3be0b&language=fr-FR&query=${text}&page=1&include_adult=false&region=fr`).then(_ => {
        pannel.film.items = _.results
      })

      await this.httpGet(`https://api.themoviedb.org/3/search/person?api_key=3836694fa8a7ae3ea69b5ff360b3be0b&language=fr-FR&query=${text}&page=1&include_adult=false&region=fr`).then(_ => {
        pannel.person.items = _.results
      })

      pannel.isSearching = false

      if (this.__window.width < 800) {
        setTimeout(() => {
          window.scroll({
            top: document.getElementsByClassName('search-name-list')[0].offsetTop - 150,
            left: 0,
            behavior: 'smooth'
          })
        }, 100)
      }
    },
    async fetchDropdowns () {
      let pannel = this.pannel

      let genre = pannel.dropdowns.genre.items[pannel.dropdowns.genre.choose]
      let year = pannel.dropdowns.year.items[pannel.dropdowns.year.choose]
      let sort = pannel.dropdowns.sort.items[pannel.dropdowns.sort.choose]

      this.reset()

      pannel.isSearching = true

      await this.httpGet(`https://api.themoviedb.org/3/discover/movie?api_key=3836694fa8a7ae3ea69b5ff360b3be0b&language=fr-FR&sort_by=${sort.value}&primary_release_year=${year.value}${genre.value ? '&with_genres=' + genre.value : ''}&include_adult=false&include_video=false&page=1`).then(_ => {
        pannel.discover = {
          page: 1,
          totalPages: _.total_pages,
          totalResults: _.total_results,
          items: _.results
        }
      })

      if (this.__window.width < 800) {
        setTimeout(() => {
          window.scroll({
            top: document.getElementsByClassName('discover-film-list')[0].offsetTop - 150,
            left: 0,
            behavior: 'smooth'
          })
        }, 100)
      }

      pannel.isSearching = false
    },
    fetchNextPage (page) {
      let pannel = this.pannel

      let genre = pannel.dropdowns.genre.items[pannel.dropdowns.genre.choose]
      let year = pannel.dropdowns.year.items[pannel.dropdowns.year.choose]
      let sort = pannel.dropdowns.sort.items[pannel.dropdowns.sort.choose]

      this.httpGet(`https://api.themoviedb.org/3/discover/movie?api_key=3836694fa8a7ae3ea69b5ff360b3be0b&language=fr-FR&sort_by=${sort.value}&primary_release_year=${year.value}${genre.value ? '&with_genres=' + genre.value : ''}&include_adult=false&include_video=false&page=${page}`).then(_ => {
        _.results.forEach(film => {
          pannel.discover.items.push(film)
        })

        pannel.discover.isSearching = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.search-pannel {
  min-width: 300px;
  max-width: 300px;
  min-height: calc(100vh - 150px - 60px);

  background: var(--black30);

  .title-name-search, .discover-search {
    padding: 10px;
    margin: 10px;

    border-radius: 5px;
  }

  .discover-search {
    background: rgba($color: plum, $alpha: .2);
  }

  .title-name-search {
    background: rgba($color: orange, $alpha: .2);
  }

  .orange {
    color: orange;
    font-style: italic;
  }

  .plum {
    color: plum;
    font-style: italic;
  }
}

@media (max-width: 800px) {
  .search-pannel {
    max-width: none;
    width: 100%;
    min-height: 0;
  }
}
</style>
