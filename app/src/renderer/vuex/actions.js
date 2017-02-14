import * as types from './mutation-types'

export const getText = ({ commit }, payload) => {
  commit(types.GET_TEXT, payload)
}

export const translatingZhVn = ({ commit }) => {
  commit(types.TRANSLATING_ZHVN)
}

export const translatingModel = ({ commit }) => {
  commit(types.TRANSLATING_MODEL)
}

export const translateZhVnDone = ({ commit }, payload) => {
  commit(types.TRANSLATE_ZHVN_DONE, payload)
}

export const translateModelDone = ({ commit }, payload) => {
  commit(types.TRANSLATE_MODEL_DONE, payload)
}

export const searchText = ({ commit }, payload) => {
  commit(types.SEARCH_TEXT, payload)
}

export const searchTextDone = ({ commit }, payload) => {
  commit(types.SEARCH_TEXT_DONE, payload)
}
