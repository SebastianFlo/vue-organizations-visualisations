<template>
  <b-navbar toggleable="md" type="dark" variant="dark">

    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

    <b-navbar-brand @click="search()" class="gdv-hover">The Flow of Funds</b-navbar-brand>

    <!-- <b-navbar-nav>
      <b-nav-item v-on:click="search(defaultOrganisation)">Click on items to see more information</b-nav-item>
    </b-navbar-nav> -->

    <b-collapse is-nav id="nav_collapse">

      <b-navbar-nav class="ml-auto">

        <!-- <b-nav-item-dropdown text="Recipient Types" right>
          <b-dropdown-item v-for="recipientType in state.recipientTypes" v-bind:key="recipientType.index" class="gdv-no-pointer">
              <div v-bind:style="{ 'color': recipientType.color }">{{ recipientType.name }}</div>
          </b-dropdown-item>
        </b-nav-item-dropdown> -->

        <b-nav-item-dropdown ref="funderDropdown" id="funderDropdown" text="Funders" right>
            <b-form-input v-model.lazy="funderFilter" placeholder="Type to Search"/>
            <b-table hover fixed striped
              class="gdv-dropdown-funders"
              :sort-by="'value'"
              :sort-desc="true"
              :filter="funderFilter"
              :items="orderedFunders"
              :fields="fields"
              @row-clicked="search"
              >
              <template slot="value" slot-scope="row">
                  {{ formatCurrency(row.item.value) }}
              </template>
          </b-table>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown ref="recipientDropdown" id="recipientDropdown" text="Recipients"
          right>
            <b-form-input v-model.lazy="recipientFilter" placeholder="Type to Search"/>
            <b-table hover fixed striped
              class="gdv-dropdown-funders"
              :sort-by="'value'"
              :sort-desc="true"
              :filter="recipientFilter"
              :items="orderedRecipients"
              :fields="fields"
              @row-clicked="search"
              >
              <template slot="name" slot-scope="row">
                  <span v-bind:style="{ 'color': row.item.color }"> {{ row.item.name }}</span>
              </template>
              <template slot="value" slot-scope="row">
                  {{ formatCurrency(row.item.value) }}
              </template>
            </b-table>
        </b-nav-item-dropdown>

      </b-navbar-nav>

    </b-collapse>
  </b-navbar>
</template>

<script>
  import _ from 'lodash';
  import store from '../store.vue';
  import { currency } from '../filters.vue';

  export default {
    data: function () {
      return {
        state: store.state,
        defaultOrganisation: 'The Wellcome Trust',
        funderFilter: '',
        recipientFilter: '',
        fields: [
        {
          key: 'name',
          class: 'gdv-hover'
        },
        {
          key: 'value',
          sortable: true
        }],
      }
    },
    methods: {
      search: function (item) {
        if (!item) {
          this.$emit('select', {});
          store.setActiveDataAction();
        } else {
          this.$emit('select', { name: item.name });
        }
        this.closeDropdowns();
      },
      closeDropdowns() {
        const funderDropdown = this.$refs.funderDropdown;
        const recipientDropdown = this.$refs.recipientDropdown;
        funderDropdown.hide();
        recipientDropdown.hide();
      },
      formatCurrency: currency
    },
    computed: {
      orderedFunders: function () {
        const filteredFunder = this.state.funders.map(funder => ({
          name: funder.name,
          value: funder.value
        }));
        return filteredFunder;
        // return _.orderBy(this.state.funders, 'value', 'desc')
      },
      orderedRecipients: function () {
        const filteredRecipient = this.state.recipients.map(recipient => ({
          name: recipient.name,
          value: recipient.value,
          color: recipient.color
        }));
        return filteredRecipient;
        // return _.orderBy(this.state.recipients, 'value', 'desc')
      }
    }
  };
</script>

<style scoped>
  .gdv-right {
    float: right;
  }

  .gdv-width-325 {
    width: 325px;
  }

  @media only screen and (max-width: 600px) {
    .gdv-dropdown-funders {
        width: 100%;
    }
  }

  @media only screen and (min-width: 600px) {
    .gdv-dropdown-funders {
        width: 475px;
    }
  }

  .gdv-no-pointer {
    cursor: default;
    pointer-events:none;
  }
</style>
