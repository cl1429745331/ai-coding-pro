<template>
  <div class="game-container">
    <div class="game-header">
      <h1>贪吃蛇游戏</h1>
      <div class="score">得分: {{ score }}</div>
    </div>
    
    <div class="game-board">
      <canvas 
        ref="gameCanvas"
        :width="canvasWidth"
        :height="canvasHeight"
        @keydown="handleKeydown"
        tabindex="0"
      ></canvas>
    </div>
    
    <div class="game-controls">
      <button v-if="!gameRunning" @click="startGame">开始游戏</button>
      <button v-if="gameRunning" @click="pauseGame">暂停游戏</button>
      <button @click="resetGame">重新开始</button>
    </div>
    
    <!-- 移动端虚拟方向键 -->
    <div class="mobile-controls" v-if="isMobile">
      <div class="d-pad">
        <button class="d-pad-btn up" @touchstart="setDirection(0, -1)" @click="setDirection(0, -1)">
          <span>↑</span>
        </button>
        <div class="d-pad-middle">
          <button class="d-pad-btn left" @touchstart="setDirection(-1, 0)" @click="setDirection(-1, 0)">
            <span>←</span>
          </button>
          <div class="d-pad-center"></div>
          <button class="d-pad-btn right" @touchstart="setDirection(1, 0)" @click="setDirection(1, 0)">
            <span>→</span>
          </button>
        </div>
        <button class="d-pad-btn down" @touchstart="setDirection(0, 1)" @click="setDirection(0, 1)">
          <span>↓</span>
        </button>
      </div>
    </div>
    
    <div class="game-info">
      <p v-if="!isMobile">使用方向键控制蛇的移动</p>
      <p v-else>点击方向键控制蛇的移动</p>
      <p v-if="gameOver" class="game-over">游戏结束！</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      canvasWidth: 400,
      canvasHeight: 400,
      gridSize: 20,
      snake: [{ x: 200, y: 200 }],
      food: { x: 100, y: 100 },
      direction: { x: 0, y: 0 },
      gameRunning: false,
      gameOver: false,
      score: 0,
      gameLoop: null,
      isMobile: false
    }
  },
  mounted() {
    this.initGame()
    this.checkMobile()
    window.addEventListener('resize', this.checkMobile)
  },
  beforeUnmount() {
    if (this.gameLoop) {
      clearInterval(this.gameLoop)
    }
  },
  methods: {
    initGame() {
      this.canvas = this.$refs.gameCanvas
      this.ctx = this.canvas.getContext('2d')
      this.canvas.focus()
      this.generateFood()
      this.draw()
      
      document.addEventListener('keydown', this.handleKeydown)
    },
    
    startGame() {
      this.gameRunning = true
      this.gameOver = false
      this.gameLoop = setInterval(() => {
        this.update()
        this.draw()
      }, 150)
    },
    
    pauseGame() {
      this.gameRunning = false
      if (this.gameLoop) {
        clearInterval(this.gameLoop)
      }
    },
    
    resetGame() {
      this.pauseGame()
      this.snake = [{ x: 200, y: 200 }]
      this.direction = { x: 0, y: 0 }
      this.score = 0
      this.gameOver = false
      this.generateFood()
      this.draw()
    },
    
    update() {
      if (!this.gameRunning || this.gameOver) return
      
      // 如果没有方向，不进行移动
      if (this.direction.x === 0 && this.direction.y === 0) return
      
      const head = { ...this.snake[0] }
      head.x += this.direction.x * this.gridSize
      head.y += this.direction.y * this.gridSize
      
      if (this.checkCollision(head)) {
        this.gameOver = true
        this.pauseGame()
        this.addShakeEffect()
        return
      }
      
      this.snake.unshift(head)
      
      if (head.x === this.food.x && head.y === this.food.y) {
        this.score += 10
        this.addScoreEffect()
        this.generateFood()
      } else {
        this.snake.pop()
      }
    },
    
    checkCollision(head) {
      if (head.x < 0 || head.x >= this.canvasWidth || 
          head.y < 0 || head.y >= this.canvasHeight) {
        return true
      }
      
      for (let segment of this.snake) {
        if (head.x === segment.x && head.y === segment.y) {
          return true
        }
      }
      
      return false
    },
    
    generateFood() {
      const maxX = Math.floor(this.canvasWidth / this.gridSize) - 1
      const maxY = Math.floor(this.canvasHeight / this.gridSize) - 1
      
      let newFood
      do {
        newFood = {
          x: Math.floor(Math.random() * maxX) * this.gridSize,
          y: Math.floor(Math.random() * maxY) * this.gridSize
        }
      } while (this.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y))
      
      this.food = newFood
    },
    
    draw() {
      // 创建渐变背景
      const gradient = this.ctx.createLinearGradient(0, 0, this.canvasWidth, this.canvasHeight)
      gradient.addColorStop(0, '#0a0a0a')
      gradient.addColorStop(0.5, '#1a1a2e')
      gradient.addColorStop(1, '#16213e')
      
      this.ctx.fillStyle = gradient
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)
      
      // 添加网格效果
      this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)'
      this.ctx.lineWidth = 0.5
      for (let x = 0; x <= this.canvasWidth; x += this.gridSize) {
        this.ctx.beginPath()
        this.ctx.moveTo(x, 0)
        this.ctx.lineTo(x, this.canvasHeight)
        this.ctx.stroke()
      }
      for (let y = 0; y <= this.canvasHeight; y += this.gridSize) {
        this.ctx.beginPath()
        this.ctx.moveTo(0, y)
        this.ctx.lineTo(this.canvasWidth, y)
        this.ctx.stroke()
      }
      
      // 绘制蛇身 - 使用渐变和阴影效果
      this.snake.forEach((segment, index) => {
        const alpha = 1 - (index * 0.05) // 渐变透明度
        const size = this.gridSize - 2
        
        // 蛇头特殊处理
        if (index === 0) {
          // 蛇头发光效果
          this.ctx.shadowColor = '#00ff88'
          this.ctx.shadowBlur = 15
          
          const headGradient = this.ctx.createRadialGradient(
            segment.x + size/2, segment.y + size/2, 0,
            segment.x + size/2, segment.y + size/2, size/2
          )
          headGradient.addColorStop(0, '#00ff88')
          headGradient.addColorStop(0.7, '#00cc66')
          headGradient.addColorStop(1, '#006633')
          
          this.ctx.fillStyle = headGradient
          this.ctx.fillRect(segment.x + 1, segment.y + 1, size, size)
          
          // 蛇头眼睛
          this.ctx.shadowBlur = 0
          this.ctx.fillStyle = '#ff0040'
          const eyeSize = 3
          this.ctx.fillRect(segment.x + 4, segment.y + 4, eyeSize, eyeSize)
          this.ctx.fillRect(segment.x + size - 4 - eyeSize, segment.y + 4, eyeSize, eyeSize)
        } else {
          // 蛇身渐变效果
          this.ctx.shadowColor = '#00ff88'
          this.ctx.shadowBlur = 8
          
          const bodyGradient = this.ctx.createLinearGradient(
            segment.x, segment.y,
            segment.x + size, segment.y + size
          )
          bodyGradient.addColorStop(0, `rgba(0, 255, 136, ${alpha})`)
          bodyGradient.addColorStop(1, `rgba(0, 153, 102, ${alpha})`)
          
          this.ctx.fillStyle = bodyGradient
          this.ctx.fillRect(segment.x + 1, segment.y + 1, size, size)
        }
      })
      
      // 重置阴影
      this.ctx.shadowBlur = 0
      
      // 绘制食物 - 添加脉冲动画效果
      const time = Date.now() * 0.005
      const pulseSize = 2 + Math.sin(time) * 1
      const foodSize = this.gridSize - 4 + pulseSize
      const foodOffset = (this.gridSize - foodSize) / 2
      
      // 食物发光效果
      this.ctx.shadowColor = '#ff6b6b'
      this.ctx.shadowBlur = 20
      
      const foodGradient = this.ctx.createRadialGradient(
        this.food.x + this.gridSize/2, this.food.y + this.gridSize/2, 0,
        this.food.x + this.gridSize/2, this.food.y + this.gridSize/2, foodSize/2
      )
      foodGradient.addColorStop(0, '#ff6b6b')
      foodGradient.addColorStop(0.6, '#ff4757')
      foodGradient.addColorStop(1, '#cc2e3f')
      
      this.ctx.fillStyle = foodGradient
      this.ctx.beginPath()
      this.ctx.arc(
        this.food.x + this.gridSize/2,
        this.food.y + this.gridSize/2,
        foodSize/2,
        0,
        Math.PI * 2
      )
      this.ctx.fill()
      
      // 食物闪烁效果
      if (Math.sin(time * 2) > 0.5) {
        this.ctx.shadowBlur = 30
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
        this.ctx.beginPath()
        this.ctx.arc(
          this.food.x + this.gridSize/2,
          this.food.y + this.gridSize/2,
          foodSize/2 + 2,
          0,
          Math.PI * 2
        )
        this.ctx.fill()
      }
      
      // 重置阴影
      this.ctx.shadowBlur = 0
    },
    
    handleKeydown(event) {
      if (!this.gameRunning) return
      
      switch (event.key) {
        case 'ArrowUp':
          if (this.direction.y === 0) {
            this.direction = { x: 0, y: -1 }
          }
          break
        case 'ArrowDown':
          if (this.direction.y === 0) {
            this.direction = { x: 0, y: 1 }
          }
          break
        case 'ArrowLeft':
          if (this.direction.x === 0) {
            this.direction = { x: -1, y: 0 }
          }
          break
        case 'ArrowRight':
          if (this.direction.x === 0) {
            this.direction = { x: 1, y: 0 }
          }
          break
      }
      event.preventDefault()
    },
    
    setDirection(x, y) {
      if (!this.gameRunning) return
      
      // 防止反向移动
      if (this.direction.x === 0 && x !== 0) {
        this.direction = { x, y: 0 }
      } else if (this.direction.y === 0 && y !== 0) {
        this.direction = { x: 0, y }
      }
    },
    
    checkMobile() {
      this.isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    },
    
    addShakeEffect() {
      const gameBoard = document.querySelector('.game-board')
      gameBoard.classList.add('shake')
      setTimeout(() => {
        gameBoard.classList.remove('shake')
      }, 600)
    },
    
    addScoreEffect() {
      const scoreElement = document.querySelector('.score')
      scoreElement.classList.add('score-pop')
      setTimeout(() => {
        scoreElement.classList.remove('score-pop')
      }, 300)
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Orbitron', monospace;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%);
  min-height: 100vh;
  overflow-x: hidden;
}

