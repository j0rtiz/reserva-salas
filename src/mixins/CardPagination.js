export const CoreCardPaginationMixin = {
  data () {
    return {
      CardPagination: {
        current: 1,
        max: 0,
        PerPage: 6,
        Cards: []
      }
    }
  },
  computed: {
    lstCardPagination () {
      return this.$paginate.paginate(this.CardPagination.Cards, this.CardPagination.PerPage, this.CardPagination.current)
    }
  },
  watch: {
    'CardPagination.Cards' (Cards) {
      this.CardPagination.current = 1
      this.CardPagination.max = Math.ceil(Object.keys(Cards).length / this.CardPagination.PerPage)
    }
  }
}
