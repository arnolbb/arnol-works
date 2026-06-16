// ─── Color Palette ──────────────────────────────────────────────────────────────
// Central source of truth for all canvas-rendered colors.
// Matches CSS custom properties defined in src/index.css (--color-neon-*).
// Changing a value here updates every canvas draw call that references it.

export const COLORS = {
  // Brand neon tokens (mirror CSS --color-neon-*)
  neonPink:   '#FF71CE',
  neonBlue:   '#01CDFE',
  neonGreen:  '#05FFA1',
  neonPurple: '#B967FF',
  neonYellow: '#FFFB96',

  // Utility
  white:      '#FFFFFF',
  black:      '#000000',
  enemyRed:   '#FF5555',

  // Backgrounds & overlays
  overlayDark:     'rgba(11, 1, 20, 0.85)',
  overlayDeep:     'rgba(11, 1, 20, 0.9)',
  overlayMedium:   'rgba(11, 1, 20, 0.8)',
  overlayLight:    'rgba(11, 1, 20, 0.75)',
  overlayFaint:    'rgba(11, 1, 20, 0.7)',
  overlayPanel:    'rgba(11, 1, 20, 0.4)',
  overlayGlass:    'rgba(23, 10, 30, 0.9)',

  // Grid & decorative
  gridLine:        'rgba(185, 103, 255, 0.05)',
  gridLineAccent:  'rgba(185, 103, 255, 0.01)',
  gridAccentBlue:  'rgba(1, 205, 254, 0.15)',

  // Laser beam gradient stops
  laserEdge:       'rgba(5, 255, 161, 0.1)',
  laserCore:       'rgba(1, 205, 254, 0.8)',
  laserGlow:       'rgba(5, 255, 161, 0.2)',

  // Shield
  shieldAura:      'rgba(1, 205, 254, 0.2)',

  // Menu sun gradient stops
  sunTop:          'rgba(255, 113, 206, 0.25)',
  sunBottom:       'rgba(185, 103, 255, 0.01)',
} as const;

// Invader type colors indexed by inv.type
export const INVADER_COLORS = [
  COLORS.neonPurple,  // type 0: Tank
  COLORS.neonBlue,    // type 1: Shooter
  COLORS.neonYellow,  // type 2: Dasher
  COLORS.neonPink,    // type 3: Basic
] as const;

// Base score per invader type
export const INVADER_BASE_SCORES = [40, 20, 30, 10] as const;

// ─── Game Dimensions ────────────────────────────────────────────────────────────

export const BASE_WIDTH = 800;
export const BASE_HEIGHT = 600;

export const INVADER_ROWS = 4;
export const INVADER_COLS = 8;
export const INVADER_WIDTH = 30;
export const INVADER_HEIGHT = 20;

export const PLAYER_WIDTH = 40;
export const PLAYER_HEIGHT = 20;

export const BULLET_WIDTH = 3;
export const BULLET_HEIGHT = 10;

// ─── Game Tuning ────────────────────────────────────────────────────────────────

export const PLAYER_SPEED = 6;
export const BULLET_SPEED_PLAYER = -7;
export const BULLET_SPEED_ENEMY = 4;
export const POWERUP_FALL_SPEED = 2;

export const SHOOT_COOLDOWN = 15;
export const SHOOT_COOLDOWN_RAPID = 7;

export const SHIELD_MAX = 3;
export const LIVES_MAX = 5;
export const LIVES_START = 3;

export const DOUBLE_SHOT_DURATION = 480;   // 8 seconds at 60fps
export const RAPID_FIRE_DURATION = 480;
export const LASER_BEAM_DURATION = 180;    // 3 seconds
export const INVINCIBLE_DURATION = 60;     // 1 second

export const COMBO_TIMER = 180;            // 3 seconds
export const COMBO_THRESHOLDS = { x2: 5, x3: 10, x5: 20 } as const;

export const UFO_SPAWN_MIN = 900;
export const UFO_SPAWN_MAX = 1500;
export const UFO_SPEED = 2.5;

export const BOSS_PATTERN_SWITCH = 200;
export const BOSS_SPREAD_COOLDOWN = 90;
export const BOSS_BURST_COOLDOWN = 80;

export const POWERUP_DROP_CHANCE = 0.15;
export const ENEMY_SHOOT_BASE_CHANCE = 0.007;
export const DASH_TRIGGER_FRAME = 180;
export const DASH_TRIGGER_CHANCE = 0.05;
export const DASH_DROP_PX = 35;

// ─── Power-Up Markers ──────────────────────────────────────────────────────────

export const POWERUP_MARKERS: Record<string, string> = {
  SHIELD: 'S',
  DOUBLE: 'x2',
  RAPID: 'R',
  LIFE: '+',
  LASER: 'L',
};
