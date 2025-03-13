import { zoom } from 'd3';

import { width, height, margin } from '@/config';

export function createSvg(container) {
  const svgContainer = container
    .append('div')
    .attr('id', 'svg-container')
    .style('width', '100%')
    .style('height', '100%')
    .style('overflow', 'auto');

  const svg = svgContainer
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMinYMin meet');

    const zoomG = svg.append('g');

    const g = zoomG.append('g')
      .attr('transform', `translate(${margin.left},${100})`);
  
    svg.call(
      zoom().on('zoom', function(event) {
        zoomG.attr('transform', event.transform);
      })
    );
  
  const headerGroup = g.append('g').attr('class', 'headers');
  
  return { svg, g, headerGroup };
}