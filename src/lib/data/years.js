export default {
  years () {
    let nbYear = new Date().getYear()
    let years = [
      {
        id: 0,
        name: 'Toutes',
        value: 0
      }
    ]

    for (let i = 0; i < nbYear; i++) {
      years.push(
        {
          id: i + 1,
          name: (1900 + nbYear) - i,
          value: (1900 + nbYear) - i
        }
      )
    }

    return years
  }
}
