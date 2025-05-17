<template>
  <div class="profile-container">
    <h1>User Profile</h1>
    <div v-if="user">
      <p><strong>Name:</strong> {{ user.username }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
    </div>
    <div v-else>
      <p>Loading profile...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Profile",
  data() {
    return {
      user: null,
    };
  },
  created() {
    this.fetchUserProfile();
  },
  methods: {
    async fetchUserProfile() {
      try {
        const token = localStorage.getItem("userToken"); // Get stored token

        if (!token) {
          console.error("No token found, user not authenticated.");
          return;
        }

        const response = await fetch("http://localhost:3000/api/user/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Attach token for authentication
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        this.user = await response.json(); // Store fetched user data
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    },
  },
};
</script>


<style scoped>
.profile-container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  text-align: center;
  font-family: 'Poppins', sans-serif;
}
p {
  font-size: 1.1em;
}
</style>
