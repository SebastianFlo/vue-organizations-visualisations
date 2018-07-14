<template>
  <div>
    <div class="side-menu-header" v-bind:style="{ 'background-color': active.color }">
      <span class="side-menu-header-title">Selection</span>
    </div>
    <div class="side-menu-header-content">

      <div v-if="active.type === 0">
        <div>
          <img height="50" v-bind:src="active.logo">
        </div>
        <br>
        <h3>Funder</h3>
        <a v-bind:href="active.website" target="new">{{ active.name }}</a>
        <br> Total Given Donations:
        <em>{{ formatCurrency(active.value) }}</em>
        <hr>
        <h3>Beneficiaries</h3>
        <ul class="gdv-recipient-list">
          <li v-for="beneficiary in active.recipients" class="gdv-recipient-list-item">
            <span class="gdv-recipient-list-item-name">{{ beneficiary.name }}</span>:
            <div class="gdv-recipient-list-item-amount">{{ formatCurrency(beneficiary.amount) }}</div>
          </li>
        </ul>
      </div>

      <div v-if="active.type === 1">
        <h3>Charrity</h3>
        <h1>{{ active.name }}</h1>

        <br>Type
        <h5>{{ active.charityType }}</h5>
        <br> Total Received Donations:
        <em>{{ formatCurrency(active.value) }}</em>
        <hr>
        <h3>Funder</h3>
        <ul>
          <li v-for="funder in active.funder" class="beneficiary-item">
            {{ funder.source.name }} :
            <div>{{ formatCurrency(funder.target.value) }}</div>
          </li>
        </ul>
      </div>

      <div v-if="active.type === 2">
        <div v-bind:style="{ 'background-color': active.source.color }">
          <h3>Funder</h3>
          <h1>{{ active.source.name }}</h1>
          <br>
          <em>{{ formatCurrency(active.source.value) }}</em>
        </div>
        <hr>
        ↓
        <hr>
        <div v-bind:style="{ 'background-color': active.target.color }">
          <h3>Beneficiary</h3>
          <a v-bind:href="active.target.website" target="new">{{ active.target.name }}</a>
          <br>
          <em>{{ formatCurrency(active.target.value) }}</em>
          <hr>
          <em>{{ active.target.charityType }}</em>
        </div>
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

  .gdv-recipient-list {
    list-style: none;
  }

  .gdv-recipient-list-item {
    text-align: left;
    padding: 4px 0;
  }

  /* .gdv-recipient-list-item-name {
  } */

  .gdv-recipient-list-item-amount {
    color:gray;
  }
</style>
