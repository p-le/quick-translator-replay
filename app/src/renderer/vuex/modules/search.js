import * as types from '../mutation-types'

const state = {
  searchText: ''
}

const mutations = {
  [types.SEARCH_TEXT] (state, payload) {
    state.searchText = payload.text
  }
}

export default {
  state,
  mutations
}
