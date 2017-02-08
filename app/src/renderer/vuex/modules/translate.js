import * as types from '../mutation-types'

const state = {
  text: '',
  isTranslatingZhVn: false,
  isTranslatingModel: false,
  resultZhVn: '',
  resultModel: ''
}

const mutations = {
  [types.GET_TEXT] (state, payload) {
    state.text = payload.text
  },
  [types.TRANSLATING_MODEL] (state, payload) {
    state.isTranslatingModel = true
  },
  [types.TRANSLATE_MODEL_DONE] (state, payload) {
    state.isTranslatingModel = false
    state.resultModel = payload.result
  },
  [types.TRANSLATING_ZHVN] (state, payload) {
    state.isTranslatingZhVn = true
  },
  [types.TRANSLATE_ZHVN_DONE] (state, payload) {
    state.isTranslatingZhVn = false
    state.resultZhVn = payload.result
  }
}

export default {
  state,
  mutations
}
