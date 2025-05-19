<template>
  <div class="filters">
    <select v-model="selectedSort" @change="emitFilters">
      <option value="">Sort</option>
      <option value="name">Name</option>
      <option value="duration">Duration</option>
    </select>

    <select v-model="selectedCategory" @change="emitFilters">
      <option value="">Genre</option>
      <option value="Strategy">Strategy</option>
      <option value="Party">Party</option>
      <option value="Family">Family</option>
    </select>

    <!-- Add this in your Filters.vue component -->
    <select v-model="selectedDuration">
      <option value="">All Durations</option>
      <option value="Short">Short</option>
      <option value="Medium">Medium</option>
      <option value="Long">Long</option>
    </select>


    <input
      type="text"
      v-model="searchQuery"
      placeholder="🔍 Type to search..."
      @input="emitFilters"
    />
  </div>
</template>

<script>
export default {
  name: "Filters",
  data() {
    return {
      selectedCategory: '',
      selectedSort: '',
      selectedDuration: '', // ← New
      searchQuery: ''
    };
  },
  watch: {
    selectedCategory: 'emitFilters',
    selectedSort: 'emitFilters',
    selectedDuration: 'emitFilters', // ← Watch this too
    searchQuery: 'emitFilters',
  },
  methods: {
    emitFilters() {
      this.$emit("filtersChanged", {
        category: this.selectedCategory,
        sort: this.selectedSort,
        duration: this.selectedDuration, // ← Emit it
        search: this.searchQuery
      });
    }
  }
};
</script>

<style scoped>
.filters {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
}

select,
input[type="text"] {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 14px;
}
</style>
