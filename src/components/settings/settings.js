import './settings.css';

import { select } from 'd3';
import { settingsOptions } from '@/components/settings/settingsOptions.js';
import * as styleHelpers from '@/helpers';
import svg from '@/assets/settings.svg';

export function Settings() {
  const settingsContainer = document.getElementById('settings-container') || document.body;

const settingsIcon = document.createElement('img');
settingsIcon.id = 'settings-icon';
settingsIcon.src = svg;
settingsIcon.width = 30;
settingsIcon.height = 30;

document.body.appendChild(settingsIcon);

  select(settingsIcon)
    .select('svg')
    .attr('width', '20px')
    .attr('height', '20px');

  const contextMenu    = document.createElement('div');
        contextMenu.id = 'settings-menu';

  settingsIcon.classList.add('settings-icon');
  contextMenu.classList.add('settings-menu');

  settingsOptions.forEach(option => {
    const container = document.createElement('div');

    const label = document.createElement('label');
    label.textContent = option.name;
    container.appendChild(label);

    const input       = document.createElement('input');
          input.type  = option.type;
          input.value = option.default;
          input.value = localStorage.getItem(option.property) || option.default;

    if (option.type === 'range') {
      input.min = option.min;
      input.max = option.max;
    }

    input.addEventListener('input', (e) => {
      const value = e.target.value;
      localStorage.setItem(option.property, value);

      if (option.property === 'fontSize') {
        styleHelpers.updateFontSize(value);
      }
      if (option.property === 'tableTextColor') {
        styleHelpers.updateTableTextColor(value);
      }
      if (option.property === 'tableCellColor') {
        styleHelpers.updateTableCellColor(value);
        location.reload();
      }
      if (option.property === 'backgroundColor') {
        styleHelpers.updateBackgroundColor(value);
      }
    });

      container.appendChild(input);
      contextMenu.appendChild(container);
  });

  settingsIcon.addEventListener('click', (event) => {
    event.preventDefault();
    contextMenu.style.display = 'block';
    contextMenu.style.left    = 'auto';
    contextMenu.style.right   = '20px';
    contextMenu.style.top     = `${event.clientY}px`;
  });


  document.body.addEventListener('click', (event) => {
    if (!contextMenu.contains(event.target) && event.target !== settingsIcon) {
      contextMenu.style.display = 'none';
    }
  });

  settingsContainer.appendChild(settingsIcon);
  settingsContainer.appendChild(contextMenu);

  applySavedSettings();
}

function applySavedSettings() {
  settingsOptions.forEach(option => {
    const value = localStorage.getItem(option.property) || option.default;
    if (option.property === 'fontSize') {
      styleHelpers.updateFontSize(value);
    }
    if (option.property === 'tableTextColor') {
      styleHelpers.updateTableTextColor(value);
    }
    if (option.property === 'tableCellColor') {
      styleHelpers.updateTableCellColor(value);
    }
    if (option.property === 'backgroundColor') {
      styleHelpers.updateBackgroundColor(value);
    }
  });
}