import * as types from '../mutation-types'

const state = {
  text: '',
  onemeaning: '',
  han: ''
}

const mutations = {
  [types.RECEIVE_TEXT] (state, payload) {
    state.text = payload.text
  },
  [types.TRANSLATE_HAN] (state, payload) {
    state.han = payload.han
  },
  [types.TRANSLATE_ONEMEANING] (state, payload) {
    state.onemeaning = payload.onemeaning
  }
}

export default {
  state,
  mutations
}
