<template>
  <v-app id="#app" top-toolbar sidebar-under-toolbar footer>
    <v-toolbar>
      <v-toolbar-side-icon @click.native.stop="openSideNav = !openSideNav" />
      <v-toolbar-title> Quick Translator </v-toolbar-title>
      <v-toolbar-items>
        <v-toolbar-item @click.native="minimize"><v-btn icon dark><v-icon>remove</v-icon></v-btn></v-toolbar-item>
        <v-toolbar-item @click.native="fullscreen">
          <v-btn icon dark>
            <v-icon v-if="isFullscreen">fullscreen_exit</v-icon>
            <v-icon v-else>fullscreen</v-icon>
          </v-btn>
        </v-toolbar-item>
        <v-toolbar-item @click.native="exit"><v-btn icon dark><v-icon>clear</v-icon></v-btn></v-toolbar-item>
      </v-toolbar-items>
    </v-toolbar>
    <main>
      <v-sidebar left fixed drawer v-model="openSideNav" close-on-click class="blue darken-2">
        <v-list>
          <v-list-item v-for="i in 3">
            <v-list-tile>
              <v-list-tile-title>Item {{ i }}</v-list-tile-title>
            </v-list-tile>
          </v-list-item>
        </v-list>
      </v-sidebar>
      <v-content>
        <router-view></router-view>
      </v-content>
    </main>
    <v-footer>
      <div class="text-xs-center">Copyright &#169; P-le, 2017</div>
    </v-footer>
  </v-app>
</template>

<script>
  import { ipcRenderer, remote } from 'electron'

  export default {
    name: 'app',
    data: () => {
      return {
        isFullscreen: false,
        openSideNav: false
      }
    },
    created () {
      ipcRenderer.on('GET_TEXT', (event, text) => {
        text = text.split(/\r?\n/).filter(line => line !== '').map(line => line.trimLeft()).join('\r\n')
        ipcRenderer.send('translate', text)
        this.$store.commit('GET_TEXT', {
          text
        })
        this.$vuetify.toast.create('Copied from clipboard!', 'bottom', 1000)
      })
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
  #app {
    min-height: 100%;
  }
  #import {
    position: fixed;
    bottom: 105px;
    right:  19px;
  }
  #take-clipboard {
    position: fixed;
    bottom: 45px;
    right: 10px;
  }
  .toolbar__logo {
    font-size: 1.5rem;
  }
  .toolbar {
    height: 45px;
    padding: 0;
    -webkit-app-region: drag;
  }
  .sidebar {
    margin-top: 45px !important;
  }
  .with.bottom-footer.with.top-toolbar main, .with.bottom-footer.with.top-fixed-toolbar main {
    min-height: calc(100vh - 45px - 45px)
  }
  .with.top-toolbar main > .content {
    padding-top: 0;
  }
  .toolbar > .toolbar__items, .toolbar > .toolbar__side-icon {
    -webkit-app-region: no-drag;
  }
  .tabs__tabs {
    height: 40px;
  }
  .tab__item {
    font-size: 0.8rem;
  }
  .tw {
    position: relative;
    padding-bottom: 2px;
    font-size: 1.3rem;
    transition: 0.4s;
    border-bottom: 3px solid transparent;
    cursor: pointer;
  }
  .underline {
    border-bottom: 3px solid #2196f3;
  }
  .row {
    margin-left: 0;
    margin-right: 0;
  }
</style>
