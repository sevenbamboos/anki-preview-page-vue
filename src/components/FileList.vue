<template>
  <div class="file-list">
      <ol v-if="fileList">
        <li class="file-item" v-for="file in fileList" :key="file">
          <a href="#" @click="onClickFile(file)">{{ file }}</a>
        </li>
      </ol>
      <div class="info" v-else>
        No files    
      </div>
  </div>
</template>

<script>
export default {
  name: 'FileList',
  props: {
    fileList: Array
  },
  methods: {
    onClickFile(fileName) {
      this.$emit('onClickFile', fileName);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.file-item {
  text-align: left;
}
</style>
