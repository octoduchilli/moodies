<template>
  <div class="home">
    <section>
      <div class="content column justi-center align-center">
        <img class="logo" src="/static/img/logo/base.png">
        <div class="description column justi-center align-center width">
          <h1 class="title border-title width animated flipInX">FAN DE FILMS ? REJOIGNEZ NOUS !</h1>
          <p class="description-sentence under-title animated-after-1s fadeIn">Créez et partagez votre liste personnalisée grâce à notre large <router-link class="link color-yellow hover-bg-yellow" to="/library">bibliothèque</router-link>. Commencer <router-link class="link color-yellow hover-bg-yellow" to="/profile/register">maintenant</router-link> !</p>
          <p class="fan-sentence under-title margin-bot -scale animated-after-1s fadeIn">MOODIES : créé par des fans pour des fans !</p>
        </div>
      </div>
    </section>
    <section>
      <demo-buttons :buttons="userButtons.buttons" :i18n="userButtons.i18n"/>
    </section>
    <section class="half">
      <list-films-scroll-left id="isNow" :films="isNow.films" :i18n="isNow.i18n"/>
    </section>
    <section class="half">
      <list-films-scroll-left id="isComing" :films="isComing.films" :i18n="isComing.i18n"/>
    </section>
    <section>
      <demo-buttons :buttons="deviceButtons.buttons" :i18n="deviceButtons.i18n"/>
    </section>
    <section class="half">
      <list-films-scroll-left id="isTopRated" :films="isTopRated.films" :i18n="isTopRated.i18n"/>
    </section>
    <section class="half">
      <list-films-scroll-left id="isPopular" :films="isPopular.films" :i18n="isPopular.i18n"/>
    </section>
    <footer class="home-footer column">
      <div class="wrap width justi-between" style="margin-top: auto">
        <div class="contact row align-center">
          <img src="/static/img/buttons/mail-white.png" alt=" ">
          <p class="margin-10">team@moodies.fr</p>
        </div>
        <a href="https://www.linkedin.com/in/josselin-ada/" class="link linkedin row align-center text-center">
          <img src="/static/img/buttons/linkedin.png" alt="Linkedin">
          <img src="/static/img/buttons/seo-white.png" alt=" ">
          <p>Developed & Designed by Josselin ADA</p>
        </a>
      </div>
    </footer>
  </div>
</template>

<script>
import demoButtons from '@/lib/pods/home/demo-buttons/Component'
import listFilmsScrollLeft from '@/lib/pods/home/list-films-scroll-left/Component'

import httpGetMixin from '@/lib/mixins/httpget'

