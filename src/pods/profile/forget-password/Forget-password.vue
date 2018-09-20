<template>
  <div class="forget-password column justi-center align-center">
    <div v-if="!forget.email.send" class="card margin-10 column justi-center align-center">
      <h1 class="text-center" style="font-size: 30px">Mot de passe oublié ?</h1>
      <h3 class="text-center">Renseignez votre Email</h3>
      <div v-if="!forget.email.send" style="margin: 0" class="form-style-7">
        <ul>
          <li>
            <label for="email">Email</label>
            <input v-model="forget.email.text" type="email" maxlength="30"/>
          </li>
        </ul>
      </div>
      <p style="color: red">{{forget.email.empty ? 'Veuillez renseigner votre Email' : forget.email.wrong ? 'Vérifier votre Email' : null}}</p>
      <basic-button style="margin-bottom: 30px" :button="forget.button"/>
      <router-link style="text-shadow: 0 0 5px black; text-decoration: underline" class="link" to="/profile/sign-in">Se connecter</router-link>
    </div>
    <div v-else class="card margin-10 column justi-center align-center">
      <h1 class="text-center">Vous allez recevoir un mail !</h1>
      <router-link style="text-shadow: 0 0 5px black; text-decoration: underline" class="link" to="/profile/sign-in">Se connecter</router-link>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'Forget-password',
  data () {
    return {
      forget: {
        button: {
          click: false,
          label: 'ENVOYER'
        },
        email: {
          text: '',
          empty: false,
          wrong: false,
          send: false
        }
      }
    }
  },
  computed: {
    __user () {
      return this.$store.state.user
    }
  },
  watch: {
    'forget.button.click' (click) {
      if (click) {
        let email = this.forget.email
        if (email.text) {
          firebase.auth().sendPasswordResetEmail(email.text).catch(() => {
            email.wrong = true
            this.forget.button.click = false
          }).then(_ => {
            if (!email.wrong) {
              email.send = true
            }
          })
        } else {
          email.empty = true
          this.forget.button.click = false
        }
      }
    },
    'forget.email.text' (text) {
      let email = this.forget.email
      email.empty = false
      email.wrong = false
    }
  }
}
</script>

<style lang="scss" scoped>
  @import 'style.scss';
</style>
