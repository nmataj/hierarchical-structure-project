import { json, sum as d3sum } from 'd3';

export async function getObjectsFromJson(filePath) {
  const data = await json(filePath);
  const result = [];

  traverse(data);

  return result;
}

export function sum(root) {
  root.eachBefore(node => {
      if (!node.children) {
          node.value = node.data.value;
          node.data.value = node.value;
      }
  });

  root.eachAfter(node => {
      if (node.children) {
          let sum = d3sum(node.children, d => isNaN(d.value) ? 0 : d.value);
          node.value = sum;
          node.data.value = node.value;
      }
  });
}

export function skip(root, node) {
  if (!node) {
    console.error(`Error: Node '${node.data.name}' not found.`);
    return root;
  }

  if (node.data.previousValue === undefined) {
    node.data.previousValue = node.data.value;
  }

  node.data.value = node.data.value === 0 ? node.data.previousValue 
                                          : 0;
  if (node.children) {
    node.children.forEach(child => skip(root, child));
  }

  return node;
}

export function invert(root, node) {
  if (!node) {
    console.error(`Error: Node '${node.data.name}' not found.`);
    return root;
  }

  node.data.value = node.data.value > 0 ? -node.data.value 
                                        : Math.abs(node.data.value);
  
  if (node.children) {
    node.children.forEach(child => invert(root, child));
  }

  return node;
}

export function countLeafNodes(node) {
  if (!node.children || node.children.length === 0) return 1;

  return node.children.reduce((sum, child) => sum + countLeafNodes(child), 0);
}

export function transformData(object) {
  return Object.entries(object).flatMap(([key, value]) => {
    if (Array.isArray(object[key])) {
        const children = value.flatMap((element) => 
          Array.isArray(element) ? element 
                                 : transformData(element),
      );
      return { name: key, value: 0, children };
    } else if (typeof value === 'object' ||
                      value === null) {
        const children = transformData(value);
        return { name: key, value: 0, children };
    } else {
      return { name: key, value };
    }
  });
}

export function traverse(node) {
  let filter = new Set();

  if (node.name) {
    filter.add(node.name);
  }

  if (node.children && node.children.length > 0) {
    node.children.forEach(traverse);
  }
  if(!node.children || !node._children) {
    return;
  }
  return filter;
}

export function extractNames(node, filter) {
  if (!node || !filter) return;

  filter.clear();

  function traverse(node) {
    if (node.children && node.children.length > 0) {
      filter.add(node.name);
      node.children.forEach(traverse);
    }
  }
  
  traverse(node);
}

export function filterData(node) {

  if (!node || !node.children) return node;
  
  const checkedValues = Array.from(document
    .querySelectorAll('#checkboxes-container input:checked'))
    .map((checkbox) => checkbox.value);

  if (!node || !node.children) return null;

  if (checkedValues.includes(node.name)) {
    node.children.map(filterData).filter((child) => child !== null);
    return node;
  }

  const filteredChildren = node.children
    .map(filterData)
    .filter((child) => child !== null);

  if (filteredChildren.length > 0) {
    return { ...node, children: filteredChildren };
  }
  
  return null;
}

export function handleFilterByName(root) {
  const checkedValues = Array.from(
    document.querySelectorAll('#checkboxes-container input:checked'),
  ).map((checkbox) => checkbox.value);

  if (!root) {
    console.error('No data available for filtering.');
    return;
  }

  function filterData(node) {
    if (!node || !node.children) return null;

    const filteredChildren = node.children
      .map(filterData)
      .filter((child) => child !== null);

    if (checkedValues.includes(node.name) || filteredChildren.length > 0) {
      return { ...node, children: filteredChildren.length > 0 ? filteredChildren : node.children };
    }
    return null;
  }

  let filteredData = checkedValues.length > 0 ? filterData(root) : root;

  if (!filteredData) {
    console.warn('Filtered data is empty. Using original dataset.');
    updateTable(root);
  } else {
    updateTable(filteredData);
  }
}
