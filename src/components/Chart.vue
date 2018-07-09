<template>
    <div id="chart"></div>
</template>

<script>
  import store from '../store.vue';
  import userLedData from '../assets/user-led.json';

  export default {
    data: function () {
      return {
        state: store.state
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
        svg.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
      }

      var radius = 5;

      console.log('active', this.active);
      var formatedData = formatData(userLedData);
      console.log('formatted Data', formatedData);

      sankey
        .nodes(formatedData.nodes)
        .links(formatedData.links)
        .layout(32); // what is this? iterations

      var link = svg.append('g').selectAll('.link')
        .data(formatedData.links)
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
        .data(formatedData.nodes)
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
        .style('fill', function (d) { return d.color = color(d.name.replace(/ .*/, '')); })
        .style('stroke', function (d) { return d3.rgb(d.color).darker(2); })
        .append('title')
        .text(function (d) { return d.name + '\n' + format(d.value); })

      node.append('text')
        .attr('text-anchor', 'middle')
        .attr('x', function (d) { return d.dy / 2 })
        .attr('y', sankey.nodeWidth() / 2)
        .attr('dy', '.35em')


      function formatData(data) {
        var funders = data.grants.reduce(function (acc, grant) {
          acc[grant.fundingOrganization[0].id] = {
            name: grant.fundingOrganization[0].name,
            logo: grant.dataset.publisher.logo,
            website: grant.dataset.publisher.website,
            id: grant.fundingOrganization[0].name,
            recipients: getRecipients(acc, grant)
          }
          return acc;
        }, {});

        var fundersList = Object.values(funders).map(function (funder, index) {
          return funder;
        });

        var fundeds = data.grants.reduce(function (acc, grant) {
          acc[grant.recipientOrganization[0].id] = {
            name: grant.recipientOrganization[0].name,
            url: grant.recipientOrganization[0].url,
            id: grant.recipientOrganization[0].id,
          };
          return acc;
        }, {});

        var nodesObjectes = Object.assign(funders, fundeds);

        var nodesList = Object.values(nodesObjectes).map(function (node, index) {
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
    },
    methods: {
      setActive: function (data) {
        store.setActiveAction(data);
      },
      clearActive: function () {
        store.clearActiveAction();
      },
      setKeepActive: function () {
        store.setKeepActiveAction(true);
      }
    }
  };
</script>

<style scoped>

</style>
