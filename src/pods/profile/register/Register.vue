<template>
  <div class="register column justi-center align-center">
    <div class="card margin-10 column justi-center align-center">
      <h1 class="text-center">Inscrivez-vous</h1>
      <div style="margin: 0" class="form-style-7">
        <ul>
          <li>
            <label for="firstname">Nom*</label>
            <input v-model="register.firstname.text" type="text" maxlength="30"/>
            <span v-if="register.firstname.empty" style="color: red">Veuillez renseigner votre Nom</span>
          </li>
          <li>
            <label for="lastname">Prénom*</label>
            <input v-model="register.lastname.text" type="text" maxlength="30"/>
            <span v-if="register.lastname.empty" style="color: red">Veuillez renseigner votre Prénom</span>
          </li>
          <li>
            <label for="email">Email*</label>
            <input v-model="register.email.text" type="email" maxlength="30"/>
            <span v-if="register.email.empty || register.email.wrong || register.email.used" style="color: red">{{register.email.empty ? 'Veuillez renseigner votre Email' : register.email.wrong ? 'Vérifiez votre Email' : 'Cette Email est déjà utilisé'}}</span>
          </li>
          <li>
            <label for="password">Mot de passe*</label>
            <input v-model="register.password.text" type="password" maxlength="20"/>
            <span v-if="!register.password.empty && !register.password.wrong">Minimum 6 caractères</span>
            <span v-else style="color: red">{{register.password.empty ? 'Veuillez renseigner votre Mot de passe' : 'Votre Mot de passe de respecte pas les conditions'}}</span>
          </li>
          <li>
            <label for="verif-password">Vérification du mot de passe*</label>
            <input v-model="register.verifPassword.text" type="password" maxlength="30"/>
            <span v-if="(register.verifPassword.empty || register.verifPassword.wrong) && (!register.password.empty || !register.password.wrong)" style="color: red">{{register.verifPassword.empty ? 'Veuillez renseigner votre Mot de passe à nouveau' : 'Votre saisie ne correspond pas à votre Mot de passe'}}</span>
          </li>
        </ul>
      </div>
      <p style="color: grey; font-size: 15px" class="text-center">*À renseigner obligatoirement</p>
      <div class="row align-center margin-10">
        <input v-model="register.check" type="checkbox"/>
        <p style="margin-left: 10px; font-size: 10px; max-width: 250px">En cochant cette case je certifie être conscient que mes informations seront enregistrées et conservées dans un but non-commercial. Service utilisé : <a class="link" href="https://firebase.google.com/">FIREBASE</a> by <a class="link" href="https://www.google.com/about/our-company/">GOOGLE</a>©</p>
      </div>
      <p v-if="register.isNotCheck" class="text-center" style="color: red; font-size: 12px; max-width: 300px">Vous devez cocher la case ci-dessus et prendre connaissance du fait ci-contre</p>
      <p v-if="register.isSubscribing" class="text-center">Inscription...</p>
      <basic-button style="margin-bottom: 30px" :button="register.button"></basic-button>
      <router-link style="text-shadow: 0 0 5px black; text-decoration: underline" class="link" to="/profile/sign-in">Se connecter</router-link>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import { db } from '@/firebase'

export default {
  data () {
    return {
      register: {
        button: {
          click: false,
          label: `S'INSCRIRE`
        },
        check: false,
        isNotCheck: false,
        isSubscribing: false,
        lastname: {
          text: '',
          empty: false
        },
        firstname: {
          text: '',
          empty: false
        },
        email: {
          text: '',
          empty: false,
          wrong: false,
          used: false
        },
        password: {
          text: '',
          empty: false,
          wrong: false
        },
        verifPassword: {
          text: '',
          empty: false,
          wrong: false
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
    'register.button.click' (click) {
      if (click) {
        let register = this.register
        let check = this.register.check
        let lastname = this.register.lastname
        let firstname = this.register.firstname
        let email = this.register.email
        let password = this.register.password
        let verifPassword = this.register.verifPassword

        if (lastname.text && firstname.text && email.text && password.text && verifPassword.text) {
          if (password.text === verifPassword.text && password.text.length >= 6) {
            if (check) {
              register.isSubscribing = true

              firebase.auth().createUserWithEmailAndPassword(email.text, password.text).then(snap => {
                let lastname = this.register.lastname.text
                let firstname = this.register.firstname.text
                let id = null
                let date = new Date()

                this.register.isSubscribing = false

                db.ref('users').once('value', _ => {
                  id = _.numChildren()

                  id++

                  db.ref('users/' + snap.user.uid + '/infos').update({
                    id: id || `${firstname[0].toUpperCase()}${lastname[0].toUpperCase()}`,
                    firstname: firstname,
                    lastname: lastname,
                    createdAt: date.toString()
                  })
                })
              }).catch(error => {
                register.isSubscribing = false

                this.$store.state.user.status.tryConnect = false

                if (error.code === 'auth/invalid-email') {
                  email.wrong = true
                }

                if (error.code === 'auth/weak-password') {
                  password.wrong = true
                }

                if (error.code === 'auth/email-already-in-use') {
                  email.used = true
                }
              })
            } else {
              register.isNotCheck = true
            }
          } else {
            password.text.length >= 6 ? verifPassword.wrong = true : password.wrong = true
          }
        } else {
          if (!lastname.text) {
            lastname.empty = true
          }

          if (!firstname.text) {
            firstname.empty = true
          }

          if (!email.text) {
            email.empty = true
          }

          if (!password.text) {
            password.empty = true
          }

          if (!verifPassword.text) {
            verifPassword.empty = true
          }
        }
      }

      this.register.button.click = false
    },
    'register.lastname.text' (text) {
      this.register.lastname.empty = false
    },
    'register.firstname.text' (text) {
      this.register.firstname.empty = false
    },
    'register.email.text' (text) {
      this.register.email.wrong = false
      this.register.email.empty = false
      this.register.email.used = false
    },
    'register.password.text' (text) {
      this.register.password.wrong = false
      this.register.password.empty = false
    },
    'register.verifPassword.text' (text) {
      this.register.verifPassword.wrong = false
      this.register.verifPassword.empty = false
    },
    'register.check' (check) {
      if (check) {
        this.register.isNotCheck = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import 'style.scss';
</style>
