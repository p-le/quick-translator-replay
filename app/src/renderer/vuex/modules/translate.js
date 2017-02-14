import * as types from '../mutation-types'

const state = {
  text: '',
  tokenizedLines: [],
  isTranslatingZhVn: false,
  isTranslatingModel: false,
  resultZhVn: '',
  tokenizedTranslateLines: [],
  translateMap: new Map()
}

const mutations = {
  [types.GET_TEXT] (state, payload) {
    state.text = payload.text
  },
  [types.TRANSLATING_MODEL] (state, payload) {
    state.isTranslatingModel = true
  },
  [types.TRANSLATE_MODEL_DONE] (state, payload) {
    state.tokenizedLines = payload.result.tokenizedLines
    state.tokenizedTranslateLines = payload.result.tokenizedTranslateLines
    state.translateMap = new Map(payload.result.map)
    state.isTranslatingModel = false
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
