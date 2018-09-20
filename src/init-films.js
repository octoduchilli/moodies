// POUR INIT LES FILMS DANS ADDED

// db.ref('films/added').once('value', films => {
//   let f = films.val()
//   let i = 0

//   for (let index in f) {
//     i++
//     let film = f[index]

//     setTimeout(() => {
//       this.$http.get(`https://api.themoviedb.org/3/movie/${film.id}?api_key=3836694fa8a7ae3ea69b5ff360b3be0b&language=fr&append_to_response=releases,recommendations,credits`).then(res => {
//         let f = res.body
//         let release = f.releases.countries.find(_ => String(_.iso_3166_1) === 'FR') ? f.releases.countries.find(_ => String(_.iso_3166_1) === 'FR').release_date : f.release_date

//         db.ref(`films/added/${f.id}`).set({
//           id: f.id,
//           title: f.title,
//           poster_path: f.poster_path,
//           runtime: f.runtime,
//           popularity: f.popularity,
//           genres: f.genres,
//           release_date: release
//         })

//         console.log(f)
//       })
//     }, 500 * i)
//   }
// })
