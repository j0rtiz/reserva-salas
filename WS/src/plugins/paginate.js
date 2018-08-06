export default ({ app, router, Vue }) => {
  Vue.prototype.$paginate = {
    paginate: paginate
  }
}

/**
 * Efetua a Paginação de uma array
 * @param {*} array
 * @param {*} PageSize Quantidade de elementos por página
 * @param {*} PageNumber Página atual
 */
function paginate (array, PageSize, PageNumber) {
  --PageNumber // As páginas começam com 1, mas as arrays começam com 0
  return array.slice(PageNumber * PageSize, (PageNumber + 1) * PageSize)
}
