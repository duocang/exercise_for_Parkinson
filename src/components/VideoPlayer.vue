<!-- VideoPlayer.vue -->
<template>

  <!-- 新增重复次数设置弹窗 -->
  <div v-if="showRepeatDialog" class="completion-dialog">
    <div class="dialog-content">
      <button class="close-btn" @click="closeRepeatDialog">×</button>
      <h2>🏋️ 设置训练次数</h2>
      <div class="repeat-picker">
        <button class="repeat-btn" @click="adjustRepeat(-1)">-</button>
        <input
          type="number"
          v-model.number="localRepeatTimes"
          min="1"
          max="10"
          class="repeat-input"
          @keydown.prevent
        >
        <button class="repeat-btn" @click="adjustRepeat(1)">+</button>
      </div>
      <div class="dialog-buttons">
        <button class="confirm-btn" @click="startTraining">开始训练</button>
      </div>
    </div>
  </div>


  <div class="main-container">
    <!-- 左侧运动列表 -->
    <div class="exercise-list">
      <div
        v-for="(exercise, index) in exercises"
        :key="index"
        :class="[
          'exercise-item',
          {
            'current-exercise': index === currentIndex,
            'completed-exercise': index < currentIndex,
            'upcoming-exercise': index > currentIndex
          }
        ]"
      >
        <div class="exercise-item">
          <div class="exercise-header">
            <h5>{{ exercise.type }} {{ exercise.name }}</h5>
            <span class="status-indicator">
              <template v-if="index < currentIndex">✅ 已完成</template>
              <template v-else-if="index === currentIndex">
                ▶️ 进行中
                <span class="repeat-progress">({{ currentRepeat + 1 }}/{{ localRepeatTimes }})</span>
              </template>
              <template v-else>⏳ 待完成</template>
            </span>
          </div>
        <!-- <p v-if="index === currentIndex">{{ exercise.duration }}</p> -->
        </div>
      </div>
    </div>

    <!-- 右侧视频区域 -->
    <div class="video-section">
      <!-- 顶部控制栏 -->
      <div class="video-controls top-controls">
        <button
          class="control-btn end-btn"
          @click="endSession"
        >
          结束训练
        </button>
        <button
          class="control-btn pause-btn"
          @click="togglePlay"
          :disabled="!canPlay"
          :class="{ 'paused-state': !isPlaying }"
        >
          {{ isPlaying ? '暂停视频' : '播放视频' }}
        </button>


        <button
          class="control-btn mute-btn"
          @click="toggleMute"
          :class="{ 'muted': isMuted }"
        >
          {{ isMuted ? '声音已关' : '声音已开' }}
        </button>
      </div>

      <div class="video-placeholder">
        <div v-if="!isPlaying" class="overlay-text">点击开始按钮</div>
      </div>

      <!-- 视频容器 -->
      <div class="video-wrapper" v-show="!showRepeatDialog">
        <!-- 顶部导航按钮 -->
        <div class="navigation-controls">
          <button
            class="nav-btn last-btn"
            @click="lastExercise"
            :disabled="currentIndex === 0"
          >
          ← 上一个
          </button>
          <button
            class="nav-btn next-btn"
            @click="nextExercise"
            :disabled="currentIndex === exercises.length - 1"
          >
            {{ isLastExercise ? '完成训练' : '下一个' }} →
          </button>
        </div>

        <!-- 视频主体 -->
        <div class="video-container">
          <video
            ref="videoPlayer"
            :src="videoSrc"
            controls
            autoplay
            @play="isPlaying = true"
            @pause="isPlaying = false"
            @ended="handleVideoEnded"
            @volumechange="handleVolumeChange"
          >
          您的浏览器不支持视频播放
          </video>
        </div>
      </div>
    </div>  <!-- 右侧视频区域 -->

    <!-- 完成弹窗 -->
    <div v-if="showCompletionDialog" class="completion-dialog">
      <div class="dialog-content">
        <h3>🎉 训练已完成</h3>
        <div class="dialog-buttons">
          <button class="restart-btn" @click="restartTraining">再来一次</button>
          <button class="finish-btn" @click="endTraining">结束训练</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

  // const props = defineProps(['exercises'])
  // 新增的repeatTimes prop和currentRepeat状态
  const props = defineProps({
    exercises: Array,
    repeatTimes: {
      type: Number,
      default: 3
    }
  })
  const emit = defineEmits(['end'])

  const currentIndex = ref(0)
  const isPlaying = ref(false)
  const isMuted = ref(false)
  const showRepeatDialog = ref(true)
  const localRepeatTimes = ref(2)

  let intervalId = null
  const videoPlayer = ref(null)
  const isVideoLoading = ref(false)

  // 在script中添加
  const totalExercises = computed(() => props.exercises.length)
  const completedCount = ref(0)

  const showCompletionDialog = ref(false)

  const currentRepeat = ref(0) // 当前重复次数

  // 新增方法
  const adjustRepeat = (delta) => {
    const newValue = localRepeatTimes.value + delta
    if (newValue >= 1 && newValue <= 10) {
      localRepeatTimes.value = newValue
    }
  }

  const startTraining = () => {
    showRepeatDialog.value = false
    console.log('关闭重复次数设置弹窗startTraining')
    console.log(isPlaying.value)
    // 初始化播放状态
    isPlaying.value = true
    if (videoPlayer.value) {
      videoPlayer.value.play()
    }
  }

  const closeRepeatDialog = () => {
    console.log('关闭重复次数设置弹窗')
    console.log(isPlaying.value)
    showRepeatDialog.value = false
    // 恢复默认值
    localRepeatTimes.value = 3
  }

  // 计算当前视频源
  const videoSrc = computed(() => {
    const path = props.exercises[currentIndex.value]?.video || ''
    // console.log("复赛啊发发发发塞缝撒")
    // console.log(path)
    // return path ? require(`@/assets/${path}`) : null
    return path
  })

  // 备选方案处理
  const hasVideo = computed(() => !!videoSrc.value)
  const fallbackImage = computed(() => placeholder)

  // 视频播放结束处理
  const handleVideoEnded = () => {
    currentRepeat.value += 1

    // if (currentRepeat.value < props.repeatTimes) {
    if (currentRepeat.value < localRepeatTimes.value) {
      // 重复播放当前视频
      videoPlayer.value.play()
    } else {
      // 重置次数并切换下一个
      currentRepeat.value = 0
      nextExercise()
    }
  }

  const isLastExercise = computed(() => currentIndex.value === props.exercises.length - 1)
  const canPlay = computed(() => {
    return !!videoPlayer.value && videoSrc.value
  })

  const currentExercise = computed(() => props.exercises[currentIndex.value])

  const togglePlay = async () => {
    try {
      if (!videoPlayer.value || !videoSrc.value) return

      if (videoPlayer.value.paused) {
        isVideoLoading.value = true
        await videoPlayer.value.play()
        isPlaying.value = true
      } else {
        videoPlayer.value.pause()
        isPlaying.value = false
      }
    } catch (error) {
      console.error('播放控制失败:', error)
    } finally {
      isVideoLoading.value = false
    }
  }

  // 切换静音状态
  const toggleMute = () => {
    if (videoPlayer.value) {
      videoPlayer.value.muted = !videoPlayer.value.muted
      isMuted.value = videoPlayer.value.muted
    }
  }

  const handleVolumeChange = () => {
  if (videoPlayer.value) {
      isMuted.value = videoPlayer.value.muted
    }
  }
  const autoNextExercise = () => {
    if (!isLastExercise.value) {
      nextExercise()
    }
  }

  const lastExercise = () => {
    if (currentIndex.value > 0) {
      currentIndex.value--
      resetPlayState()
    }
  }

  const nextExercise = () => {
    if (currentIndex.value === totalExercises.value - 1) {
      completedCount.value++
    }

    if (!isLastExercise.value) {
      currentIndex.value++
      resetPlayState()
      currentRepeat.value = 0 // 重置重复次数
    } else {
      console.log('触发 end 事件前')
      // emit('end')
      console.log('第几轮运动:', completedCount.value)
      showCompletionDialog.value = true // 显示完成弹窗
      isPlaying.value = false
      console.log('触发 end 事件后')
    }
  }

  // 新增方法
  const restartTraining = () => {
    currentIndex.value = 0
    currentRepeat.value = 0 // 重置重复次数
    showCompletionDialog.value = false
    resetPlayState()

    console.log('重新开始训练')
    console.log(videoPlayer.value)
    // if (videoPlayer.value) {
    //   videoPlayer.value.play()
    // }
  }

  const endTraining = () => {
    showCompletionDialog.value = false
    emit('end')
  }


  const endSession = () => {
    clearInterval(intervalId)
    emit('end') // 确保触发结束事件
    console.log('已触发结束事件') // 调试用
  }


  const resetPlayState = () => {
    isPlaying.value = false
  }
  watch(currentIndex, (newVal) => {
    console.log('当前运动:', newVal + 1)
  })

  // 在弹窗显示时播放音效
  const playSuccessSound = () => {
    console.log('播放成功音效')
    // const audio = new Audio('/sounds/success.mp3')
    // audio.play()
  }
  watch(showCompletionDialog, (val) => val && playSuccessSound())

  // 3. 定义事件处理函数（必须保存引用）
  const handleKeydown = (e) => {
    if (showCompletionDialog.value) {
      if (e.key === 'Enter') restartTraining()
      if (e.key === 'Escape') endTraining()
    }
  }
  // 4. 添加事件监听
  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })
  // 5. 正确移除事件监听
  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
