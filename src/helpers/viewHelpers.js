import { selectAll, rgb, interpolateRgb } from 'd3';

export function updateTableTextColor(value) {
  document.documentElement.style.setProperty('--table-text-color', value);
  selectAll('.node text').style('fill', value, 'important');
}

export function updateTableCellColor(value) {
  document.documentElement.style.setProperty('--table-cell-color', value);
  selectAll('.node')
    .selectAll('rect')
    .style('fill', (d, i) =>
      i === 0
        ? getLevelColor(d.depth, localStorage.getItem('tableCellColor'))
        : '#f0f0f0',
    );
}

export function updateBackgroundColor(value) {
  document.documentElement.style.setProperty('--background-color', value);
  document.body.style.setProperty('background-color', value, 'important');
}

export function updateFontSize(value) {
  document.documentElement.style.setProperty('--font-size', `${value}px`);
  selectAll('.node text').style('font-size', `${value}px`, 'important');
}

function hexToRGB(h) {
  let r = 0,
    g = 0,
    b = 0;
  if (h.length === 4) {
    r = parseInt(h[1] + h[1], 16);
    g = parseInt(h[2] + h[2], 16);
    b = parseInt(h[3] + h[3], 16);
  } else if (h.length === 7) {
    r = parseInt(h[1] + h[2], 16);
    g = parseInt(h[3] + h[4], 16);
    b = parseInt(h[5] + h[6], 16);
  } else {
    throw new Error('Invalid HEX color format');
  }

  return [r, g, b];
}

export function generateColorScale(maxDepth = 5, hexColor) {
  if (!hexColor) return;

  const newColor = hexToRGB(hexColor);

  const startColor = rgb(newColor[0], newColor[1], newColor[2]);
  const endColor = rgb(255, 255, 255);
  return Array.from({ length: maxDepth + 1 }, (_, i) =>
    interpolateRgb(startColor, endColor)(i / maxDepth),
  );
}

export function getLevelColor(depth, levelColors) {
  return levelColors[depth % levelColors.length];
}

export function toggleChildren(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
}

export function expand(d) {
  if (d._children) {
    d.children = d._children;
    d.children.forEach(expand);
    d._children = null;
  }
}

export function collapse(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
    d._children.forEach(collapse);
  }
}
