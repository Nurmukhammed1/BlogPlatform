const loginBtn = document.querySelector('.login-btn');

function goToSignin() {
  window.location.href = 'signup.html';
}


loginBtn.addEventListener('click', async function(event) {
  event.preventDefault();
  
  const email = document.querySelector('#lEmail').value;
  const password = document.querySelector('#lPassword').value;

  fetch('https://blogplatform-3x7m.onrender.com/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  .then(response => response.json())
  .then(data => {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    window.location.href = '../html/index.html';
  });

});


