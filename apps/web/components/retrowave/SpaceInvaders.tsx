"use client";
import React, { useRef, useEffect, useState, useCallback } from 'react';


import {
  COLORS, INVADER_COLORS, INVADER_BASE_SCORES, POWERUP_MARKERS,
  BASE_WIDTH, BASE_HEIGHT, INVADER_COLS, INVADER_WIDTH, INVADER_HEIGHT,
  PLAYER_WIDTH, PLAYER_HEIGHT, BULLET_WIDTH, BULLET_HEIGHT,
  PLAYER_SPEED, BULLET_SPEED_PLAYER, POWERUP_FALL_SPEED,
  SHOOT_COOLDOWN, SHOOT_COOLDOWN_RAPID, SHIELD_MAX, LIVES_MAX, LIVES_START,
  DOUBLE_SHOT_DURATION, RAPID_FIRE_DURATION, LASER_BEAM_DURATION, INVINCIBLE_DURATION,
  COMBO_TIMER, COMBO_THRESHOLDS, UFO_SPAWN_MIN, UFO_SPAWN_MAX, UFO_SPEED,
  BOSS_PATTERN_SWITCH, BOSS_SPREAD_COOLDOWN, BOSS_BURST_COOLDOWN,
  POWERUP_DROP_CHANCE, ENEMY_SHOOT_BASE_CHANCE, DASH_TRIGGER_FRAME,
  DASH_TRIGGER_CHANCE, DASH_DROP_PX,
} from '@/lib/retrowave/constants';
import type { GameState, Invader, Bullet, Particle, PowerUp, UFO, Boss, ScorePopup } from '@/lib/retrowave/types';
import { SoundManager } from '@/lib/retrowave/SoundManager';

