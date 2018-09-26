<template>
  <div class="users column align-center width">
    <div class="search wrap justi-center">
      <div class="pseudo-search margin-10 padding-10 column align-center">
        <basic-input maxlength="12" style="height: 30px" class="margin-10" :input="__users.inputs.pseudo"/>
        <basic-button class="margin-10" :button="buttons.search.pseudo"/>
      </div>
      <div class="discover-search margin-10 padding-10 column align-center">
        <basic-dropdown class="margin-10 pointer" :dropdown="__users.dropdowns.sort"/>
        <basic-button class="margin-10" :button="buttons.search.discover"/>
      </div>
    </div>
    <ul class="user-list basic-list wrap align-center justi-center width">
      <router-link :to="`/users/${user.pseudoLower.toLowerCase()}`" class="user link row justi-around align-center" v-for="user in __users.list" :key="user.pseudoLower">
        <div class="div-pseudo">
          <div class="pseudo flex justi-center align-center">
            {{user.pseudoBase}}
          </div>
          <div class="pseudo-bg"></div>
        </div>
        <div class="column">
          <div class="row justi-center">
            <p class="margin-10">{{user.films}} <span style="color: grey">films</span></p>
            <p class="margin-10">{{user.filters}} <span style="color: grey">filtres</span></p>
          </div>
          <p v-if="user.privateAccount" class="text-center" style="color: red">Profil privé</p>
        </div>
      </router-link>
    </ul>
    <p class="text-center" v-if="noPseudoResult">Aucun utilisateur à pour pseudo {{__users.inputs.pseudo.text}}</p>
    <basic-button :style="{'opacity': allUsers ? '.3' : null}" class="margin" :button="buttons.nextPage"/>
  </div>
</template>

<script>
import { db } from '@/firebase'

export default {
  data () {
    return {
      buttons: {
        nextPage: {
          click: false,
          label: 'Page suivante'
        },
        search: {
          pseudo: {
            click: false,
            label: 'Rechercher'
          },
          discover: {
            click: false,
            label: 'Découvrir'
          }
        }
      },
      nextPage: false,
      allUsers: false,
      noPseudoResult: false
    }
  },
  created () {
    this.fetchDropdownsUsers()
  },
  destroyed () {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'auto'
    })
  },
  computed: {
    __window () {
      return this.$store.state.window
    },
    __body () {
      return this.$store.state.body
    },
    __users () {
      return this.$store.state.community.users
    }
  },
  watch: {
    'nextPage' (val) {
      if (val) {
        this.$store.state.community.users.page++
        setTimeout(() => {
          let text = this.__users.inputs.pseudo.text

          if (text) {
            this.fetchPseudoUsers(text)
          } else {
            this.fetchDropdownsUsers()
          }
        })
      }
    },
    '__users.list' () {
      setTimeout(() => {
        this.nextPage = false
      })
    },
    'buttons.nextPage.click' (click) {
      if (click) {
        this.nextPage = true
      }

      this.buttons.nextPage.click = false
    },
    'buttons.search.discover.click' (click) {
      if (click) {
        this.__users.dropdowns.sort.click = false
        this.__users.page = 1
        this.__users.list = []
        this.__users.inputs.pseudo.text = ''

        setTimeout(() => {
          this.fetchDropdownsUsers(true)
        })
      }

      this.buttons.search.discover.click = false
    },
    'buttons.search.pseudo.click' (click) {
      let text = this.__users.inputs.pseudo.text

      if (click && text) {
        this.__users.dropdowns.sort.click = false
        this.__users.page = 1
        this.__users.list = []

        setTimeout(() => {
          this.fetchPseudoUsers(text, true)
        })
      }

      this.buttons.search.pseudo.click = false
    },
    '__users.dropdowns.sort.choose' () {
      this.__users.dropdowns.sort.click = false
    },
    '__users.inputs.pseudo.text' (text) {
      this.allUsers = true
      this.noPseudoResult = false
    }
  },
  methods: {
    async fetchDropdownsUsers (click) {
      this.allUsers = false
      let page = this.__users.page
      let filter = this.__users.dropdowns.sort.items[this.__users.dropdowns.sort.choose].value

      await db.ref('community/users').orderByChild(filter).limitToFirst(50 * page).once('value', snap => {
        if (snap.numChildren() !== 50 * page) {
          this.allUsers = true
        }

        snap.forEach(user => {
          user = user.val()
          let find = this.$store.state.community.users.list.find(_ => String(user.id) === String(_.id))

          if (!find && user.pseudoLower) {
            this.$store.state.community.users.list.push(user)
          }
        })
      })

      if (this.__window.width < 500 && click) {
        window.scroll({
          top: document.getElementsByClassName('user-list')[0].offsetTop - 120,
          left: 0,
          behavior: 'smooth'
        })
      }
    },
    async fetchPseudoUsers (text, click) {
      text = text.toLowerCase()
      let page = this.__users.page

      await db.ref('community/users').orderByChild('pseudoLower').equalTo(text).limitToFirst(2 * page).once('value', snap => {
        if (snap.val()) {
          snap.forEach(user => {
            user = user.val()
            let find = this.$store.state.community.users.list.find(_ => String(user.id) === String(_.id))

            if (!find && user.pseudoLower) {
              this.$store.state.community.users.list.push(user)
            }
          })
        } else {
          this.noPseudoResult = true
        }
      })

      if (this.__window.width < 500 && click) {
        window.scroll({
          top: document.getElementsByClassName('user-list')[0].offsetTop - 120,
          left: 0,
          behavior: 'smooth'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'style.scss';
</style>
