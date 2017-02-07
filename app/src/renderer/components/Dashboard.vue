<template>
  <v-container>
    <v-row>
      <v-col xs4="xs4">
        <v-btn @click.native="getText($event)" ripple info>Get Text</v-btn>
      </v-col>
      <v-col xs8="xs8">
        {{ text }}
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { ipcRenderer } from 'electron'

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
      translate (event) {
        ipcRenderer.send('translate', event.target.value)
      },
      getText (event) {
        ipcRenderer.send('getText')
      }
    }
  }
</script>

<style scoped>
v-container {
  margin-top: 1rem;
}
</style>
