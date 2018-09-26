<template>
  <div class="informations column justi-center align-center">
    <div class="card margin-10 column justi-center align-center">
      <h1 class="text-center">Informations du compte</h1>
      <p class="width">Nom : {{__user.firstname}}</p>
      <p class="width">Prénom : {{__user.lastname}}</p>
      <p class="width">Email : {{__user.email}}</p>
      <div class="row align-center width">
        <p class="margin-10" style="margin-left: 0">Pseudo : </p>
        <basic-input maxlength="12" :input="inputs.pseudo"/>
      </div>
      <div v-if="__user.pseudo" class="width flex justi-between align-center">
        <p class="margin-10" style="margin-left: 0">Compte privé : </p>
        <basic-on-off-button class="margin-20" :button="buttons.private"/>
      </div>
      <p v-if="__user.pseudo" class="margin-0" style="font-size: 10px; color: grey">Activez l'option ci-dessus pour masquer vôtre profil, vos films et vos filtres.</p>
      <p style="color: red" class="width text-center" v-if="usedPseudo">Pseudo déjà utilisé</p>
      <p style="color: red" class="width text-center" v-if="notAlphaNum">Pseudo de type Alpha-Numérique uniquement</p>
      <p style="color: lightgreen" class="width text-center" v-if="savedPseudo">Pseudo enregistré</p>
      <basic-button class="margin-20" style="width: 230px" :button="buttons.saveInfo"/>
      <h1 class="text-center">Personnalisation</h1>
      <div class="column align-center margin-10 padding-10">
        <div id="color"></div>
        <p :style="{'color': color}">VOTRE COULEUR</p>
      </div>
      <p style="color: lightgreen" class="width text-center" v-if="savedColors">Couleurs enregistrées</p>
      <basic-button class="margin-20" style="width: 250px" :button="buttons.saveColors"/>
      <basic-button class="margin-20" :button="buttons.back"/>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase'
import iro from '@jaames/iro'

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
        saveInfo: {
          click: false,
          label: 'Enregistrer les informations'
        },
        saveColors: {
          click: false,
          label: 'Enregistrer la personnalisation'
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
      color: null,
      usedPseudo: false,
      notAlphaNum: false,
      savedPseudo: false,
      savedColors: false
    }
  },
  async created () {
    this.$store.state.route.selected = 3
    this.inputs.pseudo.text = this.__user.pseudo

    await db.ref(`community/users/${this.__user.uid}`).once('value', snap => {
      snap = snap.val()

      this.buttons.private.on = snap.privateAccount || false
      this.color = snap.color|| null
    })

    let color = new iro.ColorPicker('#color', {
      width: 180,
      height: 180,
      color: this.color || {r: 255, g: 255, b: 0},
      markerRadius: 8,
      padding: 4,
      sliderMargin: 10,
      sliderHeight: 26,
      borderWidth: 2,
      borderColor: '#fff',
      anticlockwise: true
    })

    color.on('color:change', (color, changes) => {
      this.color = color.hexString
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
    'buttons.saveInfo.click' (click) {
      let pseudo = this.inputs.pseudo.text

      if (pseudo && click) {
        if (pseudo.match(/^[a-z0-9]+$/i)) {
          this.savePseudo(pseudo)
        } else {
          this.notAlphaNum = true
        }
      }

      this.buttons.saveInfo.click = false
    },
    'buttons.saveColors.click' (click) {
      if (click) {
        this.saveColors()
      }

      this.buttons.saveColors.click = false
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
    },
    saveColors () {
      this.savedColors = false

      db.ref(`community/users/${this.__user.uid}`).update({
        id: this.__user.uid,
        color: this.color,
        films: this.__user.buttons.length,
        inverseFilms: 9999999999999 - this.__user.buttons.length,
        filters: this.__user.filters.created.length,
        inverseFilters: 9999999999999 - this.__user.filters.created.length,
        activity: Date.now(),
        inverseActivity: 9999999999999 - Date.now()
      }).then(() => {
        setTimeout(() => {
          this.savedColors = true
        }, 500)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import 'style.scss';
</style>
