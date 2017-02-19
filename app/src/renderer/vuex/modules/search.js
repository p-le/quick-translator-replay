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
    console.log(payload.result.subTokens)
    state.subTokens = payload.result.subTokens
    if (payload.result.lacvietResult.indexOf('\\n') > -1) {
      state.lacvietResult = payload.result.lacvietResult.split('\\n').map(line => line.replace('\\t', ''))
    } else {
      state.lacvietResult = [payload.result.lacvietResult]
    }
    console.log(state.lacvietResult)
    state.babylonResult = payload.result.babylonResult
    state.thieuchuuResult = payload.result.thieuchuuResult
  }
}

export default {
  state,
  mutations
}
