<template>
  <div class="create-list column align-center width">
    <div class="wrap justi-center align-center">
      <basic-button class="margin-20" :button="buttons.back"/>
      <basic-link-button class="margin-20" :button="buttons.modif"/>
    </div>
    <h1 class="text-center">Créez vos listes personnalisées</h1>
    <div class="new-button row justi-center align-center" :class="{'column': __window.width <= 750}">
      <p>Apparence actuelle : </p>
      <div @click="newFilter.click ? newFilter.click = false : newFilter.click = true" @mouseover="newFilter.mouseover = true" @mouseout="newFilter.mouseover = false" class="button" :class="{'scale': newFilter.click}">
        <div v-for="n in 2" :key="n['.key']" class="circle" :class="[{'scale': newFilter.mouseover && __window.width >= 700}, newFilter.mouseover && __window.width >= 700 ? `veil-background` : null, newFilter.click ? `normal-background` : null]"></div>
        <p class="label unselectable">{{newFilter.label}}</p>
      </div>
    </div>
    <div class="row justi-center align-center" :class="{'column': __window.width <= 750}">
      <div class="row justi-center align-center" id="color-picker-container">
        <div class="pannel-color">
          <div class="color" :style="{'background': newFilter.hex}"></div>
          <p><span>#</span> {{newFilter.hex | noHashTag}}</p>
          <p><span>R</span> {{newFilter.rgb.r}}</p>
          <p><span>G</span> {{newFilter.rgb.g}}</p>
          <p><span>B</span> {{newFilter.rgb.b}}</p>
        </div>
      </div>
      <div class="column">
        <basic-input :class="[save.noName ? 'scale-1_1' : null]" style="margin: 10px; width: 250px; transition: .3s ease;" :input="inputs.name"/>
        <basic-input :class="[save.noLabel ? 'scale-1_1' : null]" style="margin: 10px; width: 250px; transition: .3s ease;" :maxlength="__user.uid === 'cOjx48K3P2OW3OYL5lyC9Cxm7wy2' ? null : 3" :input="inputs.label"/>
      </div>
    </div>
    <basic-button class="margin-20" :button="buttons.save"/>
  </div>
</template>

<script>
import iro from '@jaames/iro'
import { db } from '@/firebase'

export default {
  data () {
    return {
      buttons: {
        back: {
          click: false,
          label: 'RETOUR'
        },
        modif: {
          click: false,
          path: '/account/my-list/modif',
          label: 'Modifier les listes'
        },
        save: {
          click: false,
          label: 'CREER'
        }
      },
      inputs: {
        name: {
          text: '',
          placeholder: 'Titre de votre liste'
        },
        label: {
          text: 'NEW',
          placeholder: 'Label'
        }
      },
      newFilter: {
        click: false,
        mouseover: false,
        label: 'NEW',
        hex: '#ff00c8',
        rgb: {
          r: 255,
          g: 0,
          b: 200
        }
      },
      save: {
        noLabel: false,
        noName: false
      }
    }
  },
  mounted () {
    this.setColorNewFilter()

    let colorPicker = new iro.ColorPicker('#color-picker-container', {
      width: 240,
      height: 240,
      color: {r: 255, g: 0, b: 200},
      markerRadius: 8,
      padding: 4,
      sliderMargin: 24,
      sliderHeight: 36,
      borderWidth: 2,
      borderColor: '#fff',
      anticlockwise: true
    })

    colorPicker.on('color:change', (color, changes) => {
      this.newFilter.hex = color.hexString
      this.newFilter.rgb = color.rgb
    })
  },
  filters: {
    noHashTag (val) {
      val = val.replace('#', '')
      return val
    }
  },
  computed: {
    __window () {
      return this.$store.state.window
    },
    __user () {
      return this.$store.state.user
    }
  },
  watch: {
    'buttons.back.click' (click) {
      if (click) {
        this.$router.go(-1)
      }

      this.buttons.back.click = false
    },
    'buttons.save.click' (click) {
      if (click) {
        this.create()
      }

      this.buttons.save.click = false
    },
    'inputs.name.text' (text) {
      this.resetSave()
    },
    'inputs.label.text' (text) {
      this.resetSave()
      this.inputs.label.text = text.toUpperCase()
      this.newFilter.label = text
    },
    'newFilter.hex' () {
      this.setColorNewFilter()
    }
  },
  methods: {
    setColorNewFilter () {
      let rgb = this.newFilter.rgb

      let newButton = document.querySelector('.new-button')

      newButton.style.setProperty('--button-color-circle-bg', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, .3)`)
      newButton.style.setProperty('--button-color-veil-bg', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, .5)`)
      newButton.style.setProperty('--button-color-normal-bg', `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)
    },
    create () {
      let label = this.inputs.label.text
      let name = this.inputs.name.text
      let hex = this.newFilter.hex
      let date = new Date()

      if (label && name) {
        let id = db.ref(`users/${this.__user.uid}/filters`).push().key

        db.ref(`users/${this.__user.uid}/filters/${id}`).update({
          id: id,
          name: name,
          label: label,
          color: hex,
          createdAt: date.toString(),
          position: this.__user.filters.created.length + 1
        })

        setTimeout(() => {
          this.$router.go(-1)
        })
      } else {
        if (!label) {
          this.save.noLabel = true
        } else {
          this.save.noName = true
        }
      }
    },
    resetSave () {
      this.save = {
        noLabel: false,
        noName: false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'style.scss';
</style>
