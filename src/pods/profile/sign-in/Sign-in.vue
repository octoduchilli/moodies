<template>
  <div class="sign-in column justi-center align-center">
    <div v-if="!__user.tryConnect" class="card margin-10 column justi-center align-center">
      <h1 class="text-center">Connectez-vous</h1>
      <div style="margin: 0" class="form-style-7">
        <ul>
          <li>
            <label for="email">Email</label>
            <input @keypress.enter="connection()" v-model="connect.email.text" type="email" maxlength="30"/>
            <span v-if="connect.email.wrong || connect.email.empty" style="color: red">{{connect.email.wrong ? 'Vérifiez votre email' : 'Renseignez votre email'}}</span>
          </li>
          <li>
            <label for="password">Mot de passe</label>
            <input @keypress.enter="connection()" v-model="connect.password.text" type="password" maxlength="30"/>
            <span v-if="connect.password.wrong || connect.password.empty" style="color: red">{{connect.password.wrong ? 'Mauvais mot de passe' : 'Renseignez votre mot de passe'}}</span>
          </li>
        </ul>
      </div>
      <basic-button style="margin-bottom: 30px" :button="connect.button"></basic-button>
      <p style="max-height: 200px" class="text-center">{{connect.try ? 'Connexion...' : connect.manyRequests ? 'Vous avez tenté trop de fois de vous connecter, veuillez attendre quelques instants' : null}}</p>
      <router-link  style="color: grey; text-shadow: 0 0 5px black; text-decoration: underline" class="link margin-10" to="/profile/forget-password">Mot de passe oublié ?</router-link>
      <router-link style="text-shadow: 0 0 5px black; text-decoration: underline" class="link margin-10" to="/profile/register">S'inscrire</router-link>
    </div>
    <h1 v-else>Un instant...</h1>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  data () {
    return {
      connect: {
        button: {
          click: false,
          label: 'CONNEXION'
        },
        try: false,
        manyRequests: false,
        email: {
          text: '',
          wrong: false,
          empty: false
        },
        password: {
          text: '',
          wrong: false,
          empty: false
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
    'connect.button.click' (click) {
      if (click) {
        this.connection()
      }

      this.connect.button.click = false
    },
    'connect.email.text' (text) {
      this.connect.email.wrong = false
      this.connect.email.empty = false
    },
    'connect.password.text' (text) {
      this.connect.password.wrong = false
      this.connect.password.empty = false
    }
  },
  methods: {
    async connection () {
      let connect = this.connect
      let email = connect.email
      let password = connect.password

      if (email.text && password.text) {
        connect.try = true

        await firebase.auth().signInWithEmailAndPassword(email.text, password.text).catch(error => {
          connect.try = false

          if (error.code === 'auth/wrong-password') {
            password.wrong = true
          }

          if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
            email.wrong = true
          }

          if (error.code === 'auth/too-many-requests') {
            connect.manyRequests = true
          }
        }).then(() => {
          this.connect.try = false
        })
      } else {
        if (!email.text) {
          email.empty = true
        }

        if (!password.text) {
          password.empty = true
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import 'style.scss';
</style>
