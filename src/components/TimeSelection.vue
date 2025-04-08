<script setup>
defineProps({
  selectedTime: String
})

defineEmits(['select-time', 'back'])
</script>

<template>
  <div class="time-selection">
    <button class="back-btn" @click="$emit('back')">← 返回</button>
    <h2>请点击运动时间</h2>
    <div class="time-buttons">
      <button class="morning-btn" @click="$emit('select-time', 'morning')">🌅 晨间运动</button>
      <button class="noon-btn" @click="$emit('select-time', 'noon')">☀️ 午间运动</button>
      <button class="evening-btn" @click="$emit('select-time', 'evening')">🌙 晚间运动</button>
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
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
}

.morning-btn {
  background: linear-gradient(135deg, #FFB347 0%, #FFCC33 100%);
  box-shadow: 0 4px 15px rgba(255, 179, 71, 0.3);
}

.noon-btn {
  background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
}

.evening-btn {
  background: linear-gradient(135deg, #9C27B0 0%, #673AB7 100%);
  box-shadow: 0 4px 15px rgba(156, 39, 176, 0.3);
}

button {
  padding: 1.5rem 2rem;
  font-size: 1.5rem;
  border-radius: 1rem;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  width: fit-content;
  min-width: 200px;
  font-weight: bold;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.morning-btn:hover {
  background: linear-gradient(135deg, #FFA347 0%, #FFB333 100%);
}

.noon-btn:hover {
  background: linear-gradient(135deg, #3CAF50 0%, #7BC34A 100%);
}

.evening-btn:hover {
  background: linear-gradient(135deg, #8C27B0 0%, #573AB7 100%);
}

.back-btn {
  position: absolute;
  left: 1rem;
  top: 1rem;
  padding: 0.5rem 1rem;
  background: #666;
  min-width: auto;
}
</style>
