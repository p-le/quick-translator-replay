<template>
  <v-container fluid>
    {{ searchText }}
  </v-container>
</template>

<script>
  export default {
    name: 'test-window',
    computed: {
      searchText () {
        return this.$store.getters.searchText
      }
    }
  }
</script>

<style scoped>
</style>
