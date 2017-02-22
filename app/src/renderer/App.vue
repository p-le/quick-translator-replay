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
      <v-sidebar left fixed drawer v-model="openSideNav" closeOnClick class="blue darken-2">
        <v-list>
          <v-list-item>
            <v-list-tile router ripple href="/">
                <v-list-tile-title>Translate</v-list-tile-title> 
            </v-list-tile>
          </v-list-item>
          <v-list-item>
            <v-list-tile router ripple href="/dict">
                <v-list-tile-title>Dict</v-list-tile-title> 
            </v-list-tile>
          </v-list-item>
          <v-list-item>
            <v-list-tile router ripple href="/test">
                <v-list-tile-title>Test</v-list-tile-title> 
            </v-list-tile>
          </v-list-item>
        </v-list>
      </v-sidebar>
      <v-modal v-model="helpModal" bottom>
          <v-card class="secondary white--text">
            <v-card-text class="subheading white--text">
              <v-row>
                <v-col xs10>
                  <v-list>
                    <v-list-item>
                      Ấn tổ hợp shortcut CRTL + V để Copy Text
                    </v-list-item>
                    <v-list-item>
                      Ấn tổ hợp Alt + Left Click để lựa chọn từ
                    </v-list-item>
                  </v-list>
                </v-col>
                <v-col xs2>
                    <v-btn primary dark @click.native="helpModal = false">Đóng</v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-modal>
      <v-content>
        <router-view></router-view>
        <v-btn floating="floating" id="help__button" primary dark @click.native="helpModal = true">
          <v-icon large>help_outline</v-icon>
        </v-btn>
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
        openSideNav: false,
        items: [
          { text: 'Translate', href: '/' },
          { text: 'Dict', href: '/dict' },
          { text: 'Test', href: '/test' }
        ],
        helpModal: false
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
  .list__tile--active > .list__tile__title {
    color: #fff !important;
    border-bottom: 2px solid white;
  }
  .list__tile__title {
    padding-bottom: 10px;
  }
  .row {
    margin-left: 0;
    margin-right: 0;
  }
  .row .col {
    padding-left: 0;
    padding-right: 0;
  }
  .chip {
    cursor: pointer;
  }
  .title {
    text-align: center;
  }
  #help__button {
    position: fixed;
    bottom: 50px;
    right: 5px;
  }
</style>
