<template>
  <div>
    <b-card-group v-if="active.type !== 2" deck>
      <b-card bg-variant="secondary" v-if="active.type !== 0 && !active.type" :title="active.name">
        <b-button v-on:click="search(defaultOrganisation)">Hover over items to see more</b-button>
      </b-card>

      <b-card v-if="active.type === 0" :title="active.name">
          <a v-bind:href="active.website" target="new">
            <b-img rounded blank-color="#777" class="gdv-logo" :src="active.logo" thumbnail v-b-tooltip.hover title="Website"/>
          </a>

          <b-button :variant="'outline-success'" @click="search(active.name)" class="gdv-show-in-chart" v-b-tooltip.hover title="Show in chart">⊕</b-button>

          <h4 slot="header">
            <span class="gdv-header-color">
                <b-img blank rounded="circle" height="10" :blank-color="active.color"/>
            </span>
            Funder</h4>
          <b-card-body>
              <p class="card-text">
                  Total Grants Awarded:
              </p>
              <h4 class="card-text">
                  <em>{{ formatCurrency(active.value) }}</em>
              </h4>
          </b-card-body>

          <b-table hover fixed
            :sort-by="'amount'"
            :sort-desc="true"
            :items="active.recipients"
            :fields="fields">
              <template slot="name" slot-scope="row">
                <b-link @click="search(row.item.name)">{{ row.item.name }}</b-link>
              </template>
              <template slot="amount" slot-scope="row">
                  {{ formatCurrency(row.item.amount) }}
              </template>
          </b-table>
      </b-card>

      <b-card v-if="active.type === 1" deck :title="active.name" :sub-title="active.charityType">
          <b-link v-if="active.website" v-bind:href="active.website" target="new" class="card-link">Website</b-link>
          <h4 slot="header">
            <span class="gdv-header-color">
                <b-img blank rounded="circle" height="10" :blank-color="active.color"/>
            </span>
              Beneficiary
          </h4>

          <b-card-body>
            <b-list-group>
                <b-list-group-item v-for="grant in active.funder"
                  v-bind:key="grant.dx"
                  class="d-flex justify-content-between align-items-center gdv-recipient-list-item">
                      <b-link class="gdv-truncate" @click="search(grant.source.name)">{{ grant.source.name }}</b-link>
                      <b-badge variant="primary" pill>{{ formatCurrency(grant.value) }}</b-badge>
                  </b-list-group-item>
                </b-list-group>
            </b-list-group>
          </b-card-body>

          <b-card-body>
            <b-btn variant="outline-primary" v-b-modal.modal1>Description</b-btn>
          </b-card-body>

          <!-- Modal Component -->
          <b-modal size="lg" hide-footer id="modal1" :title="active.name">
            <p class="my-4">{{ active.description }}</p>
          </b-modal>
      </b-card>
    </b-card-group>

    <div v-if="active.type === 2">
      <b-card :title="active.source.name">
          <a v-bind:href="active.source.website" target="new">
            <b-img rounded blank-color="#777" class="gdv-logo" :src="active.source.logo" thumbnail/>
          </a>
          <h4 slot="header">
            <span class="gdv-header-color">
                <b-img blank rounded="circle" height="10" :blank-color="active.source.color"/>
            </span>
            Funder
          </h4>
          <b-card-body>
              <p class="card-text">
                  Grant Awarded:
              </p>
              <h4 class="card-text">
                  <em>{{ formatCurrency(active.target.value) }}</em>
              </h4>
          </b-card-body>
      </b-card>

      <div class="gdv-arrow">
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="white" fill-rule="evenodd" clip-rule="evenodd"><path d="M24 12c0-6.623-5.377-12-12-12s-12 5.377-12 12 5.377 12 12 12 12-5.377 12-12zm-1 0c0-6.071-4.929-11-11-11s-11 4.929-11 11 4.929 11 11 11 11-4.929 11-11zm-11.5 4.828l-3.763-4.608-.737.679 5 6.101 5-6.112-.753-.666-3.747 4.604v-11.826h-1v11.828z"/></svg>
      </div>

      <b-card :title="active.target.name" :sub-title="active.target.charityType">
          <b-link v-if="active.target.website" v-bind:href="active.target.website" target="new" class="card-link">Website</b-link>
          <h4 slot="header">
            <span class="gdv-header-color">
                <b-img blank rounded="circle" height="10" :blank-color="active.target.color"/>
            </span>
              Beneficiary
          </h4>

          <b-card-body>
              <b-list-group>
                <b-list-group-item v-for="grant in active.target.funder" v-bind:key="grant.dx"
                  class="d-flex justify-content-between align-items-center gdv-recipient-list-item">
                    <b-link class="gdv-truncate" @click="search(grant.source.name)">{{ grant.source.name }}</b-link>
                    <b-badge variant="primary" pill>{{ formatCurrency(grant.value) }}</b-badge>
                </b-list-group-item>
              </b-list-group>
            </b-card-body>
      </b-card>
    </div>
  </div>
</template>

<script>
  import store from '../store.vue';
  import { currency } from '../filters.vue';

  export default {
    data: function () {
      return {
        state: store.state,
        fields: ['name', { key: 'amount', sortable: true} ],
        defaultOrganisation: 'The Wellcome Trust'
      }
    },
    computed: {
      active: function () {
        return this.state.active.data;
      }
    },
    methods: {
      formatCurrency: currency,
      search: function (name) {
        this.$emit('select', { name });
      },
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

  .gdv-recipient-list-item {
    text-align: left;
  }

  .gdv-logo {
    height: 50px !important;
  }

  .gdv-arrow {
    padding-top: 20px;
    padding-bottom: 20px;
    color: white
  }

  .gdv-show-in-chart {
    width: 40px;
  }
</style>
