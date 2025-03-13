import * as d3 from 'd3';
import './filter.css';
import { showErrorModal } from '@/components/ui/error/error.js';
import { showSuccessModal } from '../ui/success/success.js';
import { transformData, extractNames } from '@/helpers';
import { updateTable } from '@/components/table/table.js';
import svg from '@/assets/filter.svg';

let root = null;
let filter = new Set();

export function Filter() {
  const settingsContainer =
    document.getElementById('settings-container') || document.body;

  const filterIcon = document.createElement('img');
  filterIcon.id = 'filter-icon';
  filterIcon.src = svg;
  filterIcon.width = 30;
  filterIcon.height = 30;

  document.body.appendChild(filterIcon);

  const filterMenu = document.createElement('div');
  filterMenu.id = 'filter-menu';
  filterMenu.classList.add('filter-menu');

  const fileUploadContainer = document.createElement('div');
  const fileUploadLabel = document.createElement('label');
  fileUploadLabel.textContent = 'Upload File';

  const fileUploadInput = document.createElement('input');
  fileUploadInput.type = 'file';
  fileUploadInput.addEventListener('change', handleFileUpload);

  fileUploadContainer.appendChild(fileUploadLabel);
  fileUploadContainer.appendChild(fileUploadInput);
  filterMenu.appendChild(fileUploadContainer);

  const filterContainer = document.createElement('div');
  const filterLabel = document.createElement('label');
  filterLabel.textContent = 'Filter';
  filterLabel.style.fontWeight = 'bold';
  filterLabel.style.marginBottom = '5px';

  const checkboxesContainer = document.createElement('div');
  checkboxesContainer.id = 'checkboxes-container';
  checkboxesContainer.style.display = 'flex';
  checkboxesContainer.style.flexDirection = 'column';

  filterContainer.appendChild(filterLabel);
  filterContainer.appendChild(checkboxesContainer);
  filterMenu.appendChild(filterContainer);

  filterIcon.addEventListener('click', (event) => {
    event.preventDefault();
    filterMenu.style.display = 'block';
    filterMenu.style.left = `${event.clientX}px`;
    filterMenu.style.top = `${event.clientY}px`;
  });

  document.body.addEventListener('click', (event) => {
    if (!filterMenu.contains(event.target) && event.target !== filterIcon) {
      filterMenu.style.display = 'none';
    }
  });

  settingsContainer.appendChild(filterIcon);
  settingsContainer.appendChild(filterMenu);
}

export async function loadData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load data from ${url}.`);
    }
    const data = await response.json();
    const transformedData = transformData(data)[0];

    if (!transformedData || transformedData.length === 0) {
      throw new Error('Data transformation failed.');
    }

    root = transformedData;
    extractNames(root, filter);
    generateCheckboxes();

    handleFilterByName();

    return transformedData;
  } catch (error) {
    showErrorModal('Error loading data.');
    console.error('Error loading data:', error);
    return null;
  }
}

export function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) {
    showErrorModal('No file selected. Please upload a valid JSON file.');
    loadData('/data.json');
    return;
  }

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const data = JSON.parse(e.target.result);

      if (!data || Object.keys(data).length === 0) {
        throw new Error('Uploaded file is empty or incorrectly formatted.');
      }

      const transformedData = transformData(data);
      if (!transformedData || transformedData.length === 0) {
        throw new Error('Data transformation failed.');
      }

      root = transformedData[0];
      showSuccessModal('Import successful!');

      extractNames(root, filter);
      generateCheckboxes();

      handleFilterByName();

    } catch (error) {
      showErrorModal('Failed to parse the uploaded file.');
      console.error('Error processing file:', error);
      loadData('/data.json');
    }
  };
  reader.readAsText(file);
}

function generateCheckboxes() {
  if (!filter || !(filter instanceof Set)) {
    console.error('Error: filter is not a Set.');
    return;
  }

  const checkboxesContainer = document.getElementById('checkboxes-container');
  if (!checkboxesContainer) return;

  checkboxesContainer.innerHTML = '';

  filter.forEach((name) => {
    const label = document.createElement('label');
    label.textContent = name;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = name;

    checkbox.addEventListener('change', handleFilterByName);

    label.prepend(checkbox);
    checkboxesContainer.appendChild(label);
  });
}

function handleFilterByName() {
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
