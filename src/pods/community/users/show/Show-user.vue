<template>
  <div class="show-user column align-center width">
    <header class="show-user-header flex text-center justi-center align-center">
      <p class="margin-0 padding-10">
        {{`${minToMDHM(__totalRuntime)} - ${__user.films.actived.length} films`}}
      </p>
    </header>
    <filters-pannel/>
    <h1 class="pad-left text-center">{{privateAccount ? 'Compte privé' : fetch ? 'Un instant...' : __user.pseudo ? `Profil de ${__user.pseudo}` : null}}</h1>
    <nav class="nav-top-show-user row justi-center align-center">
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
import filtersPannel from '@/lib/pods/users/show/filters-pannel/Component'

import { db } from '@/firebase'

import dateMixin from '@/lib/mixins/date'

export default {
  mixins: [dateMixin],
  components: {
    filtersPannel
  },
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
      nextPage: false,
      fetch: false,
      privateAccount: null
    }
  },
  async created () {
    this.$store.state.route.selected = 4
    let pseudoLower = this.$route.params.id
    let uid = null
    let privateAccount = null
    if (this.__user.view.type === 'poster-buttons') {
      this.buttons.showButtons.on = true
    }

    await db.ref('community/users').orderByChild('pseudoLower').equalTo(pseudoLower).once('value', snap => {
      snap.forEach(_ => {
        uid = _.val().id
        this.__user.pseudo = _.val().pseudoBase
        this.privateAccount = _.val().privateAccount
        privateAccount = _.val().privateAccount
      })
    })

    if (uid && !privateAccount) {
      this.fetch = true

      await db.ref(`users/${uid}/filters`).once('value', filters => {
        let final = []

        filters = filters.val()

        for (let index in filters) {
          let a = filters[index]

          a.click = false
          a.mouseover = false
          final.push(a)
        }

        final.sort((a, b) => {
          return a.position - b.position
        })

        this.$store.state.community.user.filters.created = final
      })

      let idFilms = []

      await db.ref(`users/${uid}/films`).once('value', films => {
        films = films.val()

        for (let index in films) {
          let attr = films[index]
          idFilms.push({
            id: index,
            buttons: attr
          })
        }

        if (idFilms.length !== this.$store.state.community.user.buttons.length) {
          this.$store.state.community.user.films = {
            all: [],
            current: [],
            actived: []
          }
          this.$store.state.community.user.view.page = 1
        }

        this.$store.state.community.user.buttons = idFilms
      })

      let fetchSomething = false

      if (idFilms.length === 0) {
        this.fetch = false
      }

      for (let index in idFilms) {
        let _ = idFilms[index]
        let film = this.$store.state.community.user.films.all.find(film => String(film.id) === String(_.id))

        if (!film) {
          db.ref(`films/added/${_.id}`).once('value', film => {
            fetchSomething = true
            if (film.val()) {
              this.$store.state.community.user.films.all.push(film.val())
            }

            if (this.$store.state.community.user.films.all.length > idFilms.length - 10) {
              this.fetch = false
            }
          })
        }

        if (fetchSomething === false && this.$store.state.community.user.films.all.length > idFilms.length - 10) {
          this.fetch = false
        }
      }

      setTimeout(() => {
        this.setCurrentFilmList()
        this.initListWithActivedFilters()

        if (this.__user.filters.actived.length === 0) {
          this.initActivedFilters()
        }
      }, 300)
    } else {
      this.$store.state.community.user.films = {
        all: [],
        current: [],
        actived: []
      }
      this.$store.state.community.user.filters.created = []
    }
  },
  destroyed () {
    this.__user.pseudo = null
  },
  computed: {
    __window () {
      return this.$store.state.window
    },
    __body () {
      return this.$store.state.body
    },
    __user () {
      return this.$store.state.community.user
    },
    __list () {
      return this.__user.films.actived.slice(0, this.__window.width > 500 ? (30 * this.$store.state.community.user.view.page) : (10 * this.$store.state.community.user.view.page))
    },
    __activedFilters () {
      return this.__user.filters.actived
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
    '__window.scrollY' () {
      let window = this.__window
      let body = this.__body

      if ((window.scrollY + window.height * 2) > body.height) {
        this.nextPage = true
      }
    },
    'nextPage' (val) {
      if (val) {
        this.$store.state.community.user.view.page++
      }
    },
    '__list' () {
      setTimeout(() => {
        this.nextPage = false
      })
    },
    '__user.view.type' () {
      this.$store.state.community.user.view.page = 1
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
    },
    '__user.films.all' (all) {
      this.setCurrentFilmList()

      if (all.length === this.__user.buttons.length) {
        this.initListWithActivedFilters()
      }
    },
    '__user.filters.click' () {
      this.$store.state.community.user.view.page = 1
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'auto'
      })
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

      this.$store.state.community.user.filters.actived = final
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
        this.$store.state.community.user.films.actived = films
      } else {
        this.$store.state.community.user.films.actived = final
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'style.scss';
</style>
