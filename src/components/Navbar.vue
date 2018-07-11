<template>
    <b-navbar toggleable="md" type="dark" variant="dark">

        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

        <b-navbar-brand>Children Charities</b-navbar-brand>

        <b-navbar-nav>
          <b-nav-item v-on:click="highlight(defaultOrganisation)">Hover over items to see more information</b-nav-item>
        </b-navbar-nav>

        <b-collapse is-nav id="nav_collapse">

            <b-navbar-nav class="ml-auto">

                <b-nav-form>
                    <b-form-input size="sm"
                        class="mr-sm-2"
                        type="text"
                        placeholder="Search" />
                    <b-button size="sm"
                        class="my-2 my-sm-0"
                        type="submit">Search</b-button>
                </b-nav-form>

                <b-nav-item-dropdown text="Funders" right>
                    <b-dropdown-item
                      v-on:click="highlight(funder.name)"
                      v-for="funder in state.funders">{{ funder.name }}</b-dropdown-item>
                </b-nav-item-dropdown>

                <b-nav-item-dropdown text="Recipients" right>
                    <b-dropdown-item
                      v-on:click="highlight(recipient.name)"
                      v-for="recipient in state.recipients">{{ recipient.name }}</b-dropdown-item>
                </b-nav-item-dropdown>

            </b-navbar-nav>

        </b-collapse>
    </b-navbar>
</template>

<script>
  import store from '../store.vue';

  export default {
    data: function () {
      return {
        state: store.state,
        // defaultOrganisation: 'The Big Lottery Fund'
        defaultOrganisation: 'The Wellcome Trust'
      }
    },
    methods: {
      highlight: function(name) {
        store.setActiveIdAction(name);
      }
    }
  };
</script>

<style scoped>

</style>
