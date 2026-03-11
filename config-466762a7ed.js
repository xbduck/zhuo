// 游戏配置文件
const CONFIG = {
    // 画布尺寸
    CANVAS_WIDTH: 375,
    CANVAS_HEIGHT: 667,
    
    // 物理参数
    FRICTION: 0.985,           // 摩擦系数
    BALL_RADIUS: 12,          // 球半径
    POCKET_RADIUS: 18,        // 球袋半径
    MIN_VELOCITY: 0.05,       // 最小速度阈值
    
    // 球桌参数
    TABLE_MARGIN: 30,         // 球桌边距
    TABLE_COLOR: '#1a6b3a',   // 球桌颜色
    RAIL_COLOR: '#4a2c0a',    // 边框颜色
    
    // 击球参数
    MAX_POWER: 20,            // 最大击球力度
    POWER_SCALE: 0.5,         // 力度缩放系数
    
    // 分数设置
    POINTS_PER_POCKET: 10     // 每进一球得分
};

// 球的位置配置（15个球的摆放）
const BALL_POSITIONS = [
    // 白球
    { x: 100, y: CONFIG.CANVAS_HEIGHT / 2, color: '#ffffff', isCueBall: true },
    
    // 1号球（黄色）
    { x: CONFIG.CANVAS_WIDTH - 100, y: CONFIG.CANVAS_HEIGHT / 2, color: '#ffff00', number: 1 },
    
    // 前排5个球
    { x: CONFIG.CANVAS_WIDTH - 100 - CONFIG.BALL_RADIUS * 2.2, y: CONFIG.CANVAS_HEIGHT / 2 - CONFIG.BALL_RADIUS * 2.2, color: '#0000ff', number: 2 },
    { x: CONFIG.CANVAS_WIDTH - 100 - CONFIG.BALL_RADIUS * 2.2, y: CONFIG.CANVAS_HEIGHT / 2, color: '#ff0000', number: 3 },
    { x: CONFIG.CANVAS_WIDTH - 100 - CONFIG.BALL_RADIUS * 2.2, y: CONFIG.CANVAS_HEIGHT / 2 + CONFIG.BALL_RADIUS * 2.2, color: '#800080', number: 4 },
    
    // 前排2个球
    { x: CONFIG.CANVAS_WIDTH - 100 - CONFIG.BALL_RADIUS * 4.4, y: CONFIG.CANVAS_HEIGHT / 2 - CONFIG.BALL_RADIUS * 1.1, color: '#ffa500', number: 5 },
    { x: CONFIG.CANVAS_WIDTH - 100 - CONFIG.BALL_RADIUS * 4.4, y: CONFIG.CANVAS_HEIGHT / 2 + CONFIG.BALL_RADIUS * 1.1, color: '#008000', number: 6 },
    
    // 1个球
    { x: CONFIG.CANVAS_WIDTH - 100 - CONFIG.BALL_RADIUS * 6.6, y: CONFIG.CANVAS_HEIGHT / 2, color: '#800000', number: 7 },
    
    // 前排2个球
    { x: CONFIG.CANVAS_WIDTH - 100 - CONFIG.BALL_RADIUS * 8.8, y: CONFIG.CANVAS_HEIGHT / 2 - CONFIG.BALL_RADIUS * 1.1, color: '#000000', number: 8 },
    { x: CONFIG.CANVAS_WIDTH - 100 - CONFIG.BALL_RADIUS * 8.8, y: CONFIG.CANVAS_HEIGHT / 2 + CONFIG.BALL_RADIUS * 1.1, color: '#ffff00', number: 9 },
    
    // 前排5个球
    { x: CONFIG.CANVAS_WIDTH - 100 - CONFIG.BALL_RADIUS * 11, y: CONFIG.CANVAS_HEIGHT / 2 - CONFIG.BALL_RADIUS * 2.2, color: '#0000ff', number: 10 },
    { x: CONFIG.CANVAS_WIDTH - 100 - CONFIG.BALL_RADIUS * 11, y: CONFIG.CANVAS_HEIGHT / 2 - CONFIG.BALL_RADIUS * 0, color: '#ff0000', number: 11 },
    { x: CONFIG.CANVAS_WIDTH - 100 - CONFIG.BALL_RADIUS * 11, y: CONFIG.CANVAS_HEIGHT / 2 + CONFIG.BALL_RADIUS * 2.2, color: '#800080', number: 12 },
    
    // 前排2个球
    { x: CONFIG.CANVAS_WIDTH - 100 - CONFIG.BALL_RADIUS * 13.2, y: CONFIG.CANVAS_HEIGHT / 2 - CONFIG.BALL_RADIUS * 1.1, color: '#ffa500', number: 13 },
    { x: CONFIG.CANVAS_WIDTH - 100 - CONFIG.BALL_RADIUS * 13.2, y: CONFIG.CANVAS_HEIGHT / 2 + CONFIG.BALL_RADIUS * 1.1, color: '#008000', number: 14 },
    
    // 1个球
    { x: CONFIG.CANVAS_WIDTH - 100 - CONFIG.BALL_RADIUS * 15.4, y: CONFIG.CANVAS_HEIGHT / 2, color: '#800000', number: 15 }
];

// 球袋位置配置
const POCKET_POSITIONS = [
    { x: CONFIG.TABLE_MARGIN + 5, y: CONFIG.TABLE_MARGIN + 5 },                    // 左上
    { x: CONFIG.CANVAS_WIDTH / 2, y: CONFIG.TABLE_MARGIN - 5 },                     // 中上
    { x: CONFIG.CANVAS_WIDTH - CONFIG.TABLE_MARGIN - 5, y: CONFIG.TABLE_MARGIN + 5 }, // 右上
    { x: CONFIG.TABLE_MARGIN + 5, y: CONFIG.CANVAS_HEIGHT - CONFIG.TABLE_MARGIN - 5 }, // 左下
    { x: CONFIG.CANVAS_WIDTH / 2, y: CONFIG.CANVAS_HEIGHT - CONFIG.TABLE_MARGIN + 5 }, // 中下
    { x: CONFIG.CANVAS_WIDTH - CONFIG.TABLE_MARGIN - 5, y: CONFIG.CANVAS_HEIGHT - CONFIG.TABLE_MARGIN - 5 } // 右下
];
