<template>
  <div class="upload-page">

    <message-bar :message="message"/>

    <div class="menu-buttons">
      <div>
        <button type="button" @click="onList">List</button>
        <button type="button" @click="onClear">Clear</button>
        <button @click="onOutputAll" :disabled="files.length <= 0">Output All</button>
        <span class="question-check">
          <input id="clozeCheckBox" type="checkbox" v-model="clozeQuestion"/>
          <label for="clozeCheckBox">Cloze</label>
          &nbsp;
          <input id="basicCheckBox" type="checkbox" v-model="basicQuestion"/>
          <label for="basicCheckBox">Basic</label>
        </span>

      </div>
      <upload-bar @onList="onList" @onUpload="onUpload" @onUploadError="onUploadError" />
    </div>

    <hr/>

    <div class="main-area">

      <div v-if="inFileMode">
        <file-list :errorMessage="message.isError ? message.contents : null" :fileList="files" @onClickFile="onClickFile" />
      </div>

      <div v-else-if="inGroupMode">
        <group-list :errorMessage="message.isError ? message.contents : null" :groupList="groups" :fileName="selectedFile" @onOutputFile="onOutputFile"/>
      </div>

      <div v-else>
        Unknown mode: {{mode}}
      </div>
    </div>

    <div v-if="selectedFile" class="file-name">
      {{selectedFile}}
      <button @click="onOutputFile(selectedFile)">Output</button>
    </div>

  </div>
</template>

<script>

import UploadBar from "./components/UploadBar.vue";
import FileList from "./components/FileList.vue";
import GroupList from "./components/GroupList.vue";
import MessageBar from "../common/components/MessageBar.vue";
import { output, outputs, formatOutputMessage } from '../services/anki-importer-preview.service';
import { mapState, mapActions } from 'vuex';
import { action } from "../constant";

const FILE_MODE = 0, GROUP_MODE = 1;

export default {
  name: 'UploadPage',
  components: {
    UploadBar,
    FileList,
    GroupList,
    MessageBar
  },
  props: {
    msg: String
  },
  computed: {
    inFileMode() {
      return this.mode === FILE_MODE;
    },
    inGroupMode() {
      return this.mode === GROUP_MODE;
    },
    ...mapState([
      'message', 
      'files', 
      'groups', 
      'selectedFile'
    ])
  },   
  data: function(){
    return {
      mode: FILE_MODE,
      clozeQuestion: false,
      basicQuestion: false
    };
  },
  methods: {
    async onList() {
      this.mode = FILE_MODE;
      await this.$store.dispatch(action.GET_FILES);
    },

    async onClear() {
      this.mode = FILE_MODE;
      await this.$store.dispatch(action.CLEAR_ALL_FILES);
    },

    async onClickFile(fileName) {
      this.mode = GROUP_MODE;
      await this.$store.dispatch(action.PARSE_GROUPS, fileName, this.getQuestion());
    },

    async onOutputFile(fileName) {
      try {
        const collector = await output(fileName, this.getQuestion());
        await this.onList();
        this.showInfo(formatOutputMessage(collector));
      } catch (e) {
        this.showError(e);
      }
    },

    async onOutputAll() {
      try {
        const collector = await outputs(this.files, this.getQuestion());
        await this.onList();
        this.showInfo(formatOutputMessage(collector));
      } catch (e) {
        this.showError(e);
      }
    },

    backToList() {
      this.mode = FILE_MODE;
      this.resetMessage();
    },

    async onUpload() {
      await this.onList();
    },

    onUploadError(error) {
      this.showError(error);
    },

    getQuestion() {
      if (this.clozeQuestion && this.basicQuestion) {
        return 'A';
      } else if (this.basicQuestion) {
        return 'B';
      } else if (this.clozeQuestion) {
        return 'C';
      } else {
        return '';
      }
    },

    ...mapActions([
      'resetMessage',
      'showInfo',
      'showError'
    ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.menu-buttons {
  display: flex;
}
.question-check {
  padding: 20px;
  font-size: 80%;
}
.main-area {
  display: block;
  width: 100%;
}
</style>
