<template>
  <div>
    <div id='chart'></div>
    <div class='chart-actions'>
      <button id='zoom_in'>+</button>
      <button id='zoom_out'>-</button>
      <button id='zoom_full'>[ ]</button>
      <button id='move_prev'>⬅</button>
      <button id='move_next'>➡</button>
    </div>
  </div>
</template>

<script>
  import store from '../store.vue';
  import userLedData from '../assets/children-with-disabilities.json';

  export default {
    data: function () {
      return {
        state: store.state,
        chartData: {
          margin: { top: 1, right: 1, bottom: 6, left: 1 },
        },
        height: 3000,
        d3Active: d3.select(null),
        formatNumber: d3.format(',.0f'),
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
    props: ['lastSelected'],
    created: function () {
    },
    mounted: function () {
      this.formatedData = this.formatData(userLedData);
      console.log('formatted Data', this.formatedData);

      this.createChart();
      this.setupButtons();
    },
    methods: {
      createChart: function () {
        const color = d3.scale.category20();
        const format = this.format;
        const colorPallete = this.colorPallete;

        const zoom = d3.behavior.zoom()
        .translate([0, 0])
        .scale(1)
        .scaleExtent([0.2, 2])
        .on('zoom', zoomed);

        this.zoom = zoom;

        const svg = d3.select('#chart').append('svg')
          .attr('width', this.width + this.chartData.margin.left + this.chartData.margin.right)
          .attr('height', this.height + this.chartData.margin.top + this.chartData.margin.bottom)
          .call(this.zoom)
          .append('g')
          .attr('transform', 'translate(' + this.chartData.margin.left + ',' + this.chartData.margin.top + ')');

        const sankey = d3.sankey()
          .nodeWidth(55) // was 15
          .nodePadding(20) // was 10
          .size([this.width, this.height]);

        const path = sankey.link();

        function zoomed() {
          svg.attr('transform',
            'translate(' + zoom.translate() + ')' +
            'scale(' + zoom.scale() + ')'
          );
          console.log(zoom.translate(), zoom.scale());
        }

        this.zoomed = zoomed;

        sankey
          .nodes(this.formatedData.nodes)
          .links(this.formatedData.links)
          .layout(32);

        const link = svg.append('g').selectAll('.link')
          .data(this.formatedData.links)
          .enter().append('path')
          .attr('class', 'link')
          .attr('d', path)
          .style('stroke-width', function (d) { return Math.max(1, d.dy); })
          .style('stroke', function (d) { return d.source.color = color(d.source.name.replace(/ .*/, '')); })
          .attr('id', function (d, i) {
            d.id = i;
            return 'link-' + i;
          })
        // .on('mouseover', this.setActive)
        // .on('mouseout', this.clearActive);

        link.append('title')
          .text(function (d) { return d.source.name + ' → ' + d.target.name + '\n' + format(d.value); });

        const node = svg.append('g').selectAll('.node')
          .data(this.formatedData.nodes)
          .enter().append('g')
          .attr('class', 'node')
          .attr('transform', function (d) {
            return 'translate(' + d.x + ',' + d.y + ')';
          })
          // .on('click', this.setActive)
          .on('mouseover', (node, i) => { this.setNodeLinksOpacity(node, i, 1) })
          .on('mouseout', (node, i) => { this.setNodeLinksOpacity(node, i, 0.2) });

        node.append('rect')
          .attr('height', sankey.nodeWidth())
          .attr('width', function (d) { return d.dy; })
          .attr('id', function (d) { return d.name; })
          .style('fill', function (d) {
            if (d.type) {
              return d.color = color(colorPallete[d.type]);
            } else if (d.recipients) {
              return d.color = color(d.name.replace(/ .*/, ''));
            }

            return d.color = color(colorPallete.None);
          })
          .append('title')
          .text(function (d) { return d.name + '\n' + format(d.value); });

        node.selectAll('rect')
          .on('click', this.zoomToElement);

        node.append('text')
          .attr('text-anchor', 'middle')
          .attr('x', function (d) { return d.dy / 2 })
          .attr('y', sankey.nodeWidth() / 2)
          .attr('dy', '.35em');
      },
      zoom: function () {},
      format: function (d) { return this.formatNumber(d) + ' £'; },
      zoomed: function () {},
      formatData: function (data) {
        const funders = data.grants.reduce((acc, grant) => {
          acc[grant.fundingOrganization[0].id] = {
            name: grant.fundingOrganization[0].name,
            logo: grant.dataset.publisher.logo,
            website: grant.dataset.publisher.website,
            id: grant.fundingOrganization[0].name,
            recipients: this.getRecipients(acc, grant),
          }
          return acc;
        }, {});

        const fundersList = Object.values(funders).map(function (funder, index) {
          return funder;
        });

        store.setFundersAction(fundersList);

        const fundeds = data.grants.reduce(function (acc, grant) {
          acc[grant.recipientOrganization[0].id] = {
            name: grant.recipientOrganization[0].name,
            url: grant.recipientOrganization[0].url,
            id: grant.recipientOrganization[0].id,
            type: grant.BIGField_Organisation_Type
          };
          return acc;
        }, {});

        const fundedsList = Object.values(fundeds).map(function (funded, index) {
          return funded;
        });

        store.setRecipientsAction(fundedsList);

        const nodesObjects = Object.assign(funders, fundeds);

        const nodesList = Object.values(nodesObjects).map(function (node, index) {
          return {
            org: node,
            index: index,
          };
        });

        let links = [];
        nodesList.forEach((node) => {
          if (!node.org.recipients) {
            return;
          }

          const subLinks = node.org.recipients.reduce((acc, recipient) => {
            const link = {
              source: node.index,
              target: this.findIndexOf(recipient.id, nodesList),
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
      },
      setNodeLinksOpacity: function (node, i, opacity) {
        let remainingNodes = [];
        let nextNodes = [];

        var traverse = [{
          linkType: 'sourceLinks',
          nodeType: 'target'
        }, {
          linkType: 'targetLinks',
          nodeType: 'source'
        }];

        traverse.forEach(step => {
          node[step.linkType].forEach(link => {
            remainingNodes.push(link[step.nodeType]);
            this.highlight_link(link.id, opacity);
          });

          while (remainingNodes.length) {
            nextNodes = [];
            remainingNodes.forEach(node => {
              node[step.linkType].forEach(link => {
                nextNodes.push(link[step.nodeType]);
                this.highlight_link(link.id, opacity);
              });
            });
            remainingNodes = nextNodes;
          }
        });
      },
      highlight_link: function (id, opacity) {
        d3.select('#link-' + id).style('opacity', opacity);
      },
      zoomToElement: function (d) {
        // if (d3Active.node() === this) return reset();
        // d3Active.classed('active', false);
        // d3Active = d3.select(this).classed('active', true);
        const { x, y, dy } = d;

        const scale = 1;
        const translate = [-x - (dy / 2) + (this.width / 2) - 150, -y + 360];

        // console.log('zooming to', translate);
        this.svg.transition()
          .duration(1000)
          .attr('transform', 'translate(' + translate + ')scale(' + scale + ')');
      },
      setupButtons: function () {
        d3.selectAll('button').on('click', this.zoomClick);
        d3.select('#zoom_full').on('click', this.zoomFull);
      },
      findIndexOf: function (id, list) {
        const foundItem = list.find(function (item) {
          return item.org.id === id;
        });
        return foundItem.index;
      },
      interpolateZoom: function (translate, scale) {
        return d3.transition().duration(350).tween('zoom', () => {
          const iTranslate = d3.interpolate(this.zoom.translate(), translate);
          const iScale = d3.interpolate(this.zoom.scale(), scale);

          return (t) => {
            this.zoom
              .scale(iScale(t))
              .translate(iTranslate(t));
            this.zoomed();
          };
        });
      },
      zoomClick: function () {
        const clicked = d3.event.target;
        let direction = 1;
        const factor = 0.2;
        let target_zoom = 1;
        const center = [this.width / 2, this.height / 2];
        const extent = this.zoom.scaleExtent();
        const translate = this.zoom.translate();
        let translate0 = [];
        let l = [];
        const view = { x: translate[0], y: translate[1], k: this.zoom.scale() };

        d3.event.preventDefault();
        direction = (this.id === 'zoom_in') ? 1 : -1;
        target_zoom = this.zoom.scale() * (1 + factor * direction);

        if (target_zoom < extent[0] || target_zoom > extent[1]) { return false; }

        translate0 = [(center[0] - view.x) / view.k, (center[1] - view.y) / view.k];
        view.k = target_zoom;
        l = [translate0[0] * view.k + view.x, translate0[1] * view.k + view.y];

        view.x += center[0] - l[0];
        view.y += center[1] - l[1];

        this.interpolateZoom([view.x, view.y], view.k);
      },
      zoomFull: function () {
        const translate = [792.9501717238787, 21.866219449124685];
        const scale = 0.2264789279589534;

        this.svg
          .transition()
          .duration(750) // milliseconds
          .call(this.zoom.translate(translate).scale(scale).event);
      },
      reset: function () {
        // d3Active.classed('active', false);
        // d3Active = d3.select(null);

        this.zoomFull();
      },
      getRecipients: function (list, grant) {
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
      },


      setActive: function (data) {
        // if (this.state.activeId) {
        //   this.clearActive(this.activeId);
        // }

        // store.setActiveAction(data);
      },
      clearActive: function (name) {
        // store.clearActiveAction();
        // store.setActiveIdAction('');

        // const element = this.findElement(name);
        // if (element && element.classList.contains('active')) {
        //   element.classList.toggle('active');
        // }
      },
      setKeepActive: function () {
        // store.setKeepActiveAction(true);
      },
      findElement(id) {
        return d3.selectAll('rect')[0].find(rectangle => rectangle.id === id);
      },
      findNodeData(id) {
        return this.formatedData.nodes.find(node => node.id === id);
      },
      preselectActive(id) {
        // if (!id) {
        //   return;
        // }

        // const match = this.findElement(id);
        // const matchData = this.findNodeData(id);

        // this.setActive(matchData);

        // match.classList.toggle('active');
      }
    },
    computed: {
      width: function () {
        return 1500 - this.chartData.margin.left - this.chartData.margin.right;
      },
      // svg: function () {
      //   return d3.select('svg');
      // }
    },
    watch: {
      lastSelected: function (newVal, oldVal) { // watch it
        if (newVal.name !== oldVal.name) {
          const el = this.findElement(newVal.name);
          const click = new Event('click');
          el.dispatchEvent(click);
        }
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
