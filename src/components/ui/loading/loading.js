import './loading.css';

export function showLoadingSpinner() {
  let loadingContainer = document.getElementById('loading-container');

  if (!loadingContainer) {
    loadingContainer = document.createElement('div');
    loadingContainer.id = 'loading-container';

    const spinner = document.createElement('div');
    spinner.className = 'spinner';

    loadingContainer.appendChild(spinner);
    document.body.appendChild(loadingContainer);
  }

  loadingContainer.style.display = 'flex';
}

export function hideLoadingSpinner() {
  const loadingContainer = document.getElementById('loading-container');
  if (loadingContainer) {
    loadingContainer.remove();
  }
}