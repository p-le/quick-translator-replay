<template>
  <v-container>
    <v-row>
      <v-col xs4="xs4">
        <div @mouseup="select">
          {{ text }}
        </div>
      </v-col>
      <v-col xs8="xs8">
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { ipcRenderer, remote } from 'electron'
  const { Menu, MenuItem } = remote
  const menu = new Menu()
  menu.append(new MenuItem({ label: 'Add Vietpharse', click () { console.log('item 1 clicked') }}))
  menu.append(new MenuItem({ type: 'separator'}))
  menu.append(new MenuItem({ label: 'Add Name' }))

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
    },
    methods: {
      select () {
        const selected = window.getSelection().toString()
        if (selected.length > 0) {
          ipcRenderer.send('translate', selected)
          menu.popup(remote.getCurrentWindow())
        }
      }
    }
  }
</script>

<style scoped>
v-container {
  margin-top: 1rem;
}
</style>
