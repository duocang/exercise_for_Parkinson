<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['start'])
const password = ref('')
const error = ref('')
const showAnimation = ref(true) // 初始设为 true，确保动画容器立即显示
const showUnderstand = ref(false)
const showContent = ref(false)

onMounted(() => {
  setTimeout(() => {
    showUnderstand.value = true
  }, 2500)
})

const handleUnderstand = () => {
  showAnimation.value = false
  setTimeout(() => {
    showContent.value = true
  }, 500) // 等待动画完成
}

const handleSubmit = () => {
  if (password.value === '123') {
    error.value = ''
    emit('start')
  } else {
    error.value = '密码不正确，请再试一次'
    password.value = ''
  }
}
</script>

<template>
  <div class="home-page">
    <div class="animation-container">
      <transition name="splash">
        <div v-if="showAnimation" class="splash-content">
          <div class="animated-text">
            <p>不求<span class="highlight"><strong>100%</strong></span>控制</p>

            <p>药物<span class="highlight">按量</span>不能多</p>

            <p><span class="highlight">运动</span>是隐形<span class="highlight">良药</span></p>
          </div>
            <button
              v-if="showUnderstand"
              class="understand-btn"
              @click="handleUnderstand"
            >
              明白
            </button>
        </div>
      </transition>

      <!-- 密码输入区 -->
      <transition name="content">
        <div v-if="showContent" class="password-content">
          <input
            v-model="password"
            type="text"
            placeholder="请输入密码"
            class="password-input"
            @keyup.enter="handleSubmit"
          >
          <button
            class="start-btn"
            @click="handleSubmit"
          >
            开始今日运动任务！
          </button>
          <div v-if="error" class="error-msg">{{ error }}</div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
  /* 新增动画容器 */
  .animation-container {
    position: relative;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* 开场动画样式 */
  .splash-content {
    position: relative;
    text-align: center;
    transition: all 0.5s ease;
  }

  .animated-text {
    font-size: 3rem;
    color: #2c3e50;
    line-height: 1.5;
    font-weight: bold;
    margin-bottom: 2rem;
  }

  /* 选择其中一种动画样式添加 */
  /* 方式1：逐行飞入 */
  .animated-text p {
    opacity: 0;
    transform: translateX(-50px);
    animation: slideIn 5s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
  }

  @keyframes slideIn {
    to { opacity: 1; transform: translateX(0); }
  }

  .animated-text p:nth-child(1) { animation-delay: 0.5s; }
  .animated-text p:nth-child(2) { animation-delay: 01s; }
  .animated-text p:nth-child(3) { animation-delay: 1.5s; }


  /* 强调样式 */
  .highlight {
    font-size: 1.4em; /* 加大字体 */
    font-weight: 1500; /* 加粗 */
    color: #e74c3c;
  }

  /* 密码输入区样式 */
  .password-content {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  /* 按钮样式优化 */
  .understand-btn {
    padding: 1rem 3rem;
    font-size: 3rem;
    border-radius: 1rem;
    background: #e74c3c;
    color: white;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 15px rgba(33,150,243,0.3);
    animation: slideUp 0.8s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
    opacity: 0;
    transform: translateY(50px);
  }

  .understand-btn:hover, .start-btn:hover {
    transform: scale(1.05);
    background: #1976D2;
  }

  @keyframes slideUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  /* 添加按钮动画延迟 */
  .understand-btn {
    animation-delay: 0s; /* 约在文字动画结束后出现 */
  }
  .password-input {
    width: 350px;
    padding: 1.5rem;
    font-size: 2rem;
    border: 3px solid #4CAF50;
    border-radius: 1.5rem;
    text-align: center;
    letter-spacing: 0.5rem;
    transition: all 0.1s;
  }

  .start-btn {
    padding: 1.5rem 3rem;
    font-size: 2rem;
    border-radius: 1.5rem;
    background: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 4px 15px rgba(76,175,80,0.3);
  }

  .home-page {
    background: linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%);
  }
</style>
