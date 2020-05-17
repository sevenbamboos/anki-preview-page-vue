<template>
  <div class="upload-bar">
    <div class="upload-form">
      <form enctype="multipart/form-data" novalidate>
        <div class="dropbox">
          <input type="file"
            ref="fileToUpload"
            :disabled="isSaving" 
            @change="fileChange($event.target.files)"
            accept="*/*">

          <input type="button"
            @click="doUpload"
            :disabled="!hasFileToUpload"
            value="Upload" />

        </div>
      </form>
    </div>
  </div>
</template>

<script>

import { upload } from '../services/anki-importer-preview.service';

const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3;

export default {
  name: 'UploadBar',
  props: {
  },
  computed: {
      isInitial() {
        return this.currentStatus === STATUS_INITIAL;
      },
      isSaving() {
        return this.currentStatus === STATUS_SAVING;
      },
      isSuccess() {
        return this.currentStatus === STATUS_SUCCESS;
      },
      isFailed() {
        return this.currentStatus === STATUS_FAILED;
      },
      hasFileToUpload() {
        return this.formData !== null;
      },

    },  
  data: function() {
    return {
        uploadError: null,
        currentStatus: null,
        formData: null
    };
  },
  methods: {
      reset() {
        // reset form to initial state
        this.currentStatus = STATUS_INITIAL;
        this.formData = null;
      },

      async doUpload() {
        // upload data to the server
        this.currentStatus = STATUS_SAVING;

        try {
          await upload(this.formData);
          this.currentStatus = STATUS_SUCCESS;
          this.$emit('onUpload');
        } catch (e) {
          this.$emit('onUploadError', e);
          this.currentStatus = STATUS_FAILED;
        } finally {
          this.$refs.fileToUpload.value = null;
          this.formData = null;
        }
      },

      fileChange(fileList) {
        this.reset();

        if (!fileList.length) return;

        this.formData = new FormData();
        // append the files to FormData
        this.formData.append("file", fileList[0], fileList[0].name);
      }      
  },
  mounted() {
    this.reset();
  },  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.upload-bar {
  flex-grow: 100;
}
.upload-form {
  float: right;
}
</style>
