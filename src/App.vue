<template>
  <div id="app">
    <gdv-navbar v-on:select="selectLast"></gdv-navbar>

    <b-container fluid
      style="height: 100%;">
      <b-row style="height: 100%;">
        <b-col cols="3"
          class="side-menu">
          <gdv-sidebar></gdv-sidebar>
        </b-col>
        <b-col cols="9" class="content">
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


  #chart {
    height: 720px;
    /* must at least match the svg, to place content after it!*/
    overflow: hidden;
    /* background-color: rgba(0, 0, 0, 0.2); */
    background-color: rgb(255, 255, 255);
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
    height: 100%;
    padding: 10px;
    overflow: scroll;
    border-right: 1px solid black;
  }

  .content {
    height: 100%;
  }

  .navbar-expand-md .navbar-nav .dropdown-menu {
    position: absolute;
    height: 200px;
    max-height: 200px;
    overflow-x: hidden;
  }
</style>
