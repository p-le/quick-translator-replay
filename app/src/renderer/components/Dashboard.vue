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
                  <pre>{{ han }}</pre>
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
                <v-card-text>
                  <pre>
                    {{ onemeaning }}
                  </pre>
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
    name: 'dashboard',
    computed: {
      text () {
        return this.$store.getters.text
      },
      han () {
        return this.$store.getters.han
      },
      onemeaning () {
        return this.$store.getters.onemeaning
      }
    },
    created () {
      ipcRenderer.on('onemeaning', (event, arg) => {
        this.$store.commit('TRANSLATE_ONEMEANING', arg)
      })
      ipcRenderer.on('han', (event, arg) => {
        this.$store.commit('TRANSLATE_HAN', arg)
      })
      ipcRenderer.on('textReceived', (event, arg) => {
        this.$store.commit('RECEIVE_TEXT', {
          text: arg
        })
      })
      ipcRenderer.send('loadDict')
      ipcRenderer.on('hanviet', (event, arg) => {
        const dict = new Map(JSON.parse(arg))
        console.log(dict.size)
      })
    },
    methods: {
      select () {
        const selected = window.getSelection().toString()
        if (selected.length > 0) {
          ipcRenderer.send('translate', selected)
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
  height: 50px !important;
}
.tabs__item {
  height: 400px;
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
</style>
