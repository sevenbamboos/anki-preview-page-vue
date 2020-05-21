import Vue from 'vue'
import Vuex from 'vuex';
import { list, clear, getGroups } from './services/anki-importer-preview.service';
import { mutation, action } from './constant';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    message: {content: null, isError: false},
    files: [],
    selectedFile: null,
    groups: []
  },

  mutations: {

    [mutation.SET_MESSAGE](state, {content, isError}) {
      state.message.content = content;
      state.message.isError = isError;
    },
    [mutation.CLEAR_FILES](state) {
      state.files.splice(0);
    },
    [mutation.ADD_FILES](state, fileList) {
      state.files = fileList; 
    },
    [mutation.CLEAR_GROUPS](state) {
      state.groups.splice(0);
    },
    [mutation.REPLACE_GROUPS](state, groupList) {
      state.groups = groupList;
    },
    [mutation.SELECT_FILE](state, fileName) {
      state.selectedFile = fileName; 
    }
  },

  actions: {
    [action.RESET_MESSAGE]({commit}) {
      commit(mutation.SET_MESSAGE, {content: null, isError: false});
    },    

    [action.SHOW_INFO]({commit}, content) {
      commit(mutation.SET_MESSAGE, {content, isError: false});
    },

    [action.SHOW_ERROR]({commit}, content) {
      commit(mutation.SET_MESSAGE, {content, isError: true});
    },

    async [action.GET_FILES]({commit, dispatch}) {
      try {
        commit(mutation.ADD_FILES, await list());
        dispatch(action.RESET_MESSAGE);
        if (this.state.files.length == 0) {
          dispatch(action.SHOW_INFO, 'No files');
        }
      } catch (e) {
        dispatch(action.SHOW_ERROR, e);
        commit(mutation.CLEAR_FILES);
      }    
    },    

    async [action.CLEAR_ALL_FILES]({commit, dispatch}) {
      try {
        const deleted = await clear();
        console.log("File deleted:" + deleted);
        commit(mutation.CLEAR_FILES);
        commit(mutation.SELECT_FILE, null);
        dispatch(action.SHOW_INFO, 'Files cleared');
      } catch (e) {
        dispatch(action.SHOW_ERROR, e);
        commit(mutation.CLEAR_FILES);
        commit(mutation.SELECT_FILE, null);
      }
    },

    async [action.PARSE_GROUPS]({commit, dispatch}, fileName, question) {
      try {
        commit(mutation.REPLACE_GROUPS, await getGroups(fileName, question)); 
        commit(mutation.SELECT_FILE, fileName);
        dispatch(action.RESET_MESSAGE);
      } catch (e) {
        dispatch(action.SHOW_ERROR, e);
        commit(mutation.CLEAR_GROUPS);
      }
    },
  },
});

export {store};