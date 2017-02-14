<template>
  <v-container fluid>
    <v-row>
      <v-col xs5="xs5">
        <v-tabs grow>
          <v-tab-item href="#c" ripple slot="activators">Gốc</v-tab-item>
          <v-tab-item href="cv" ripple slot="activators">Trung</v-tab-item>
          <v-tab-content id="c" slot="content">
            <v-card>
              <v-card-text @mouseup="select" v-if="isTranslatingModel" v-html="text"> 
              </v-card-text>
              <v-card-text @mouseup="select" v-else v-html="tokenizedText"> 
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
              <v-card-text v-else v-html="resultByModel">
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
      <v-col xs12="xs12">
        <v-chip class="primary white--text" >{{ searchText }}</v-chip>
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
      tokenizedText () {
        return this.$store.getters.tokenizedText
      },
      resultZhVn () {
        return this.$store.getters.resultZhVn
      },
      resultByModel () {
        return this.$store.getters.resultByModel
      },
      searchText () {
        return this.$store.getters.searchText
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
  font-size: 24px;
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
