const yearSlots = document.querySelectorAll('[data-year], #year');
yearSlots.forEach((slot) => {
  slot.textContent = new Date().getFullYear();
});

const forms = document.querySelectorAll('form[data-endpoint]');
forms.forEach((form) => {
  const endpoint = form.dataset.endpoint;
  const successMessage = form.querySelector('.form-status.ok');
  const statusBox = form.querySelector('.form-status:not(.ok)');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!endpoint || endpoint.includes('YOUR_FORM_ID')) {
      if (statusBox) {
        statusBox.textContent = 'Add your Formspree endpoint to activate submissions.';
        statusBox.classList.add('err');
        statusBox.style.display = 'block';
      }
      return;
    }

    if (statusBox) {
      statusBox.textContent = '';
      statusBox.style.display = 'none';
      statusBox.classList.remove('err');
    }

    const formData = new FormData(form);
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.dataset.original = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData,
      });
      if (!response.ok) throw new Error('Form submit failed');
      if (successMessage) {
        successMessage.style.display = 'block';
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      form.reset();
    } catch (err) {
      if (statusBox) {
        statusBox.textContent = 'Could not send. Please try again or email us.';
        statusBox.classList.add('err');
        statusBox.style.display = 'block';
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtn.dataset.original || submitBtn.textContent;
      }
    }
  });
});
