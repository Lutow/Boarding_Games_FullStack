<template>
  <div class="game-detail">
    <div v-if="game" class="game-content">
      <div class="game-image">
        <img :src="game.game_image" />
      </div>
      <div class="game-info">
        <h1>{{ game.name }}</h1>
        <p><strong>Year:</strong> {{ game.year_published }}</p>
        <p><strong>Players:</strong> {{ game.min_players }} - {{ game.max_players }}</p>
        <p><strong>Playing Time:</strong> {{ game.playingtime }} minutes</p>
        <p><strong>Description:</strong> {{ game.description }}</p>
        <p><strong>Category:</strong> {{ game.category_name }}</p>
      </div>
    </div>

    <!-- Reviews Section -->
    <div class="review-section">
      <h2>Reviews</h2>
      <ul>
        <li v-for="r in reviews" :key="r.username">
          <strong>{{ r.username }}:</strong> {{ r.review_text }}
        </li>
      </ul>

      <!-- Show review form if logged in -->
      <div v-if="isLoggedIn" class="review-form">
        <textarea v-model="newReview" placeholder="Write your review..."></textarea>
        <button @click="submitReview">Submit Review</button>
      </div>

      <p v-else><router-link to="/login">Log in to leave a review</router-link></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameDetail',
  data() {
    return {
      game: null,
      reviews: [],
      newReview: '',
    };
  },
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('userToken');
    },
  },
  methods: {
    fetchGameDetails() {
      const id = this.$route.params.id;
      fetch(`http://localhost:3000/api/game/${id}`)
        .then(res => res.json())
        .then(data => {
          this.game = data;
        });
    },
    fetchReviews() {
      const id = this.$route.params.id;
      fetch(`http://localhost:3000/api/game/${id}/reviews`)
        .then(res => res.json())
        .then(data => {
          this.reviews = data;
        });
    },
    submitReview() {
      const token = localStorage.getItem('userToken');
      if (!token) return;

      fetch(`http://localhost:3000/api/game/${this.$route.params.id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ review: this.newReview }),
      })
        .then(res => res.json())
        .then(data => {
          alert(data.message);
          this.newReview = '';
          this.fetchReviews(); // refresh
        });
    },
  },
  mounted() {
    this.fetchGameDetails();
    this.fetchReviews();
  },
};
</script>

<style scoped>
.game-detail {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.game-content {
  display: flex;
  gap: 2rem;
}

.game-image img {
  width: 250px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.review-section {
  margin-top: 2rem;
}

.review-form textarea {
  width: 100%;
  height: 100px;
  margin-top: 1rem;
  padding: 0.5rem;
}

.review-form button {
  margin-top: 0.5rem;
}
</style>
