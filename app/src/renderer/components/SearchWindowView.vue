<template>
  <v-container fluid>
    {{ searchText }}
  </v-container>
</template>

<script>
  import { ipcRenderer } from 'electron'
  export default {
    name: 'search-window',
    computed: {
      searchText () {
        return this.$store.getters.searchText
      }
    },
    created () {
      ipcRenderer.on('search/dict/text', (event, arg) => {
        console.log(event, arg)
        this.$store.commit('SEARCH_TEXT', arg)
      })
    }
  }
</script>

<style scoped>
</style>
