import * as types from '../mutation-types'

const state = {
  text: '',
  isTranslatingZhVn: false,
  isTranslatingModel: false,
  resultZhVn: '',
  resultByModel: '',
  resultMapByModel: new Map()
}

const mutations = {
  [types.GET_TEXT] (state, payload) {
    state.text = payload.text
  },
  [types.TRANSLATING_MODEL] (state, payload) {
    state.isTranslatingModel = true
  },
  [types.TRANSLATE_MODEL_DONE] (state, payload) {
    const resultMap = new Map(payload.result.map)
    let result = payload.result.lines.join('\r\n')
    /* eslint-disable no-unused-vars */
    for (let [token, translatedToken] of resultMap.entries()) {
      result = result.replace(translatedToken, `<span class="tw">${translatedToken}</span>`)
    }

    state.resultByModel = result
    state.resultMapByModel = resultMap
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
