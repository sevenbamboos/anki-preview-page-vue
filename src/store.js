import { list, clear, getGroups } from './services/anki-importer-preview.service';

const store = {
  state: {
    message: {content: null, isError: false},
    files: [],
    selectedFile: {file: null},
    groups: []
  },

  async getFiles() {
    try {
      this.state.files.splice(0);
      this.state.files.push(... await list());
      this.resetMessage();
      if (this.state.files.length == 0) {
        this.showInfo('No files');
      }
    } catch (e) {
      this.showError(e);
      this.state.files.splice(0);
    }    
  },

  async clearFiles() {
    try {
      const deleted = await clear();
      console.log("File deleted:" + deleted);
      this.state.files.splice(0);
      this.state.selectedFile.file = null;
      this.showInfo('Files cleared');
    } catch (e) {
      this.showError(e);
      this.state.files.splice(0);
      this.state.selectedFile.file = null;
    }
  },

  async parseGroups(fileName, question) {
    try {
      this.state.groups.splice(0);
      this.state.groups.push(... await getGroups(fileName, question));
      this.state.selectedFile.file = fileName;
      this.resetMessage();
    } catch (e) {
      this.showError(e);
      this.state.groups.splice(0);
    }
  },

  resetMessage() {
    this.state.message.content = null;
    this.state.message.isError = false;
  },

  showInfo(contents) {
    this.state.message.content = contents;
    this.state.message.isError = false;
  },

  showError(contents) {
    this.state.message.content = contents;
    this.state.message.isError = true;
  }
};

export {store};