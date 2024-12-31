// Register User
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const userName = document.getElementById('userName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;
    const userType = document.getElementById('userType').value;
    const answer = document.getElementById('answer').value;
  
    try {
      const response = await fetch('http://localhost:4040/api/v1/user/register', {  // Corrected URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName,
          email,
          password,
          address,
          phone,
          userType,
          answer,
        }),
      });
  
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error(error);
      alert('Error registering user');
    }
  });
  
  // Login User
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const userType = document.getElementById('loginUserType').value;
  
    try {
      const response = await fetch('http://localhost:4040/api/v1/user/login', {  // Corrected URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, userType }),
      });
  
      const data = await response.json();
      alert(data.message);
      if (data.success) {
        // Store the token in localStorage or sessionStorage
        localStorage.setItem('token', data.token);
      }
    } catch (error) {
      console.error(error);
      alert('Error logging in');
    }
  });
