import './success.css';

export function showSuccessModal(message) {
  let successModal = document.getElementById('success-modal');

  if (!successModal) {
    successModal = document.createElement('div');
    successModal.id = 'success-modal';
    successModal.classList.add('modal');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    const closeButton = document.createElement('span');
    closeButton.classList.add('close-button');
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
      successModal.style.display = 'none';
    });

    const messageContainer = document.createElement('p');
    messageContainer.id = 'success-message';

    modalContent.appendChild(closeButton);
    modalContent.appendChild(messageContainer);
    successModal.appendChild(modalContent);
    document.body.appendChild(successModal);
  }

  document.getElementById('success-message').textContent = message;
  successModal.style.display = 'block';
}