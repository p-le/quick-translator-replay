<template>
  <v-container fluid>
    <v-row>
      <v-col xs5="xs5">
        <v-tabs grow>
          <v-tab-item href="#c" ripple slot="activators">Gốc</v-tab-item>
          <v-tab-item href="cv" ripple slot="activators">Trung</v-tab-item>
          <v-tab-content id="c" slot="content">
            <v-card>
              <v-card-text @mouseup="select" v-if="isTranslatingModel">
                {{ text }} 
              </v-card-text>
              <v-card-text @mouseup="select" v-else>
                <p v-for="(line, i) in tokenizedLines">
                  <span v-for="(token, j) in line"  :class="['tw', `tw-${i}${j}`]" @mouseover="mouseover($event)" @mouseout="mouseout($event)" @click="click($event)">{{token}}</span><br />
                </p>
              </v-card-text>
            </v-card>
          </v-tab-content>
          <v-tab-content id="cv" slot="content">
            <v-card>
              <v-card-text>
                <pre>{{ resultZhVn }}</pre>
              </v-card-text>
            </v-card>
          </v-tab-content>
        </v-tabs>
      </v-col>
      <v-col xs7="xs7">
        <v-tabs grow>
          <v-tab-item href="#one-meaning" ripple slot="activators">Dịch 1 nghĩa</v-tab-item>
          <v-tab-item href="#multi-meaning" ripple slot="activators">Dịch nhiều nghĩa</v-tab-item>
          <v-tab-content id="one-meaning" slot="content">
            <v-card>
              <v-card-text v-if="isTranslatingModel" id="loading">
                <v-progress-circular indeterminate v-bind:size="50" class="primary--text"></v-progress-circular>
              </v-card-text>
              <v-card-text v-else>
                <p v-for="(line, i) in tokenizedTranslateLines">
                  <span v-for="(token, j) in line" :class="['tw', `tw-${i}${j}`]" @mouseover="mouseover($event)" @mouseout="mouseout($event)">{{token + ' '}}</span><br />
                </p>
              </v-card-text>
            </v-card>
          </v-tab-content >
          <v-tab-content id="multi-meaning" slot="content">
            <v-card>
              <v-card-text>...</v-card-text>
            </v-card>
          </v-tab-content>
        </v-tabs>
      </v-col>
      <v-col xs3="xs3">
        <div class="text-xs-center">
          <v-chip class="primary white--text" >{{ searchText }}</v-chip>
          <v-chip class="primary white--text" v-for="token in subTokens">{{token}}</v-chip>
        </div>
      </v-col>
            <v-col xs3="xs3">
        <div class="text-xs-center">
          <v-chip class="primary white--text" >{{ lacvietResult }}</v-chip>
        </div>
      </v-col>
      <v-col xs3="xs3">
        <div class="text-xs-center">
          <v-chip class="primary white--text" >{{ babylonResult }}</v-chip>
        </div>
      </v-col>
      <v-col xs3="xs3">
        <div class="text-xs-center">
          <v-chip class="primary white--text" >{{ thieuchuuResult }}</v-chip>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { ipcRenderer, remote } from 'electron'
  const { Menu, MenuItem } = remote
  const menu = new Menu()
  menu.append(new MenuItem({label: 'Add Vietpharse', click () { console.log('item 1 clicked') }}))
  menu.append(new MenuItem({type: 'separator'}))
  menu.append(new MenuItem({label: 'Add Name'}))

  export default {
    name: 'trasnlate-window',
    computed: {
      isTranslatingZhVn () {
        return this.$store.getters.isTranslatingZhVn
      },
      isTranslatingModel () {
        return this.$store.getters.isTranslatingModel
      },
      text () {
        return this.$store.getters.text
      },
      tokenizedLines () {
        return this.$store.getters.tokenizedLines
      },
      resultZhVn () {
        return this.$store.getters.resultZhVn
      },
      tokenizedTranslateLines () {
        return this.$store.getters.tokenizedTranslateLines
      },
      searchText () {
        return this.$store.getters.searchText
      },
      subTokens () {
        return this.$store.getters.subTokens
      },
      lacvietResult () {
        return this.$store.getters.lacvietResult
      },
      babylonResult () {
        return this.$store.getters.babylonResult
      },
      thieuchuuResult () {
        return this.$store.getters.thieuchuuResult
      }
    },
    created () {
      ipcRenderer.on('model', (event, arg) => {
        this.$store.commit('TRANSLATE_ONEMEANING', arg)
      })
      ipcRenderer.on('translate/by/ZhVn', (event, args) => {
        switch (args.status) {
          case true:
            this.$store.commit('TRANSLATING_ZHVN')
            break
          case false:
            this.$store.commit('TRANSLATE_ZHVN_DONE', { result: args.result })
            break
        }
      })
      ipcRenderer.on('translate/by/model', (event, args) => {
        switch (args.status) {
          case true:
            this.$store.commit('TRANSLATING_MODEL')
            break
          case false:
            this.$store.commit('TRANSLATE_MODEL_DONE', { result: JSON.parse(args.result) })
            break
        }
      })
      ipcRenderer.on('search/dict/result', (event, result) => {
        console.log(result)
        this.$store.commit('SEARCH_TEXT_DONE', {
          result
        })
      })
    },
    methods: {
      select () {
        const selected = window.getSelection().toString()
        if (selected.length > 0) {
          this.$store.commit('SEARCH_TEXT', {
            text: selected
          })
          ipcRenderer.send('search/dict/text', selected)
          window.getSelection().removeAllRanges()
          // menu.popup(remote.getCurrentWindow())
        }
      },
      click (event) {
        const selected = event.target.innerText
        this.$store.commit('SEARCH_TEXT', {
          text: selected
        })
        ipcRenderer.send('search/dict/text', selected)
      },
      mouseover (event) {
        const tokens = document.getElementsByClassName(event.target.className)
        Array.from(tokens).map(token => {
          token.className += ' underline'
        })
      },
      mouseout (event) {
        const tokens = document.getElementsByClassName(event.target.className)
        Array.from(tokens).map(token => {
          token.className = token.className.replace(' underline', '')
        })
      }
    }
  }
</script>

<style scoped>
.tabs__item {
  height: 500px;
  overflow: auto;
}
.chip {
  font-size: 20px;
}
.row .col {
  padding: 0 !important;
}
::-webkit-scrollbar {
    width: 10px;
}

::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); 
    border-radius: 10px;
}
 
::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); 
}

#loading {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
