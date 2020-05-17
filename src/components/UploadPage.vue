<template>
  <div class="upload-page">

    <div class="menu-buttons">
      <div>
        <button type="button" @click="onList">List</button>
        <button type="button" @click="onClear">Clear</button>

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

    <hr/>

    <div v-if="selectedFile" class="file-name">
      <!-- <button @click="backToList">File</button> -->
      {{selectedFile}}
      <button @click="onOutputFile(selectedFile)">Output</button>
    </div>

    <message-bar :message="message"/>

  </div>
</template>

<script>

import UploadBar from "./UploadBar.vue";
import FileList from "./FileList.vue";
import GroupList from "./GroupList.vue";
import MessageBar from "./MessageBar.vue";
import { list, getGroups, clear, output } from '../services/anki-importer-preview.service';

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
    }
  },   
  data: function(){
    return {
      mode: FILE_MODE,
      clozeQuestion: false,
      basicQuestion: false,
      message: {content: null, isError: false},
      files: [],
      groups: [],
      selectedFile: null
    };
  },
  methods: {
    async onList() {
      this.mode = FILE_MODE;
      try {
        this.files = await list();
        this.resetMessage();
        if (this.files.length == 0) {
          this.showInfo('No files');
        }
      } catch (e) {
        this.showError(e);
        this.files = [];
      }
    },

    async onClear() {
      this.mode = FILE_MODE;
      try {
        const deleted = await clear();
        console.log("File deleted:" + deleted);
        this.files = [];
        this.selectedFile = null;
        this.showInfo('Files cleared');
      } catch (e) {
        this.showError(e);
        this.files = [];
        this.selectedFile = null;
      }
    },

    async onClickFile(fileName) {
      this.mode = GROUP_MODE;
      try {
        this.groups = await getGroups(fileName, this.getQuestion());
        this.selectedFile = fileName;
        this.resetMessage();
      } catch (e) {
        this.showError(e);
        this.groups = [];
      }
    },

    async onOutputFile(fileName) {
      try {
        const collector = await output(fileName, this.getQuestion());
        await this.onList();
        this.showInfo(this.formatOutputMessage(collector));
      } catch (e) {
        this.showError(e);
      }
    },

    formatOutputMessage(collector) {
      let result = '';
      if (collector.errorCards.length > 0) {
        result +='Error Cards ' + collector.errorCards.length + '; ';
      }

      if (collector.ignoredGroups.length > 0) {
        result +='Ignored Groups ' + collector.ignoredGroups.length + '; ';
      }

      if (collector.groups.length > 0) {
        result += 'Groups ' + collector.groups.join(',') + '; ';
      }

      result += 'Cloze ' + collector.clozeCards.length + '; ';
      result += 'Basic ' + collector.basicCards.length + '; ';

      result += ' at ' + new Date().toTimeString();

      return result;
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

    resetMessage() {
      this.message.content = null;
      this.message.isError = false;
    },

    showInfo(contents) {
      this.message.content = contents;
      this.message.isError = false;
    },

    showError(contents) {
      this.message.content = contents;
      this.message.isError = true;
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
    }
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
  height: 500px;
  overflow: auto;  
}
</style>
