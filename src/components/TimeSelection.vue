<script setup>
defineProps({
  selectedTime: String
})

defineEmits(['select-time', 'back'])
</script>

<template>
  <div class="time-selection">
    <button class="back-btn" @click="$emit('back')">← 返回</button>
    <h2>请选择运动时间</h2>
    <div class="time-buttons">
      <button @click="$emit('select-time', 'morning')">🌅 晨间运动</button>
      <button @click="$emit('select-time', 'noon')">☀️ 午间运动</button>
      <button @click="$emit('select-time', 'evening')">🌙 晚间运动</button>
    </div>
  </div>
</template>

<style scoped>
.time-selection {
  padding: 2rem;
  text-align: center;
}

.time-buttons {
  display: grid;
  gap: 1.5rem;
  margin-top: 2rem;
}

button {
  padding: 1.5rem;
  font-size: 1.5rem;
  border-radius: 1rem;
  background: #2196F3;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

button:hover {
  background: #1976D2;
  transform: translateY(-2px);
}

.back-btn {
  position: absolute;
  left: 1rem;
  top: 1rem;
  padding: 0.5rem 1rem;
  background: #666;
}
</style>
