<template>
  <div id="#app" :style="{'min-height': '100%'}">
    <v-navbar>
      <v-navbar-logo></v-navbar-logo>
      <v-navbar-items>
        <v-navbar-item v-bind:item="{ href: '#!', icon: 'remove' }" @click.native="minimize"></v-navbar-item>
        <v-navbar-item v-bind:item="{ href: '#!', icon: isFullscreen ? 'fullscreen_exit' : 'fullscreen' }" @click.native="fullscreen"></v-navbar-item>
        <v-navbar-item v-bind:item="{ href: '#!', icon: 'clear' }" @click.native="exit"></v-navbar-item>
      </v-navbar-items>
    </v-navbar>
    
    <router-view></router-view>
    <v-btn
      v-tooltip:left="{ html: 'Copy Text from Clipboard' }"
      floating
      large
      info
      id="take-clipboard"
      @click.native="getText($event)"
      ripple
    >
      <v-icon>library_books</v-icon>
    </v-btn>
  </div>
</template>

<script>
  import { ipcRenderer, remote } from 'electron'

  export default {
    name: 'app',
    data: () => {
      return {
        isFullscreen: false
      }
    },
    mounted () {
      this.$vuetify.init()
    },
    methods: {
      getText (event) {
        ipcRenderer.send('getText')
      },
      fullscreen () {
        this.isFullscreen = !this.isFullscreen
        remote.getCurrentWindow().setFullScreen(this.isFullscreen)
      },
      exit () {
        remote.app.quit()
      },
      minimize () {
        remote.getCurrentWindow().minimize()
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../../node_modules/vuetify/src/stylus/main';
  @import './css/main.css';

  #take-clipboard {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
  }
  .navbar__logo {
    font-size: 2.3rem;
  }
  .navbar {
    height: 2.4rem;
    -webkit-app-region: drag;
  }
  .navbar__items li {
    -webkit-app-region: no-drag;
  }
</style>
