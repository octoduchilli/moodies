export default {
  methods: {
    w500 (file1, file2) {
      if (file1) {
        return `https://image.tmdb.org/t/p/w500${file1}`
      } else if (file2) {
        return `https://image.tmdb.org/t/p/w500${file2}`
      } else {
        return `/static/img/utils/no-photo.png`
      }
    },
    original (file1, file2) {
      if (file1) {
        return `https://image.tmdb.org/t/p/original${file1}`
      } else if (file2) {
        return `https://image.tmdb.org/t/p/original${file2}`
      } else {
        return `/static/img/utils/no-image.png`
      }
    }
  }
}
