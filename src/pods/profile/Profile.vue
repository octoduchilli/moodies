<template>
  <div class="profile column align-center justi-center">
    <router-view/>
  </div>
</template>

<script>
export default {
  created () {
    this.$store.state.route.selected = 3

    if (this.__user.uid) {
      this.$router.push('/account/log-out')
    } else {
      this.$router.push('/profile/sign-in')
    }
  },
  computed: {
    __user () {
      return this.$store.state.user
    }
  },
  watch: {
    '__user.uid' (uid) {
      if (uid) {
        this.$router.push('/account/log-out')
      } else {
        this.$router.push('/profile/sign-in')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'style.scss';
</style>
