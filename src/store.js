import Vue from 'vue'
import Vuex from 'vuex'
import genresData from '@/lib/data/genres'
import yearsData from '@/lib/data/years'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    window: {
      width: null,
      height: null,
      scrollY: null
    },
    body: {
      width: null,
      height: null
    },
    route: {
      selected: 0
    },
    library: {
      index: true,
      search: {
        isSearching: false,
        person: {
          items: []
        },
        film: {
          items: []
        },
        name: {
          view: {
            type: 'title'
          }
        },
        discover: {
          page: 1,
          totalPages: null,
          totalResults: null,
          items: []
        },
        dropdowns: {
          year: {
            id: 1,
            click: false,
            choose: 0,
            label: 'Année',
            items: yearsData.years()
          },
          genre: {
            id: 2,
            click: false,
            choose: 0,
            label: 'Genres',
            items: genresData
          },
          sort: {
            id: 3,
            click: false,
            choose: 0,
            label: 'Trier',
            items: [
              {
                id: 0,
                name: 'Popularité ↗',
                value: 'popularity.desc'
              },
              {
                id: 1,
                name: 'Popularité ↘',
                value: 'popularity.asc'
              },
              {
                id: 2,
                name: 'Note ↗',
                value: 'vote_count.desc'
              },
              {
                id: 3,
                name: 'Note ↘',
                value: 'vote_count.asc'
              },
              {
                id: 4,
                name: 'Date ↗',
                value: 'primary_release_date.desc'
              },
              {
                id: 5,
                name: 'Date ↘',
                value: 'primary_release_date.asc'
              }
            ]
          }
        },
        input: {
          text: '',
          placeholder: 'Un film ? Une personnalité ?',
          type: 'text'
        }
      },
      history: {
        items: []
      }
    },
    community: {
      user: {
        uid: null,
        pseudo: null,
        films: {
          actived: [],
          current: [],
          all: []
        },
        buttons: [],
        view: {
          type: 'poster',
          page: 1,
          compareList: {
            viewed: {
              on: false,
              label: 'compare-list-viewed'
            },
            notViewed: {
              on: false,
              label: 'compare-list-not-viewed'
            }
          }
        },
        filters: {
          actived: [],
          click: [],
          created: [],
          name: {
            text: '',
            placeholder: 'Titre',
            type: 'text'
          },
          genre: {
            id: 1,
            click: false,
            choose: 0,
            label: 'Genres',
            items: genresData
          },
          sort: {
            id: 2,
            click: false,
            choose: 0,
            label: 'Trier',
            items: [
              {
                id: 0,
                name: 'Popularité ↗',
                value: 'popularity+'
              },
              {
                id: 1,
                name: 'Popularité ↘',
                value: 'popularity-'
              },
              {
                id: 2,
                name: 'Date ↗',
                value: 'date+'
              },
              {
                id: 3,
                name: 'Date ↘',
                value: 'date-'
              },
              {
                id: 4,
                name: 'A à Z',
                value: 'az'
              },
              {
                id: 5,
                name: 'Z à A',
                value: 'za'
              }
            ]
          }
        }
      },
      users: {
        list: [],
        page: 1,
        inputs: {
          pseudo: {
            text: '',
            placeholder: 'Pseudo',
            type: 'text'
          }
        },
        dropdowns: {
          sort: {
            id: 1,
            click: false,
            choose: 0,
            label: 'Trier',
            items: [
              {
                id: 0,
                name: 'De A à Z',
                value: 'pseudoLower'
              },
              {
                id: 1,
                name: 'De Z à A',
                value: 'pseudoInverseLower'
              },
              {
                id: 2,
                name: 'Activité ↘',
                value: 'activity'
              },
              {
                id: 3,
                name: 'Activité ↗',
                value: 'inverseActivity'
              },
              {
                id: 4,
                name: 'Films ↘',
                value: 'films'
              },
              {
                id: 5,
                name: 'Films ↗',
                value: 'inverseFilms'
              },
              {
                id: 6,
                name: 'Filtres ↘',
                value: 'filters'
              },
              {
                id: 7,
                name: 'Filtres ↗',
                value: 'inverseFilters'
              }
            ]
          }
        }
      }
    },
    account: {
      rated: {
        list: [],
        dropdowns: {
          sort: {
            id: 1,
            click: false,
            choose: 0,
            label: 'Trier',
            items: [
              {
                id: 0,
                name: 'Étoiles ↗',
                value: 'star+'
              },
              {
                id: 1,
                name: 'Étoiles ↘',
                value: 'star-'
              },
              {
                id: 2,
                name: 'Date ↗',
                value: 'date+'
              },
              {
                id: 3,
                name: 'Date ↘',
                value: 'date-'
              }
            ]
          }
        }
      }
    },
    user: {
      uid: null,
      email: null,
      emailVerified: false,
      firstname: null,
      lastname: null,
      pseudo: null,
      guestTmdb: null,
      tryConnect: false,
      fetchFilms: false,
      fetchFilmsNum: 0,
      films: {
        actived: [],
        current: [],
        all: []
      },
      buttons: [],
      view: {
        type: 'poster',
        page: 1
      },
      filters: {
        actived: [],
        click: [],
        created: [],
        name: {
          text: '',
          placeholder: 'Titre',
          type: 'text'
        },
        genre: {
          id: 1,
          click: false,
          choose: 0,
          label: 'Genres',
          items: genresData
        },
        sort: {
          id: 2,
          click: false,
          choose: 0,
          label: 'Trier',
          items: [
            {
              id: 0,
              name: 'Popularité ↗',
              value: 'popularity+'
            },
            {
              id: 1,
              name: 'Popularité ↘',
              value: 'popularity-'
            },
            {
              id: 2,
              name: 'Date ↗',
              value: 'date+'
            },
            {
              id: 3,
              name: 'Date ↘',
              value: 'date-'
            },
            {
              id: 4,
              name: 'A à Z',
              value: 'az'
            },
            {
              id: 5,
              name: 'Z à A',
              value: 'za'
            }
          ]
        }
      },
      personalized: []
    }
  },
  mutations: {
    user (state, payload) {
      state.user.uid = payload.uid
      state.user.email = payload.email
      state.user.firstname = payload.firstname
      state.user.lastname = payload.lastname
      state.user.pseudo = payload.pseudo
      state.user.guestTmdb = payload.guestTmdb
    },
    fullResetUser (state) {
      state.user = {
        uid: null,
        email: null,
        emailVerified: false,
        firstname: null,
        lastname: null,
        pseudo: null,
        guestTmdb: null,
        tryConnect: false,
        fetchFilms: false,
        fetchFilmsNum: 0,
        films: {
          actived: [],
          current: [],
          all: []
        },
        buttons: [],
        view: {
          type: 'poster',
          page: 1
        },
        filters: {
          actived: [],
          click: [],
          created: [],
          name: {
            text: '',
            placeholder: 'Titre',
            type: 'text'
          },
          genre: {
            id: 1,
            click: false,
            choose: 0,
            label: 'Genres',
            items: genresData
          },
          sort: {
            id: 2,
            click: false,
            choose: 0,
            label: 'Trier',
            items: [
              {
                id: 0,
                name: 'Popularité ↘',
                value: 'popularity+'
              },
              {
                id: 1,
                name: 'Popularité ↗',
                value: 'popularity-'
              },
              {
                id: 2,
                name: 'Date ↘',
                value: 'date+'
              },
              {
                id: 3,
                name: 'Date ↗',
                value: 'date-'
              },
              {
                id: 4,
                name: 'A à Z',
                value: 'az'
              },
              {
                id: 5,
                name: 'Z à A',
                value: 'za'
              }
            ]
          }
        },
        personalized: []
      }
    }
  }
})
