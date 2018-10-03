<template>
  <div class="edit-list column align-center width">
    <basic-button class="margin-20" :button="buttons.back"/>
    <p class="text-center" v-if="modified">Modifications enregistrées !</p>
    <li class="edit-filter basic-list" v-if="currentFilter" :class="{'scale': currentFilter.click}" @click="currentFilter.click ? currentFilter.click = false : currentFilter.click = true" @mouseover="currentFilter.mouseover = true" @mouseout="currentFilter.mouseover = false">
      <div class="circle" :class="[{'scale': currentFilter.mouseover && __window.width >= 700}, currentFilter.mouseover && __window.width >= 700 ? `veil-background` : null, currentFilter.click ? `normal-background` : null]" v-for="n in 2" :key="n['.key']"></div>
      <p v-if="currentFilter.label" class="button-label">{{currentFilter.label}}</p>
    </li>
    <div class="row justi-center align-center" id="color-picker-container">
      <div class="pannel-color">
        <div class="color" :style="{'background': hex}"></div>
        <p><span>#</span> {{hex | noHashTag}}</p>
        <p><span>R</span> {{rgb.r}}</p>
        <p><span>G</span> {{rgb.g}}</p>
        <p><span>B</span> {{rgb.b}}</p>
      </div>
    </div>
    <div class="column">
      <basic-input :class="[save.noName ? 'scale-1_1' : null]" class="margin-10" :input="name"/>
      <basic-input :class="[save.noLabel ? 'scale-1_1' : null]" class="margin-10" :maxlength="__user.infos.uid === 'cOjx48K3P2OW3OYL5lyC9Cxm7wy2' ? null : 3" :input="label"/>
    </div>
    <basic-button class="margin-20" :button="buttons.save"/>
    <basic-button class="margin-20" style="color: red; width: 230px" :button="buttons.delete"/>
  </div>
</template>

<script>
import iro from '@jaames/iro'
import { db } from '@/firebase'

export default {
  data () {
    return {
      modified: false,
      buttons: {
        back: {
          click: false,
          label: 'RETOUR'
        },
        save: {
          click: false,
          label: 'MODIFIER'
        },
        delete: {
          click: false,
          label: 'Supprimer definitivement'
        }
      },
      currentFilter: null,
      hex: '#',
      rgb: {
        r: 0,
        g: 0,
        b: 0
      },
      name: {
        text: '',
        placeholder: 'Titre',
        type: 'text'
      },
      label: {
        text: '',
        placeholder: 'Label',
        type: 'text'
      },
      save: {
        noLabel: false,
        noName: false
      }
    }
  },
  mounted () {
    this.currentFilter = JSON.parse(JSON.stringify(this.__currentFilter))

    let currentFilter = this.currentFilter

    this.hex = currentFilter.color
    this.rgb = this.hexToRgb(currentFilter.color)
    this.name.text = currentFilter.name
    this.label.text = currentFilter.label

    setTimeout(() => {
      this.setColorFilters()
    })

    let colorPicker = new iro.ColorPicker('#color-picker-container', {
      width: 240,
      height: 240,
      color: this.rgb,
      markerRadius: 8,
      padding: 4,
      sliderMargin: 24,
      sliderHeight: 36,
      borderWidth: 2,
      borderColor: '#fff',
      anticlockwise: true
    })

    colorPicker.on('color:change', (color, changes) => {
      this.hex = color.hexString
      this.rgb = color.rgb
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
    },
    __currentFilter () {
      let id = this.$route.params.id

      return this.__user.filters.created.find(_ => String(_.id) === String(id))
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
        this.edit()
      }

      this.buttons.save.click = false
    },
    'buttons.delete.click' (click) {
      if (click) {
        this.delete()
      }

      this.buttons.delete.click = false
    },
    'hex' (hex) {
      this.modified = false
      this.currentFilter.color = hex
      this.setColorFilters()
    },
    'name.text' () {
      this.resetSave()
      this.modified = false
    },
    'label.text' (text) {
      this.resetSave()
      text = text.toUpperCase()
      this.label.text = text
      this.modified = false
      this.currentFilter.label = text
    }
  },
  methods: {
    setColorFilters () {
      let filter = this.currentFilter
      let li = document.getElementsByClassName('edit-filter')[0]

      if (li) {
        li.style.setProperty('--button-color-circle-bg', `${filter.color}`)
        li.style.setProperty('--button-color-veil-bg', `${filter.color}`)
        li.style.setProperty('--button-color-normal-bg', `${filter.color}`)
      }
    },
    edit () {
      let label = this.label.text
      let name = this.name.text
      let hex = this.hex
      let id = this.currentFilter.id
      let date = new Date()

      if (label && name) {
        db.ref(`users/${this.__user.infos.uid}/filters/${id}`).update({
          name: name,
          label: label,
          color: hex,
          modifiedAt: date.toString()
        }).then(() => {
          this.modified = true
        })
      } else {
        if (!label) {
          this.save.noLabel = true
        } else {
          this.save.noName = true
        }
      }
    },
    delete () {
      let filters = this.__user.filters.created
      let films = this.__user.films.buttons
      let currentFilter = this.currentFilter

      for (let i = 1; i <= filters.length; i++) {
        let filter = filters[i - 1]
        if (Number(i) > Number(currentFilter.position)) {
          db.ref(`users/${this.__user.infos.uid}/filters/${filter.id}`).update({
            position: i - 1
          })
        }
      }

      films.forEach(f => {
        f.buttons.forEach(_ => {
          if (String(_.id) === String(currentFilter.id)) {
            _.id = null
            db.ref(`users/${this.__user.infos.uid}/films/${f.id}`).set(f.buttons)

            if (f.buttons.length === 1) {
              let index = this.__user.films.all.findIndex(a => String(a.id) === String(f.id))

              if (index !== -1) {
                this.__user.films.all.splice(index, 1)
              }
            }
          }
        })
      })

      this.__user.filters.click = []

      db.ref(`users/${this.__user.infos.uid}/filters/${currentFilter.id}`).set(null).then(() => {
        this.$router.go(-1)
      })
    },
    hexToRgb (hex) {
      let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
      hex = hex.replace(shorthandRegex, (m, r, g, b) => {
        return r + r + g + g + b + b
      })

      let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null
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
