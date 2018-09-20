export default {
  methods: {
    YMDtoDate (YMD) {
      YMD = YMD.split('-')
      let Y = YMD[0]
      let M = YMD[1] - 1
      let D = YMD[2]
      let months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
      return `${D} ${months[Number(M)]} ${Y}`
    },
    minToHM (min) {
      let H = Math.floor(min / 60)
      let M = min % 60
      return `${H} h ${M}`
    },
    minToMDHM (min) {
      let M = Math.floor(min / (24 * 30 * 60)) % 12
      let D = Math.floor(min / (24 * 60)) % 30
      let H = Math.floor(min / 60) % 24
      let m = min % 60
      return `${M} mois, ${D} jours, ${H} heures, ${m} minutes`
    }
  }
}
