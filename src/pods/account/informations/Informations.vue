<template>
  <div class="informations column justi-center align-center">
    <div class="card margin-10 column justi-center align-center">
      <h1 class="text-center">Informations du compte</h1>
      <p style="width: 100%">Nom : {{__user.firstname}}</p>
      <p style="width: 100%">Prénom : {{__user.lastname}}</p>
      <p style="width: 100%">Email : {{__user.email}}</p>
      <div class="row align-center width">
        <p class="margin-10" style="margin-left: 0">Pseudo : </p>
        <basic-input maxlength="12" :input="inputs.pseudo"/>
      </div>
      <p style="color: red" class="width text-center" v-if="usedPseudo">Pseudo déjà utilisé</p>
      <p style="color: red" class="width text-center" v-if="notAlphaNum">Pseudo de type Alpha-Numérique uniquement</p>
      <p style="color: lightgreen" class="width text-center" v-if="savedPseudo">Pseudo enregistré</p>
      <basic-button class="margin-20" :button="buttons.save"/>
      <div v-if="__user.pseudo" class="width flex justi-between align-center">
        <p class="margin-10" style="margin-left: 0">Compte privé : </p>
        <basic-on-off-button class="margin-20" :button="buttons.private"/>
      </div>
      <p v-if="__user.pseudo" class="margin-0" style="font-size: 10px; color: grey">Activez l'option ci-dessus pour masquer vôtre profil, vos films et vos filtres.</p>
      <basic-button class="margin-20" :button="buttons.back"/>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase'

export default {
  data () {
    return {
      inputs: {
        pseudo: {
          text: '',
          type: 'text',
          placeholder: 'MonPseudo'
        }
      },
      buttons: {
        save: {
          click: false,
          label: 'Enregistrer'
        },
        back: {
          click: false,
          label: 'RETOUR'
        },
        private: {
          on: false,
          label: 'private'
        }
      },
      usedPseudo: false,
      notAlphaNum: false,
      savedPseudo: false
    }
  },
  async created () {
    this.$store.state.route.selected = 3
    this.inputs.pseudo.text = this.__user.pseudo

    await db.ref(`community/users/${this.__user.uid}`).once('value', snap => {
      this.buttons.private.on = snap.val().privateAccount || false
    })
  },
  computed: {
    __user () {
      return this.$store.state.user
    }
  },
  watch: {
    'inputs.pseudo.text' () {
      this.usedPseudo = false
      this.savedPseudo = false
      this.notAlphaNum = false
    },
    'buttons.save.click' (click) {
      let pseudo = this.inputs.pseudo.text

      if (pseudo && click) {
        if (pseudo.match(/^[a-z0-9]+$/i)) {
          this.savePseudo(pseudo)
        } else {
          this.notAlphaNum = true
        }
      }

      this.buttons.save.click = false
    },
    'buttons.back.click' () {
      this.$router.go(-1)
    },
    'buttons.private.on' (on) {
      db.ref(`community/users/${this.__user.uid}`).update({
        privateAccount: on ? true : null
      })
    }
  },
  methods: {
    async savePseudo (pseudo) {
      let used = false

      await db.ref('community/users').orderByChild('pseudoLower').equalTo(pseudo.toLowerCase()).once('value', snap => {
        if (snap.val() && !snap.val()[this.__user.uid]) {
          used = true
          this.usedPseudo = true
        }
      })

      if (!used) {
        db.ref(`users/${this.__user.uid}/infos`).update({
          pseudo: pseudo
        }).then(() => {
          this.savedPseudo = true
        })

        db.ref(`community/users/${this.__user.uid}`).update({
          id: this.__user.uid,
          pseudoBase: pseudo,
          pseudoLower: pseudo.toLowerCase(),
          pseudoInverseLower: this.inverseCharCode(pseudo.toLowerCase()),
          films: this.__user.buttons.length,
          inverseFilms: 9999999999999 - this.__user.buttons.length,
          filters: this.__user.filters.created.length,
          inverseFilters: 9999999999999 - this.__user.filters.created.length,
          activity: Date.now(),
          inverseActivity: 9999999999999 - Date.now()
        })
      }
    },
    inverseCharCode (str) {
      let final = ''

      for (let i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) < 58) {
          final += String.fromCharCode(57 - str.charCodeAt(i) + 48)
        } else {
          final += String.fromCharCode(122 - str.charCodeAt(i) + 97)
        }
      }

      return final
    }
  }
}
</script>

<style lang="scss" scoped>
  @import 'style.scss';
</style>
