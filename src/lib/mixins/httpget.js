export default {
  methods: {
    httpGet (http) {
      let body = this.$http.get(http).then(res => {
        return res.body
      })
      return body
    }
  }
}