export default {
  mixins: [httpGetMixin],
  components: {
    demoButtons,
    listFilmsScrollLeft
  },
  data () {
    return {
      userButtons: {
        i18n: {
          title: 'VOTRE LISTE PERSONNALISÉE AVEC MOODIES',
          underTitle: 'Créez votre propre liste de films que vous avez préalablement sélectionné et gérez chacun d\'entre eux avec les options disponibles',
          description: 'Soyez sûr de bien marquer vos films avec les boutons disponibles ci-dessus !'
        },
        buttons: [
          {
            id: 1,
            mouseover: false,
            image: {
              before: '/static/img/buttons/visibility-button-green.png',
              after: '/static/img/buttons/visibility-button-black.png'
            },
            circle: {
              color: 'green'
            },
            description: 'Le bouton <span style="padding: 4px 2px 1px 2px; border: 1px solid lightgreen; color: lightgreen">VUE</span> est utile pour marquer les films que vous avez déjà vu !'
          },
          {
            id: 2,
            mouseover: false,
            image: {
              before: '/static/img/buttons/star-yellow.png',
              after: '/static/img/buttons/star-black.png'
            },
            circle: {
              color: 'yellow'
            },
            description: 'Le bouton <span style="padding: 4px 2px 1px 2px; border: 1px solid yellow; color: yellow">FAVORI</span> est utile pour marquer vos films favoris !'
          },
          {
            id: 3,
            mouseover: false,
            image: {
              before: '/static/img/buttons/add-white.png',
              after: '/static/img/buttons/add-black.png'
            },
            circle: {
              color: 'white'
            },
            description: 'Le bouton <span style="padding: 4px 2px 1px 2px; border: 1px solid white; color: white">PLUS</span> vous permettra de parametrer avec bien plus de détails votre liste de films !'
          }
        ]
      },
      deviceButtons: {
        i18n: {
          title: 'ADAPTÉ À TOUS VOS ECRANS',
          underTitle: 'Nous sommes fiers de vous informer que MOODIES est adapté à tous vos écrans !',
          description: 'Soyez connecté partout, à tout moment et en toutes circonstances à votre liste de films personnalisées et restez en contact avec la communauté de MOODIES'
        },
        buttons: [
          {
            id: 1,
            mouseover: false,
            image: {
              width: 80,
              before: '/static/img/devices/macbook.png',
              after: '/static/img/devices/macbook.png'
            },
            circle: {
              color: 'pink-veil'
            },
            description: 'Naviguez tranquilement sur votre <span style="background: rgb(161, 250, 250); color: black">ORDINATEUR</span> et profitez un maximum des nos services !'
          },
          {
            id: 2,
            mouseover: false,
            image: {
              width: 60,
              before: '/static/img/devices/tablet.png',
              after: '/static/img/devices/tablet.png'
            },
            circle: {
              color: 'pink-veil'
            },
            description: 'Soyez au Top avec votre <span style="background: rgb(161, 250, 250); color: black">TABLETTE</span>, likez, aimez et partagez vos derniers coup de coeurs !'
          },
          {
            id: 3,
            mouseover: false,
            image: {
              width: 40,
              before: '/static/img/devices/smartphone.png',
              after: '/static/img/devices/smartphone.png'
            },
            circle: {
              color: 'pink-veil'
            },
            description: 'À tout moment sur votre <span style="background: rgb(161, 250, 250); color: black">TÉLÉPHONE</span> connectez vous et actualisez votre liste de films !'
          }
        ]
      },
      isNow: {
        i18n: {
          title: 'FILMS À L\'AFFICHE',
          underTitle: 'PAR ORDRE DE POPULARITÉ'
        },
        films: []
      },
      isComing: {
        i18n: {
          title: 'FILMS À VENIR',
          underTitle: 'PAR ORDRE DE POPULARITÉ'
        },
        films: []
      },
      isTopRated: {
        i18n: {
          title: 'FILMS LES MIEUX NOTÉS'
        },
        films: []
      },
      isPopular: {
        i18n: {
          title: 'FILMS POPULAIRES'
        },
        films: []
      }
    }
  },
  created () {
    this.$store.state.route.selected = 0
    this.httpGet(`https://api.themoviedb.org/3/movie/now_playing?api_key=3836694fa8a7ae3ea69b5ff360b3be0b&language=fr-FR&page=1&region=fr&append_to_response=releases`).then(_ => {
      this.isNow.films = _.results
    })
    this.httpGet(`https://api.themoviedb.org/3/movie/upcoming?api_key=3836694fa8a7ae3ea69b5ff360b3be0b&language=en-US&page=1&region=fr&append_to_response=releases`).then(_ => {
      this.isComing.films = _.results
    })
    this.httpGet(`https://api.themoviedb.org/3/movie/top_rated?api_key=3836694fa8a7ae3ea69b5ff360b3be0b&language=fr-FR&page=1&region=fr`).then(_ => {
      this.isTopRated.films = _.results
    })
    this.httpGet(`https://api.themoviedb.org/3/movie/popular?api_key=3836694fa8a7ae3ea69b5ff360b3be0b&language=fr-FR&page=1&region=fr`).then(_ => {
      this.isPopular.films = _.results
    })
  },
  destroyed () {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'auto'
    })
  }
}
</script>

<style lang="scss" scoped>
@import 'style.scss';
</style>
