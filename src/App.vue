<template>
  <div class="container">
    <HomePage v-if="currentStep === 'home'" @start="currentStep = 'time'" />
    <TimeSelection
      v-if="currentStep === 'time'"
      @select-time="startExercise"
      @back="currentStep = 'home'"
    />
    <VideoPlayer
      v-if="currentStep === 'exercises'"
      :exercises="exercises[selectedTime]"
      @end="handleExerciseEnd"
    />
  </div>
</template>


<script setup>
  import { exercises } from './data/exercises'
  import { ref } from 'vue'
  import HomePage from './components/HomePage.vue'
  import TimeSelection from './components/TimeSelection.vue'
  import VideoPlayer from './components/VideoPlayer.vue'

  const currentStep = ref('home')
  const selectedTime = ref(null)
  const currentExerciseIndex = ref(0)
  const isPlaying = ref(false)

  const startExercise = (time) => {
    selectedTime.value = time
    currentStep.value = 'exercises'

    // 调试输出
    console.log('当前选中时间段:', time)
    console.log('运动数据:', exercises[time])
    console.log('currentStep状态:', currentStep.value)
    console.log('首个运动视频路径:', exercises[time][0].video)
    // console.log('完整assets路径:', require('@/assets/' + exercises[time][0].video))
  }

  const handleExerciseEnd = () => {
    console.log('收到结束事件')
    console.log('处理结束事件:', {
      currentStepBefore: currentStep.value,
      selectedTimeBefore: selectedTime.value
    })

    currentExerciseIndex.value = 0
    currentStep.value = 'time' // 回到选择时间页面
    selectedTime.value = null // 清空已选时间

    console.log('处理后状态:', {
      currentStepAfter: currentStep.value,
      selectedTimeAfter: selectedTime.value
    })
  }
</script>

<!-- 添加视觉过渡效果 -->
<style>
.container {
  transition: opacity 0.3s ease;
}

.container > * {
  transition: transform 0.3s ease;
}
</style>