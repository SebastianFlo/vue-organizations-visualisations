<template>
  <div>
    <div id="chart"></div>
    <div class="chart-actions">
      <button id="zoom_in">+</button>
      <button id="zoom_out">-</button>
      <button id="zoom_full">[ ]</button>
      {{ activeElement }}
    </div>
  </div>
</template>

<script>
  import store from '../store.vue';
  // import userLedData from '../assets/user-led.json';
  import userLedData from '../assets/children-with-disabilities.json';
  // import userLedData from '../assets/children-with-disabilities-no-blf.json';
  // import userLedData from '../assets/mental-health.json';
  // import userLedData from '../assets/mental-health-no-blf.json';
  // import userLedData from '../assets/blf.json';

  export default {
    data: function () {
      return {
        activeId: '',
        prevActiveId: '',
        state: store.state,
        allRectangles: [],
        formatedData: [],
        colorPallete: {
          'Charity : Registered Charity': 0,
          'School : Voluntary Aided School': 1,
          'School : Voluntary Controlled School': 2,
          'School : Community School': 3,
          'Other : Non charitable unincorporated organisation': 4,
          'None': 5
        }
      }
    },
    mounted: function () {
      var margin = { top: 1, right: 1, bottom: 6, left: 1 },
        width = 1500 - margin.left - margin.right, // was 960
        height = 3000;

      var formatNumber = d3.format(',.0f'),
        format = function (d) { return formatNumber(d) + ' £'; },
        color = d3.scale.category20();

      var zoom = d3.behavior.zoom()
        .translate([0, 0])
        .scale(1)
        .scaleExtent([0.2, 2])
        .on('zoom', zoomed);

      var svg = d3.select('#chart').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .call(zoom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      var sankey = d3.sankey()
        .nodeWidth(55) // was 15
        .nodePadding(20) // was 10
        .size([width, height]);

      var path = sankey.link();

      function zoomed() {
        svg.attr('transform',
          'translate(' + zoom.translate() + ')' +
          'scale(' + zoom.scale() + ')'
        );
        console.log(zoom.translate(), zoom.scale());
      }

      var radius = 5;

      this.formatedData = formatData(userLedData);
      const colorPallete = this.colorPallete;
      console.log('formatted Data', this.formatedData);

      sankey
        .nodes(this.formatedData.nodes)
        .links(this.formatedData.links)
        .layout(32); // what is this? iterations

      var link = svg.append('g').selectAll('.link')
        .data(this.formatedData.links)
        .enter().append('path')
        .attr('class', 'link')
        .attr('d', path)
        .style('stroke-width', function (d) { return Math.max(1, d.dy); })
        .style('stroke', function (d) { return d.source.color = color(d.source.name.replace(/ .*/, '')); })
        .sort(function (a, b) { return b.dy - a.dy; })
        .on('mouseover', this.setActive)
        .on('mouseout', this.clearActive);

      link.append('title')
        .text(function (d) { return d.source.name + ' → ' + d.target.name + '\n' + format(d.value); })

      var node = svg.append('g').selectAll('.node')
        .data(this.formatedData.nodes)
        .enter().append('g')
        .attr('class', 'node')

        .attr('transform', function (d) {
          return 'translate(' + d.x + ',' + d.y + ')';
        })
        .on('click', this.setKeepActive)
        .on('mouseover', this.setActive)
        .on('mouseout', this.clearActive);


      node.append('rect')
        .attr('height', sankey.nodeWidth())
        .attr('width', function (d) { return d.dy; })
        .attr('id', function (d) { return d.name; })
        .style('fill', function(d) {
          if (d.type) {
            return d.color = color(colorPallete[d.type]);
          } else if (d.recipients) {
            return d.color = color(d.name.replace(/ .*/, ''));
          }

          return d.color = color(colorPallete.None);
        })
        .append('title')
        .text(function (d) { return d.name + '\n' + format(d.value); })

      node.append('text')
        .attr('text-anchor', 'middle')
        .attr('x', function (d) { return d.dy / 2 })
        .attr('y', sankey.nodeWidth() / 2)
        .attr('dy', '.35em')

      d3.selectAll('button').on('click', zoomClick);
      d3.select('#zoom_full').on('click', zoomFull);


      function formatData(data) {
        var funders = data.grants.reduce(function (acc, grant) {
          acc[grant.fundingOrganization[0].id] = {
            name: grant.fundingOrganization[0].name,
            logo: grant.dataset.publisher.logo,
            website: grant.dataset.publisher.website,
            id: grant.fundingOrganization[0].name,
            recipients: getRecipients(acc, grant),
          }
          return acc;
        }, {});

        var fundersList = Object.values(funders).map(function (funder, index) {
          return funder;
        });

        store.setFundersAction(fundersList);

        var fundeds = data.grants.reduce(function (acc, grant) {
          acc[grant.recipientOrganization[0].id] = {
            name: grant.recipientOrganization[0].name,
            url: grant.recipientOrganization[0].url,
            id: grant.recipientOrganization[0].id,
            type: grant.BIGField_Organisation_Type
          };
          return acc;
        }, {});

        var fundedsList = Object.values(fundeds).map(function (funded, index) {
          return funded;
        });

        store.setRecipientsAction(fundedsList);

        var nodesObjects = Object.assign(funders, fundeds);

        var nodesList = Object.values(nodesObjects).map(function (node, index) {
          return {
            org: node,
            index: index,
          };
        });

        var links = [];
        nodesList.forEach(function (node) {
          if (!node.org.recipients) {
            return;
          }

          var subLinks = node.org.recipients.reduce(function (acc, recipient) {
            var link = {
              source: node.index,
              target: findIndexOf(recipient.id, nodesList),
              value: recipient.amount
            }
            acc.push(link);
            return acc;
          }, [])

          links = links.concat(subLinks);
        });

        return {
          nodes: nodesList.map(function (org) { return org.org }),
          links: links
        };
      }

      function findIndexOf(id, list) {
        const foundItem = list.find(function (item) {
          return item.org.id === id;
        });
        return foundItem.index;
      }

      function interpolateZoom(translate, scale) {
        const self = this;
        return d3.transition().duration(350).tween('zoom', function () {
          const iTranslate = d3.interpolate(zoom.translate(), translate);
          const iScale = d3.interpolate(zoom.scale(), scale);
          return function (t) {
            zoom
              .scale(iScale(t))
              .translate(iTranslate(t));
            zoomed();
          };
        });
      }

      function zoomClick() {
        const clicked = d3.event.target;
        let direction = 1;
        const factor = 0.2;
        let target_zoom = 1;
        const center = [width / 2, height / 2];
        const extent = zoom.scaleExtent();
        const translate = zoom.translate();
        let translate0 = [];
        let l = [];
        const view = { x: translate[0], y: translate[1], k: zoom.scale() };

        d3.event.preventDefault();
        direction = (this.id === 'zoom_in') ? 1 : -1;
        target_zoom = zoom.scale() * (1 + factor * direction);

        if (target_zoom < extent[0] || target_zoom > extent[1]) { return false; }

        translate0 = [(center[0] - view.x) / view.k, (center[1] - view.y) / view.k];
        view.k = target_zoom;
        l = [translate0[0] * view.k + view.x, translate0[1] * view.k + view.y];

        view.x += center[0] - l[0];
        view.y += center[1] - l[1];

        interpolateZoom([view.x, view.y], view.k);
      }

      function zoomFull() {
        const translate = [423.513292147877, 17.42590127464055];
        const scale = 0.2264789279589534;

        svg
          .transition()
          .duration(200) // milliseconds
          .call(zoom.translate(translate).scale(scale).event);
      }

      function getRecipients(list, grant) {
        var id = grant.fundingOrganization[0].id;
        var recipientOrganization = grant.recipientOrganization[0];
        var recipients = [];
        if (list[id] && list[id].recipients) {
          recipients = list[id].recipients;
          recipients.push({
            name: recipientOrganization.name,
            amount: grant.amountAwarded,
            id: recipientOrganization.id
          });
        } else {
          recipients.push({
            name: recipientOrganization.name,
            amount: grant.amountAwarded,
            id: recipientOrganization.id
          })
        }
        return recipients;
      }

      this.allRectangles = d3.selectAll('rect')[0];

      // this.preselectActive('The Big Lottery Fund');
    },
    methods: {
      setActive: function (data) {
        if (this.state.activeId) {
          this.clearActive(this.activeId);
        }

        store.setActiveAction(data);
      },
      clearActive: function (name) {
        store.clearActiveAction();
        store.setActiveIdAction('');

        const element = this.findElement(name);
        if (element && element.classList.contains('active')) {
          element.classList.toggle('active');
        }
      },
      setKeepActive: function () {
        store.setKeepActiveAction(true);
      },
      findElement(id) {
        return this.allRectangles.find(rectangle => rectangle.id === id);
      },
      findNodeData(id) {
        return this.formatedData.nodes.find(node => node.id === id);
      },
      preselectActive(id) {
        if (!id) {
          return;
        }

        const match = this.findElement(id);
        const matchData = this.findNodeData(id);

        this.setActive(matchData);

        match.classList.toggle('active');
      }
    },
    computed: {
      activeElement: function () {
        if (this.state.activeId && this.state.activeId !== this.prevActiveId) {
          this.preselectActive(this.state.activeId);
          this.state.activeId = this.prevActiveId;
        }

        return this.state.activeId;
      }
    }
  };
</script>

<style scoped>
  button {
    padding: 0px 30px;
  }

  .chart-actions {
    float: left;
  }
</style>
