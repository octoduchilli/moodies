<template>
  <div class="log-out column justi-center align-center">
    <div class="card margin-10 column justi-center align-center">
      <h1 class="text-center">{{__user.infos.lastname ? `${__user.infos.lastname}, vous êtes connecté !` : 'Vous êtes connecté !'}}</h1>
      <basic-button style="margin-bottom: 30px; width: 200px" :button="logOut.button"/>
      <router-link style="text-shadow: 0 0 5px black; text-decoration: underline" class="link margin-10" to="/account/informations">Mes informations</router-link>
      <router-link style="text-shadow: 0 0 5px black; text-decoration: underline" class="link margin-10" to="/account/my-list/show">Voir mes films</router-link>
      <router-link style="text-shadow: 0 0 5px black; text-decoration: underline" class="link margin-10" to="/account/my-list/modif">Modifier mes listes</router-link>
      <router-link style="text-shadow: 0 0 5px black; text-decoration: underline" class="link margin-10" to="/account/rated">Voir mes votes</router-link>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'Log-out',
  data () {
    return {
      logOut: {
        button: {
          click: false,
          label: 'Se déconnecter'
        }
      }
    }
  },
  created () {
    this.$store.state.route.selected = 3
  },
  computed: {
    __user () {
      return this.$store.state.user
    }
  },
  watch: {
    async 'logOut.button.click' (click) {
      if (click) {
        await firebase.auth().signOut()
        this.$router.push('/profile/sign-in')
      }

      this.logOut.button.click = false
    }
  }
}
</script>

<style lang="scss" scoped>
  @import 'style.scss';
</style>
