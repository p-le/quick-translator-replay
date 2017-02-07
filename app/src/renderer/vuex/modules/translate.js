import * as types from '../mutation-types'

const state = {
  text: '',
  han: ''
}

const mutations = {
  [types.RECEIVE_TEXT] (state, payload) {
    state.text = payload.text
  },
  [types.TRANSLATE_HAN] (state, payload) {
    state.han = payload.han
  }
}

export default {
  state,
  mutations
}
