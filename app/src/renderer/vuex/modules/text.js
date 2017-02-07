import * as types from '../mutation-types'

const state = {
  text: ''
}

const mutations = {
  [types.RECEIVE_TEXT] (state, payload) {
    state.text = payload.text
  }
}

export default {
  state,
  mutations
}
