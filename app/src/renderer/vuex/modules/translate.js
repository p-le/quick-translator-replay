import * as types from '../mutation-types'

const state = {
  text: '',
  tokenizedText: [],
  isTranslatingZhVn: false,
  isTranslatingModel: false,
  resultZhVn: '',
  resultByModel: [],
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
    let tokenizedText = state.text
    const resultMap = new Map(payload.result.map)
    let result = payload.result.lines.join('\r\n')
    /* eslint-disable no-unused-vars */
    for (let [token, translatedToken] of resultMap.entries()) {
      tokenizedText = tokenizedText.replace(token, `<span class="tw" @mouseover="mouseover($event)">${token}</span>`)
      result = result.replace(translatedToken, `<span class="tw">${translatedToken}</span>`)
    }
    state.resultByModel = result.split(/\r?\n/).map(lines => `${lines}</br>`)
    state.tokenizedText = tokenizedText.split(/\r?\n/).map(lines => `${lines}</br>`)
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
