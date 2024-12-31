const loginBtn = document.querySelector('.login-btn');

function goToSignin() {
  window.location.href = 'signup.html';
}


loginBtn.addEventListener('click', async function(event) {
  event.preventDefault();
  
  const email = document.querySelector('#lEmail').value;
  const password = document.querySelector('#lPassword').value;

  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      window.location.href = '../html/index.html'; // Redirect to home page
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  }
});
