const loginBtn = document.querySelector('.login-btn');

function goToSignin() {
  window.location.href = 'signup.html';
}


loginBtn.addEventListener('click', async function(event) {
  event.preventDefault();
  
  const email = document.querySelector('#lEmail').value;
  const password = document.querySelector('#lPassword').value;

  let response = await fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  let data = await response.json();

  if (response.status == 200) {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    window.location.href = '../html/index.html';
  } else {
    alert(data.message);
  }
});


