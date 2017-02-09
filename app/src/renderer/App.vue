<template>
  <div id="#app">
    <v-navbar>
      <v-navbar-logo>Quick Translator</v-navbar-logo>
      <v-navbar-items>
        <v-navbar-item v-bind:item="{ href: '#!', icon: 'remove' }" @click.native="minimize"></v-navbar-item>
        <v-navbar-item v-bind:item="{ href: '#!', icon: isFullscreen ? 'fullscreen_exit' : 'fullscreen' }" @click.native="fullscreen"></v-navbar-item>
        <v-navbar-item v-bind:item="{ href: '#!', icon: 'clear' }" @click.native="exit"></v-navbar-item>
      </v-navbar-items>
    </v-navbar>
    You are currently at <code>`\{{ $route.fullPath }}`</code> on the <code>`\{{ $route.name }}`</code> view.
    <router-link to="/search">Go to Bar</router-link>
    <router-link to="/">Go to Home</router-link>
    <router-view></router-view>
    <v-btn
      v-tooltip:left="{ html: 'Import from text file' }"
      floating
      info
      id="import"
      @click.native="importText($event)"
      ripple
    >
      <v-icon>note_add</v-icon>
    </v-btn>
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
    created () {
      ipcRenderer.on('GET_TEXT', (event, text) => {
        text = text.split(/\r?\n/).filter(line => line !== '').map(line => line.trimLeft()).join('\r\n')
        ipcRenderer.send('translate', text)
        this.$store.commit('GET_TEXT', {
          text
        })
      })
    },
    mounted () {
      this.$vuetify.init()
    },
    methods: {
      importText (event) {
        remote.dialog.showOpenDialog({properties: [
          'openFile',
          'openDirectory',
          'multiSelections'
        ]}, (filenames) => {
          if (filenames !== undefined) {
            console.log(filenames)
          }
        })
      },
      getText (event) {
        const clipboard = remote.clipboard
        let text = clipboard.readText()
        text = text.split(/\r?\n/).filter(line => line !== '').map(line => line.trimLeft()).join('\r\n')
        ipcRenderer.send('translate', text)
        this.$store.commit('GET_TEXT', {
          text
        })
      },
      fullscreen () {
        this.isFullscreen = !this.isFullscreen
        remote.getCurrentWindow().setFullScreen(this.isFullscreen)
      },
      exit () {
        remote.getCurrentWindow().close()
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

  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  #import {
    position: fixed;
    bottom: 5.2rem;
    right:  1.9rem;
  }
  #take-clipboard {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
  }
  .navbar__logo {
    font-size: 1.6rem;
  }
  .navbar {
    height: 2.4rem;
    -webkit-app-region: drag;
  }
  .navbar__items li {
    -webkit-app-region: no-drag;
  }
  #app {
    min-height: 100%;
    animation: fadein 0.5s;
  }

</style>
