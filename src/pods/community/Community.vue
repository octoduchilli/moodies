<template>
  <div class="community column align-center" :style="{'padding-top': !__user.pseudo && __user.uid ? null : '60px'}">
    <header v-if="!__user.pseudo && __user.uid" class="community-header width row justi-center align-center">
      <p class="text-center">
        Vous n'avez pas encore de
        <router-link to="/account/informations" class="link padding-10">
          pseudo
        </router-link>
      </p>
    </header>
    <div class="margin-20 column align-start">
      <h1 class="text-center padding-10" style="width: calc(100% - 20px)">Communauté de Moodies</h1>
      <h2 class="padding-10 margin-0">Retrouvez votre profil et ceux de vos amis</h2>
      <p class="padding-10 margin-0">Pour retrouver votre profil dans la liste des utilisateurs de Moodies nous vous invitons à définir votre pseudo.</p>
      <router-link to="/account/informations" class="link color-yellow hover-bg-yellow padding-10" style="margin: 10px 0;">
        Définissez votre pseudo ici !
      </router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  created () {
    this.$store.state.route.selected = 4
    this.$router.push('/community/users')
  },
  computed: {
    __user () {
      return this.$store.state.user
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'style.scss';
</style>
