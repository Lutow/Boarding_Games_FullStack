<template>
  <div class="hero-container">
    <video autoplay muted loop playsinline class="background-video">
      <source src="@/assets/background.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  <div class="overlay"></div>
      <div class="content">
        <h1>Welcome to BoardGameHub</h1>
        <p>Explore hundreds of boarding games !</p>
      </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
};
</script>

<style scoped>
.hero-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.background-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.27);
  z-index: 0;
}

.content {
  position: relative;
  z-index: 1;
  color: white;
  text-align: center;
  top: 50%;
  transform: translateY(-50%);
  font-family: 'Poppins', sans-serif;
}
</style>
