<template>
  <div id="#app">
    <router-view></router-view>
  </div>
</template>

<script>
  import store from 'renderer/vuex/store'
  export default {
    store,
    name: 'app',
    mounted () {
      this.$vuetify.init()
    }
  }
</script>

<style lang="stylus">
  @import '../../../node_modules/vuetify/src/stylus/main';
</style>
