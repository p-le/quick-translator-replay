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
        console.log(this.$vuetify.toast)
        this.$vuetify.toast.create('Copied from clipboard!', 'bottom', 1000)
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
        this.$vuetify.toast.create('Copied from clipboard!', 'bottom', 1000)
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
  .tw {
    position: relative;
    padding-bottom: 2px;
  }
  .tw:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0%;
    border-bottom: 2px solid #2196f3;
    transition: 0.4s;
  }
  .tw:hover:after {
    width: 100%;
  }
  .row {
    margin-left: 0;
    margin-right: 0;
  }
</style>