</script>

<style scoped>

.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  transition: all 0.2s ease;
}

.close-btn:hover {
  color: #333;
  transform: scale(1.1);
}

.repeat-picker {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin: 20px 0;
}

.repeat-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #2196f3;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.repeat-btn:hover {
  background: #1976d2;
  transform: scale(1.1);
}

.repeat-input {
  width: 80px;
  height: 40px;
  text-align: center;
  font-size: 20px;
  border: 2px solid #2196f3;
  border-radius: 8px;
  -moz-appearance: textfield;
}

.repeat-input::-webkit-outer-spin-button,
.repeat-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.confirm-btn {
  background: #4CAF50;
  padding: 12px 30px;
  font-size: 16px;
  border-radius: 6px;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.confirm-btn:hover {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76,175,80,0.3);
}

/* 基础布局 */
.main-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 10px;
  height: 95vh;
  padding: 10px;
  background: #f5f7fa;
}

/* 运动列表 */
.exercise-list {
  background: #fff;
  padding: 0.5rem;
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  padding: 0rem; /* 减少容器内边距 */
}

.exercise-item {
  padding: 0.1rem;
  margin: 0.25rem 0.25rem 0.25rem 0.25rem; /* 调整外边距 */
  border-radius: 4px;
  transition: all 0.25s ease;
  background: #f8f9fa;
}

