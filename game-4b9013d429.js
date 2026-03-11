// 游戏主逻辑文件

class BilliardGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 设置画布尺寸
        this.canvas.width = CONFIG.CANVAS_WIDTH;
        this.canvas.height = CONFIG.CANVAS_HEIGHT;
        
        // 游戏状态
        this.balls = [];
        this.score = 0;
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.dragEnd = { x: 0, y: 0 };
        this.cueBall = null;
        this.gameOver = false;
        
        // 初始化游戏
        this.init();
        this.bindEvents();
        this.gameLoop();
    }
    
    init() {
        // 重置分数
        this.score = 0;
        this.gameOver = false;
        document.getElementById('score').textContent = this.score;
        
        // 创建球
        this.balls = BALL_POSITIONS.map(pos => ({
            x: pos.x,
            y: pos.y,
            vx: 0,
            vy: 0,
            radius: CONFIG.BALL_RADIUS,
            color: pos.color,
            number: pos.number || null,
            isCueBall: pos.isCueBall || false,
            active: true
        }));
        
        // 找到白球
        this.cueBall = this.balls.find(ball => ball.isCueBall);
        
        // 隐藏游戏结束弹窗
        document.getElementById('game-over-modal').style.display = 'none';
    }
    
    bindEvents() {
        // 鼠标事件
        this.canvas.addEventListener('mousedown', (e) => this.handleStart(e.offsetX, e.offsetY));
        this.canvas.addEventListener('mousemove', (e) => this.handleMove(e.offsetX, e.offsetY));
        this.canvas.addEventListener('mouseup', () => this.handleEnd());
        this.canvas.addEventListener('mouseleave', () => this.handleEnd());
        
        // 触摸事件
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            this.handleStart(touch.clientX - rect.left, touch.clientY - rect.top);
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            this.handleMove(touch.clientX - rect.left, touch.clientY - rect.top);
        });
        
        this.canvas.addEventListener('touchend', () => this.handleEnd());
        
        // 重置按钮
        document.getElementById('reset-btn').addEventListener('click', () => this.init());
    }
    
    handleStart(x, y) {
        if (this.gameOver) return;
        
        // 检查是否点击了白球
        const dist = Math.sqrt((x - this.cueBall.x) ** 2 + (y - this.cueBall.y) ** 2);
        if (dist < this.cueBall.radius * 2) {
            this.isDragging = true;
            this.dragStart = { x: this.cueBall.x, y: this.cueBall.y };
            this.dragEnd = { x, y };
        }
    }
    
    handleMove(x, y) {
        if (this.isDragging) {
            this.dragEnd = { x, y };
        }
    }
    
    handleEnd() {
        if (this.isDragging && this.cueBall) {
            // 计算击球力度
            const dx = this.dragStart.x - this.dragEnd.x;
            const dy = this.dragStart.y - this.dragEnd.y;
            const power = Math.min(Math.sqrt(dx ** 2 + dy ** 2) * CONFIG.POWER_SCALE, CONFIG.MAX_POWER);
            
            if (power > 0.5) {
                const angle = Math.atan2(dy, dx);
                this.cueBall.vx = Math.cos(angle) * power;
                this.cueBall.vy = Math.sin(angle) * power;
            }
        }
        this.isDragging = false;
    }
    
    update() {
        // 更新每个球的位置
        this.balls.forEach(ball => {
            if (!ball.active) return;
            
            // 应用摩擦力
            ball.vx *= CONFIG.FRICTION;
            ball.vy *= CONFIG.FRICTION;
            
            // 速度过小时停止
            if (Math.abs(ball.vx) < CONFIG.MIN_VELOCITY) ball.vx = 0;
            if (Math.abs(ball.vy) < CONFIG.MIN_VELOCITY) ball.vy = 0;
            
            // 更新位置
            ball.x += ball.vx;
            ball.y += ball.vy;
            
            // 边界碰撞检测
            this.handleWallCollision(ball);
        });
        
        // 球与球的碰撞检测
        this.handleBallCollisions();
        
        // 进袋检测
        this.handlePocketDetection();
    }
    
    handleWallCollision(ball) {
        const left = CONFIG.TABLE_MARGIN + ball.radius;
        const right = CONFIG.CANVAS_WIDTH - CONFIG.TABLE_MARGIN - ball.radius;
        const top = CONFIG.TABLE_MARGIN + ball.radius;
        const bottom = CONFIG.CANVAS_HEIGHT - CONFIG.TABLE_MARGIN - ball.radius;
        
        if (ball.x < left) {
            ball.x = left;
            ball.vx = -ball.vx * 0.8;
        } else if (ball.x > right) {
            ball.x = right;
            ball.vx = -ball.vx * 0.8;
        }
        
        if (ball.y < top) {
            ball.y = top;
            ball.vy = -ball.vy * 0.8;
        } else if (ball.y > bottom) {
            ball.y = bottom;
            ball.vy = -ball.vy * 0.8;
        }
    }
    
    handleBallCollisions() {
        for (let i = 0; i < this.balls.length; i++) {
            for (let j = i + 1; j < this.balls.length; j++) {
                const ball1 = this.balls[i];
                const ball2 = this.balls[j];
                
                if (!ball1.active || !ball2.active) continue;
                
                const dx = ball2.x - ball1.x;
                const dy = ball2.y - ball1.y;
                const dist = Math.sqrt(dx ** 2 + dy ** 2);
                
                if (dist < ball1.radius + ball2.radius) {
                    // 碰撞响应
                    const angle = Math.atan2(dy, dx);
                    const sin = Math.sin(angle);
                    const cos = Math.cos(angle);
                    
                    // 旋转速度
                    const vx1 = ball1.vx * cos + ball1.vy * sin;
                    const vy1 = ball1.vy * cos - ball1.vx * sin;
                    const vx2 = ball2.vx * cos + ball2.vy * sin;
                    const vy2 = ball2.vy * cos - ball2.vx * sin;
                    
                    // 交换速度（完全弹性碰撞）
                    const finalVx1 = vx2 * 0.95;
                    const finalVx2 = vx1 * 0.95;
                    
                    // 旋转回原来的坐标系
                    ball1.vx = finalVx1 * cos - vy1 * sin;
                    ball1.vy = vy1 * cos + finalVx1 * sin;
                    ball2.vx = finalVx2 * cos - vy2 * sin;
                    ball2.vy = vy2 * cos + finalVx2 * sin;
                    
                    // 分离球
                    const overlap = (ball1.radius + ball2.radius - dist) / 2;
                    ball1.x -= overlap * cos;
                    ball1.y -= overlap * sin;
                    ball2.x += overlap * cos;
                    ball2.y += overlap * sin;
                }
            }
        }
    }
    
    handlePocketDetection() {
        POCKET_POSITIONS.forEach(pocket => {
            this.balls.forEach(ball => {
                if (!ball.active) return;
                
                const dist = Math.sqrt((ball.x - pocket.x) ** 2 + (ball.y - pocket.y) ** 2);
                if (dist < CONFIG.POCKET_RADIUS) {
                    ball.active = false;
                    
                    if (ball.isCueBall) {
                        // 白球进袋，重置位置
                        setTimeout(() => {
                            ball.x = 100;
                            ball.y = CONFIG.CANVAS_HEIGHT / 2;
                            ball.vx = 0;
                            ball.vy = 0;
                            ball.active = true;
                        }, 1000);
                    } else {
                        // 彩球进袋，加分
                        this.score += CONFIG.POINTS_PER_POCKET;
                        document.getElementById('score').textContent = this.score;
                        
                        // 检查是否所有球都进袋
                        this.checkGameOver();
                    }
                }
            });
        });
    }
    
    checkGameOver() {
        const remainingBalls = this.balls.filter(ball => ball.active && !ball.isCueBall);
        if (remainingBalls.length === 0) {
            this.gameOver = true;
            this.showGameOver();
        }
    }
    
    showGameOver() {
        const modal = document.getElementById('game-over-modal');
        const finalScore = document.getElementById('final-score');
        finalScore.textContent = this.score;
        modal.style.display = 'flex';
        
        // 绑定再玩一次按钮
        const playAgainBtn = document.getElementById('play-again-btn');
        playAgainBtn.onclick = () => this.init();
    }
    
    draw() {
        // 清空画布
        this.ctx.fillStyle = CONFIG.TABLE_COLOR;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制边框
        this.ctx.fillStyle = CONFIG.RAIL_COLOR;
        this.ctx.fillRect(0, 0, CONFIG.TABLE_MARGIN, CONFIG.CANVAS_HEIGHT);
        this.ctx.fillRect(CONFIG.CANVAS_WIDTH - CONFIG.TABLE_MARGIN, 0, CONFIG.TABLE_MARGIN, CONFIG.CANVAS_HEIGHT);
        this.ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.TABLE_MARGIN);
        this.ctx.fillRect(0, CONFIG.CANVAS_HEIGHT - CONFIG.TABLE_MARGIN, CONFIG.CANVAS_WIDTH, CONFIG.TABLE_MARGIN);
        
        // 绘制球袋
        this.ctx.fillStyle = '#000000';
        POCKET_POSITIONS.forEach(pocket => {
            this.ctx.beginPath();
            this.ctx.arc(pocket.x, pocket.y, CONFIG.POCKET_RADIUS, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // 绘制瞄准线
        if (this.isDragging && this.cueBall) {
            const dx = this.dragStart.x - this.dragEnd.x;
            const dy = this.dragStart.y - this.dragEnd.y;
            const power = Math.min(Math.sqrt(dx ** 2 + dy ** 2) * CONFIG.POWER_SCALE, CONFIG.MAX_POWER);
            
            if (power > 0.5) {
                const angle = Math.atan2(dy, dx);
                const lineLength = power * 5;
                
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                this.ctx.lineWidth = 2;
                this.ctx.setLineDash([5, 5]);
                this.ctx.beginPath();
                this.ctx.moveTo(this.cueBall.x, this.cueBall.y);
                this.ctx.lineTo(
                    this.cueBall.x + Math.cos(angle) * lineLength,
                    this.cueBall.y + Math.sin(angle) * lineLength
                );
                this.ctx.stroke();
                this.ctx.setLineDash([]);
            }
        }
        
        // 绘制球
        this.balls.forEach(ball => {
            if (!ball.active) return;
            
            // 绘制球体
            this.ctx.beginPath();
            this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = ball.color;
            this.ctx.fill();
            
            // 绘制高光
            const gradient = this.ctx.createRadialGradient(
                ball.x - ball.radius / 3, ball.y - ball.radius / 3, 0,
                ball.x, ball.y, ball.radius
            );
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
            
            // 绘制号码
            if (ball.number) {
                this.ctx.fillStyle = ball.color === '#000000' ? '#ffffff' : '#000000';
                this.ctx.font = 'bold 10px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(ball.number, ball.x, ball.y);
            }
        });
    }
    
    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// 页面加载完成后启动游戏
document.addEventListener('DOMContentLoaded', () => {
    // 添加游戏结束弹窗的HTML
    const modalHTML = `
        <div id="game-over-modal">
            <div id="game-over-content">
                <h2>🎱 游戏结束!</h2>
                <div id="final-score">0</div>
                <p>你的最终得分</p>
                <button id="play-again-btn">再玩一次</button>
            </div>
        </div>
    `;
    document.getElementById('ui-layer').innerHTML += modalHTML;
    
    // 创建游戏实例
    new BilliardGame();
});
