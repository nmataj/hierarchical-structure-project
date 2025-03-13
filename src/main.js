import './style.css';

import { select, hierarchy } from 'd3';
import { barWidth, barHeight, cellColor } from '@/config';
import {sum, collapse, generateColorScale } from '@/helpers';
import { createSvg } from '@/components/svg';
import { createHeaders } from '@/components/table/headers.js';
import { update } from '@/components/table/table.js';
import { showLoadingSpinner, hideLoadingSpinner } from '@/components/ui/loading/loading.js';
import { Header } from '@/components/header/header.js';
import { loadData } from '@/components/filter/filter.js';

let root, headers, levelColors;
const container = select('#app');
const { svg, g, headerGroup } = createSvg(container);

Header();
showLoadingSpinner();

try {
 loadData('../data.json').then((data) => {
  if (data) {
    headers = Object.keys(data)
    .filter((key) => key !== 'children')
    .map((key) => key.charAt(0).toUpperCase() + key.slice(1));
      
    root = hierarchy(data);
    root.x0 = 0;
    root.y0 = 0;

    levelColors = generateColorScale(root.depth, 
                                      localStorage.getItem('tableCellColor') || 
                                      cellColor);

    sum(root);
    collapse(root);
    createHeaders(headerGroup, headers, barWidth, barHeight);
    update(root, svg, g, headers, barHeight, barWidth, levelColors);
      
    hideLoadingSpinner()
  }
})} catch (error) {
  console.error('Error loading initial data:', error);
  hideLoadingSpinner();
}