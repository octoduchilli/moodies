<template>
  <div class="rated-films column align-center">
    <basic-button class="margin-20" :button="buttons.back"/>
    <h1 class="text-center">Liste de vos votes ({{__rated.list.length}})</h1>
    <p class="text-center" style="height: 17px">{{fetch || __user.fetchFilms ? 'Récupération des votes...' : null}}</p>
    <basic-dropdown class="margin-10" :dropdown="__rated.dropdowns.sort"/>
    <ul class="rated-list basic-list wrap justi-center">
      <li class="rated wrap justi-center align-center margin-10 padding-10" v-for="item in __list" :key="item.id">
        <div @click="removeRate(item)" class="delete flex align-center justi-center">
          <img src="/static/img/buttons/garbage-white.png" alt=" ">
        </div>
        <router-link class="poster link column justi-center align-center" :to="`/film/${item.id}`">
          <img class="item-image" :src="w500(item.poster_path)" onerror="this.src = '/static/img/buttons/picture-white.png'; this.style.opacity = '.2'">
          <p class="item-name text-center">{{item.title}}</p>
        </router-link>
        <div class="column">
          <router-link class="link row align-center" :to="`/film/${item.id}`">
            <basic-rate :rate="item.rate"/>
            <p class="row"><span class="text-right" style="min-width: 20px; margin-right: 5px">{{item.rate.value.mouseover / 2}}</span> / 5</p>
          </router-link>
          <p class="text-center" style="font-size: 10px; color: lightgrey; height: 10px">Changez votre note sur la fiche du film</p>
          <p style="min-width: 270px" class="text-center"><span style="color: grey; font-size: 10px; margin-right: 5px">Date du vote : </span>{{item.votedAt | moment("Do MMMM YYYY à H:mm")}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { db } from '@/firebase'
import imageMixin from '@/lib/mixins/image'

export default {
  mixins: [imageMixin],
  data () {
    return {
      buttons: {
        back: {
          click: false,
          label: 'RETOUR'
        }
      },
      fetch: false
    }
  },
  created () {
    this.$store.state.route.selected = 3

    this.fetch = true

    db.ref(`users/${this.__user.uid}/rate`).once('value', snap => {
      let list = this.__rated.list
      for (let index in snap.val()) {
        let _ = snap.val()[index]

        let f = list.find(a => String(a.id) === String(index))

        if (!f) {
          db.ref(`films/added/${index}`).once('value', snap => {
            let film = snap.val()

            if (film) {
              list.push({
                id: index,
                votedAt: _.votedAt,
                timestamp: new Date(_.votedAt).getTime(),
                poster_path: film.poster_path,
                title: film.title,
                rate: {
                  value: {
                    base: _.value,
                    mouseover: _.value
                  }
                }
              })
            }
          })
        }
      }

      this.fetch = false
    })

    db.ref(`users/${this.__user.uid}/rate`).on('child_changed', _ => {
      let key = _.key

      _ = _.val()

      let list = this.__rated.list
      let f = list.find(a => String(a.id) === String(key))

      if (f) {
        f.rate.value = {
          base: _.value,
          mouseover: _.value
        }
      }
    })
  },
  computed: {
    __user () {
      return this.$store.state.user
    },
    __rated () {
      return this.$store.state.account.rated
    },
    __window () {
      return this.$store.state.window
    },
    __list () {
      let list = JSON.parse(JSON.stringify(this.__rated.list))
      let sort = this.__rated.dropdowns.sort.items[this.__rated.dropdowns.sort.choose].value

      if (sort === 'star+') {
        list.sort((a, b) => {
          return b.rate.value.base - a.rate.value.base
        })
      } else if (sort === 'star-') {
        list.sort((a, b) => {
          return a.rate.value.base - b.rate.value.base
        })
      } else if (sort === 'date+') {
        list.sort((a, b) => {
          return b.timestamp - a.timestamp
        })
      } else if (sort === 'date-') {
        list.sort((a, b) => {
          return a.timestamp - b.timestamp
        })
      }

      return list
    }
  },
  watch: {
    'buttons.back.click' () {
      this.$router.go(-1)
    },
    '__rated.dropdowns.sort.choose' () {
      this.__rated.dropdowns.sort.click = false
    }
  },
  methods: {
    removeRate (rate) {
      let list = this.__rated.list

      db.ref(`users/${this.__user.uid}/rate/${rate.id}`).set(null)

      let index = list.findIndex(_ => String(_.id) === String(rate.id))

      list.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'style.scss';
</style>
