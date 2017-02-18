<template>
  <v-container fluid>
    <v-row>
      <v-col xs2="xs2">
        <v-card class="blue darken-2 white--text dict" v-for="dict in dicts">
          <v-card-row height="50px">
            <v-card-title>
              {{ dict.name }}
            </v-card-title>
          </v-card-row>
          <v-card-row actions>
            <v-btn flat class="white--text" @click.native="viewDict(dict.name)">{{ dict.size }}</v-btn>
          </v-card-row>
        </v-card>
      </v-col>
      <v-col xs10="xs10">
        <div>
            <v-text-input  name="search" 
              label="Testing 2" 
              v-model="text"
            ></v-text-input>
        </div>
        <div>
          
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { ipcRenderer } from 'electron'
  export default {
    name: 'dict-window',
    data: () => {
      return {
        dicts: []
      }
    },
    created () {
      ipcRenderer.send('dict/count')
      ipcRenderer.on('dict/count/result', (event, result) => {
        for (let prop in result) {
          if (result.hasOwnProperty(prop)) {
            this.dicts.push({
              name: prop,
              size: result[prop]
            })
          }
        }
        console.log(this.dicts)
      })
    },
    methods: {
      viewDict (name) {
        console.log(name)
      }
    }
  }
</script>

<style scoped>
.dict {
  height: calc((100vh - 45px - 45px)/6) !important;
}
</style>
