<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['start'])
const password = ref('')
const error = ref('')
const showAnimation = ref(true) // 初始设为 true，确保动画容器立即显示
const showUnderstand = ref(false)
const showContent = ref(false)
const showSuccess = ref(false)
const isTransitioning = ref(false)

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

const handleNumberClick = (number) => {
  if (password.value.length < 3) {
    password.value += number
    if (password.value.length === 3) {
      handleSubmit()
    }
  }
}

const handleBackspace = () => {
  if (password.value.length > 0) {
    password.value = password.value.slice(0, -1)
  }
}

const handleSubmit = () => {
  if (password.value === '123') {
    error.value = ''
    showSuccess.value = true
    setTimeout(() => {
      isTransitioning.value = true
      setTimeout(() => {
        emit('start')
      }, 1000)
    }, 1500)
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
          <div class="password-display">{{ password || '请输入密码！' }}</div>
          <div class="number-buttons">
            <button
              v-for="num in 9"
              :key="num"
              class="number-btn"
              @click="handleNumberClick(num)"
            >
              {{ num }}
            </button>
            <div class="zero-container">
              <button
                class="number-btn"
                @click="handleNumberClick(0)"
              >
                0
              </button>
            </div>
            <div class="backspace-container">
              <button
                class="backspace-btn"
                @click="handleBackspace"
              >
                ⌫
              </button>
            </div>
          </div>
          <div v-if="error" class="error-msg">{{ error }}</div>
        </div>
      </transition>

      <transition name="success">
        <div v-if="showSuccess" class="success-message" :class="{ 'transitioning': isTransitioning }">
          <div class="success-icon">✓</div>
          <div class="success-text">验证成功</div>
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
    align-items: flex-start; /* 改为顶部对齐 */
    padding-top: 0vh; /* 添加顶部内边距 */
  }

  /* 开场动画样式 */
  .splash-content {
    position: relative;
    text-align: center;
    transition: all 0.5s ease;
    margin-top: 5vh; /* 添加顶部外边距 */
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
    margin-top: 15vh; /* 添加顶部外边距 */
  }

  .password-display {
    width: 350px;
    height: 60px;
    font-size: 2rem;
    border: 3px solid #e74c3c;
    border-radius: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    letter-spacing: 0.5rem;
    background-color: white;
    color: #2c3e50;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
  }

  .password-display:active {
    transform: scale(0.98);
  }

  .number-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.8rem;
    width: 300px;
    position: relative;
  }

  .number-btn {
    width: 80px;
    height: 80px;
    font-size: 2rem;
    border-radius: 50%;
    background: #e74c3c;
    color: white;
    border: none;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    touch-action: manipulation;
    padding: 0;
    line-height: 1;
  }

  .number-btn:active {
    transform: scale(0.95);
    background: #c0392b;
    box-shadow: 0 2px 8px rgba(231, 76, 60, 0.2);
  }

  .number-btn:hover {
    background: #c0392b;
  }

  .zero-container {
    grid-column: 1;
    grid-row: 4;
    display: flex;
    justify-content: center;
  }

  .backspace-container {
    grid-column: 2 / span 2;
    grid-row: 4;
    display: flex;
    justify-content: center;
  }

  .backspace-btn {
    width: 170px;
    height: 80px;
    font-size: 2.5rem;
    border-radius: 40px;
    background: #e74c3c;
    color: white;
    border: none;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    touch-action: manipulation;
    padding: 0;
    line-height: 1;
  }

  .backspace-btn:active {
    transform: scale(0.95);
    background: #c0392b;
    box-shadow: 0 2px 8px rgba(231, 76, 60, 0.2);
  }

  .backspace-btn:hover {
    background: #c0392b;
  }

  .error-msg {
    color: #e74c3c;
    font-size: 1.5rem;
    text-align: center;
    background: rgba(231, 76, 60, 0.1);
    padding: 0.8rem 1.5rem;
    border-radius: 0.8rem;
    animation: fadeIn 0.3s ease;
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
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    touch-action: manipulation;
  }

  .understand-btn:active {
    transform: scale(0.95);
    background: #c0392b;
    box-shadow: 0 2px 8px rgba(231,76,60,0.2);
  }

  .understand-btn:hover {
    background: #c0392b;
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

  .success-message {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(231, 76, 60, 0.95);
    padding: 2.5rem 4rem;
    border-radius: 1.5rem;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    box-shadow: 0 8px 32px rgba(231, 76, 60, 0.4);
    backdrop-filter: blur(10px);
    z-index: 1000;
  }

  .success-message::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
    z-index: -1;
    pointer-events: none;
  }

  .success-icon {
    font-size: 5rem;
    line-height: 1;
    animation: checkmark 0.5s ease-in-out;
    color: #fff;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    background: rgba(255, 255, 255, 0.2);
    width: 100px;
    height: 100px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
  }

  .success-text {
    font-size: 2.5rem;
    font-weight: bold;
    animation: textFade 0.5s ease-in-out;
    color: #fff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    letter-spacing: 0.2rem;
  }

  @keyframes checkmark {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes textFade {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .success-enter-active,
  .success-leave-active {
    transition: all 0.5s ease;
  }

  .success-enter-from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }

  .success-leave-to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.2);
  }

  .content-enter-active,
  .content-leave-active {
    transition: all 0.5s ease;
  }

  .content-enter-from,
  .content-leave-to {
    opacity: 0;
    transform: translateY(20px);
  }

  .success-message ~ .password-content {
    filter: blur(8px) brightness(0.7);
    transform: scale(0.98);
  }

  .home-page {
    background: linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%);
    transition: all 0.3s ease;
  }

  .success-message ~ .home-page {
    filter: blur(8px) brightness(0.7);
  }
</style>
