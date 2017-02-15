import * as types from '../mutation-types'

const state = {
  searchText: '',
  subTokens: [],
  lacvietResult: '',
  babylonResult: '',
  thieuchuuResult: ''
}

const mutations = {
  [types.SEARCH_TEXT] (state, payload) {
    state.searchText = payload.text
  },
  [types.SEARCH_TEXT_DONE] (state, payload) {
    state.subTokens = payload.result.subTokens
    state.lacvietResult = payload.result.lacvietResult
    state.babylonResult = payload.result.babylonResult
    state.thieuchuuResult = payload.result.thieuchuuResult
  }
}

export default {
  state,
  mutations
}
