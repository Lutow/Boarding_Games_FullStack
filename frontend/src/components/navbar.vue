<template>
  <nav class="navbar">
    <div class="container">
      <div class="logo">
        <router-link to="/">🎲 BoardGameHub</router-link>
      </div>
      <ul class="nav-links">
        <li><router-link to="/games">Games</router-link></li>
        <li><router-link to="/login">Log in / Register</router-link></li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
};

</script>

<style scoped>

.navbar {
  background-color: #e39429;
  color: white;
  padding: 1rem 0;
  font-family: 'Poppins', sans-serif;
}

.navbar a {
  text-decoration: none;
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1100px;
  margin: auto;
  padding: 0 1.5rem;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
}

.logo a {
  text-decoration: none;
}

.logo a:hover {
  text-decoration: none;
}

.logo a,
.logo a:visited,
.logo a:hover,
.logo a:active,
.logo a:focus {
  color: white !important;
  text-decoration: none !important;
}


.logo span {
  margin-left: 0.4rem;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 5rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

</style>