const sounds = new SoundManager();
export default function SpaceInvaders({ onScoreUpdate, highScore }: { onScoreUpdate: (s: number) => void, highScore: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // React State for HUD & Screens
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [wave, setWave] = useState(1);
  const [gameMode, setGameMode] = useState<'MENU' | 'HOW_TO_PLAY' | 'SETTINGS' | 'PLAYING' | 'PAUSED' | 'GAME_OVER'>('MENU');

  // ARIA live region for screen reader announcements
  const [announcement, setAnnouncement] = useState('');
  const prevModeRef = useRef(gameMode);

  // Settings State
  const [sfxOn, setSfxOn] = useState(() => localStorage.getItem('neon-starwave-sfx-enabled') !== 'false');
  const [sfxVolume, setSfxVolume] = useState(() => parseFloat(localStorage.getItem('neon-starwave-sfx-volume') || '0.5'));

  // Sync settings
  useEffect(() => {
    sounds.sfxEnabled = sfxOn;
    localStorage.setItem('neon-starwave-sfx-enabled', sfxOn.toString());
  }, [sfxOn]);

  useEffect(() => {
    sounds.volume = sfxVolume;
    localStorage.setItem('neon-starwave-sfx-volume', sfxVolume.toString());
  }, [sfxVolume]);

  // Announce game state transitions to screen readers
  useEffect(() => {
    if (prevModeRef.current !== gameMode) {
      prevModeRef.current = gameMode;
      const labels: Record<string, string> = {
        MENU: 'Main menu. Use pointer or touch to select an option.',
        HOW_TO_PLAY: 'Controls screen. Move with A, D or arrow keys. Fire with Space. Pause with P.',
        SETTINGS: 'Audio settings screen.',
        PLAYING: 'Game started. Move with arrow keys, fire with Space.',
        PAUSED: 'Game paused.',
        GAME_OVER: 'Game over. Final score: ' + score + '.',
      };
      setAnnouncement(labels[gameMode] ?? gameMode);
    }
  }, [gameMode, score]);

  // Game state ref
  const gameStateRef = useRef<GameState>({
    player: {
      x: 380,
      y: 540,
      lives: 3,
      shieldCount: 0, // max 3 shields
      invincibleTime: 0,
      shootCooldown: 0,
      doubleShotTime: 0,
      rapidFireTime: 0,
      laserBeamTime: 0 // Laser active duration
    },
    invaders: [] as Invader[],
    bullets: [] as Bullet[],
    particles: [] as Particle[],
    powerups: [] as PowerUp[],
    scorePopups: [] as ScorePopup[],
    ufo: null as UFO | null,
    boss: null as Boss | null,
    direction: 1,
    moveTimer: 0,
    keys: {} as Record<string, boolean>,
    frame: 0,
    score: 0,
    wave: 1,
    ufoSpawnTimer: 600,
    hoveredButton: null as string | null,
    combo: 0,
    comboTimer: 0, // Reset after 180 frames (3 seconds)
    screenShake: 0
  });

  const mouseRef = useRef({ x: 0, y: 0 });
  const getPowerupMarker = (type: PowerUp['type']): string => POWERUP_MARKERS[type] ?? '?';

  // Initialize a game wave
  const initWave = useCallback((currentWave: number) => {
    const invaders: Invader[] = [];
    let boss: Boss | null = null;

    if (currentWave % 5 === 0) {
      // Boss Fight (Wave 5, 10, 15...)
      const bossMaxHp = 30 + (currentWave / 5) * 45; // HP scaling
      boss = {
        x: 350,
        y: 80,
        width: 100,
        height: 50,
        hp: bossMaxHp,
        maxHp: bossMaxHp,
        vx: 1.8 + (currentWave / 5) * 0.4, // Speed scaling
        direction: 1,
        shootCooldown: 60,
        pattern: 0,
        patternTimer: 200
      };
    } else {
      // Spawn standard invaders
      const spacingX = 25;
      const spacingY = 20;
      const cols = INVADER_COLS;
      const rows = currentWave >= 3 ? 5 : 4; // Taller grid on Wave 3+
      const totalGridWidth = cols * INVADER_WIDTH + (cols - 1) * spacingX;
      const startX = (BASE_WIDTH - totalGridWidth) / 2;
      const startY = 80;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // Types: 0: Tank (Purple), 1: Shooter (Cyan), 2: Dasher (Yellow), 3: Basic (Pink)
          // Wave manager combinations:
          let invType = 3; // basic pink
          if (currentWave > 1) {
            // Mix in shooter and dasher
            if (r === 0) invType = 0; // Top row tank
            else if (r === 1) invType = 1; // Shooter row
            else if (r === 2 && currentWave >= 3) invType = 2; // Dasher row
          }

          let hp = 1;
          if (invType === 0) hp = 3; // Tank has 3 HP

          invaders.push({
            x: c * (INVADER_WIDTH + spacingX) + startX,
            y: r * (INVADER_HEIGHT + spacingY) + startY,
            width: INVADER_WIDTH,
            height: INVADER_HEIGHT,
            alive: true,
            type: invType,
            hp: hp,
            maxHp: hp,
            dashTimer: 0
          });
        }
      }
    }

    const state = gameStateRef.current;
    state.invaders = invaders;
    state.boss = boss;
    state.bullets = [];
    state.powerups = [];
    state.ufo = null;
    state.direction = 1;
    state.moveTimer = 0;
    state.wave = currentWave;
    setWave(currentWave);

    // Initial shield
    state.player.shieldCount = Math.max(state.player.shieldCount, 1);
    state.player.x = 380;
    state.player.y = 540;
    state.player.invincibleTime = INVINCIBLE_DURATION;
  }, []);

  const resetGame = useCallback(() => {
    const state = gameStateRef.current;
    state.player = {
      x: 380,
      y: 540,
      lives: 3,
      shieldCount: 1,
      invincibleTime: 0,
      shootCooldown: 0,
      doubleShotTime: 0,
      rapidFireTime: 0,
      laserBeamTime: 0
    };
    state.score = 0;
    state.wave = 1;
    state.combo = 0;
    state.comboTimer = 0;
    state.scorePopups = [];
    setScore(0);
    setLives(3);
    setWave(1);
    onScoreUpdate(0);
    initWave(1);
  }, [initWave, onScoreUpdate]);

  const shoot = useCallback(() => {
    const state = gameStateRef.current;
    if (gameMode !== 'PLAYING') return;

    // Laser Beam power-up overrides shooting completely (fires continuously without trigger)
    if (state.player.laserBeamTime > 0) return;
    if (state.player.shootCooldown > 0) return;

    const cooldown = state.player.rapidFireTime > 0 ? SHOOT_COOLDOWN_RAPID : SHOOT_COOLDOWN;
    state.player.shootCooldown = cooldown;

    if (state.player.doubleShotTime > 0) {
      state.bullets.push({
        x: state.player.x + 5 - BULLET_WIDTH / 2,
        y: state.player.y - 5,
        width: BULLET_WIDTH,
        height: BULLET_HEIGHT,
        active: true,
        dy: -9,
        isEnemy: false,
        damage: 1
      });
      state.bullets.push({
        x: state.player.x + PLAYER_WIDTH - 5 - BULLET_WIDTH / 2,
        y: state.player.y - 5,
        width: BULLET_WIDTH,
        height: BULLET_HEIGHT,
        active: true,
        dy: -9,
        isEnemy: false,
        damage: 1
      });
    } else {
      state.bullets.push({
        x: state.player.x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2,
        y: state.player.y - 5,
        width: BULLET_WIDTH,
        height: BULLET_HEIGHT,
        active: true,
        dy: -9,
        isEnemy: false,
        damage: 1
      });
    }

    sounds.playShoot();
  }, [gameMode]);

  // Handle keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const state = gameStateRef.current;
      state.keys[e.code] = true;

      if (e.code === 'Space') {
        e.preventDefault();
        shoot();
      }

      if (e.code === 'KeyP') {
        e.preventDefault();
        if (gameMode === 'PLAYING') {
          setGameMode('PAUSED');
        } else if (gameMode === 'PAUSED') {
          setGameMode('PLAYING');
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const state = gameStateRef.current;
      state.keys[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [shoot, gameMode]);

  // UI Buttons setup for canvas mouse interaction
  const getButtons = useCallback(() => {
    const buttons: { id: string; x: number; y: number; w: number; h: number; label: string; action: () => void }[] = [];

    if (gameMode === 'MENU') {
      buttons.push({
        id: 'play',
        x: 300, y: 260, w: 200, h: 45,
        label: 'START RUN',
        action: () => {
          resetGame();
          setGameMode('PLAYING');
          sounds.playStart();
        }
      });
      buttons.push({
        id: 'how_to_play',
        x: 300, y: 325, w: 200, h: 45,
        label: 'VIEW CONTROLS',
        action: () => {
          setGameMode('HOW_TO_PLAY');
          sounds.playPowerup();
        }
      });
      buttons.push({
        id: 'settings',
        x: 300, y: 390, w: 200, h: 45,
        label: 'AUDIO SETTINGS',
        action: () => {
          setGameMode('SETTINGS');
          sounds.playPowerup();
        }
      });
    } else if (gameMode === 'HOW_TO_PLAY') {
      buttons.push({
        id: 'back_menu',
        x: 300, y: 470, w: 200, h: 45,
        label: 'BACK TO MENU',
        action: () => {
          setGameMode('MENU');
          sounds.playPowerup();
        }
      });
    } else if (gameMode === 'SETTINGS') {
      buttons.push({
        id: 'toggle_sfx',
        x: 300, y: 230, w: 200, h: 45,
        label: sfxOn ? 'SOUND: ON' : 'SOUND: OFF',
        action: () => {
          setSfxOn(!sfxOn);
          sounds.playPowerup();
        }
      });
      buttons.push({
        id: 'vol_down',
        x: 300, y: 335, w: 90, h: 40,
        label: 'VOLUME -',
        action: () => {
          setSfxVolume(prev => Math.max(0, parseFloat((prev - 0.1).toFixed(1))));
          sounds.playPowerup();
        }
      });
      buttons.push({
        id: 'vol_up',
        x: 410, y: 335, w: 90, h: 40,
        label: 'VOLUME +',
        action: () => {
          setSfxVolume(prev => Math.min(1.0, parseFloat((prev + 0.1).toFixed(1))));
          sounds.playPowerup();
        }
      });
      buttons.push({
        id: 'back_menu',
        x: 300, y: 430, w: 200, h: 45,
        label: 'BACK TO MENU',
        action: () => {
          setGameMode('MENU');
          sounds.playPowerup();
        }
      });
    } else if (gameMode === 'PAUSED') {
      buttons.push({
        id: 'resume',
        x: 300, y: 240, w: 200, h: 45,
        label: 'RESUME RUN',
        action: () => {
          setGameMode('PLAYING');
          sounds.playPowerup();
        }
      });
      buttons.push({
        id: 'restart',
        x: 300, y: 305, w: 200, h: 45,
        label: 'RESTART RUN',
        action: () => {
          resetGame();
          setGameMode('PLAYING');
          sounds.playStart();
        }
      });
      buttons.push({
        id: 'back_menu',
        x: 300, y: 370, w: 200, h: 45,
        label: 'BACK TO MENU',
        action: () => {
          setGameMode('MENU');
          sounds.playPowerup();
        }
      });
    } else if (gameMode === 'GAME_OVER') {
      buttons.push({
        id: 'play_again',
        x: 300, y: 360, w: 200, h: 45,
        label: 'PLAY AGAIN',
        action: () => {
          resetGame();
          setGameMode('PLAYING');
          sounds.playStart();
        }
      });
      buttons.push({
        id: 'back_menu',
        x: 300, y: 425, w: 200, h: 45,
        label: 'BACK TO MENU',
        action: () => {
          setGameMode('MENU');
          sounds.playPowerup();
        }
      });
    }

    return buttons;
  }, [gameMode, sfxOn, sfxVolume, resetGame]);

  // Canvas interaction event handlers
  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * BASE_WIDTH;
    const my = ((e.clientY - rect.top) / rect.height) * BASE_HEIGHT;
    mouseRef.current = { x: mx, y: my };

    // Update hovered button
    const buttons = getButtons();
    let hovered: string | null = null;
    for (const b of buttons) {
      if (mx >= b.x && mx <= b.x + b.w && my >= b.y && my <= b.y + b.h) {
        hovered = b.id;
        break;
      }
    }
    gameStateRef.current.hoveredButton = hovered;
  };

  const handleCanvasDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * BASE_WIDTH;
    const my = ((e.clientY - rect.top) / rect.height) * BASE_HEIGHT;

    const buttons = getButtons();
    for (const b of buttons) {
      if (mx >= b.x && mx <= b.x + b.w && my >= b.y && my <= b.y + b.h) {
        b.action();
        break;
      }
    }
  };
  // Main Loop logic inside useEffect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const loop = () => {
      if (gameMode === 'PLAYING') {
        update();
      }
      draw();
      animationFrameId = requestAnimationFrame(loop);
    };

    const spawnExplosion = (x: number, y: number, color: string, count = 12) => {
      const state = gameStateRef.current;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        state.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          alpha: 1.0,
          size: Math.random() * 3 + 1
        });
      }
    };

    const triggerEnemyDestroyed = (inv: Invader, ix: number, iy: number, multiplier: number) => {
      const state = gameStateRef.current;
      
      const baseScore = INVADER_BASE_SCORES[inv.type % INVADER_BASE_SCORES.length];
      const points = baseScore * multiplier;

      state.score += points;
      setScore(state.score);
      onScoreUpdate(state.score);

      // Using imported INVADER_COLORS
      const color = INVADER_COLORS[inv.type % INVADER_COLORS.length];

      state.scorePopups.push({
        x: ix + inv.width / 2,
        y: iy,
        text: `+${points}`,
        color,
        alpha: 1.0,
        timer: 60
      });

      state.combo++;
      state.comboTimer = COMBO_TIMER;

      sounds.playExplosion();
      spawnExplosion(ix + inv.width / 2, iy + inv.height / 2, color, 12);

      // Power-Up Drop System
      const dropChance = 0.15;
      if (Math.random() < dropChance) {
        const rand = Math.random();
        let pType: 'SHIELD' | 'DOUBLE' | 'RAPID' | 'LIFE' | 'LASER' = 'SHIELD';

        if (rand < 0.3) pType = 'SHIELD';
        else if (rand < 0.55) pType = 'DOUBLE';
        else if (rand < 0.8) pType = 'RAPID';
        else if (rand < 0.9) pType = 'LASER';
        else pType = 'LIFE';

        state.powerups.push({
          x: ix + inv.width / 2 - 7.5,
          y: iy + inv.height,
          width: 15,
          height: 15,
          type: pType,
          active: true
        });
      }
    };

    const triggerBossDefeated = (boss: Boss, multiplier: number) => {
      const state = gameStateRef.current;
      sounds.playExplosion();
      state.screenShake = 30;
      spawnExplosion(boss.x + boss.width / 2, boss.y + boss.height / 2, COLORS.enemyRed, 50);

      const bossScoreReward = (state.wave / 5) * 500 * multiplier;
      state.score += bossScoreReward;
      setScore(state.score);
      onScoreUpdate(state.score);

      state.scorePopups.push({
        x: boss.x + boss.width / 2,
        y: boss.y + boss.height / 2,
        text: `+${bossScoreReward} BOSS BONUS`,
        color: COLORS.enemyRed,
        alpha: 1.0,
        timer: 100
      });

      state.combo += 10;
      state.comboTimer = 250;
    };

    const triggerPlayerHit = () => {
      const state = gameStateRef.current;
      if (state.player.invincibleTime > 0) return;

      // Reset combo on damage
      state.combo = 0;
      state.comboTimer = 0;
      state.screenShake = 15; // Shake screen on player hit

      if (state.player.shieldCount > 0) {
        state.player.shieldCount--;
        state.player.invincibleTime = 90; // 1.5 seconds immune
        sounds.playExplosion();
        spawnExplosion(state.player.x + PLAYER_WIDTH / 2, state.player.y + PLAYER_HEIGHT / 2, COLORS.neonBlue, 20);
      } else {
        state.player.lives--;
        setLives(state.player.lives);
        sounds.playExplosion();
        spawnExplosion(state.player.x + PLAYER_WIDTH / 2, state.player.y + PLAYER_HEIGHT / 2, COLORS.neonPink, 35);

        if (state.player.lives <= 0) {
          setGameMode('GAME_OVER');
          sounds.playGameOver();
        } else {
          state.player.invincibleTime = 120; // 2 seconds immune
          state.player.x = 380; // Reposition safely
          state.bullets = []; // Clear bullets for fairness
        }
      }
    };

    const update = () => {
      const state = gameStateRef.current;
      state.frame++;

      // Screen shake decay
      if (state.screenShake > 0.1) {
        state.screenShake *= 0.9;
      }

      // Update Cooldowns & Power-up timers
      if (state.player.shootCooldown > 0) state.player.shootCooldown--;
      if (state.player.invincibleTime > 0) state.player.invincibleTime--;
      if (state.player.doubleShotTime > 0) state.player.doubleShotTime--;
      if (state.player.rapidFireTime > 0) state.player.rapidFireTime--;
      if (state.player.laserBeamTime > 0) state.player.laserBeamTime--;

      // Combo timer decay
      if (state.comboTimer > 0) {
        state.comboTimer--;
        if (state.comboTimer <= 0) {
          state.combo = 0; // reset combo
        }
      }

      // Calculate score multiplier
      let multiplier = 1;
      if (state.combo >= COMBO_THRESHOLDS.x2 && state.combo < COMBO_THRESHOLDS.x3) multiplier = 1.5;
      else if (state.combo >= COMBO_THRESHOLDS.x3 && state.combo < COMBO_THRESHOLDS.x5) multiplier = 2;
      else if (state.combo >= COMBO_THRESHOLDS.x5) multiplier = 3;

      // Move Player
      if (state.keys['ArrowLeft'] || state.keys['KeyA']) state.player.x -= PLAYER_SPEED;
      if (state.keys['ArrowRight'] || state.keys['KeyD']) state.player.x += PLAYER_SPEED;
      state.player.x = Math.max(0, Math.min(BASE_WIDTH - PLAYER_WIDTH, state.player.x));

      // Move Bullets
      state.bullets.forEach((b) => {
        b.y += b.dy;
        if (b.y < 0 || b.y > BASE_HEIGHT) b.active = false;
      });
      state.bullets = state.bullets.filter(b => b.active);

      // Move Power-Ups
      state.powerups.forEach((p) => {
        p.y += POWERUP_FALL_SPEED;
        if (p.y > BASE_HEIGHT) p.active = false;

        // Collect Power-up
        if (p.active &&
            p.x < state.player.x + PLAYER_WIDTH &&
            p.x + p.width > state.player.x &&
            p.y < state.player.y + PLAYER_HEIGHT &&
            p.y + p.height > state.player.y) {
          p.active = false;
          sounds.playPowerup();
          if (p.type === 'SHIELD') {
            state.player.shieldCount = Math.min(SHIELD_MAX, state.player.shieldCount + 1);
          } else if (p.type === 'DOUBLE') {
            state.player.doubleShotTime = DOUBLE_SHOT_DURATION; // 8 seconds (480 frames)
          } else if (p.type === 'RAPID') {
            state.player.rapidFireTime = RAPID_FIRE_DURATION; // 8 seconds
          } else if (p.type === 'LIFE') {
            state.player.lives = Math.min(LIVES_MAX, state.player.lives + 1);
            setLives(state.player.lives);
          } else if (p.type === 'LASER') {
            state.player.laserBeamTime = LASER_BEAM_DURATION; // 3 seconds (180 frames)
          }
        }
      });
      state.powerups = state.powerups.filter(p => p.active);

      // Update Particles
      state.particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.02;
      });
      state.particles = state.particles.filter(p => p.alpha > 0);

      // Update Score Popups
      state.scorePopups.forEach((pop) => {
        pop.y -= 0.8;
        pop.timer--;
        if (pop.timer < 15) {
          pop.alpha -= 0.06;
        }
      });
      state.scorePopups = state.scorePopups.filter(pop => pop.timer > 0);

      // Spawn and Move Special UFO
      state.ufoSpawnTimer--;
      if (state.ufoSpawnTimer <= 0) {
        state.ufoSpawnTimer = 900 + Math.random() * 600;
        const fromLeft = Math.random() > 0.5;
        state.ufo = {
          x: fromLeft ? -40 : BASE_WIDTH,
          y: 45,
          width: 40,
          height: 18,
          vx: fromLeft ? 2.5 : -2.5,
          active: true
        };
      }

      if (state.ufo) {
        state.ufo.x += state.ufo.vx;
        if (state.ufo.x < -50 || state.ufo.x > BASE_WIDTH + 50) {
          state.ufo = null;
        }
      }

      // Move Boss Unit (Wave 5, 10, 15...)
      if (state.boss) {
        const boss = state.boss;
        boss.x += boss.vx * boss.direction;
        if (boss.x <= 20 || boss.x >= BASE_WIDTH - boss.width - 20) {
          boss.direction *= -1;
          boss.y += 3;
        }

        // Switch patterns every 200 frames
        boss.patternTimer--;
        if (boss.patternTimer <= 0) {
          boss.patternTimer = 200;
          boss.pattern = boss.pattern === 0 ? 1 : 0;
        }

        // Boss Shoot Logic
        boss.shootCooldown--;
        if (boss.shootCooldown <= 0) {
          sounds.playInvaderShoot();

          if (boss.pattern === 0) {
            // Pattern 1: Spread Shot (5 bullets)
            boss.shootCooldown = 90;
            const spread = [-2, -1, 0, 1, 2];
            spread.forEach(dirX => {
              state.bullets.push({
                x: boss.x + boss.width / 2 - BULLET_WIDTH / 2,
                y: boss.y + boss.height,
                width: BULLET_WIDTH,
                height: BULLET_HEIGHT,
                active: true,
                dy: 4,
                isEnemy: true,
                damage: 1
              });
              const b = state.bullets[state.bullets.length - 1];
              (b as any).dx = dirX;
            });
          } else {
            // Pattern 2: Burst Shot (4 rapid inline bullets)
            boss.shootCooldown = 80;
            for (let i = 0; i < 4; i++) {
              setTimeout(() => {
                if (gameMode !== 'PLAYING' || !state.boss) return;
                state.bullets.push({
                  x: boss.x + boss.width / 2 - BULLET_WIDTH / 2,
                  y: boss.y + boss.height,
                  width: BULLET_WIDTH,
                  height: BULLET_HEIGHT,
                  active: true,
                  dy: 5.5,
                  isEnemy: true,
                  damage: 1
                });
                sounds.playInvaderShoot();
              }, i * 150);
            }
          }
        }
      }

      // Move Normal Invaders
      if (!state.boss) {
        state.moveTimer++;
        const aliveInvadersCount = state.invaders.filter(inv => inv.alive).length;
        const speed = Math.max(4, 6 + Math.floor(aliveInvadersCount * 0.9));
        if (state.moveTimer > speed) {
          state.moveTimer = 0;
          let edge = false;

          state.invaders.forEach(inv => {
            if (!inv.alive) return;

            // Dasher Enemy logic: occasionally drop faster
            if (inv.type === 2) {
              inv.dashTimer++;
              if (inv.dashTimer > 180 && Math.random() < 0.05) {
                inv.dashTimer = 0;
                inv.y += 35; // rapid drop
                spawnExplosion(inv.x + inv.width/2, inv.y, COLORS.neonYellow, 4);
                if (inv.y > state.player.y - 20) {
                  triggerPlayerHit();
                }
              }
            }

            inv.x += 10 * state.direction;
            if (inv.x > BASE_WIDTH - INVADER_WIDTH || inv.x < 0) edge = true;
          });

          if (edge) {
            state.direction *= -1;
            state.invaders.forEach(inv => {
              if (!inv.alive) return;
              inv.y += 12;
              if (inv.y > state.player.y - 20) {
                triggerPlayerHit();
              }
            });
          }
        }

        // Invader Shooting Logic
        const difficultyScale = 1.0 + (state.wave - 1) * 0.25;
        const shootChance = 0.007 * difficultyScale;
        if (state.bullets.filter(b => b.isEnemy).length < 4 + state.wave && Math.random() < shootChance) {
          const aliveInvaders = state.invaders.filter(inv => inv.alive);
          if (aliveInvaders.length > 0) {
            const randomInvader = aliveInvaders[Math.floor(Math.random() * aliveInvaders.length)];
            const isShooter = randomInvader.type === 1;

            state.bullets.push({
              x: randomInvader.x + INVADER_WIDTH / 2 - BULLET_WIDTH / 2,
              y: randomInvader.y + INVADER_HEIGHT,
              width: BULLET_WIDTH,
              height: BULLET_HEIGHT,
              active: true,
              dy: (isShooter ? 4.5 : 3.5) + (state.wave * 0.15),
              isEnemy: true,
              damage: 1
            });
            sounds.playInvaderShoot();
          }
        }
      }

      // Diagonal bullets support
      state.bullets.forEach(b => {
        if ((b as any).dx !== undefined) {
          b.x += (b as any).dx;
        }
      });

      // 13. Continuous Laser Beam active check
      if (state.player.laserBeamTime > 0) {
        const laserX = state.player.x + PLAYER_WIDTH / 2;
        if (state.frame % 8 === 0) {
          // Check standard invaders
          state.invaders.forEach(inv => {
            if (inv.alive && laserX >= inv.x && laserX <= inv.x + inv.width) {
              inv.hp--;
              spawnExplosion(inv.x + inv.width/2, inv.y + inv.height/2, COLORS.neonGreen, 3);
              if (inv.hp <= 0) {
                inv.alive = false;
                triggerEnemyDestroyed(inv, inv.x, inv.y, multiplier);
              }
            }
          });

          // Check Boss
          if (state.boss && laserX >= state.boss.x && laserX <= state.boss.x + state.boss.width) {
            state.boss.hp--;
            state.screenShake = 3;
            spawnExplosion(laserX, state.boss.y + state.boss.height, COLORS.neonGreen, 4);
            if (state.boss.hp <= 0) {
              triggerBossDefeated(state.boss, multiplier);
              state.boss = null;
            }
          }

          // Check UFO
          if (state.ufo && state.ufo.active && laserX >= state.ufo.x && laserX <= state.ufo.x + state.ufo.width) {
            state.ufo = null;
            sounds.playExplosion();
            spawnExplosion(laserX, 45, COLORS.neonYellow, 20);

            const pointsGained = 100 * multiplier;
            state.score += pointsGained;
            setScore(state.score);
            onScoreUpdate(state.score);

            state.scorePopups.push({
              x: laserX,
              y: 45,
              text: `+${pointsGained}`,
              color: COLORS.neonYellow,
              alpha: 1.0,
              timer: 60
            });
          }
        }
      }

      // Player Bullet collisions with targets
      state.bullets.forEach(b => {
        if (b.isEnemy) return;

        // Hit standard invaders
        state.invaders.forEach(inv => {
          if (inv.alive && b.x < inv.x + inv.width && b.x + b.width > inv.x && b.y < inv.y + inv.height && b.y + b.height > inv.y) {
            b.active = false;
            inv.hp -= b.damage;
            spawnExplosion(b.x, b.y, COLORS.neonGreen, 3);

            if (inv.hp <= 0) {
              inv.alive = false;
              triggerEnemyDestroyed(inv, inv.x, inv.y, multiplier);
            }
          }
        });

        // Hit special UFO
        if (state.ufo && state.ufo.active && b.x < state.ufo.x + state.ufo.width && b.x + b.width > state.ufo.x && b.y < state.ufo.y + state.ufo.height && b.y + b.height > state.ufo.y) {
          b.active = false;
          state.ufo = null;
          sounds.playExplosion();
          spawnExplosion(b.x, b.y, COLORS.neonYellow, 30);

          const pointsGained = 100 * multiplier;
          state.score += pointsGained;
          setScore(state.score);
          onScoreUpdate(state.score);

          state.scorePopups.push({
            x: b.x,
            y: b.y,
            text: `+${pointsGained}`,
            color: COLORS.neonYellow,
            alpha: 1.0,
            timer: 60
          });

          state.combo += 2;
          state.comboTimer = COMBO_TIMER;
        }

        // Hit Boss
        if (state.boss && b.x < state.boss.x + state.boss.width && b.x + b.width > state.boss.x && b.y < state.boss.y + state.boss.height && b.y + b.height > state.boss.y) {
          b.active = false;
          state.boss.hp -= b.damage;
          spawnExplosion(b.x, b.y, COLORS.neonGreen, 5);

          if (state.boss.hp <= 0) {
            triggerBossDefeated(state.boss, multiplier);
            state.boss = null;
          }
        }
      });

      // Enemy Bullet collisions with player
      state.bullets.forEach(b => {
        if (!b.isEnemy) return;
        if (b.active &&
            b.x < state.player.x + PLAYER_WIDTH &&
            b.x + b.width > state.player.x &&
            b.y < state.player.y + PLAYER_HEIGHT &&
            b.y + b.height > state.player.y) {
          b.active = false;
          triggerPlayerHit();
        }
      });

      // Check Wave Clear
      if (state.boss === null && state.invaders.length > 0 && state.invaders.every(i => !i.alive)) {
        initWave(state.wave + 1);
      }
    };

    const drawInvader = (inv: Invader) => {
      
      const color = INVADER_COLORS[inv.type % INVADER_COLORS.length];
      ctx.shadowColor = color;
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;

      const x = inv.x;
      const y = inv.y;
      const w = inv.width;
      const h = inv.height;

      ctx.beginPath();
      if (inv.type === 0) {
        ctx.moveTo(x + 2, y + 2);
        ctx.lineTo(x + w - 2, y + 2);
        ctx.lineTo(x + w, y + h - 5);
        ctx.lineTo(x + w - 10, y + h);
        ctx.lineTo(x + 10, y + h);
        ctx.lineTo(x, y + h - 5);
      } else if (inv.type === 1) {
        ctx.moveTo(x + w/2, y);
        ctx.lineTo(x + w, y + h - 6);
        ctx.lineTo(x + w - 6, y + h);
        ctx.lineTo(x + w/2, y + h - 4);
        ctx.lineTo(x + 6, y + h);
        ctx.lineTo(x, y + h - 6);
      } else if (inv.type === 2) {
        ctx.moveTo(x + 6, y);
        ctx.lineTo(x + w - 6, y);
        ctx.lineTo(x + w, y + h/2);
        ctx.lineTo(x + w - 3, y + h);
        ctx.lineTo(x + w/2, y + h - 5);
        ctx.lineTo(x + 3, y + h);
        ctx.lineTo(x, y + h/2);
      } else {
        ctx.moveTo(x + w/2, y);
        ctx.lineTo(x + w, y + h/3);
        ctx.lineTo(x + w - 4, y + h);
        ctx.lineTo(x + w/2 + 2, y + h/2);
        ctx.lineTo(x + w/2 - 2, y + h/2);
        ctx.lineTo(x + 4, y + h);
        ctx.lineTo(x, y + h/3);
      }
      ctx.closePath();
      ctx.fill();

      if (inv.type === 0 && inv.hp > 0) {
        ctx.fillStyle = COLORS.white;
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(inv.hp.toString(), x + w/2, y + h - 6);
      }

      ctx.fillStyle = COLORS.black;
      ctx.shadowColor = 'transparent';
      ctx.fillRect(x + 6, y + 6, 3, 3);
      ctx.fillRect(x + w - 9, y + 6, 3, 3);
    };
    const drawButton = (btn: { id: string; x: number; y: number; w: number; h: number; label: string }) => {
      const state = gameStateRef.current;
      const isHovered = state.hoveredButton === btn.id;

      ctx.save();
      ctx.shadowBlur = isHovered ? 15 : 6;
      ctx.shadowColor = isHovered ? COLORS.neonGreen : COLORS.neonPurple;
      ctx.fillStyle = COLORS.overlayMedium;
      ctx.strokeStyle = isHovered ? COLORS.neonGreen : COLORS.neonPurple;
      ctx.lineWidth = isHovered ? 3 : 2;

      ctx.beginPath();
      ctx.roundRect(btn.x, btn.y, btn.w, btn.h, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isHovered ? COLORS.neonGreen : COLORS.white;
      ctx.shadowColor = 'transparent';
      ctx.font = 'bold 12px "JetBrains Mono", Courier, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(btn.label, btn.x + btn.w / 2, btn.y + btn.h / 2);
      ctx.restore();
    };

    const draw = () => {
      const state = gameStateRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      // Screen shake
      if (state.screenShake > 0.1) {
        const dx = (Math.random() - 0.5) * state.screenShake;
        const dy = (Math.random() - 0.5) * state.screenShake;
        ctx.translate(dx, dy);
      }

      // Grid
      ctx.strokeStyle = COLORS.gridLine;
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 30) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Particles
      state.particles.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        ctx.restore();
      });

      if (gameMode === 'PLAYING' || gameMode === 'PAUSED') {
        // Laser Beam
        if (state.player.laserBeamTime > 0) {
          ctx.save();
          const laserX = state.player.x + PLAYER_WIDTH / 2;
          const beamWidth = 16 + Math.sin(state.frame * 0.8) * 4;
          const grad = ctx.createLinearGradient(laserX - beamWidth/2, 0, laserX + beamWidth/2, 0);
          grad.addColorStop(0, COLORS.laserEdge);
          grad.addColorStop(0.3, COLORS.laserCore);
          grad.addColorStop(0.5, COLORS.white);
          grad.addColorStop(0.7, COLORS.laserCore);
          grad.addColorStop(1, COLORS.laserEdge);

          ctx.shadowBlur = 20;
          ctx.shadowColor = COLORS.neonBlue;
          ctx.fillStyle = grad;
          ctx.fillRect(laserX - beamWidth / 2, 0, beamWidth, state.player.y);
          ctx.restore();
        }

        // Ship
        const isBlinking = state.player.invincibleTime > 0 && Math.floor(state.player.invincibleTime / 6) % 2 === 0;
        if (!isBlinking) {
          ctx.save();
          ctx.shadowColor = COLORS.neonPink;
          ctx.shadowBlur = 12;
          ctx.fillStyle = COLORS.neonPink;

          ctx.beginPath();
          ctx.moveTo(state.player.x + PLAYER_WIDTH / 2, state.player.y);
          ctx.lineTo(state.player.x + PLAYER_WIDTH, state.player.y + PLAYER_HEIGHT);
          ctx.lineTo(state.player.x + PLAYER_WIDTH - 8, state.player.y + PLAYER_HEIGHT - 4);
          ctx.lineTo(state.player.x + 8, state.player.y + PLAYER_HEIGHT - 4);
          ctx.lineTo(state.player.x, state.player.y + PLAYER_HEIGHT);
          ctx.closePath();
          ctx.fill();

          const thrusterSize = 4 + Math.sin(state.frame * 0.5) * 3;
          ctx.shadowColor = COLORS.neonGreen;
          ctx.fillStyle = COLORS.neonGreen;
          ctx.fillRect(state.player.x + PLAYER_WIDTH / 2 - 2, state.player.y + PLAYER_HEIGHT - 2, 4, thrusterSize);

          if (state.player.shieldCount > 0) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = COLORS.neonBlue;
            ctx.lineWidth = 1.5 + state.player.shieldCount * 0.8;
            ctx.strokeStyle = `rgba(1, 205, 254, ${0.4 + state.player.shieldCount * 0.2})`;
            ctx.beginPath();
            ctx.arc(state.player.x + PLAYER_WIDTH / 2, state.player.y + PLAYER_HEIGHT / 2, PLAYER_WIDTH - 5, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.restore();
        }

        // Bullets
        state.bullets.forEach(b => {
          ctx.save();
          ctx.shadowBlur = 8;
          ctx.shadowColor = b.isEnemy ? COLORS.enemyRed : COLORS.neonGreen;
          ctx.fillStyle = b.isEnemy ? COLORS.enemyRed : COLORS.neonGreen;
          ctx.fillRect(b.x, b.y, b.width, b.height);

          ctx.globalAlpha = 0.35;
          ctx.fillRect(b.x, b.y + (b.isEnemy ? -4 : 4), b.width, b.height);
          ctx.restore();
        });

        // Power-Ups
        state.powerups.forEach(p => {
          ctx.save();
          let color: string = COLORS.neonYellow;
          if (p.type === 'SHIELD') color = COLORS.neonBlue;
          if (p.type === 'DOUBLE') color = COLORS.neonPurple;
          if (p.type === 'RAPID') color = COLORS.neonGreen;
          if (p.type === 'LASER') color = COLORS.neonGreen;

          ctx.shadowBlur = 10;
          ctx.shadowColor = color;
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.5;
          ctx.fillStyle = COLORS.overlayFaint;

          ctx.beginPath();
          ctx.roundRect(p.x, p.y, p.width, p.height, 3);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = COLORS.white;
          ctx.shadowColor = 'transparent';
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(getPowerupMarker(p.type), p.x + p.width / 2, p.y + p.height / 2);
          ctx.restore();
        });

        // Special UFO
        if (state.ufo && state.ufo.active) {
          ctx.save();
          ctx.shadowBlur = 12;
          ctx.shadowColor = COLORS.neonYellow;
          ctx.fillStyle = COLORS.neonYellow;
          ctx.beginPath();
          ctx.ellipse(state.ufo.x + 20, state.ufo.y + 9, 20, 6, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(state.ufo.x + 20, state.ufo.y + 6, 8, Math.PI, 0);
          ctx.fill();
          ctx.restore();
        }

        // Boss unit
        if (state.boss) {
          const boss = state.boss;
          ctx.save();
          ctx.shadowBlur = 15;
          ctx.shadowColor = COLORS.enemyRed;
          ctx.strokeStyle = COLORS.enemyRed;
          ctx.fillStyle = COLORS.overlayGlass;
          ctx.lineWidth = 3;

          ctx.beginPath();
          ctx.moveTo(boss.x + boss.width / 2, boss.y);
          ctx.lineTo(boss.x + boss.width, boss.y + 30);
          ctx.lineTo(boss.x + boss.width - 20, boss.y + boss.height);
          ctx.lineTo(boss.x + 20, boss.y + boss.height);
          ctx.lineTo(boss.x, boss.y + 30);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = COLORS.neonGreen;
          ctx.fillRect(boss.x + 30, boss.y + 20, 10, 8);
          ctx.fillRect(boss.x + boss.width - 40, boss.y + 20, 10, 8);

          ctx.restore();
          ctx.save();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.fillRect(250, 60, 300, 12);
          ctx.fillStyle = COLORS.enemyRed;
          ctx.shadowColor = COLORS.enemyRed;
          ctx.shadowBlur = 8;
          ctx.fillRect(250, 60, (boss.hp / boss.maxHp) * 300, 12);
          ctx.font = 'bold 9px "JetBrains Mono"';
          ctx.fillStyle = COLORS.white;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`BOSS LEVEL ${Math.floor(state.wave/5)}: ${boss.hp}/${boss.maxHp} HP`, 400, 66);
          ctx.restore();
        }

        // Invaders
        state.invaders.forEach(inv => {
          if (!inv.alive) return;
          drawInvader(inv);
        });

        // Floating Popups
        state.scorePopups.forEach(pop => {
          ctx.save();
          ctx.globalAlpha = pop.alpha;
          ctx.fillStyle = pop.color;
          ctx.shadowColor = pop.color;
          ctx.shadowBlur = 6;
          ctx.font = 'bold 11px "JetBrains Mono", Courier, monospace';
          ctx.textAlign = 'center';
          ctx.fillText(pop.text, pop.x, pop.y);
          ctx.restore();
        });

        // HUD Text
        ctx.save();
        ctx.fillStyle = COLORS.neonBlue;
        ctx.shadowColor = COLORS.neonBlue;
        ctx.shadowBlur = 8;
        ctx.font = 'bold 12px "JetBrains Mono", Courier, monospace';

        ctx.textAlign = 'left';
        ctx.fillText(`SCORE: ${String(state.score).padStart(6, '0')}`, 20, 30);

        ctx.fillStyle = COLORS.neonYellow;
        ctx.shadowColor = COLORS.neonYellow;
        ctx.textAlign = 'center';
        ctx.fillText(`WAVE: ${state.wave}`, 400, 30);

        ctx.fillStyle = COLORS.neonPink;
        ctx.shadowColor = COLORS.neonPink;
        ctx.textAlign = 'right';
        ctx.fillText(`HIGH: ${String(highScore).padStart(6, '0')}`, 780, 30);

        let activePowerupText = '';
        if (state.player.doubleShotTime > 0) activePowerupText += `[DOUBLE SHOT: ${Math.ceil(state.player.doubleShotTime / 60)}s]  `;
        if (state.player.rapidFireTime > 0) activePowerupText += `[RAPID FIRE: ${Math.ceil(state.player.rapidFireTime / 60)}s]  `;
        if (state.player.laserBeamTime > 0) activePowerupText += `[LASER BEAM: ${Math.ceil(state.player.laserBeamTime / 60)}s]  `;
        if (state.player.shieldCount > 0) activePowerupText += `[SHIELDS: ${state.player.shieldCount}/3]`;
        if (activePowerupText) {
          ctx.fillStyle = COLORS.neonGreen;
          ctx.shadowColor = COLORS.neonGreen;
          ctx.textAlign = 'left';
          ctx.fillText(activePowerupText, 20, 580);
        }

        if (state.combo > 0) {
          const multText = state.combo >= 20 ? "3.0" : state.combo >= 10 ? "2.0" : state.combo >= 5 ? "1.5" : "1.0";
          ctx.fillStyle = COLORS.neonBlue;
          ctx.shadowColor = COLORS.neonBlue;
          ctx.textAlign = 'center';
          ctx.fillText(`COMBO x${state.combo} (${multText}x MULTIPLIER)`, 400, 580);

          ctx.fillStyle = COLORS.gridAccentBlue;
          ctx.fillRect(350, 588, 100, 3);
          ctx.fillStyle = COLORS.neonBlue;
          ctx.fillRect(350, 588, (state.comboTimer / 180) * 100, 3);
        }

        ctx.textAlign = 'right';
        ctx.fillStyle = COLORS.neonPink;
        ctx.shadowColor = COLORS.neonPink;
        ctx.fillText('LIVES: ', 710, 580);
        for (let l = 0; l < state.player.lives; l++) {
          ctx.fillStyle = COLORS.neonPink;
          ctx.fillRect(720 + l * 15, 570, 10, 10);
        }
        ctx.restore();
      }

      ctx.restore();

      if (gameMode === 'MENU') {
        ctx.save();
        ctx.fillStyle = COLORS.overlayPanel;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.shadowColor = 'transparent';
        const sunGlow = ctx.createLinearGradient(0, 50, 0, 250);
        sunGlow.addColorStop(0, COLORS.neonPink);
        sunGlow.addColorStop(1, COLORS.sunBottom);
        ctx.fillStyle = sunGlow;
        ctx.beginPath();
        ctx.arc(400, 170, 90, 0, Math.PI, true);
        ctx.fill();

        ctx.shadowColor = COLORS.neonPink;
        ctx.shadowBlur = 15;
        ctx.fillStyle = COLORS.white;
        ctx.font = 'italic bold 48px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('RETROWAVE', 400, 140);

        ctx.shadowColor = COLORS.neonBlue;
        ctx.shadowBlur = 10;
        ctx.fillStyle = COLORS.neonBlue;
        ctx.font = '11px "JetBrains Mono", Courier, monospace';
        ctx.fillText('NEON ARCADE DEFENSE', 400, 185);
        ctx.restore();
      }

      else if (gameMode === 'HOW_TO_PLAY') {
        ctx.save();
        ctx.fillStyle = COLORS.overlayDark;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.shadowColor = COLORS.neonBlue;
        ctx.shadowBlur = 12;
        ctx.fillStyle = COLORS.neonBlue;
        ctx.font = 'bold 28px "Space Grotesk"';
        ctx.textAlign = 'center';
        ctx.fillText('CONTROLS', 400, 100);

        ctx.shadowColor = 'transparent';
        ctx.fillStyle = COLORS.white;
        ctx.font = '13px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';

        const lines = [
          '[A / D] or [â† / â†’]    : MOVE LEFT AND RIGHT',
          '[SPACEBAR]           : FIRE',
          '[P]                  : PAUSE OR RESUME',
          '',
          '--- TARGET VALUES & POINTS ---',
          'PINK ALIEN: 10 PTS   |   CYAN ALIEN: 20 PTS',
          'YELLOW ALIEN: 30 PTS |   PURPLE ALIEN: 40 PTS',
          'GOLDEN UFO: 100 PTS  (SPAWNS RANDOMLY)',
          'EVERY 5TH WAVE: DEFEAT THE BOSS FOR A BONUS',
          '',
          '--- POWER-UPS DROPPED BY ENEMIES ---',
          '[S] SHIELD: ABSORBS 1 HIT | [D] DOUBLE SHOT: 8 SECS',
          '[R] RAPID FIRE: 8 SECS    | [+] EXTRA LIFE: +1 LIFE',
          '[L] LASER BEAM: 3 SECS OF VERTICAL DAMAGE'
        ];

        lines.forEach((l, idx) => {
          ctx.fillText(l, 400, 150 + idx * 22);
        });
        ctx.restore();
      }

      else if (gameMode === 'SETTINGS') {
        ctx.save();
        ctx.fillStyle = COLORS.overlayDark;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.shadowColor = COLORS.neonPurple;
        ctx.shadowBlur = 12;
        ctx.fillStyle = COLORS.neonPurple;
        ctx.font = 'bold 28px "Space Grotesk"';
        ctx.textAlign = 'center';
        ctx.fillText('AUDIO SETTINGS', 400, 100);

        ctx.shadowColor = 'transparent';
        ctx.fillStyle = COLORS.white;
        ctx.font = '14px "JetBrains Mono", monospace';

        ctx.fillText(`GAME SOUND VOLUME: ${Math.round(sfxVolume * 100)}%`, 400, 310);
        ctx.restore();
      }

      else if (gameMode === 'PAUSED') {
        ctx.save();
        ctx.fillStyle = COLORS.overlayLight;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.shadowColor = COLORS.neonBlue;
        ctx.shadowBlur = 15;
        ctx.fillStyle = COLORS.neonBlue;
        ctx.font = 'bold 36px "Space Grotesk"';
        ctx.textAlign = 'center';
        ctx.fillText('RUN PAUSED', 400, 160);
        ctx.restore();
      }

      else if (gameMode === 'GAME_OVER') {
        ctx.save();
        ctx.fillStyle = COLORS.overlayDark;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.shadowColor = COLORS.neonPink;
        ctx.shadowBlur = 15;
        ctx.fillStyle = COLORS.neonPink;
        ctx.font = 'bold 38px "Space Grotesk"';
        ctx.textAlign = 'center';
        ctx.fillText('RUN COMPLETE', 400, 140);

        ctx.shadowColor = 'transparent';
        ctx.fillStyle = COLORS.white;
        ctx.font = '14px "JetBrains Mono", monospace';
        ctx.fillText(`FINAL SCORE: ${String(state.score).padStart(6, '0')}`, 400, 220);
        ctx.fillText(`HIGH SCORE:  ${String(highScore).padStart(6, '0')}`, 400, 250);
        ctx.restore();
      }

      const buttons = getButtons();
      buttons.forEach(btn => drawButton(btn));
    };

    loop();

    return () => cancelAnimationFrame(animationFrameId);
  }, [gameMode, sfxOn, sfxVolume, highScore, getButtons]);

  return (
    <div className="flex min-h-0 flex-col items-center gap-2 w-full">
      {/* Score and High Score Bar */}
      <div className="arcade-panel flex h-11 shrink-0 justify-between w-full font-mono text-neon-blue uppercase tracking-normal text-xs md:text-sm px-3 py-2"
        role="status"
        aria-label="Game score and high score">
        <div className="flex items-center gap-2">
          <span className="opacity-60 text-white">SCORE:</span>
          <span
            key={score}
            className="font-bold text-sm md:text-xl font-mono text-neon-blue neon-text-blue"
          >
            {String(score).padStart(6, '0')}
          </span>
        </div>
        <div className="flex items-center gap-2 text-neon-pink">
          <svg className="w-3.5 h-3.5 animate-pulse text-neon-yellow" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <span className="opacity-60 text-white">HIGH SCORE:</span>
          <span className="font-bold font-mono text-sm md:text-xl text-neon-yellow" style={{ textShadow: '0 0 5px var(--color-neon-yellow)' }}>
            {String(highScore).padStart(6, '0')}
          </span>
        </div>
      </div>

      {/* Screen Frame with scanline overlay */}
      <div ref={containerRef} className="relative group w-full max-h-[calc(100vh-170px)] aspect-[4/3] rounded-lg overflow-hidden bg-black select-none touch-none border border-neon-pink/40"
        role="region"
        aria-label="Game screen">
        <canvas
          ref={canvasRef}
          width={BASE_WIDTH}
          height={BASE_HEIGHT}
          onPointerDown={handleCanvasDown}
          onPointerMove={handleCanvasPointerMove}
          role="application"
          aria-label="Neon Invaders game canvas. Use A/D or arrow keys to move, Space to fire, P to pause."
          aria-roledescription="arcade game"
          tabIndex={0}
          className="w-full h-full cursor-crosshair bg-[radial-gradient(circle_at_center,_#1c102c_0%,_#090212_100%)] block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-blue"
        />

        {/* Dynamic scanlines and noise */}
        <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay">
          <div className="absolute inset-0 scanline" />
        </div>
        <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-xl" />
      </div>

      {/* Mobile Controls */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-[400px] mt-2 lg:hidden select-none touch-none"
        role="toolbar"
        aria-label="Game controls">
        <button
          onPointerDown={() => gameStateRef.current.keys['ArrowLeft'] = true}
          onPointerUp={() => gameStateRef.current.keys['ArrowLeft'] = false}
          onPointerLeave={() => gameStateRef.current.keys['ArrowLeft'] = false}
          className="h-16 arcade-panel flex items-center justify-center active:scale-95 transition-transform hover:border-neon-blue/60 select-none touch-none"
          aria-label="Move ship left"
        >
          <svg className="w-8 h-8 text-neon-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        </button>
        <button
          onPointerDown={shoot}
          className="h-16 arcade-panel flex items-center justify-center active:scale-95 transition-transform hover:border-neon-pink/60 select-none touch-none"
          aria-label="Fire"
        >
          <svg className="w-8 h-8 text-neon-pink" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </button>
        <button
          onPointerDown={() => gameStateRef.current.keys['ArrowRight'] = true}
          onPointerUp={() => gameStateRef.current.keys['ArrowRight'] = false}
          onPointerLeave={() => gameStateRef.current.keys['ArrowRight'] = false}
          className="h-16 arcade-panel flex items-center justify-center active:scale-95 transition-transform hover:border-neon-blue/60 select-none touch-none"
          aria-label="Move ship right"
        >
          <svg className="w-8 h-8 text-neon-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </button>
      </div>

      {/* Keyboard hints */}
      <div className="hidden lg:flex h-7 shrink-0 items-center text-[10px] text-neon-blue/55 font-mono uppercase tracking-[0.14em] gap-6 bg-black/30 px-5 rounded border border-white/10">
        <span>[A/D] or [â†/â†’] MOVE</span>
        <span>[SPACE] FIRE</span>
        <span>[P] PAUSE</span>
      </div>

      {/* Screen reader live region for game state announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
    </div>
  );
}