/* 调整内部元素间距 */
.exercise-item h5 {
  margin: 0.25rem 0; /* 减少标题间距 */
  font-size: 0.95rem; /* 略微缩小字体 */
  line-height: 1.3; /* 紧凑行高 */
  color: #333;
  transition: all 0.3s ease; /* 添加过渡动画 */
}

.exercise-item p {
  margin: 0.25rem 0; /* 减少段落间距 */
  font-size: 0.85rem; /* 缩小说明文字 */
  color: #666; /* 弱化文字颜色 */
}

/* 调整状态图标 */
.exercise-item > span {
  display: block;
  margin-bottom: 0.25rem; /* 减少图标下边距 */
  font-size: 0.9rem;
}

/* 优化动画性能 */
.current-exercise {
  animation: pulse 1.5s ease infinite;
  transform-origin: center; /* 优化缩放中心 */
}

.current-exercise {
  background: #e8f4ff;
  border-left: 8px solid #2196f3;
  animation: pulse 1.5s ease infinite;
}
.completed-exercise {
  opacity: 0.7;
  border-left: 4px solid #4caf50;
}

/* 在样式表中添加 */
.completed-exercise h5 {
  position: relative;
  text-decoration: line-through;
  transform: translateY(-10%);
  color: #999; /* 可选：弱化文字颜色 */
  opacity: 0.8; /* 可选：降低不透明度 */
}

