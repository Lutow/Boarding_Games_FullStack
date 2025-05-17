<template>
  <div class="games-container">
    <div
      class="game-card"
      v-for="game in games"
      :key="game.id"
    >
      <!-- Game Image -->
      <img :src="game.game_image" alt="Game Poster" class="poster" />
      <!-- Game Info -->
      <div class="info">
        <h2 class="title">
          {{ game.name.toUpperCase() }}
        </h2>

        <p><strong>Players:</strong> {{ game.min_players }} - {{ game.max_players }}</p>
        <p><strong>Playing Time:</strong> {{ game.playingtime }} minutes</p>

        <p v-if="game.description">
          <strong>Description:</strong> {{ game.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GameList",
  data() {
    return {
      games: [],
    };
  },
  mounted() {
    fetch("http://localhost:3000/api/games")
      .then((res) => res.json())
      .then((data) => {
        this.games = data;
      })
      .catch((err) => console.error("Error fetching games:", err));
  },
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
  width: 130px;
  height: 190px;
  object-fit: cover;
  border-radius: 4px;
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
