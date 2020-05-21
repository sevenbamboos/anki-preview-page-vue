<template>
  <div class="card-list">
      <ol v-if="cardList">

        <div class="menu-group">
          <button @click="showAllCloze"><b>C</b>loze</button>
          <button @click="showAllBasic"><b>B</b>asic</button>
          <button @click="showAllSource"><b>S</b>ource</button>
        </div>

        <li class="card" v-for="card in cardsWithDisplay" :key="card.source">
          <div v-if="card.error">
            <span class="error-card"> ERROR </span>
          </div>
          <div v-else>
            <span :class="{
              'highlighted': highlighted(card, 0/*SHOW_CLOZE*/),
              'not-available': notAvailable(card, 0)
              }" 
            @click="showCloze(card)">[C]</span>
            ,
            <span :class="{
              'highlighted': highlighted(card, 1/*SHOW_BASIC*/),
              'not-available': notAvailable(card, 1)
              }" 
            @click="showBasic(card)">[B]</span>
            ,
            <span :class="{
              'highlighted': highlighted(card, 2/*SHOW_SOURCE*/)
              }" 
            @click="showSource(card)">[S]</span>
            ...
            {{  card.display }}
            ...
            <span class="tooltip">Tags
              <span class="tooltiptext">{{ card.tags }}</span>
            </span>
            ,
            <span class="tooltip">Group
              <span class="tooltiptext">{{ card.groupName }}</span>
            </span>
          </div>

        </li>
      </ol>
      <div class="info" v-else>
        No cards    
      </div>
  </div>
</template>

<script>
import Vue from 'vue';
const SHOW_CLOZE = 0, SHOW_BASIC = 1, SHOW_SOURCE = 2;

export default {
  name: 'CardList',
  props: {
    cardList: Array
  },
  computed: {
    cardsWithDisplay() {
      return this.cardList.map(card => {
        if (card.forCloze) {
          Vue.set(card, 'display', card.cloze);
          Vue.set(card, 'mode', SHOW_CLOZE);
        } else if (card.forBasic) {
          Vue.set(card, 'display', card.basic);
          Vue.set(card, 'mode', SHOW_BASIC);
        } else {
          Vue.set(card, 'display', card.source);
          Vue.set(card, 'mode', SHOW_SOURCE);
        }
        return card;
      });
    },
  },
  methods: {
    showCloze(card) {
      card.display = card.error ? 'ERROR' : card.cloze;
      card.mode = SHOW_CLOZE;
    },
    showAllCloze() {
      this.cardsWithDisplay.forEach(card => this.showCloze(card));
    },
    showBasic(card) {
      card.display = card.error ? 'ERROR' : card.basic;
      card.mode = SHOW_BASIC;
    },
    showAllBasic() {
      this.cardsWithDisplay.forEach(card => this.showBasic(card));
    },
    showSource(card) {
      card.display = card.source;
      card.mode = SHOW_SOURCE;
    },
    showAllSource() {
      this.cardsWithDisplay.forEach(card => this.showSource(card));
    },
    highlighted(card, expectedMode) {
      return card.mode === expectedMode;
    },

    notAvailable(card, expectedMode) {
      if (expectedMode === 0) {
        return !card.forCloze;
      } else if (expectedMode === 1) {
        return !card.forBasic;
      } else {
        return false;
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul {
  /* list-style-type: none; */
  padding: 0;
}
li {
  /* display: inline-block; */
  text-align: left;
  margin: 0 10px;
}
.error-message {
  color: #ff00ff;
}
.active {
  color: #00ff00
}
.error-card {
  color: #ff00ff;
}
.warn-card {
  color: #00ff00
}
.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black;
  font-size: 70%;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 240px;
  background-color: #eeeeee;
  color: black;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  
  /* Position the tooltip */
  position: absolute;
  z-index: 1;
  bottom: 100%;
  left: 50%;
  margin-left: -60px;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}

.highlighted {
  background: #eeeeee;
}

.not-available {
  text-decoration: line-through;
}

.menu-group {
  padding-bottom: 10px;
}

.card-list {
  height: 450px;
  overflow: auto;
}

.card {
  white-space: nowrap;
  width: 200%;  
}
</style>