.exercise-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.status-indicator {
  font-size: 0.85rem;
  color: #666;
  white-space: nowrap;
}

.status-indicator span {
  display: flex;
  align-items: center;
  gap: 0.1rem;
}

.upcoming-exercise {
  border-left: 4px solid #eee;
  opacity: 0.5;
  border-left: 4px solid #ff9800;
}

@keyframes pulse {
  0%, 100% { transform: scale(1.15); }
  50% { transform: scale(1.02); }
}

/* 视频区域 */
.video-section {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 40px);
}

/* 视频容器 */
.video-wrapper {
  flex: 1;
  position: relative;
  background: #000;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.video-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* 控制按钮 */
.top-controls {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.control-btn {
  padding: 14px 28px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
  display: flex;
  align-items: center;
  gap: 8px;
}

.pause-btn {
  background: linear-gradient(135deg, #66b3ff, #3385ff);
  color: white;
  box-shadow: 0 4px 12px rgba(51,133,255,0.3);
}

.end-btn {
  background: linear-gradient(135deg, #ff6666, #ff4444);
  color: white;
  box-shadow: 0 4px 12px rgba(255,68,68,0.25);
}
.pause-btn.paused-state {
  background: linear-gradient(135deg, #ff4444, #ff0000);
  box-shadow: 0 4px 12px rgba(251,140,0,0.25);
}

/* 调整hover效果 */
.pause-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 5px 12px rgba(0,0,0,0.15);
}

/* 导航按钮 */
.navigation-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  position: absolute;
  left: 0;
  right: 0;
  z-index: 10;
}

.nav-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.25s ease;
  background: rgba(255,255,255,0.95);
  box-shadow: 0 3px 8px rgba(0,0,0,0.1);
}

/* 通用状态 */
button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 12px rgba(0,0,0,0.15);
}

/* 叠加文字 */
.overlay-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 1.25rem;
  text-shadow: 0 2px 6px rgba(0,0,0,0.3);
  opacity: 0.9;
}

/* 响应式适配 */
@media (min-aspect-ratio: 16/9) {
  video { width: auto; height: 100%; }
}

@media (max-aspect-ratio: 16/9) {
  video { width: 100%; height: auto; }
}
.mute-btn {
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  box-shadow: 0 4px 12px rgba(76,175,80,0.3);
}

.mute-btn.muted {
  background: linear-gradient(135deg, #ff4444, #ff0000);
}
@media (max-width: 768px) {
  .completed-exercise h5 {
    text-decoration-thickness: 1px;
  }
}

.completion-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-content {
  background: white;
  padding: 2rem;
  border-radius: 6px;
  text-align: center;
  box-shadow: 0 8px 30px rgba(0,0,0,0.2);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.dialog-buttons {
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.restart-btn, .finish-btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.restart-btn {
  background: #4CAF50;
  color: white;
}

.finish-btn {
  background: #f44336;
  color: white;
}

.restart-btn:hover {
  background: #45a049;
  transform: translateY(-2px);
}

.finish-btn:hover {
  background: #d32f2f;
  transform: translateY(-2px);
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.repeat-progress {
  font-size: 1em;
  color: #66b3ff;
  background: rgba(0,0,0,0.05);
  padding: 0px 6px;
  border-radius: 4px;
  margin-left: 0rem;
}
</style>
