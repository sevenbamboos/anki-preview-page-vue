<template>
  <div class="group-list">
      <div class="groups-navigator" v-if="groupList">
        <div class="navigator-button">
          <span v-if="hasPrev">
            <a href="#" @click="onPrev">&lt;&lt;</a>
          </span>
          <span v-else>
            &lt;&lt;
          </span>
        </div>
        <div>
          <ol>
            <li v-for="group in groupWithErrorList" :key="group.name">
              <div :class="{'current-group': isCurrentGroup(group)}">
              <div v-if="count(group) > 0">
                <a href="#" @click="onClickGroup(group)">{{ group.name }}</a>
                <span class="group-count">({{count(group)}})</span>
                <span v-if="!group.good" class="bad-group">
                  !!!
                </span>
                <span v-if="group.new" class="new-group">
                  New
                </span>
                <span v-if="group.changed" class="changed-group">
                  Changed 
                </span>
              </div>
              <div v-else>
                {{ group.name }}
              </div>
              </div>
            </li>
          </ol>
        </div>
        <div class="navigator-button">
          <span v-if="hasNext">
            <a href="#" @click="onNext">&gt;&gt;</a>
          </span>
          <span v-else>
            &gt;&gt;
          </span>
        </div>
      </div>
      <div class="info" v-else>
        No groups    
      </div>

      <card-list :cardList="cardList" />

  </div>
</template>

<script>
import Vue from 'vue';
import CardList from "./CardList";

export default {
  name: 'GroupList',
  components: {
    CardList
  },
  props: {
    groupList: Array
  },
  computed: {
    groupWithErrorList() {
      return this.groupList.map(group => {
        Vue.set(group, 'good', group.cards.every(card => !card.error))
        return group;
      });
    },
    currentGroupIndex() {
      return this.groupList.findIndex(group => group.name === this.currentGroup);
    },
    hasPrev() {
      return this.currentGroupIndex > 0;  
    },
    hasNext() {
      return this.currentGroupIndex < this.groupList.length - 1;  
    }
  },
  data: function(){
    return {
      currentGroup: '',
      cardList: []
    };
  },
  methods: {
    count(group) {
      return group.previewCards.length;
    },
    onClickGroup(group) {
      this.cardList = group.previewCards;
      this.currentGroup = group.name;
    },

    isCurrentGroup(group) {
      return group.name === this.currentGroup;
    },

    onPrev() {
      this.onNavigateGroup(this.currentGroupIndex - 1);
    },

    onNext() {
      this.onNavigateGroup(this.currentGroupIndex + 1);
    },

    onNavigateGroup(index) {
      if (index < 0 || index >= this.groupList.length) {
        console.error("Invalid index:" + index);
        return;
      }

      this.onClickGroup(this.groupList[index]);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
.group-count {
  font-size: 50%;
}
.bad-group {
  color: #ff00ff;
}
.current-group {
  background: #eeeeee;
}
.new-group {
  color: red;
  font-size: 50%;
}
.changed-group {
  color: blue;
  font-size: 50%;
}
.groups-navigator {
  display: flex;
  flex-flow: row;
}
.navigator-button {
  margin: auto;
}
</style>
