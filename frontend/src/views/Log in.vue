<template>
  <main class="page">
    <div class="login-container">
      <!-- Login Form -->
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">&#9993;</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="Email"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">&#128274;</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Password"
            required
          />
        </div>

        <div class="form-group">
          <input
            type="submit"
            value="SE CONNECTER"
            class="submit-btn"
          />
        </div>
      </form>

      <!-- Sign-Up Link -->
      <div class="signup-text">
        <p>
          Vous n'avez pas de compte ?
          <a href="/register">Essayez gratuitement</a>
        </p>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // Store user data in localStorage for authentication persistence
          localStorage.setItem('userEmail', data.user.email); // Store logged-in user's email
          localStorage.setItem('userToken', data.token); // Replace with actual token logic

          alert('LOG IN SUCCESS')
          // Redirect to homepage
          this.$router.push('/');
          setTimeout(() => {
            window.location.reload(); // Force state update after login
          }, 100);
        } else {
          alert(data.message || 'Login failed!');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred while logging in.');
      }
    },
  },
};
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

.page {
  font-family: 'Poppins', sans-serif;
  background-color: #ffffff;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  background-color: white;
  padding: 40px;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.form-group {
  position: relative;
  margin-bottom: 20px;
}

.form-group label {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: gray;
}

.form-group input[type="email"],
.form-group input[type="password"] {
  width: 100%;
  padding: 12px 15px 12px 40px;
  background-color: #f3f3f3;
  border: none;
  border-radius: 5px;
  font-size: 16px;
}

.submit-btn {
  width: 100%;
  background-color: #e39429;
  color: white;
  font-weight: 600;
  padding: 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #a66905;
}

.signup-text {
  margin-top: 15px;
}

.signup-text a {
  color: #e39429;
  font-weight: 500;
  text-decoration: none;
}

.signup-text a:hover {
  text-decoration: underline;
}
</style>
