let data = {}

let width = 520
let height = 283
let padding = 5

let minX
let maxX
let minY
let maxY
let xScale
let yScale

let canvas = d3.select('#canvas')
canvas.attr('width', width)
      .attr('height', height)

let tooltip = d3.select('#tooltip')

let color = d3
    .scaleThreshold()
    .domain(d3.range(0.01, 1.00, 1 / 8))
    .range(d3.schemeReds[9]);

d3.json("Compactness Index.json").then(function(d) {
    data = d.features
    //console.log(data);

    /*generate scales*/
    minX = d3.min(data, (item) => item.geometry.rings[0][0][0])
    maxX = d3.max(data, (item) => item.geometry.rings[0][0][0])
    minY = d3.min(data, (item) => item.geometry.rings[0][0][1])
    maxY = d3.max(data, (item) => item.geometry.rings[0][0][1])

    xScale = d3.scaleLinear()
               .domain([minX, maxX])
               .range([padding, width - padding])
    
    yScale = d3.scaleLinear()
               .domain([maxY, minY])
               .range([padding, height - padding])
    
    /*draw cells*/
    canvas.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'cell')
      .attr('x', (item) => xScale(item.geometry.rings[0][0][0]))
      .attr('y', (item) => yScale(item.geometry.rings[0][0][1])-5)
      .attr('width', (width - 2*padding)/40)
      .attr('height', (height - 2*padding)/21)
      .attr('fill', (item) => color(item.attributes['紧凑度指数']))
      .on('mouseover', (item) => {
        tooltip.transition()
               .duration(0)
               .style('visibility', 'visible')
               .text('Compactness Index: '+item.attributes['紧凑度指数'])
               .style('left', d3.event.pageX + 'px')
               .style('top', d3.event.pageY +20 + 'px')
      })
      .on('mouseout', (item) => {
        tooltip.transition()
               .style('visibility', 'hidden')
      })

    /*draw legend
    let x = d3.scaleLinear().domain([0.01, 1.00]).rangeRound([370, 580]);
    let g = canvas.append('g')
        .attr('class', 'key')
        .attr('id', 'legend')
        .attr('transform', 'translate(0,40)');
    g.selectAll('rect')
        .data(
          color.range().map(function (d) {
            d = color.invertExtent(d);
            if (d[0] === null) {
              d[0] = x.domain()[0];
            }
            if (d[1] === null) {
              d[1] = x.domain()[1];
            }
            return d;
          })
        )
        .enter()
        .append('rect')
        .attr('height', 8)
        .attr('x', function (d) {
          return x(d[0]);
        })
        .attr('width', function (d) {
          return d[0] && d[1] ? x(d[1]) - x(d[0]) : x(null);
        })
        .attr('fill', function (d) {
          return color(d[0]);
        });
    g.append('text')
        .attr('class', 'caption')
        .attr('x', x.range()[0])
        .attr('y', -6)
        .attr('fill', '#000')
        .attr('text-anchor', 'start');
    g.call(
        d3
          .axisBottom(x)
          .tickSize(12)
          .tickFormat(function (x) {
            return x;
          })
          .tickValues(color.domain())
      )
        .select('.domain')
        .remove();*/
});