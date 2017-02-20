<template>
  <v-container>
    <v-text-input 
      id="test" 
      name="test" 
      label="Test" 
      v-model="text"
    ></v-text-input>
    <v-btn primary dark @click.native="click">Normal</v-btn>
  </v-container>
</template>

<script>
  import { ipcRenderer } from 'electron'
  export default {
    name: 'test-window',
    data: () => {
      return {
        text: '“呱……”一声略带凄切的叫声惊醒了莫无忌'
      }
    },
    methods: {
      click () {
        console.log(this.text)
        ipcRenderer.send('test', this.text)
      }
    }
  }
</script>

<style scoped>
</style>
