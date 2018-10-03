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
        <p>Pour le moment votre liste principale est composée de deux listes distinctes, <span class="view border">VUS</span> et <span class="favorite border">FAVORIS</span> . Ces deux listes, comme toutes les listes personnalisées que vous allez créer, sont actionnable à plusieurs points de vue (nous verrons par la suite les différents boutons liés à vos listes).</p>
      </section>
      <section>
        <h1>En suivant ce tutoriel</h1>
        <p>Vous apprendrez à créer, modifier et gérer vos listes mais surtout à utiliser le plein potentiel de Moodies !</p>
      </section>
    </div>
    <div v-show="__step === '2'" class="padding-20 column">
      <section>
        <h1>Votre première liste personnalisée</h1>
        <p>Pour la création de votre première liste personnalisée nous allons partir sur un thème plutôt commun. Votre nouvelle liste aura pour titre "Films à voir" et son label "SEE". Pour information, le titre d'une liste est limité à <span style="color: lightgreen">50 caractères</span> et à <span style="color: lightgreen">3 caractères</span> pour le label.</p>
        <p>Cette première liste comme vous pouvez très facilement l'imaginé, vous permettra d'ajouter des films </p>
      </section>
      <section>
        <h1>Choisir une couleur</h1>
        <p>Pour différencier vos listes et apporter une meilleur visibilité, commencez par définir la couleur de votre nouvelle liste avec l'outil mis à votre disposition ci-dessous.</p>
        <div id="color-picker-container" class="margin"></div>
        <h2 style="margin: 10px auto">Couleur de la liste</h2>
        <p>Conseil : évitez les couleurs trop sombres pour bien voir plus facilement le label de votre liste</p>
      </section>
    </div>
    <div class="wrap justi-center">
      <basic-link-button class="margin-10" style="width: 170px" v-if="__step !== '1'" :button="buttons.previous"/>
      <basic-link-button class="margin-10" style="width: 170px" :button="buttons.next"/>
    </div>
  </div>
</template>

<script>
import iro from '@jaames/iro'

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
  },
  computed: {
    __step () {
      return this.$route.query.step
    }
  },
  watch: {
    '__step': {
      handler (step) {
        step = Number(step)

        let buttons = this.buttons

        buttons.previous.path = `/account/my-list/tutorial?step=${step - 1}`
        buttons.next.path = `/account/my-list/tutorial?step=${step + 1}`

        window.scroll({
          top: 0
        })
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'style.scss';
</style>
