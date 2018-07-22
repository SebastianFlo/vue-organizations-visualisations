<template>
  <div id="chart-parent">
    <div class='chart-actions'>
      <!-- <button id='zoom_in'>+</button>
      <button id='zoom_out'>-</button> -->
      <b-button :variant="'outline-success'"
        id='zoom_full'
        v-b-tooltip.hover
        title="Fit to Screen">[ ]</b-button>
      <!-- <button id='move_prev'></button>
      <button id='move_next'></button> -->
      <b-form-group class="gdv-left gdv-mt20" label="Grant Awarded">
        <b-form-checkbox-group stacked v-model="years.selected" name="flavour2" :options="years.options" v-on:change="toggleYears">
        </b-form-checkbox-group>
      </b-form-group>

    </div>
    <div id='chart'></div>
  </div>
</template>

<script>
  import _ from 'lodash';
  import store from '../store.vue';
  import userLedData from '../assets/children-with-disabilities.json';
  import extraData from '../assets/children-with-disabilities-extra.json';
  import { formatDate } from '../filters.vue';

  export default {
    data: function () {
      return {
        state: store.state,
        chartData: {
          margin: { top: 1, right: 1, bottom: 6, left: 1 },
        },
        height: 3000,
        d3Active: d3.select(null),
        legendEl: undefined,
        formatNumber: d3.format(',.0f'),
        formatedData: [],
        // debug only
        matchLess: [],
        parentDiv: undefined,
        years: {
          // values: new Set(),
          selected: ['2014', '2015', '2016', '2017', '2018'], // Must be an array reference!
          options: [
            {text: '2018', value: '2018'},
            {text: '2017', value: '2017'},
            {text: '2016', value: '2016'},
            {text: '2015', value: '2015'},
            {text: '2014', value: '2014'},
          ]
        }
      }
    },
    props: ['lastSelected'],
    created: function () {
    },
    mounted: function () {
      this.formatedData = this.formatData(userLedData);
      console.log('formatted Data', this.formatedData);
      this.parentDiv = document.getElementById('parentDiv');

      this.createChart();
      this.createLegend();
      this.setupButtons();
    },
    methods: {
      createChart: function () {
        const color = d3.scale.category20();
        const format = this.format;
        // const colorPallete = this.colorPallete;
        const colorPallete = this.state.charityTypes;
        // TODO: Set color dynamically
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

        this.svg = svg;

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
          .style('stroke', (d) => {
            // return d.source.color = color(d.source.name.replace(/ .*/, ''));
            const funderIndex = this.mapToRange(d.source.value, 0, 11871856, colorPallete.length, colorPallete.length + 27);
            return d.source.color = color(Math.round(funderIndex));
          })
          .attr('id', function (d, i) {
            d.id = i;
            return 'link-' + i;
          })
          .attr('data-target', function (d) { return d.target.name; })
          .attr('data-year', function (d) { return d.date; })
          .on('mouseover', this.setActive)
          .on('mouseout', this.clearActive);

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
          .on('mouseover', (node, i) => {
            this.showAllYears();
            this.setNodeLinksOpacity(node, i, 1);
            this.setActive(node);
          })
          // .on('mouseover', this.setActive)
          .on('mouseout', (node, i) => {
            // reset years
            this.setNodeLinksOpacity(node, i, 0.2);
            this.clearActive(node);
          });

        var charityTypes = new Map(); // delete

        node.append('rect')
          .attr('height', sankey.nodeWidth())
          .attr('width', function (d) { return d.dy; })
          .attr('id', function (d) { return d.name; })
          .style('fill', (d, index) => {
            if (d.type) {
              const charityIndex = colorPallete.indexOf(d.type);
              charityTypes.set(d.type, color(charityIndex));

              return d.color = color(charityIndex);
            } else if (d.recipients) {
              // return d.color = color(d.name.replace(/ .*/, ''));
              const funderIndex = this.mapToRange(d.value, 0, 11871856, colorPallete.length, colorPallete.length + 27);
              return d.color = color(Math.round(funderIndex));
            }

            return d.color = color(colorPallete.length);
          })
          .append('title')
          .text(function (d) { return d.name + '\n' + format(d.value); });

        node.selectAll('rect')
          .filter(function (d) { return d.type })
          .attr('data-legend', function (d) { return d.type })
          .attr('data-legend-pos', function (d) { return colorPallete.indexOf(d.type) });

        // Set color dynamically
        charityTypes.forEach((value, key) => {
          // console.log(value, key);
          store.setRecipientColorAction(key.toString(), value.toString(), colorPallete.indexOf(key.toString()));
        });

        node.selectAll('rect')
          .on('click', this.zoomToElement);

        node.append('text')
          .filter(function (d) { return d.recipients })
          .filter(function (d) { return d.dy > 100; })
          .attr('x', sankey.nodeWidth() + 20)
          .attr('y', (sankey.nodeWidth() + 170) / 2)
          .attr('text-anchor', 'start')
          .attr('transform', 'rotate(-65)')
          .style('fill', (d, index) => {
            const funderIndex = this.mapToRange(d.value, 0, 11871856, colorPallete.length, colorPallete.length + 27);
            return d.color = color(Math.round(funderIndex));
          })
          .text(function (d) { return d.name; });

        node.append('text')
          .filter(function (d) { return d.recipients })
          .filter(function (d) { return d.dy < 100; })
          .attr('x', sankey.nodeWidth() - 30)
          .attr('y', function (d) { return d.y })
          .attr('text-anchor', 'start')
          .attr('transform', 'rotate(-65)')
          .style('fill', (d, index) => {
            const funderIndex = this.mapToRange(d.value, 0, 11871856, colorPallete.length, colorPallete.length + 27);
            return d.color = color(Math.round(funderIndex));
          })
          .style('opacity', 0.5)
          .text(function (d) { return d.name; });

        this.zoomFull();
        // console.log('matchLess', this.matchLess);
      },
      createLegend: function () {
        this.legendEl = this.svg.append('g')
          .attr('class', 'legend')
          .attr('transform', `translate(${-2 * this.width}, ${(this.height / 2) - 50})`)
          .style('font-size', '32px')
          .call(this.generateLegendLib)
      },
      zoom: function () { },
      format: function (d) { return this.formatNumber(d) + ' £'; },
      zoomed: function () { },
      formatData: function (data) {
        const includedGrants = data.grants.filter(grant => extraData.exclude.indexOf(grant.id) < 0);

        const funders = includedGrants.reduce((acc, grant) => {
          acc[grant.fundingOrganization[0].id] = {
            name: grant.fundingOrganization[0].name,
            logo: grant.dataset.publisher.logo,
            website: grant.dataset.publisher.website,
            id: grant.fundingOrganization[0].name,
            recipients: this.getRecipients(acc, grant),
          }
          return acc;
        }, {});

        // this.years.values.forEach(val => console.log(val));

        const fundersList = Object.values(funders).map(function (funder, index) {
          return funder;
        });

        store.setFundersAction(fundersList);

        const fundeds = includedGrants.reduce((acc, grant) => {
          acc[grant.recipientOrganization[0].id] = {
            name: grant.recipientOrganization[0].name,
            website: grant.recipientOrganization[0].url,
            id: grant.recipientOrganization[0].id,
            description: grant.description,
            type: this.getCharityType(grant.id, grant.recipientOrganization[0].name) || ''
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
              value: recipient.amount,
              date: recipient.date
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
            this.highlight_link('#link-' + link.id, opacity);
          });

          while (remainingNodes.length) {
            nextNodes = [];
            remainingNodes.forEach(node => {
              node[step.linkType].forEach(link => {
                nextNodes.push(link[step.nodeType]);
                this.highlight_link('#link-' + link.id, opacity);
              });
            });
            remainingNodes = nextNodes;
          }
        });
      },
      highlight_link: function (id, opacity) {
        d3.select(id).style('stroke-opacity', opacity);
      },
      showAllYears: function () {
        this.years.selected = this.years.options.map(option => option.value); // reset years
        this.toggleYears(this.years.selected);
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
        console.log(this.svg);
        const bbox = this.svg[0][0].getBBox();
        const center = {
          x: bbox.x + bbox.width/2,
          y: bbox.y + bbox.height/2
        };

        // const translate = [659.9932142084058, 99.55105973555226];
        // const translate = [this.width + center.x, (this.height / 2) - center.y];
        const translate = [this.width + center.x - (center.x / 8), (this.height / 2) - center.y - 80];
        const scale = 0.20837957399983806;

        this.svg
          .transition()
          .duration(750) // milliseconds
          .call(this.zoom.translate(translate).scale(scale).event);
      },
      reset: function () {
        this.zoomFull();
      },
      getRecipients: function (list, grant) {
        const id = grant.fundingOrganization[0].id;
        const recipientOrganization = grant.recipientOrganization[0];
        let recipients = [];

        // this.years.values.add(formatDate(grant.awardDate));

        if (list[id] && list[id].recipients) {
          recipients = list[id].recipients;
          recipients.push({
            name: recipientOrganization.name,
            amount: grant.amountAwarded,
            id: recipientOrganization.id,
            date: formatDate(grant.awardDate)
          });
        } else {
          recipients.push({
            name: recipientOrganization.name,
            amount: grant.amountAwarded,
            id: recipientOrganization.id,
            date: formatDate(grant.awardDate)
          })
        }
        return recipients;
      },

      getCharityType: function (grantId, recipientName) {
        const grant = extraData.additionalData.find(charity => charity.id === grantId);

        if (!grant || !grant.type) {
          this.matchLess.push({
            id: grantId, name: recipientName
          });
          return '';
        }

        return grant.type;
      },


      setActive: function (data) {
        store.setActiveDataAction(data);
      },
      clearActive: function (data) {

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
      mapToRange(num, in_min, in_max, out_min, out_max) {
        return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
      },
      generateLegendLib(g) {
        const setNodeLinksOpacity = this.setNodeLinksOpacity;
        const formatedData = this.formatedData;
        const highlight_link = this.highlight_link;
        const chartSvg = this.svg;

        g.each(function () {

          const g = d3.select(this);
          let items = {};
          const svg = d3.select(g.property('nearestViewportElement'));
          const legendPadding = g.attr('data-style-padding') || 5;
          const lb = g.selectAll('.legend-box').data([true]);
          const li = g.selectAll('.legend-items').data([true]);

          lb.enter().append('rect').classed('legend-box', true)
          li.enter().append('g').classed('legend-items', true)

          svg.selectAll('[data-legend]').each(function () {
            var self = d3.select(this)
            items[self.attr('data-legend')] = {
              pos: self.attr('data-legend-pos') || this.getBBox().y,
              color: self.attr('data-legend-color') != undefined ? self.attr('data-legend-color') : self.style('fill') != 'none' ? self.style('fill') : self.style('stroke')
            }
          })

          items = d3.entries(items).sort(function (a, b) { return a.value.pos - b.value.pos })


          li.selectAll('text')
            .data(items, function (d) { return d.key })
            .call(function (d) { d.enter().append('text') })
            .call(function (d) { d.exit().remove() })
            .attr('y', function (d, i) { return i + 'em' })
            .attr('x', '1em')
            .text(function (d) { return d.key; })
            .on('mouseover', (node, i) => {
              const rectNodes = svg.selectAll(`rect[data-legend="${node.key}"]`);

              rectNodes[0].forEach((rectNode, i) => {
                const link = svg.select(`.link[data-target="${rectNode.id}"]`)
                highlight_link('#' + link[0][0].id, 1);
              });
            })
            .on('mouseout', (node, i) => {
              const rectNodes = svg.selectAll(`rect[data-legend="${node.key}"]`);

              rectNodes[0].forEach((rectNode, i) => {
                const link = svg.select(`.link[data-target="${rectNode.id}"]`)
                highlight_link('#' + link[0][0].id, 0.2);
              });
            });

          li.selectAll('circle')
            .data(items, function (d) { return d.key })
            .call(function (d) { d.enter().append('circle') })
            .call(function (d) { d.exit().remove() })
            .attr('cy', function (d, i) { return i - 0.25 + 'em' })
            .attr('cx', 0)
            .attr('r', '0.4em')
            .style('fill', function (d) { return d.value.color })

          // Reposition and resize the box
          var lbbox = li[0][0].getBBox()
          lb.attr('x', (lbbox.x - legendPadding))
            .attr('y', (lbbox.y - legendPadding))
            .attr('height', (lbbox.height + 2 * legendPadding))
            .attr('width', (lbbox.width + 2 * legendPadding))
        })
        return g;
      },
      toggleYears (checked) {
        // this.selected = checked ? this.flavours.slice() : []
        const links = this.svg.selectAll(`.link`);
        const deselected = _.difference(this.years.options.map(option => option.value), checked);
        console.log('deselected', deselected);
        deselected.forEach(year => {
          const deselectedLinks = this.svg.selectAll(`.link[data-year="${year}"]`)
          deselectedLinks[0].forEach(link => {
            this.highlight_link('#' + link.id, 0);
          })
        });

        checked.forEach(year => {
          const selectedLinks = this.svg.selectAll(`.link[data-year="${year}"]`)
          selectedLinks[0].forEach(link => {
            this.highlight_link('#' + link.id, 0.2);
          })
        });
      },
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
          const parent = el.parentNode;
          const click = new Event('click');
          const mouseover = new Event('mouseover');
          el.dispatchEvent(click);
          parent.dispatchEvent(mouseover);
        }
      }
    }
  };
</script>

<style scoped>
  .chart-actions {
    position: absolute;
    top: 20px;
    left: 20px;
  }

  #parentDiv {
    height: calc(100vh - 100px); /** output container is small for display */
    width: calc(100vw - 100px);
    display: block;
    border: 1px solid red;
  }
</style>
