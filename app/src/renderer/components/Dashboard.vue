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
                  {{ text }}
                </v-card-text>
              </v-card>
            </v-tabs-item>
            <v-tabs-item id="cv">
              <v-card>
                <v-card-text>
                </v-card-text>
              </v-card>
            </v-tabs-item>
          </v-tabs-items>
        </v-tabs>
      </v-col>
      <v-col xs7="xs7">
        <v-tabs grow>
          <v-tabs-tabs>
            <v-tab-item v-for="i in 3" v-bind:item="{ text: 'Item ' + i, href: '#mobile-tabs-2-' + i }" ripple></v-tab-item>
          </v-tabs-tabs>
          <v-tabs-items>
            <v-tabs-item v-for="i in 3" v-bind:id="'mobile-tabs-2-' + i">
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
      }
    },
    created () {
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
</style>
