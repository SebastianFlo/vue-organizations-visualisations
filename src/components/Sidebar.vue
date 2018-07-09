<template>
  <div>
    <div class="side-menu-header">
      <h2>Selection</h2>
    </div>
    <div v-if="active.type === 'funder'">
      <div style="background-color: white">
        <img height="50"
          v-bind:src="active.logo">
      </div>
      <br>
      <h3>Funder</h3>
      <h1>{{ active.name }}</h1>
      <br> Total Given Donations:
      <em>{{ active.value | currency }}</em>
      <hr>
      <h3>Beneficiaries</h3>
      <ul>
        <li v-for="beneficiary in active.recipients"
          class="beneficiary-item">
          {{ beneficiary.name }} :
          <div>{{ beneficiary.amount | currency }}</div>
        </li>
      </ul>
    </div>

    <div v-if="active.type === 'funded'">
      <h3>Charrity</h3>
      <h1>{{ active.name }}</h1>
      <br> Total Received Donations:
      <em>{{ active.value | currency }}</em>
      <hr>
      <h3>Funders</h3>
      <ul>
        <li v-for="funder in active.funder"
          class="beneficiary-item">
          {{ funder.source.name }} :
          <div>{{ funder.target.value | currency }}</div>
        </li>
      </ul>
    </div>

    <div v-if="active.type === 'link'">
      <h3>Funder</h3>
      <h1>{{ active.source.name }}</h1>
      <br>
      <em>{{ active.source.value | currency }}</em>
      <hr> ↓
      <hr>
      <h3>Beneficiary</h3>
      <h1>{{ active.target.name }}</h1>
      <br>
      <em>{{ active.target.value | currency }}</em>
      <hr>
    </div>
  </div>
</template>

<script>
  import store from '../store.vue';

  export default {
    data: function () {
      return {
        state: store.state
      }
    },
    computed: {
      active: function() {
        return this.state.active;
      }
    }
  };
</script>

<style scoped>

</style>