.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  min-height: 100vh;
  position: relative;
}

.game-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 50%, rgba(120, 0, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(255, 0, 120, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.game-header {
  text-align: center;
  margin-bottom: 30px;
  z-index: 1;
  position: relative;
}

.game-header h1 {
  color: #00ffff;
  margin-bottom: 15px;
  font-size: 2.5rem;
  font-weight: 900;
  text-shadow: 
    0 0 20px rgba(0, 255, 255, 0.5),
    0 0 40px rgba(0, 255, 255, 0.3),
    0 0 60px rgba(0, 255, 255, 0.1);
  letter-spacing: 2px;
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    text-shadow: 
      0 0 20px rgba(0, 255, 255, 0.5),
      0 0 40px rgba(0, 255, 255, 0.3),
      0 0 60px rgba(0, 255, 255, 0.1);
  }
  to {
    text-shadow: 
      0 0 30px rgba(0, 255, 255, 0.8),
      0 0 50px rgba(0, 255, 255, 0.5),
      0 0 80px rgba(0, 255, 255, 0.3);
  }
}

.score {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ff6b6b;
  background: linear-gradient(45deg, #ff6b6b, #ffa500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 20px rgba(255, 107, 107, 0.3);
  letter-spacing: 1px;
}

.game-board {
  border: 3px solid;
  border-image: linear-gradient(45deg, #00ffff, #ff6b6b, #00ff88) 1;
  border-radius: 15px;
  margin-bottom: 30px;
  box-shadow: 
    0 0 30px rgba(0, 255, 255, 0.3),
    inset 0 0 30px rgba(0, 0, 0, 0.3);
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.game-board::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #00ffff, #ff6b6b, #00ff88, #ffa500);
  border-radius: 15px;
  z-index: -1;
  animation: border-flow 3s linear infinite;
}

@keyframes border-flow {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}

canvas {
  display: block;
  outline: none;
  border-radius: 12px;
  position: relative;
  z-index: 1;
}

.game-controls {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  justify-content: center;
}

button {
  padding: 12px 24px;
  font-size: 1rem;
  font-family: 'Orbitron', monospace;
  font-weight: 700;
  background: linear-gradient(45deg, #1e3c72, #2a5298);
  color: #ffffff;
  border: 2px solid transparent;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(30, 60, 114, 0.3);
}

button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

button:hover {
  background: linear-gradient(45deg, #2a5298, #1e3c72);
  border-color: #00ffff;
  box-shadow: 
    0 6px 20px rgba(30, 60, 114, 0.4),
    0 0 20px rgba(0, 255, 255, 0.3);
  transform: translateY(-2px);
}

button:hover::before {
  left: 100%;
}

button:active {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(30, 60, 114, 0.3);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.game-info {
  text-align: center;
  color: #a0a0a0;
  font-size: 1rem;
  letter-spacing: 0.5px;
}

.game-info p {
  margin-bottom: 8px;
}

.game-over {
  color: #ff4757;
  font-weight: bold;
  font-size: 1.5rem;
  margin-top: 15px;
  text-shadow: 0 0 20px rgba(255, 71, 87, 0.5);
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* 震动效果 */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
  20%, 40%, 60%, 80% { transform: translateX(8px); }
}

.shake {
  animation: shake 0.6s ease-in-out;
}

/* 分数弹出效果 */
@keyframes scorePop {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

.score-pop {
  animation: scorePop 0.3s ease-out;
}

/* 按钮点击波纹效果 */
@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 0.6;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}

button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  transform: scale(0);
  pointer-events: none;
}

button:active::after {
  animation: ripple 0.6s ease-out;
}

/* 移动端虚拟方向键 */
.mobile-controls {
  margin: 20px 0;
  display: flex;
  justify-content: center;
}

.d-pad {
  display: grid;
  grid-template-rows: 60px 60px 60px;
  grid-template-columns: 60px 60px 60px;
  gap: 5px;
  opacity: 0.9;
}

.d-pad-btn {
  background: linear-gradient(145deg, #2c3e50, #34495e);
  border: 2px solid #00ffff;
  border-radius: 50%;
  color: #00ffff;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.1);
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.d-pad-btn:active {
  background: linear-gradient(145deg, #34495e, #2c3e50);
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.3),
    inset 0 2px 8px rgba(0, 0, 0, 0.3);
  transform: scale(0.95);
  border-color: #ff6b6b;
  color: #ff6b6b;
}

.d-pad-btn.up {
  grid-column: 2;
  grid-row: 1;
}

.d-pad-btn.left {
  grid-column: 1;
  grid-row: 2;
}

.d-pad-btn.right {
  grid-column: 3;
  grid-row: 2;
}

.d-pad-btn.down {
  grid-column: 2;
  grid-row: 3;
}

.d-pad-middle {
  grid-column: 2;
  grid-row: 2;
  display: flex;
  align-items: center;
}

.d-pad-center {
  width: 20px;
  height: 20px;
  background: radial-gradient(circle, #00ffff, transparent);
  border-radius: 50%;
  opacity: 0.3;
  margin: 0 auto;
}

/* 添加移动端适配 */
@media (max-width: 768px) {
  .game-header h1 {
    font-size: 2rem;
  }
  
  .score {
    font-size: 1.2rem;
  }
  
  .game-controls {
    gap: 10px;
  }
  
  button {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
  
  .game-container {
    padding: 15px;
  }
  
  .game-board {
    margin-bottom: 20px;
  }
  
  .mobile-controls {
    margin: 15px 0;
  }
}

@media (max-width: 480px) {
  .game-header h1 {
    font-size: 1.5rem;
  }
  
  .score {
    font-size: 1rem;
  }
  
  button {
    padding: 8px 16px;
    font-size: 0.8rem;
  }
  
  .game-container {
    padding: 10px;
  }
  
  /* 调整画布大小适应小屏幕 */
  canvas {
    max-width: 100%;
    height: auto;
  }
  
  /* 调整虚拟方向键大小 */
  .d-pad {
    grid-template-rows: 50px 50px 50px;
    grid-template-columns: 50px 50px 50px;
    gap: 3px;
  }
  
  .d-pad-btn {
    font-size: 18px;
  }
  
  .d-pad-center {
    width: 15px;
    height: 15px;
  }
}

/* 横屏模式优化 */
@media (max-height: 600px) and (orientation: landscape) {
  .game-container {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
    padding: 10px;
  }
  
  .game-header {
    order: 1;
    width: 100%;
    margin-bottom: 10px;
  }
  
  .game-board {
    order: 2;
    margin: 0 20px 0 0;
  }
  
  .game-controls {
    order: 4;
    flex-direction: column;
    gap: 8px;
    margin: 0;
  }
  
  .mobile-controls {
    order: 3;
    margin: 0;
  }
  
  .game-info {
    order: 5;
    width: 100%;
    margin-top: 10px;
  }
  
  .d-pad {
    grid-template-rows: 40px 40px 40px;
    grid-template-columns: 40px 40px 40px;
  }
  
  .d-pad-btn {
    font-size: 16px;
  }
}

/* 超小屏幕设备 */
@media (max-width: 360px) {
  .game-header h1 {
    font-size: 1.2rem;
    letter-spacing: 1px;
  }
  
  .score {
    font-size: 0.9rem;
  }
  
  .game-controls {
    flex-direction: column;
    gap: 8px;
  }
  
  button {
    padding: 6px 12px;
    font-size: 0.7rem;
  }
}
</style>