var app = new Vue({
    el: '#app',
    data: {
      message: 'User Led Organizations!',
      active: {
          name: '',
          value: null,
          funder: false,
      },
      keepActiveItem: true
    },
    mounted: function () {
        var margin = { top: 1, right: 1, bottom: 6, left: 1 },
            width = 1500 - margin.left - margin.right, // was 960
            //height = 1500 - margin.top - margin.bottom; // was 500
            height = 3000; // UBS Example

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
            // .call(d3.behavior.zoom().on('zoom', function () {
            //     svg.attr('transform', 'translate(' + d3.event.translate + ')' + ' scale(' + d3.event.scale + ')')
            // }))
            .call(zoom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

        var sankey = d3.sankey()
            .nodeWidth(55) // was 15
            .nodePadding(20) // was 10
            .size([width, height]);

        var path = sankey.link();

        function zoomed(){
            svg.attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
        }

        var radius = 5;

        d3.json('data/user-led.json', (userLedData) => {

            console.log('active', this.active);
            var formatedData = formatData(userLedData);
            console.log('formatted Data', formatedData);

            // var xScale = d3.scale.linear()
            // .domain([0, d3.max(formatedData, function (d) { return d.x + 10; })])
            // .range([margin.left, width - margin.right]);  // Set margins for x specific

            // // We're passing in a function in d3.max to tell it what we're maxing (y value)
            // var yScale = d3.scale.linear()
            // .domain([0, d3.max(formatedData, function (d) { return d.y + 10; })])
            // .range([margin.top, height - margin.bottom]);  // Set margins for y specific


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
                .on('mouseout', this.removeActive);

            link.append('title')
                .text(function (d) { return d.source.name + ' → ' + d.target.name + '\n' + format(d.value); })
            // title is an SVG standard way of providing tooltips, up to the browser how to render this, so changing the style is tricky

            var node = svg.append('g').selectAll('.node')
                .data(formatedData.nodes)
                .enter().append('g')
                .attr('class', 'node')
                .attr('transform', function (d) {
                    return 'translate(' + d.x + ',' + d.y + ')';
                })
                .on('click', this.keepActive)
                .on('mouseover', this.setActive)
                .on('mouseout', this.removeActive);
                // .call(d3.behavior.drag()
                //     .origin(function (d) { return d; })
                //     .on('dragstart', function () { this.parentNode.appendChild(this); })
                //     .on('drag', dragmove));

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
                // .text(function (d) { return d.name; })
                // .filter(function (d) { return d.x < width / 2; });

            // function dragmove(d) {
            //     d3.select(this).attr('transform', 'translate(' + (d.x = Math.max(0, Math.min(width - d.dy, d3.event.x))) + ',' + d.y + ')');
            //     sankey.relayout();
            //     link.attr('d', path);
            // }

            // function handleMouseOver(d, i) {
            //     // Add interactivity
            //     // console.log('on mouse over', d)
            //     // Use D3 to select element, change color and size
            //     // d3.select(this).attr({
            //     //   fill: 'orange',
            //     //   r: radius * 2
            //     // });

            //     // // Specify where to put label of text
            //     // svg.append('text').attr({
            //     //    id: 't' + d.x + '-' + d.y + '-' + i,  // Create an id for text so we can select it later for removing on mouseout
            //     //     x: function() { return xScale(d.x) - 30; },
            //     //     y: function() { return yScale(d.y) - 15; }
            //     // })
            //     // .text(function() {
            //     //   return [d.x, d.y];  // Value of the text
            //     // });
            //   }

            // function handleMouseOut(d, i) {
            //     this.active = {};

            //     console.log('active', this.active);
            //     //     console.log('on mouse out', d)
            //     //     // Use D3 to select element, change color back to normal
            //     //     d3.select(this).attr({
            //     //         fill: 'black',
            //     //         r: radius
            //     //     });

            //     //     // Select text by id and then remove
            //     //     d3.select('#t' + d.x + '-' + d.y + '-' + i).remove();  // Remove text location
            //     }
        });

        function formatData(data) {
            var funders = data.grants.reduce(function(acc, grant) {
                acc[grant.fundingOrganization[0].id] = {
                    name: grant.fundingOrganization[0].name,
                    logo: grant.dataset.publisher.logo,
                    website: grant.dataset.publisher.website,
                    id: grant.fundingOrganization[0].name,
                    recipients: getRecipients(acc, grant)
                }
                return acc;
            }, {});

            var fundersList = Object.values(funders).map(function(funder, index) {
                return funder;
            });

            var fundeds = data.grants.reduce(function(acc, grant) {
                acc[grant.recipientOrganization[0].id] = {
                    name: grant.recipientOrganization[0].name,
                    url: grant.recipientOrganization[0].url,
                    id: grant.recipientOrganization[0].id,
                };
                return acc;
            }, {});

            var nodesObjectes = Object.assign(funders, fundeds);

            var nodesList = Object.values(nodesObjectes).map(function(node, index) {
                return {
                    org: node,
                    index: index,
                };
            });

            var links = [];
            nodesList.forEach(function(node) {
                if (!node.org.recipients) {
                    return;
                }

                var subLinks = node.org.recipients.reduce(function(acc, recipient) {
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
                nodes: nodesList.map(function(org) { return org.org }),
                links: links
            };
        }

        function findIndexOf(id, list) {
            const foundItem = list.find(function(item) {
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

        keepActive() {
            this.keepActiveItem = true;
        },
        removeActive() {
            if (this.keepActiveItem) {
                return;
            }
          this.active = {};
        },
        setActive(data) {
            let activeData = {
                type: ''
            };

            if (data.source && data.target) {
                // If Link
                activeData.source = {
                    name: data.source.name,
                    recipients: data.source.recipients,
                    value: data.source.value,
                };
                activeData.target = {
                    name: data.target.name,
                    value: data.target.value,
                };
                activeData.type = 'link';

            } else if (data.recipients) {
                // If Funder
                activeData.name = data.name;
                activeData.logo = data.logo;
                activeData.value = data.value;
                activeData.recipients = data.recipients;
                activeData.type = 'funder';

            } else {
                // If Funded
                activeData.name = data.name;
                activeData.value = data.value;
                activeData.type = 'funded';
                activeData.funder = data.targetLinks;
            }

            this.active = activeData;
        }
    },
    filters: {
        currency: function (value) {
          if (!value) return ''
          value = value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
          return value + ' £';
        }
      }
  })
