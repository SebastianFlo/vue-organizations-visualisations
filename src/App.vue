<template>
  <div id="app">
    <gdv-navbar v-on:select="selectLast"></gdv-navbar>

    <b-container fluid style="height: 100%;">
      <b-row style="height: 100%;">
        <b-col cols="12" md="3" class="side-menu">
          <gdv-sidebar v-on:select="selectLast"></gdv-sidebar>
        </b-col>
        <b-col cols="6" md="9" class="content">
          <gdv-chart v-bind:lastSelected="selectedLast"></gdv-chart>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import Navbar from './components/Navbar.vue';
  import Sidebar from './components/Sidebar.vue';
  import Chart from './components/Chart.vue';

  import store from './store.vue';

  export default {
    name: 'app',
    data() {
      return {
        state: store.state,
        selectedLast: {}
      }
    },
    components: {
      'gdv-navbar': Navbar,
      'gdv-sidebar': Sidebar,
      'gdv-chart': Chart,
    },
    methods: {
      selectLast: function (name) {
        this.selectedLast = name;
      }
    }
  }
</script>

<style>
  html {
    height: 100%;
  }

  body {
    background-color: white;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  h1,
  h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }


  /* #chart {
    height: 720px;
    overflow: hidden;
    background-color: rgb(255, 255, 255);
  } */

  #chart {
    /* position: fixed; */
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
  }

  .node rect {
    /* cursor: move; */
    fill-opacity: .7;
    shape-rendering: crispEdges;
  }

  .node rect:hover {
    fill-opacity: 1;
    stroke: blue;
  }

  .node rect.active {
    fill-opacity: 1;
    stroke: blue;
  }

  .node text {
    font-family: Arial, Helvetica, sans-serif;
    pointer-events: none;
  }

  .link {
    fill: none;
    stroke-opacity: .2;
    /* opacity: 0.2; */
  }

  .link:hover {
    stroke-opacity: 1 !important;
    /* opacity: 1; */
  }

  #app {
    height: 100%;
  }

  .side-menu {
    /*
    padding: 10px;
    border-right: 1px solid black; */
    height: 100%;
    overflow: scroll;
    background: #343a40;
  }

  .content {
    height: 100%;
  }

  .navbar-expand-md .navbar-nav .dropdown-menu {
    position: absolute;
    height: 300px;
    max-height: 300px;
    overflow-x: hidden;
    padding: 0;
  }

  .gdv-truncate {
    overflow: hidden;
    display: inline-block;
    text-overflow: ellipsis;
  }

  .gdv-width-200 {
    width: 200px;
  }

  .gdv-hover {
    cursor: pointer;
  }

  .gdv-left {
    text-align: left;
  }

  .gdv-mt20 {
    margin-top: 20px;
  }

  .gdv-mb70 {
    margin-bottom: 70px !important;
  }

  .gdv-text--black {
    color: rgb(10, 10, 10);
  }

  .legend rect {
    fill:white;
    opacity:0.8;
  }

  .legend text {
    cursor: default;
  }
</style>
