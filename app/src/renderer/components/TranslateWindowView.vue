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
                  <span v-for="(token, j) in line"  :class="['tw', `tw-${i}${j}`]" 
                    @mouseover="mouseover($event)" @mouseout="mouseout($event)" 
                    @click="clickOriginal($event)">{{token}}</span><br />
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
              <v-card-text v-else >
                <p v-for="(line, i) in tokenizedTranslateLines">
                    <span v-for="(token, j) in line" :class="['tw', `tw-${i}${j}`]" 
                     @mouseover="mouseover($event)" @mouseout="mouseout($event)"
                      @click="clickTranslated($event)" @contextmenu="rightClickTranslated($event)">
                      {{token.indexOf('/') > -1 ? token.split('/')[0] + '*' : token}}
                    </span><br />
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
    </v-row>
    <v-row>
      <v-col xs3="xs3">
        <div class="text-xs-center search_container" id="search_words_container">
          <v-chip 
            class="primary white--text"
            v-if="searchText.length > 0"
            @click.native="clickSubtoken($event)"
          >
            {{ searchText }}
          </v-chip>
          <div id="subtoken_container">
            <v-chip outline 
              class="primary primary--text"
              v-for="token in subTokens"
              v-if="subTokens.length > 1" 
              @click.native="clickSubtoken($event)"
            >
              {{token}}
            </v-chip>
          </div>
        </div>
      </v-col>
      <v-col xs9="xs9">
        <div class="search_container" id="search_result_container">
          <p v-for="line of lacvietResult">
            {{ line }}
          </p>
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
    data: () => {
      return {
        lastTokens: []
      }
    },
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
      ipcRenderer.on('search/dict/text/result', (event, result) => {
        this.$store.commit('SEARCH_TEXT_DONE', {
          result: result
        })
      })
      ipcRenderer.on('search/dict/subtoken/result', (event, result) => {
        this.$store.commit('SEARCH_SUBTOKEN_DONE', {
          result: result
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
      clickOriginal (event) {
        const tokens = document.getElementsByClassName(event.target.className)
        this.lastTokens.map(token => {
          token.className = token.className.replace(' selected', '')
        })
        this.lastTokens = Array.from(tokens)
        Array.from(tokens).map(token => {
          token.className += ' selected'
        })

        const selected = event.target.innerText
        this.$store.commit('SEARCH_TEXT', {
          text: selected
        })
        ipcRenderer.send('search/dict/text', selected)
      },
      clickTranslated (event) {
        const tokens = document.getElementsByClassName(event.target.className)
        this.lastTokens.map(token => {
          token.className = token.className.replace(' selected', '')
        })
        this.lastTokens = Array.from(tokens)
        Array.from(tokens).map(token => {
          token.className += ' selected'
        })

        const selected = Array.from(tokens).filter(token => token.innerText !== event.target.innerText)[0].innerText
        this.$store.commit('SEARCH_TEXT', {
          text: selected
        })
        ipcRenderer.send('search/dict/text', selected)
      },
      clickSubtoken (event) {
        const selected = event.target.innerText
        ipcRenderer.send('search/dict/subtoken', selected)
      },
      rightClickTranslated (event) {
        console.log(event.target)
        menu.popup(remote.getCurrentWindow())
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
  height: 450px;
  overflow: auto;
}
.chip {
  font-size: 16px;
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

#search_words_container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.tw {
  position: relative;
  padding: 4px 1px 2px 1px;
  font-size: 1.3rem;
  transition: 0.4s;
  border-bottom: 3px solid transparent;
  cursor: pointer;
}
.tw.underline {
  border-bottom: 3px solid #2196f3;
}
.tw.selected {
  background-color: #2196f3;
  color: white;
  border-radius: 5px;
}
.search_container {
  padding: 10px 0;
  height: calc(100vh - 45px - 45px - 450px - 40px);
  overflow-y: auto;

}
.search_container > p {
  margin-bottom: 0;
}
#search_words_container {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
}
#search_result_container {
  display: flex;
  flex-direction: column;
}
#subtoken_container {
  width: 80%;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
</style>
