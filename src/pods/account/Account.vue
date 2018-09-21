<template>
  <div class="account">
    <header class="flex text-center justi-center align-center account-header">
      <p v-if="!__user.fetchFilms" class="margin-0 padding-10">
        {{`${minToMDHM(__totalRuntime)} - ${__user.films.actived.length} films`}}
      </p>
      <p v-else class="margin-0 padding-10">Récupération des films en cours...</p>
    </header>
    <router-view v-if="__user.uid"/>
    <h1 class="wait text-center width" v-else>Un instant...</h1>
  </div>
</template>

<script>
import dateMixin from '@/lib/mixins/date'

export default {
  mixins: [dateMixin],
  mounted () {
    this.$store.state.route.selected = 3
    if (!this.__user.uid && !this.__user.tryConnect) {
      this.$router.push('/profile/sign-in')
    } else if (this.__user.uid) {
      this.setCurrentFilmList()
      this.initListWithActivedFilters()
      if (this.__user.filters.actived.length === 0) {
        this.initActivedFilters()
      }
    }
  },
  computed: {
    __user () {
      return this.$store.state.user
    },
    __totalRuntime () {
      let current = this.__user.films.actived
      let all = this.__user.films.all
      let final = 0

      current.forEach(_ => {
        let find = all.find(f => String(f.id) === String(_.id))

        if (find) {
          final += find.runtime || 100
        }
      })

      return final
    }
  },
  watch: {
    '__user.tryConnect' (val) {
      if (!val && !this.__user.uid) {
        this.$router.push('/profile/sign-in')
      }
    },
    '__user.films.all' (all) {
      this.setCurrentFilmList()

      if (all.length === this.__user.buttons.length) {
        this.initListWithActivedFilters()
      }
    },
    '__user.filters.click' () {
      this.initActivedFilters()
      this.setCurrentFilmList()
      this.initListWithActivedFilters()
    },
    '__user.filters.name.text' () {
      this.setCurrentFilmList()
      this.initListWithActivedFilters()
    },
    '__user.filters.sort.choose' () {
      this.setCurrentFilmList()
      this.initListWithActivedFilters()
    },
    '__user.filters.genre.choose' () {
      this.setCurrentFilmList()
      this.initListWithActivedFilters()
    },
    '__user.filters.actived': {
      handler () {
        this.initListWithActivedFilters()
      },
      deep: true
    }
  },
  methods: {
    setCurrentFilmList () {
      let finded = []
      let final = []
      let user = this.__user
      let name = this.__user.filters.name.text
      let sort = this.__user.filters.sort
      let genre = this.__user.filters.genre.items[this.__user.filters.genre.choose].value

      user.filters.click.forEach(filter => {
        user.buttons.forEach(film => {
          let clicked = film.buttons.find(_ => String(_.id) === String(filter.id))

          if (clicked) {
            let isAlreadyPushed = finded.find(_ => String(_.id) === String(film.id))

            if (!isAlreadyPushed) {
              let _ = user.films.all.find(_ => String(_.id) === String(film.id))

              if (_) {
                this.$set(_, 'from', filter.id)
                finded.push(_)
              }
            }
          }
        })
      })

      if (finded.length === 0 && user.filters.click.length === 0) {
        user.films.all.forEach(_ => {
          finded.push(_)
        })
      }

      if (name) {
        let save = finded

        finded = []

        save.forEach(_ => {
          let find = _.title.toLowerCase().indexOf(name.toLowerCase())

          if (find !== -1) {
            finded.push(_)
          }
        })
      }

      if (sort.choose === 0) {
        finded.sort((a, b) => {
          if (a.popularity && b.popularity) {
            return Number(b.popularity) - Number(a.popularity)
          }
        })
      } else if (sort.choose === 1) {
        finded.sort((a, b) => {
          if (a.popularity && b.popularity) {
            return Number(a.popularity) - Number(b.popularity)
          }
        })
      } else if (sort.choose === 2) {
        finded.sort((a, b) => {
          if (a.release_date && b.release_date) {
            return ('' + b.release_date).localeCompare(a.release_date)
          }
        })
      } else if (sort.choose === 3) {
        finded.sort((a, b) => {
          if (a.release_date && b.release_date) {
            return ('' + a.release_date).localeCompare(b.release_date)
          }
        })
      } else if (sort.choose === 4) {
        finded.sort((a, b) => {
          if (a.title && b.title) {
            return ('' + a.title).localeCompare(b.title)
          }
        })
      } else if (sort.choose === 5) {
        finded.sort((a, b) => {
          if (a.title && b.title) {
            return ('' + b.title).localeCompare(a.title)
          }
        })
      }

      if (genre) {
        let save = finded

        finded = []

        save.forEach(_ => {
          if (_.genres) {
            let g = _.genres.find(x => String(x.id) === String(genre))

            if (g) {
              finded.push(_)
            }
          }
        })
      }

      finded.forEach(_ => {
        final.push({
          id: _.id,
          name: _.title,
          url: _.poster_path,
          path: `/film/${_.id}`,
          from: _.from
        })
      })

      user.films.current = final
    },
    initActivedFilters () {
      let final = []
      let filters = this.__user.filters
      let choice = {
        choose: 1,
        content: [
          {
            id: 1,
            name: 'TOUS'
          },
          {
            id: 2,
            name: 'VUS'
          },
          {
            id: 3,
            name: 'NON VUS'
          }
        ]
      }

      filters.click.forEach(click => {
        if (click.id === 1) {
          final.push({
            id: 1,
            name: 'Films visionnés',
            color: '#8ddd6d',
            mouseover: false,
            choice: JSON.parse(JSON.stringify(choice))
          })
        } else if (click.id === 2) {
          final.push({
            id: 2,
            name: 'Films favoris',
            color: '#ffff00',
            mouseover: false,
            choice: JSON.parse(JSON.stringify(choice))
          })
        } else {
          let find = filters.created.find(_ => String(click.id) === String(_.id))

          if (find) {
            final.push({
              id: find.id,
              name: find.name,
              color: find.color,
              mouseover: false,
              choice: JSON.parse(JSON.stringify(choice))
            })
          }
        }
      })

      this.$store.state.user.filters.actived = final
    },
    initListWithActivedFilters () {
      let final = []
      let activedFilters = this.__user.filters.actived
      let films = this.__user.films.current
      let buttons = this.__user.buttons

      activedFilters.forEach(activedFilter => {
        films.forEach(film => {
          if (String(film.from) === String(activedFilter.id)) {
            let choosedFilter = activedFilter.choice.choose
            let filmButton = buttons.find(_ => String(_.id) === String(film.id))

            if (choosedFilter === 1) {
              final.push(film)
            } else if (choosedFilter === 2) {
              let vue = filmButton.buttons.find(_ => String(_.id) === String(1))

              if (vue) {
                final.push(film)
              }
            } else if (choosedFilter === 3) {
              let vue = filmButton.buttons.find(_ => String(_.id) === String(1))

              if (!vue) {
                final.push(film)
              }
            }
          }
        })
      })

      if (activedFilters.length === 0) {
        this.$store.state.user.films.actived = films
      } else {
        this.$store.state.user.films.actived = final
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'style.scss';
</style>
