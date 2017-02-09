<template>
  <v-container fluid>
    <v-row>
      <v-col xs5="xs5">
        <v-tabs grow>
          <v-tabs-tabs>
            <v-tab-item :item="{ text: 'Gốc', href: '#c'}" ripple></v-tab-item>
            <v-tab-item :item="{ text: 'Trung', href: '#cv'}" ripple></v-tab-item>
          </v-tabs-tabs>
          <v-tabs-items>
            <v-tabs-item id="c">
              <v-card>
                <v-card-text @mouseup="select">
                  <pre>{{ text }}</pre>
                </v-card-text>
              </v-card>
            </v-tabs-item>
            <v-tabs-item id="cv">
              <v-card>
                <v-card-text>
                  <pre>{{ resultZhVn }}</pre>
                </v-card-text>
              </v-card>
            </v-tabs-item>
          </v-tabs-items>
        </v-tabs>
      </v-col>
      <v-col xs7="xs7">
        <v-tabs grow>
          <v-tabs-tabs>
            <v-tab-item :item="{ text: 'Dịch 1 nghĩa', href: '#one-meaning' }" ripple></v-tab-item>
            <v-tab-item :item="{ text: 'Dịch nhiều nghĩa', href: '#multi-meaning' }" ripple></v-tab-item>
          </v-tabs-tabs>
          <v-tabs-items>
            <v-tabs-item id="one-meaning">
              <v-card>
                <v-card-text v-if="isTranslatingModel" id="loading">
                  <v-progress-circular indeterminate v-bind:size="50" class="primary--text"></v-progress-circular>
                </v-card-text>
                <v-card-text v-else>
                  <pre>{{ resultModel }}</pre>
                </v-card-text>
              </v-card>
            </v-tabs-item>
            <v-tabs-item id="multi-meaning">
              <v-card>
                <v-card-text>...</v-card-text>
              </v-card>
            </v-tabs-item>
          </v-tabs-items>
        </v-tabs>
      </v-col>
    </v-row>
    <v-row>
      <v-col xs2="xs2">河伯</v-col>
      <v-col xs10="xs10"></v-col>
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
      text () {
        return this.$store.getters.text
      },
      resultZhVn () {
        return this.$store.getters.resultZhVn
      },
      resultModel () {
        return this.$store.getters.resultModel
      },
      isTranslatingZhVn () {
        return this.$store.getters.isTranslatingZhVn
      },
      isTranslatingModel () {
        return this.$store.getters.isTranslatingModel
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
            this.$store.commit('TRANSLATE_MODEL_DONE', { result: args.result })
            break
        }
      })
    },
    methods: {
      select () {
        const selected = window.getSelection().toString()
        if (selected.length > 0) {
          ipcRenderer.send('search/dict', selected)
          // menu.popup(remote.getCurrentWindow())
        }
      }
    }
  }
</script>

<style scoped>
v-container {
  margin-top: 1rem;
}
.tabs__tabs {
  height: 40px;
}
.tabs__item {
  height: 500px;
  overflow: auto;
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
