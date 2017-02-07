import * as types from './mutation-types'

export const decrementMain = ({ commit }) => {
  commit(types.DECREMENT_MAIN_COUNTER)
}

export const incrementMain = ({ commit }) => {
  commit(types.INCREMENT_MAIN_COUNTER)
}

export const receiveText = ({ commit }, payload) => {
  commit(types.RECEIVE_TEXT, payload)
}

export const translateHan = ({ commit }, payload) => {
  commit(types.TRANSLATE_HAN, payload)
}
