import React, { useState, useEffect, useRef } from 'react';
import { CharacterPose } from '../../types';

interface BalaMuruganProps {
  pose?: CharacterPose;
  size?: number | string;
  className?: string;
  animate?: boolean;
  showCloud?: boolean;
  interactive?: boolean;
}

export const BalaMurugan: React.FC<BalaMuruganProps> = ({
  pose = 'blessing',
  size = 200,
  className = '',
  animate = true,
  showCloud = true,
  interactive = true,
}) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize pose aliases
  const normalizedPose = pose
    .replace('murugan_state_', '')
    .toLowerCase();

  // Natural eye blink loop every 3.8s
  useEffect(() => {
    if (!animate) return;
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3800);
    return () => clearInterval(interval);
  }, [animate]);

  // Interactive 3D tilt tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    setTilt({ x: x * 14, y: -y * 14 }); // Degrees of 3D rotation
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const numericSize = typeof size === 'number' ? size : 200;

  // Expression flags
  const isThinking = normalizedPose === 'thinking' || normalizedPose === 'remind';
  const isSad = normalizedPose === 'sad';
  const isWorried = normalizedPose === 'worried';
  const isSleepy = normalizedPose === 'sleep' || normalizedPose === 'sleepy';
  const isPeaceful = normalizedPose === 'peace' || normalizedPose === 'peaceful' || normalizedPose === 'calm';
  const isHappy = normalizedPose === 'happy';
  const isExcited = normalizedPose === 'excited';
  const isCelebrating = normalizedPose === 'celebrate' || normalizedPose === 'celebrating';
  const isEncouraging = normalizedPose === 'encourage' || normalizedPose === 'encouraging' || normalizedPose === 'motivate';
  const isStudying = normalizedPose === 'study';
  const isHydration = normalizedPose === 'hydration';
  const isBreak = normalizedPose === 'break';
  const isBlessing =
    normalizedPose === 'blessing' ||
    normalizedPose === 'welcome' ||
    (!isThinking &&
      !isSad &&
      !isWorried &&
      !isSleepy &&
      !isPeaceful &&
      !isExcited &&
      !isCelebrating &&
      !isEncouraging &&
      !isStudying &&
      !isHydration &&
      !isBreak);

  // Animation timing
  const floatClass = animate
    ? isSleepy
      ? 'animate-murugan-sleep'
      : isCelebrating || isExcited
      ? 'animate-murugan-celebrate'
      : 'animate-murugan-float'
    : '';

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-flex items-center justify-center select-none ${floatClass} ${className}`}
      style={{
        width: numericSize,
        height: numericSize,
        perspective: '1000px',
      }}
    >
      {/* 1. Divine Golden Halo & Ambient 3D Backlight */}
      <div
        className="absolute rounded-full pointer-events-none transition-all duration-700"
        style={{
          width: numericSize * 0.9,
          height: numericSize * 0.9,
          top: '5%',
          left: '5%',
          background: isSleepy
            ? 'radial-gradient(circle, rgba(162, 155, 254, 0.35) 0%, rgba(254, 215, 155, 0.15) 50%, transparent 70%)'
            : isCelebrating || isExcited
            ? 'radial-gradient(circle, rgba(255, 234, 167, 0.85) 0%, rgba(250, 177, 160, 0.4) 50%, transparent 70%)'
            : isSad || isWorried
            ? 'radial-gradient(circle, rgba(255, 224, 194, 0.6) 0%, rgba(214, 164, 59, 0.2) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255, 236, 199, 0.75) 0%, rgba(254, 215, 155, 0.3) 50%, transparent 70%)',
          filter: 'blur(8px)',
          transform: `translate3d(${tilt.x * 0.4}px, ${-tilt.y * 0.4}px, -20px)`,
        }}
      />

      {/* 2. Soft Cloud Pedestal with Warm Gold Outline and Contact Shadow */}
      {showCloud && (
        <div
          className="absolute pointer-events-none transition-transform duration-300 z-0"
          style={{
            bottom: '2%',
            width: numericSize * 0.82,
            height: numericSize * 0.22,
            transform: `translate3d(${tilt.x * 0.2}px, 0px, -10px)`,
          }}
        >
          {/* Ambient Floor Shadow */}
          <div
            className="absolute inset-x-4 bottom-0 h-4 rounded-full bg-[#49321F]/15 blur-md"
            style={{
              transform: isHovered ? 'scale(1.08)' : 'scale(1)',
              transition: 'transform 0.3s ease',
            }}
          />

          {/* 3D Fluffy Golden Cloud Pedestal */}
          <svg viewBox="0 0 160 40" width="100%" height="100%" fill="none" className="overflow-visible">
            <defs>
              <linearGradient id="cloud3DGrad" x1="0" y1="0" x2="0" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="60%" stopColor="#FFF9F2" />
                <stop offset="100%" stopColor="#FFE8D2" />
              </linearGradient>
              <linearGradient id="cloudZariGrad" x1="0" y1="0" x2="160" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#E8C496" />
                <stop offset="50%" stopColor="#F9D459" />
                <stop offset="100%" stopColor="#E8C496" />
              </linearGradient>
            </defs>
            <path
              d="M30 32 C15 32 4 24 8 14 C11 5 24 2 32 8 C40 -2 60 -2 70 6 C80 -2 104 -2 114 6 C124 -1 142 2 148 10 C156 4 168 9 168 18 C168 28 156 34 140 34 C115 39 45 39 30 32 Z"
              fill="url(#cloud3DGrad)"
              stroke="url(#cloudZariGrad)"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Soft inner glow */}
            <ellipse cx="86" cy="30" rx="55" ry="5.5" fill="#FFE0C2" opacity="0.6" />
          </svg>
        </div>
      )}

      {/* 3. The Official 3D Murugan Character Model with Dynamic 3D Transform */}
      <div
        className="relative z-10 w-full h-full flex items-center justify-center transition-transform ease-out"
        style={{
          transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) translateZ(10px)`,
          transitionDuration: isHovered ? '80ms' : '400ms',
          transformStyle: 'preserve-3d',
        }}
      >
        <img
          src="/assets/murugan_3d_standing.png"
          alt="Bala Murugan 3D Mascot"
          className="w-full h-full object-contain pointer-events-none drop-shadow-md select-none"
          style={{
            filter: isSleepy
              ? 'brightness(0.96) saturate(0.95) drop-shadow(0 14px 18px rgba(73, 50, 31, 0.18))'
              : isCelebrating || isExcited
              ? 'brightness(1.04) saturate(1.1) drop-shadow(0 16px 22px rgba(242, 140, 40, 0.28))'
              : 'brightness(1.01) saturate(1.02) drop-shadow(0 14px 20px rgba(73, 50, 31, 0.2))',
          }}
          loading="eager"
        />

        {/* 4. Natural 3D Specular Shimmer on the Golden Vel and Crown on Hover */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: isHovered ? 0.45 : 0.15,
            background: `radial-gradient(circle at ${50 + tilt.x * 2}% ${35 - tilt.y * 2}%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 235, 160, 0.3) 25%, transparent 55%)`,
            mixBlendMode: 'overlay',
          }}
        />

        {/* 5. Dynamic Eye & Facial Expression Overlay (Aligned to 3D Coordinates) */}
        <svg
          viewBox="0 0 1024 1024"
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20"
        >
          {/* Natural Eye Blinking Overlay (Left Eye: cx 445, cy 320; Right Eye: cx 568, cy 320) */}
          {isBlinking && !isSleepy && (
            <g id="blinking-eyelids">
              {/* Left Eyelid */}
              <ellipse cx="445" cy="324" rx="34" ry="22" fill="#E8B490" />
              <path
                d="M414 324 Q445 334 476 324"
                stroke="#4A2614"
                strokeWidth="4.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M420 327 L414 332 M445 329 L445 336 M470 327 L476 332"
                stroke="#3D1E0E"
                strokeWidth="3.2"
                strokeLinecap="round"
              />

              {/* Right Eyelid */}
              <ellipse cx="568" cy="324" rx="34" ry="22" fill="#E8B490" />
              <path
                d="M537 324 Q568 334 599 324"
                stroke="#4A2614"
                strokeWidth="4.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M543 327 L537 332 M568 329 L568 336 M593 327 L599 332"
                stroke="#3D1E0E"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* SLEEPY / PEACEFUL EXPRESSION: Peaceful Curved Eyelashes */}
          {(isSleepy || isPeaceful) && !isBlinking && (
            <g id="sleepy-peaceful-eyes">
              {/* Soft Peach Eyelid Covers */}
              <ellipse cx="445" cy="324" rx="34" ry="24" fill="#ECC09E" opacity="0.96" />
              <path
                d="M414 322 Q445 336 476 322"
                stroke="#3D1E0E"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
              <ellipse cx="568" cy="324" rx="34" ry="24" fill="#ECC09E" opacity="0.96" />
              <path
                d="M537 322 Q568 336 599 322"
                stroke="#3D1E0E"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Gentle Floating Zzz particles for Sleepy */}
              {isSleepy && (
                <g id="sleep-zzz" className="animate-pulse">
                  <text
                    x="630"
                    y="240"
                    fill="#9B59B6"
                    fontSize="32"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                    opacity="0.85"
                  >
                    z
                  </text>
                  <text
                    x="655"
                    y="200"
                    fill="#9B59B6"
                    fontSize="42"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                    opacity="0.95"
                  >
                    Z
                  </text>
                  <text
                    x="685"
                    y="150"
                    fill="#F1C40F"
                    fontSize="48"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    Z
                  </text>
                </g>
              )}
            </g>
          )}

          {/* CELEBRATING / EXCITED EXPRESSION: Starry Eye Highlights & Falling Petals */}
          {(isCelebrating || isExcited) && (
            <g id="celebrating-sparkles">
              {/* Star pupil gleams */}
              <circle cx="434" cy="308" r="7" fill="#FFFFFF" />
              <circle cx="452" cy="330" r="4.5" fill="#FFF275" />
              <circle cx="558" cy="308" r="7" fill="#FFFFFF" />
              <circle cx="576" cy="330" r="4.5" fill="#FFF275" />

              {/* Floating Flower Petals (Malar Thooval) */}
              <g className="animate-bounce" opacity="0.9">
                <ellipse cx="260" cy="220" rx="14" ry="8" fill="#FF7675" transform="rotate(-25 260 220)" />
                <ellipse cx="730" cy="240" rx="15" ry="9" fill="#FDCB6E" transform="rotate(35 730 240)" />
                <ellipse cx="320" cy="140" rx="12" ry="7" fill="#E84393" transform="rotate(15 320 140)" />
                <ellipse cx="680" cy="120" rx="13" ry="7.5" fill="#FF7675" transform="rotate(-30 680 120)" />
              </g>

              {/* Twinkling Golden Star Bursts */}
              <path
                d="M280 280 Q285 292 297 292 Q285 292 280 304 Q275 292 263 292 Q275 292 280 280 Z"
                fill="#F9D459"
              />
              <path
                d="M740 310 Q744 320 754 320 Q744 320 740 330 Q736 320 726 320 Q736 320 740 310 Z"
                fill="#F9D459"
              />
            </g>
          )}

          {/* THINKING EXPRESSION: Curious Arched Brow & Thought Sparkle */}
          {isThinking && (
            <g id="thinking-indicator">
              {/* Arched left eyebrow lift */}
              <path
                d="M408 268 Q442 246 476 264"
                stroke="#3D1E0E"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Glowing sacred thought spark */}
              <circle cx="340" cy="190" r="8" fill="#F9D459" opacity="0.6" />
              <circle cx="320" cy="150" r="14" fill="#F9D459" opacity="0.75" />
              <ellipse cx="300" cy="100" rx="24" ry="20" fill="#FFF2DC" stroke="#D6A43B" strokeWidth="2.5" />
              <text
                x="300"
                y="108"
                textAnchor="middle"
                fontSize="24"
                fontWeight="bold"
                fill="#642D35"
                fontFamily="sans-serif"
              >
                ✨
              </text>
            </g>
          )}

          {/* SAD / WORRIED EXPRESSION: Sympathetic Brow & Comforting Warmth */}
          {(isSad || isWorried) && (
            <g id="worried-expression">
              {/* Worried tilted eyebrows */}
              <path
                d="M410 262 Q445 274 476 266"
                stroke="#3D1E0E"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M536 266 Q568 274 602 262"
                stroke="#3D1E0E"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Extra glossy emotional catchlights */}
              <circle cx="452" cy="344" r="6" fill="#FFFFFF" opacity="0.9" />
              <circle cx="574" cy="344" r="6" fill="#FFFFFF" opacity="0.9" />
            </g>
          )}

          {/* HYDRATION EXPRESSION: Theertham Drops */}
          {isHydration && (
            <g id="theertham-droplets">
              {/* Pure sacred water drops */}
              <path
                d="M340 380 C330 400 350 400 340 380 Z"
                fill="#00CEC9"
                transform="scale(1.8) translate(-150, -170)"
              />
              <circle cx="280" cy="350" r="9" fill="#81ECEC" opacity="0.8" />
              <circle cx="295" cy="320" r="6" fill="#81ECEC" opacity="0.8" />
            </g>
          )}

          {/* STUDY / FOCUS EXPRESSION: Sacred Wisdom Glow */}
          {isStudying && (
            <g id="study-aura">
              <circle cx="506" cy="180" r="45" fill="#FFEAA7" opacity="0.25" />
              <path
                d="M330 350 L380 340 L380 380 L330 390 Z"
                fill="#F8C291"
                stroke="#B37C11"
                strokeWidth="2.5"
                transform="rotate(-15 355 365)"
              />
              <line x1="340" y1="352" x2="370" y2="346" stroke="#5D3A24" strokeWidth="2" />
              <line x1="340" y1="362" x2="370" y2="356" stroke="#148255" strokeWidth="2" />
            </g>
          )}
        </svg>
      </div>

      {/* 6. Sacred Sparkle Orbs & Light Motes in Ambient Space */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <span
          className="absolute text-yellow-400 text-xs sm:text-sm animate-ping"
          style={{ top: '22%', left: '16%', animationDuration: '3.2s' }}
        >
          ✨
        </span>
        <span
          className="absolute text-amber-300 text-xs animate-pulse"
          style={{ top: '65%', left: '12%', animationDuration: '2.5s' }}
        >
          ✨
        </span>
        <span
          className="absolute text-yellow-300 text-xs animate-ping"
          style={{ top: '48%', right: '12%', animationDuration: '4s' }}
        >
          ✨
        </span>
      </div>
    </div>
  );
};
