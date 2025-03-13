import './error.css';

export function showErrorModal(message) {
  let errorModal = document.getElementById('error-modal');

  if (!errorModal) {
    errorModal = document.createElement('div');
    errorModal.id = 'error-modal';
    errorModal.classList.add('modal');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    const closeButton = document.createElement('span');
    closeButton.classList.add('close-button');
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
      errorModal.style.display = 'none';
    });

    const messageContainer = document.createElement('p');
    messageContainer.id = 'error-message';

    modalContent.appendChild(closeButton);
    modalContent.appendChild(messageContainer);
    errorModal.appendChild(modalContent);
    document.body.appendChild(errorModal);
  }

  document.getElementById('error-message').textContent = message;
  errorModal.style.display = 'block';
}