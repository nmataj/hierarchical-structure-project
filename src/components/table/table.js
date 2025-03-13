import { select, selectAll, hierarchy, max } from 'd3';

import { sum, invert, skip, toggleChildren, getLevelColor  } from '@/helpers';
import { createSvg } from '@/components/svg';
import { collapse, generateColorScale } from '@/helpers';
import { createHeaders } from '@/components/table/headers.js';
import { barWidth, barHeight, cellColor, innerHeight } from '@/config';

let i = 0;

export function update(root, svg, g, headers, barHeight, barWidth, levelColors) {
  if (!root) return null;

  sum(root);

  const nodes = root.descendants() || [];

  let index = -1;
  root.eachBefore(d => {
    d.x = ++index * barHeight + barHeight;
    d.y = d.depth * 25;
  });

  const node = g.selectAll('.node')
    .data(nodes, d => d.id || (d.id = ++i));

  const nodeEnter = node.enter().append('g')
    .attr('class', 'node')
    .attr('transform', d => `translate(0,${d.x})`)
    .style('opacity', 0)
    .style('font-weight', d => (d.children || d._children) ? 'bold' : 'normal')
    .on('mouseenter', function(event, d) {
      select(this).selectAll('rect').style('fill', '#d3d3d3');
    })
    .on('mouseleave', function(event, d) {
      select(this).selectAll('rect')
        .style('fill', (d, i) => (i === 0 ? getLevelColor(d.depth, levelColors) : '#f0f0f0'));
    });

  headers.forEach((header, index) => {
    nodeEnter.append('rect')
    .attr('x', index * (barWidth / headers.length))
    .attr('height', barHeight)
    .attr('width', barWidth / headers.length)
    .attr('class', `rect-${index}`)
    .style('fill', (d) => (index === 0 ? getLevelColor(d.depth, levelColors) : '#f0f0f0'))
    .on('contextmenu', (event, d) => {
      event.preventDefault();
    });

    if (index === 0) {
     nodeEnter.select(`.rect-${index}`)
     .style('cursor', d => (d.children || d._children)? 'pointer' : 'default')

     .on('click', function (event, d) {
        toggleChildren(d);
        update(root, svg, g, headers, barHeight, barWidth, levelColors);
     })
     .append('title')
     .text('Click to expand or collapse')
    }

    if (index === 1) {
     nodeEnter.select(`.rect-${index}`)
     .style('cursor', d => (d.children || d._children) ? 'default' : 'pointer')
     .on('click', (event, d) => {
       invert(root, d);
       sum(root);
       update(root, svg, g, headers, barHeight, barWidth, levelColors);
     });

     nodeEnter.select(`.rect-${index}`)
     .on('contextmenu', (event, d) => {
       event.preventDefault();
       skip(root, d);
       sum(root);
       update(root, svg, g, headers, barHeight, barWidth, levelColors);
     })
    }

    nodeEnter
      .append('text')
      .attr('dy', barHeight / 2)
      .attr('dominant-baseline', 'central')
      .attr('dx',(d) => index * (barWidth / headers.length) + 10 +(index === 0 ? d.depth * 20 : 0),)
      .attr('class', `text-${index}`)
      .text(d => {
        const keys = Object.keys(d.data);
        const key = keys[index];
    
        if (key === 'name') return d.data[key];
        if (typeof d.data[key] === 'number') return parseFloat(d.data[key]).toFixed(1);
        return d.data[key] !== undefined ? d.data[key] : 'N/A';
      });
  });

  const nodeUpdate = nodeEnter.merge(node);

  nodeUpdate.transition()
    .duration(0)
    .attr('transform', d => `translate(0,${d.x})`)
    .style('opacity', 1);
    
    headers.forEach((header, index) => {
      nodeUpdate.select(`.text-${index}`)
        .text(d => {
          if (index === 0) return d.data.name;
          if (index === 1) return d.data.value !== undefined ? parseFloat(d.data.value).toFixed(1) : 'N/A';
          if (index === 2) return d.data.size !== undefined ? d.data.size : 'N/A';
          if (index === 3) return d.data.type !== undefined ? d.data.type : 'N/A';
        });
    });

  node.exit().transition()
    .duration(0)
    .attr('transform', `translate(0,${root.x})`)
    .style('opacity', 0)
    .remove();

  root.each(d => {
    d.x0 = d.x;
    d.y0 = d.y;
  });

  updateHiddenNodesColor(root);
}

export function updateTable(data) {
  if (!data) {
    console.error("Error: No data.");
    return;
  }

  const root =  hierarchy(data);
  root.x0 = 0;
  root.y0 = 0;

   selectAll("#svg-container").remove();
   select("#app").select("svg").remove();

  const container =  select('#app');
  const { svg, g, headerGroup } = createSvg(container);

  const levelColors = generateColorScale(6, localStorage.getItem("tableCellColor") || cellColor);

  const headers = Object.keys(data)
    .filter(key => key !== "children")
    .map(key => key.charAt(0).toUpperCase() + key.slice(1));

  sum(root);
  collapse(root);
  createHeaders(headerGroup, headers, barWidth, barHeight);

  update(root, svg, g, headers, barHeight, barWidth, levelColors);
}

function updateHiddenNodesColor(node) {
  if (!node) return;

  const textColor = localStorage.getItem("tableTextColor") || "#000";

  if (node._children) {
    node._children.forEach(child => {
       select(`.text-${child.id}`).style('fill', textColor);
      updateHiddenNodesColor(child);
    });
  }

   selectAll('.node text').style('fill', textColor);
}
