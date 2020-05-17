<template>
  <div class="message-bar">
    <span class="message-bar-head" v-if="showMessage">
      <button type="button" @click="hideMessage(false)">&gt;</button>
    </span>
    <span class="message-bar-head" v-else>
      <button type="button" @click="hideMessage(true)">&lt;</button>
    </span>
    <span v-if="showMessage && message.content" class="message-bar-message"
      :class="{'error-message': message.isError, 'general-message': !message.isError}"
    >
      {{message.content}}
    </span>
  </div>
</template>

<script>

export default {
  name: 'MessageBar',
  props: {
    message: {content: null, isError: false}
  },
  data: function() {
    return {
      showMessage: true
    };
  },
  methods: {
      hideMessage(whether) {
        this.showMessage = whether;
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.message-bar {
  display: flex;
  padding: 0.5em;
}

.message-bar-head {
  float: left;
}

.message-bar-message {
  flex-grow: 100;
}

.general-message {
  color: green;
  font-size: 70%;
}

.error-message {
  color: red;
  font-size: 70%;
}
</style>
