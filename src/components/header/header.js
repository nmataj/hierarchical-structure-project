import './header.css';

import { Filter } from '@/components/filter/filter.js';
import { Settings } from '@/components/settings/settings.js';

export function Header() {
  const headerContainer = document.createElement('div');
  headerContainer.id = 'header-container';
  headerContainer.classList.add('header-container');

  const leftSection = document.createElement('div');

  leftSection.classList.add('header-left');
  leftSection.textContent = "Hierarchical Structure";

  const rightSection = document.createElement('div');
  rightSection.classList.add('header-right');

  Filter();
  Settings();

  const filterIcon = document.getElementById('filter-icon');
  const settingsIcon = document.getElementById('settings-icon');

  if (filterIcon) leftSection.appendChild(filterIcon);
  if (settingsIcon) rightSection.appendChild(settingsIcon);

  headerContainer.appendChild(leftSection);
  headerContainer.appendChild(rightSection);

  const appContainer = document.getElementById('app');
  if (appContainer) {
    appContainer.prepend(headerContainer);
  } else {
    document.body.prepend(headerContainer);
  }
}