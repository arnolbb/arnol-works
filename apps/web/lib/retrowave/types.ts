// ── Game entity types ──────────────────────────────────────────
export interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Invader extends GameObject {
  alive: boolean;
  type: number; // 0: Tank (Purple), 1: Shooter (Cyan), 2: Dasher (Yellow), 3: Basic (Pink)
  hp: number;
  maxHp: number;
  dashTimer: number;
}

export interface Bullet extends GameObject {
  active: boolean;
  dy: number;
  isEnemy: boolean;
  damage: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  size: number;
}

export type PowerUpType = 'SHIELD' | 'DOUBLE' | 'RAPID' | 'LIFE' | 'LASER';

export interface PowerUp extends GameObject {
  type: PowerUpType;
  active: boolean;
}

export interface UFO extends GameObject {
  vx: number;
  active: boolean;
}

export interface Boss extends GameObject {
  hp: number;
  maxHp: number;
  vx: number;
  direction: number;
  shootCooldown: number;
  pattern: number;  // 0: Spread, 1: Burst
  patternTimer: number;
}

export interface ScorePopup {
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  timer: number;
}

export type GameMode = 'MENU' | 'HOW_TO_PLAY' | 'SETTINGS' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export interface Player {
  x: number;
  y: number;
  lives: number;
  shieldCount: number;
  invincibleTime: number;
  shootCooldown: number;
  doubleShotTime: number;
  rapidFireTime: number;
  laserBeamTime: number;
}

export interface GameState {
  player: Player;
  invaders: Invader[];
  bullets: Bullet[];
  particles: Particle[];
  powerups: PowerUp[];
  scorePopups: ScorePopup[];
  ufo: UFO | null;
  boss: Boss | null;
  direction: number;
  moveTimer: number;
  keys: Record<string, boolean>;
  frame: number;
  score: number;
  wave: number;
  ufoSpawnTimer: number;
  hoveredButton: string | null;
  combo: number;
  comboTimer: number;
  screenShake: number;
}

export interface UIButton {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
}
