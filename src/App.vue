<template>
  <div id="app">
    <upload-page msg="Anki Upload Preview"/>
  </div>
</template>

<script>
import UploadPage from './upload/UploadPage.vue'

export default {
  name: 'App',
  components: {
    UploadPage 
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 1em;
}

</style>
