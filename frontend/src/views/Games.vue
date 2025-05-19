<template>
  <div class="games-container">
    <Loader v-if="loading" />
    <Filters @filtersChanged="updateFilters" />
    <div
      class="game-card"
      v-for="game in filteredGames"
      :key="game.id"
    >
      <img :src="game.game_image" alt="Game Poster" class="poster" @click="goToGame(game.game_id)"/>

      <div class="info">
        <h2 class="title">{{ game.name.toUpperCase() }}</h2>
        <p><strong>Players:</strong> {{ game.min_players }} - {{ game.max_players }}</p>
        <p><strong>Playing Time:</strong> {{ game.playingtime }} minutes</p>
        <p v-if="game.description"><strong>Description:</strong> {{ game.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from '../components/Loader.vue';
import Filters from '../components/filters.vue';

export default {
  name: "GameList",
  components: { Loader, Filters },
  data() {
    return {
      loading: true,
      games: [],
      filters: {
        sort: "",
        category: "all",
        search: ""
      }
    };
  },
  computed: {
    filteredGames() {
      let result = [...this.games];

      // Search filter
      if (this.filters.search) {
        const searchLower = this.filters.search.toLowerCase();
        result = result.filter(game => game.name.toLowerCase().includes(searchLower));
      }

      // Genre filter
      if (this.filters.category && this.filters.category !== "all") {
        result = result.filter(game => game.categories?.toLowerCase().includes(this.filters.category.toLowerCase())
        );
      }

      // Duration filter
      if (this.filters.duration && this.filters.duration !== "") {
        result = result.filter(game => game.duration_level === this.filters.duration);
      }

      // Sorting by duration using the Trigger defined in the DB
      if (this.filters.sort === "name") {
        result.sort((a, b) => a.name.localeCompare(b.name));
      } else if (this.filters.sort === "duration") {
        const durationOrder = { "Short": 1, "Medium": 2, "Long": 3 };
        result.sort((a, b) => durationOrder[a.duration_level] - durationOrder[b.duration_level]);
      }

      return result;
    }
  },
  methods: {
    updateFilters(newFilters) {
      console.log("Received filters:", newFilters);
      this.filters = { ...this.filters, ...newFilters };
    },
    goToGame(gameId) {
      this.$router.push(`/game/${gameId}`);
    },
  },
  mounted() {
    fetch("http://localhost:3000/api/games")
      .then(res => res.json())
      .then(data => {
        setTimeout(() => {
          this.games = data;
          this.loading = false;
        }, 1500);
      })
      .catch(err => console.error("Error fetching games:", err));
  }
};
</script>



<style scoped>
.games-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 30px;
  max-width: 900px;
  margin: auto;
}

.game-card {
  display: flex;
  border-top: 1px solid #ccc;
  padding-top: 20px;
  position: relative;
  gap: 20px;
}

.poster {
  cursor: pointer;
  transition: transform 0.2s;
  width: 130px;
  height: 190px;
  object-fit: cover;
  border-radius: 4px;
}

.poster:hover {
  transform: scale(1.05);
}

.info {
  flex: 1;
}

.title {
  font-size: 20px;
  color: #0077cc;
  margin-bottom: 10px;
}

.rank {
  position: absolute;
  right: 10px;
  top: 10px;
  background: #333;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: bold;
}
</style>
