<template>
  <v-container>
    <v-row id="text-import">
      <div >
        <textarea rows="5" cols="100" @keyup.enter="translate">
        At w3schools.com you will learn how to make a website. We offer free tutorials in all web development technologies. 
        </textarea>
      </div>
    </v-row>
    <v-row>
      <v-col xs4="xs4">
        3
      </v-col>
      <v-col xs8="xs8">
        9
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { ipcRenderer } from 'electron'

  export default {
    name: 'dashboard',
    methods: {
      translate () {
        ipcRenderer.send('translate', 'abc')
      }
    }
  }
</script>

<style scoped>
v-container {
  margin-top: 1rem;
}
#text-import {
  display: flex;
  align-content: center;
  justify-content: center;
}
</style>
