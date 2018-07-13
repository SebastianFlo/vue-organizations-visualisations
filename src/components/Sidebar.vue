<template>
  <div>
    <div class="side-menu-header">
      <span class="side-menu-header-title">Selection</span>
    </div>
    <div class="side-menu-header-content">
      <div v-if="active.type === 'funder'">
        <div>
          <img height="50" v-bind:src="active.logo">
        </div>
        <br>
        <h3>Funder</h3>
        <h1>{{ active.name }}</h1>
        <br> Total Given Donations:
        <em>{{ formatCurrency(active.value) }}</em>
        <hr>
        <h3>Beneficiaries</h3>
        <ul>
          <li v-for="beneficiary in active.recipients"
            class="beneficiary-item">
            {{ beneficiary.name }} :
            <div>{{ formatCurrency(beneficiary.amount) }}</div>
          </li>
        </ul>
      </div>

      <div v-if="active.type === 'funded'">
        <h3>Charrity</h3>
        <h1>{{ active.name }}</h1>

        <br>Type
        <h5>{{ active.charityType }}</h5>
        <br> Total Received Donations:
        <em>{{ formatCurrency(active.value) }}</em>
        <hr>
        <h3>Funders</h3>
        <ul>
          <li v-for="funder in active.funder"
            class="beneficiary-item">
            {{ funder.source.name }} :
            <div>{{ formatCurrency(funder.target.value) }}</div>
          </li>
        </ul>
      </div>

      <div v-if="active.type === 'link'">
        <h3>Funder</h3>
        <h1>{{ active.source.name }}</h1>
        <br>
        <em>{{ formatCurrency(active.source.value) }}</em>
        <hr> ↓
        <hr>
        <h3>Beneficiary</h3>
        <h1>{{ active.target.name }}</h1>
        <br>
        <em>{{ formatCurrency(active.target.value) }}</em>
        <hr>
      </div>
    </div>
  </div>
</template>

<script>
  import store from '../store.vue';
  import { currency } from '../filters.vue';

  export default {
    data: function () {
      return {
        state: store.state
      }
    },
    computed: {
      active: function () {
        return this.state.active.data;
      }
    },
    methods: {
      formatCurrency: currency
    }
  };
</script>

<style scoped>
  .side-menu-header {
    text-align: center;
    background-color: rgba(0, 0, 0, 0.2);
  }

  .side-menu-header-title {
    font-size: 14px;
    font-style: italic;
  }

  .side-menu-header-content {
    padding-top: 10px;
  }
</style>
