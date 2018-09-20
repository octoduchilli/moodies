<template>
  <div class="index width height">
    <h1 class="text-center">Dans notre bibliothèque</h1>
    <p class="margin-20">Retrouvez tout les films que vous avez vu ou que vous voulez voir grâce aux filtres mis à votre disposition dans le panneau de recherches.</p>
    <p class="margin-20">La bibliothèque est divisée en deux types de recherche : </p>
    <ul class="list">
      <li class="margin-20">Recherche <span class="orange">Nom</span> par titre pour un film ou par nom et/ou prénom pour une personnalité.</li>
      <li class="margin-20">Recherche <span class="plum">Découverte</span> pour une liste de films trié par genres et années.</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'index'
}
</script>

<style lang="scss" scoped>
  @import 'style.scss';
</style>
