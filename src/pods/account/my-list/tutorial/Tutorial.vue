<template>
  <div class="tutorial-list pad-left align-center column width">
    <div v-show="__step === '1'" class="padding-20 column">
      <section>
        <h1>Comme vous le savez</h1>
        <p>Le service proposé par Moodies est de permettre à ses utilisateurs de créer leur propre liste de film grâce à une large bibliothèque. Les films que vous trouvez et que vous voulez ajouter à votre liste principale sont tous équipés de trois boutons par défaut :</p>
        <ul class="margin-0">
          <li>
            <p>
              <span class="view border">VUS</span> pour les films que vous avez vus
            </p>
          </li>
          <li>
            <p>
              <span class="favorite border">FAVORIS</span> pour les films qui vous passionnent
            </p>
          </li>
          <li>
            <p>
              <span class="personalize border">PLUS</span> qui vous redirige vers la création d'une liste personnalisée
            </p>
          </li>
        </ul>
        <p>Pour le moment votre liste principale est composée de deux listes distinctes, <span class="view border">VUS</span> et <span class="favorite border">FAVORIS</span> .</p>
      </section>
      <section>
        <h1>En suivant ce tutoriel</h1>
        <p>Vous apprendrez à :</p>
        <ul class="margin-0">
          <li>
            <p>créer des listes</p>
          </li>
          <li>
            <p>gérer leurs contenus</p>
          </li>
          <li>
            <p>modifier celles-ci</p>
          </li>
        </ul>
        <p>Mais surtout à utiliser le plein potentiel de Moodies !</p>
      </section>
    </div>
    <div v-show="__step === '2'" class="padding-20 column">
      <section>
        <h1>Votre première liste personnalisée</h1>
        <p>Pour la création de votre première liste personnalisée nous allons partir sur un thème plutôt commun. Votre nouvelle liste aura pour titre <span style="color: lightblue">"Films à voir"</span> et son label sera <span style="color: lightblue">"SEE"</span> ("see" signifie "voir" en anglais). Pour information, le titre d'une liste est limité à <span style="color: lightgreen">50 caractères</span> et à <span style="color: lightgreen">3 caractères</span> pour le label.</p>
        <p>Cette première liste comme vous pouvez très facilement l'imaginer, vous permettra d'ajouter des films que vous auriez envie de voir.</p>
      </section>
      <section>
        <h1>Choisir une couleur</h1>
        <p>Pour différencier vos listes et apporter une meilleure visibilité, commencez par définir la couleur de votre nouvelle liste avec l'outil mis à votre disposition ci-dessous.</p>
        <div id="color-picker-container" class="margin"></div>
        <h2 style="margin: 10px auto" :style="{'color': filter.color}">Couleur de la liste</h2>
        <p class="text-center">Conseil : préferez les couleurs claires</p>
      </section>
      <section>
        <h1>Un titre et un label</h1>
        <p>Pour reconnaître rapidement vos listes il est recommandé de lier vos titres à vos labels. Dans un autre exemple, une liste qui a pour titre <span style="color: pink">"Films que je n'ai pas aimé"</span> pourraît avoir <span style="color: pink">"NUL"</span> comme label.</p>
        <p class="text-center">Nous vous invitons à renseigner le titre <span style="color: lightblue">"Films à voir"</span> : </p>
        <basic-input class="margin" :input="inputs.name"/>
        <p class="text-center">Et le label <span style="color: lightblue">"SEE"</span> : </p>
        <basic-input class="margin" :input="inputs.label"/>
      </section>
      <section>
        <h1>En passant à l'étape suivante</h1>
        <p>Vous validerez la création de votre toute première liste personnalisée <span style="color: lightblue">"Films à voir"</span> !</p>
      </section>
    </div>
    <div v-show="__step === '3'" class="padding-20 column">
      <section>
        <h1 class="text-center">Bravo ! Vous venez de créer votre première liste</h1>
      </section>
      <section>
        <h1>Des films dans votre nouvelle liste</h1>
        <p>Maintenant que votre nouvelle liste personnalisée est créée et prête à l'emploi il ne vous manque plus qu'à y ajouter les films que vous aimerez voir.</p>
        <p>Vous remarquerez l'apparition de boutons liés à votre nouvelle liste à plusieurs endroits sur Moodies : dans les fiche des films <span @mouseover="images.mouseover = 1" @mouseout="images.mouseover = null" style="color: lightgrey">(image n°1)</span>, à droite des posters de film <span @mouseover="images.mouseover = 2" @mouseout="images.mouseover = null" style="color: lightgrey">(image n°2)</span> et dans votre pannel de filtres dans l'onglet "Ma liste" <span @mouseover="images.mouseover = 3" @mouseout="images.mouseover = null" style="color: lightgrey">(image n°3)</span>.</p>
        <ul class="list-image-tutorial width basic-list wrap justi-center text-center">
          <li :class="[images.mouseover === 1 ? 'scale-1_05' : null]">
            <h3>Image 1</h3>
            <img src="/static/img/tutorial/filter/1.png" alt="Image 1">
          </li>
          <li :class="[images.mouseover === 2 ? 'scale-1_05' : null]">
            <h3>Image 2</h3>
            <img src="/static/img/tutorial/filter/2.png" alt="Image 2">
          </li>
          <li :class="[images.mouseover === 3 ? 'scale-1_05' : null]">
            <h3>Image 3</h3>
            <img src="/static/img/tutorial/filter/3.png" alt="Image 3">
          </li>
        </ul>
      </section>
      <section>
        <h1>Ajouter un film</h1>
        <p>Tout aussi simple que pour les listes par défaut <span class="view border">VUS</span> et <span class="favorite border">FAVORIS</span>, l'ajout d'un film dans votre nouvelle liste se fait par le bouton correspondant.</p>
        <p>Vous allez commencer par ajouter votre premier film ci-dessous :</p>
        <div class="row justi-center">
          <div class="film-item column justi-center align-center">
            <img class="item-image" src="https://image.tmdb.org/t/p/w500/xcKR6cAhdGmZQxyFfBqW5oPUF6E.jpg" onerror="this.src = '/static/img/buttons/picture-white.png'; this.style.opacity = '.2'">
            <p class="item-name text-center">Solo A Star Wars Story</p>
          </div>
          <ul class="user-buttons justi-center column scrollbar basic-list align-center">
            <li :style="{'opacity': button.id !== '9999' ? '.3' : null}" class="user-button one-user-button" :class="{'scale': button.click}" @click="button.id === '9999' ? button.click = true : null" @mouseover="button.mouseover = true" @mouseout="button.mouseover = false" v-for="button in __filmOneButtons" :key="button.id">
              <div class="circle" :class="[{'scale': button.mouseover && __window.width >= 700}, button.mouseover && __window.width >= 700 ? `veil-background` : null, button.click ? `normal-background` : null]" v-for="n in 2" :key="n['.key']"></div>
              <img v-if="button.link" class="button-img" :src="`/static/img/buttons/${button.link}-black.png`">
              <p v-if="button.label" class="button-label">{{button.label}}</p>
            </li>
          </ul>
        </div>
        <h3 v-if="__filmOneButtons[2].click" class="text-center">Bien joué ! Solo A Star Wars Story est maintenant dans <span style="color: lightblue">"Films à voir"</span></h3>
      </section>
      <section>
        <h1>Enlever un film</h1>
        <p>Pour enlever un film de votre nouvelle liste il suffit de cliquer une fois de plus sur le bouton correspondant à votre liste :</p>
        <div class="row justi-center">
          <div class="film-item column justi-center align-center">
            <img class="item-image" src="https://image.tmdb.org/t/p/w500/xcKR6cAhdGmZQxyFfBqW5oPUF6E.jpg" onerror="this.src = '/static/img/buttons/picture-white.png'; this.style.opacity = '.2'">
            <p class="item-name text-center">Solo A Star Wars Story</p>
          </div>
          <ul class="user-buttons justi-center column scrollbar basic-list align-center">
            <li :style="{'opacity': button.id !== '9999' ? '.3' : null}" class="user-button two-user-button" :class="{'scale': button.click}" @click="button.id === '9999' ? button.click = false : null" @mouseover="button.mouseover = true" @mouseout="button.mouseover = false" v-for="button in __filmTwoButtons" :key="button.id">
              <div class="circle" :class="[{'scale': button.mouseover && __window.width >= 700}, button.mouseover && __window.width >= 700 ? `veil-background` : null, button.click ? `normal-background` : null]" v-for="n in 2" :key="n['.key']"></div>
              <img v-if="button.link" class="button-img" :src="`/static/img/buttons/${button.link}-black.png`">
              <p v-if="button.label" class="button-label">{{button.label}}</p>
            </li>
          </ul>
        </div>
        <h3 v-if="!__filmTwoButtons[2].click" class="text-center">Un expert ! Solo A Star Wars Story n'est plus dans <span style="color: lightblue">"Films à voir"</span></h3>
      </section>
      <section>
        <h1>Dans l'étape suivante</h1>
        <p>Vous allez apprendre à modifier une liste personnalisée. Sachez que les listes par défaut ne sont en aucun cas modifiable.</p>
      </section>
    </div>
    <div v-show="__step === '4'" class="padding-20 column">
      <section>
        <h1>Accéder à l'interface</h1>
        <p>Pour modifier une liste il vous faut d'abord accéder à l'interface dédié. Vous avez pour ceci deux manières :</p>
        <ul class="basic-list list-image-tutorial">
          <li>
            <p class="text-center">dans "Profil" vous trouverez un lien "Modifier mes listes"</p>
            <div class="wrap justi-around">
              <img src="/static/img/tutorial/modif-filter-path/1.png" alt="Image 1">
            </div>
          </li>
          <li>
            <p class="text-center">dans "Ma liste" cliquez sur le bouton "+" dans le pannel de filtres puis sur "Modifier mes listes"</p>
            <div class="wrap justi-around">
              <img src="/static/img/tutorial/modif-filter-path/2.png" alt="Image 2">
              <img src="/static/img/tutorial/modif-filter-path/3.png" alt="Image 3">
            </div>
          </li>
        </ul>
        <router-link class="link margin text-center" style="text-decoration: underline" to="/account/my-list/modif">Visualiser l'interface</router-link>
      </section>
      <section>
        <h1>Ce qui est modifiable</h1>
        <p>Une fois que vous avez selectionné la liste à modifier dans l'interface vous arrivez sur l'édition de celle-ci. Vous aurez alors la possibilité de changer :</p>
        <ul>
          <li><p>Sa couleur</p></li>
          <li><p>Son titre</p></li>
          <li><p>Son label</p></li>
        </ul>
        <p>Vous pouvez bien evidémment supprimer la liste choisis en cliquant sur "<span style="color: red">Supprimer définitivement</span>".</p>
        <p>ATTENTION : La suppression d'une liste est définitive et irréversible.</p>
      </section>
    </div>
    <div v-if="__validation" class="padding-20 column">
      <section>
        <h1>Tutoriel validé, à vous de jouer maintenant !</h1>
        <router-link class="link margin text-center" style="text-decoration: underline" to="/account/log-out">Quitter le tutoriel</router-link>
      </section>
    </div>
    <div v-if="__step" class="wrap justi-center">
      <basic-link-button class="margin-10" style="width: 170px" v-if="__step !== '1'" :button="buttons.previous"/>
      <basic-link-button class="margin-10" style="width: 170px" :button="buttons.next"/>
    </div>
    <router-view/>
  </div>
