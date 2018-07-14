<template>
  <b-navbar toggleable="md"
    type="dark"
    variant="dark">

    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

    <b-navbar-brand>Children Charities</b-navbar-brand>

    <b-navbar-nav>
      <b-nav-item v-on:click="search(defaultOrganisation)">Click on items to see more information</b-nav-item>
    </b-navbar-nav>

    <b-collapse is-nav
      id="nav_collapse">

      <b-navbar-nav class="ml-auto">

        <!-- <b-nav-form>
          <b-form-input size="sm"
            class="mr-sm-2"
            type="text"
            placeholder="Search" />

          <b-button size="sm"
            class="my-2 my-sm-0"
            type="submit">Search</b-button>

        </b-nav-form> -->

        <b-nav-item-dropdown text="Funders" right>
          <b-dropdown-item v-on:click="search(funder.name)" v-bind:key="funder.id" v-for="funder in orderedFunders">
            <div class="gdv-dropdown-funders">
              <span class="gdv-truncate">{{ funder.name }}</span>
              :
              <span class="gdv-right">{{ formatCurrency(funder.value) }}</span>
            </div>
          </b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown text="Recipients"
          right>
          <b-dropdown-item v-on:click="search(recipient.name)" v-bind:key="recipient.id" v-for="recipient in orderedRecipients">
            <div class="gdv-dropdown-funders">
              <span class="gdv-truncate">{{ recipient.name }}</span>
              :
              <span class="gdv-right">{{ formatCurrency(recipient.value) }}</span>
            </div>
          </b-dropdown-item>
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
        // defaultOrganisation: 'The Big Lottery Fund'
        defaultOrganisation: 'The Wellcome Trust'
      }
    },
    methods: {
      search: function (name) {
        // store.getElementAction(name);
        this.$emit('select', { name });
        // store.setActiveIdAction(name);
      },
      formatCurrency: currency
    },
    computed: {
      orderedFunders: function () {
        return _.orderBy(this.state.funders, 'value', 'desc')
      },
      orderedRecipients: function () {
        return _.orderBy(this.state.recipients, 'value', 'desc')
      }
    }
  };
</script>

<style scoped>
  .gdv-right {
    float: right;
  }

  .gdv-truncate {
    width: 325px;
    overflow: hidden;
    display: inline-block;
    text-overflow: ellipsis;
  }

  .gdv-dropdown-funders {
    width: 475px;
  }
</style>