</template>

<script>
import iro from '@jaames/iro'
import { db } from '@/firebase'

export default {
  data () {
    return {
      buttons: {
        previous: {
          path: `/account/my-list/tutorial?step=`,
          label: 'Étape précédente'
        },
        next: {
          path: `/account/my-list/tutorial?step=`,
          label: 'Étape suivante'
        }
      },
      inputs: {
        name: {
          text: '',
          type: 'text',
          placeholder: 'Titre de la liste'
        },
        label: {
          text: '',
          type: 'text',
          placeholder: 'Label de la liste'
        }
      },
      films: {
        one: {
          buttons: {
            view: {
              id: 1,
              mouseover: false,
              click: false,
              link: 'visibility-button',
              color: '#8ddd6d'
            },
            favorite: {
              id: 2,
              mouseover: false,
              click: false,
              link: 'star',
              color: 'yellow'
            },
            see: {
              id: '9999',
              mouseover: false,
              click: false,
              label: 'SEE',
              color: null
            },
            personalize: {
              mouseover: false,
              click: false,
              link: 'add-64',
              color: 'white'
            }
          }
        },
        two: {
          buttons: {
            view: {
              id: 1,
              mouseover: false,
              click: false,
              link: 'visibility-button',
              color: '#8ddd6d'
            },
            favorite: {
              id: 2,
              mouseover: false,
              click: false,
              link: 'star',
              color: 'yellow'
            },
            see: {
              id: '9999',
              mouseover: false,
              click: true,
              label: 'SEE',
              color: null
            },
            personalize: {
              mouseover: false,
              click: false,
              link: 'add-64',
              color: 'white'
            }
          }
        }
      },
      images: {
        mouseover: null
      },
      filter: {
        color: '#ff00c8'
      }
    }
  },
  mounted () {
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
      this.filter.color = color.hexString
    })
  },
  computed: {
    __window () {
      return this.$store.state.window
    },
    __step () {
      return this.$route.query.step
    },
    __validation () {
      return this.$route.query.validation
    },
    __user () {
      return this.$store.state.user
    },
    __filmOneButtons () {
      let basicButtons = this.films.one.buttons

      let final = []
      let see = this.__user.filters.created.find(_ => String(_.id) === '9999')

      for (let index in basicButtons) {
        let button = basicButtons[index]

        final.push(button)
      }

      if (see) {
        final[2].color = see.color
      }

      return final
    },
    __filmTwoButtons () {
      let basicButtons = this.films.two.buttons

      let final = []
      let see = this.__user.filters.created.find(_ => String(_.id) === '9999')

      for (let index in basicButtons) {
        let button = basicButtons[index]

        final.push(button)
      }

      if (see) {
        final[2].color = see.color
      }

      return final
    }
  },
  watch: {
    '__step': {
      handler (step, before) {
        step = Number(step)
        before = Number(before)

        let buttons = this.buttons

        if (step > 2) {
          this.createFilter(before)
        }

        buttons.previous.path = `/account/my-list/tutorial?step=${step - 1}`

        if (step === 4) {
          buttons.next.label = 'Valider ce tutoriel'
          buttons.next.path = '/account/my-list/tutorial?validation=true'
        } else {
          buttons.next.label = 'Étape suivante'
          buttons.next.path = `/account/my-list/tutorial?step=${step + 1}`
        }

        window.scroll({
          top: 0
        })
      },
      immediate: true
    },
    '__validation' (validation) {
      if (validation) {
        db.ref(`users/${this.__user.infos.uid}/infos`).update({
          tutorial: null
        })
      }
    },
    '__filmOneButtons': {
      handler (buttons) {
        setTimeout(() => {
          this.setColorButtons(buttons, 'one')
        }, 300)
      },
      immediate: true
    },
    '__filmTwoButtons': {
      handler (buttons) {
        setTimeout(() => {
          this.setColorButtons(buttons, 'two')
        }, 300)
      },
      immediate: true
    },
    'inputs.name.text' (text) {
      let base = 'Films à voir'

      this.inputs.name.text = base.slice(0, text.length)
    },
    'inputs.label.text' (text) {
      let base = 'SEE'

      this.inputs.label.text = base.slice(0, text.length)
    }
  },
  methods: {
    createFilter (stepBefore) {
      let filter = this.filter
      let date = new Date()

      let f = this.__user.filters.created.find(_ => String(_.id) === '9999')

      let update = {
        color: f && stepBefore !== 2 ? f.color : filter.color,
        createdAt: date.toString(),
        id: '9999',
        label: 'SEE',
        name: 'Films à voir'
      }

      if (!f) {
        update.position = this.__user.filters.created.length + 1
      }

      db.ref(`users/${this.__user.infos.uid}/filters/9999`).update(update)
    },
    setColorButtons (buttons, from) {
      for (let i = 0; i < buttons.length; i++) {
        let button = buttons[i]
        let li = document.getElementsByClassName(`${from}-user-button`)[i]

        if (li) {
          li.style.setProperty('--button-color-circle-bg', `${button.color}`)
          li.style.setProperty('--button-color-veil-bg', `${button.color}`)
          li.style.setProperty('--button-color-normal-bg', `${button.color}`)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'style.scss';
</style>
