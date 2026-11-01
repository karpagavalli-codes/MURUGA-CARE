import React, { useState } from 'react';
import { BalaMurugan } from '../mascot/BalaMurugan';
import { CharacterPose, CompanionTone } from '../../types';
import { PeacockCornerMotif, VelIcon } from '../common/Decorations';
import { playTempleBell, playVictoryChime } from '../../utils/audio';
import { ChevronRight, ChevronLeft, Heart, Shield, Smile } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onFinish: (data: { name: string; nickname: string; tone: CompanionTone }) => void;
  soundEnabled?: boolean;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onFinish,
  soundEnabled = true,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState('Karthik');
  const [nickname, setNickname] = useState('Kanna');
  const [tone, setTone] = useState<CompanionTone>('thozhan');

  if (!isOpen) return null;

  const slides: {
    title: string;
    tamilKicker: string;
    description: string;
    pose: CharacterPose;
  }[] = [
    {
      title: 'Organized Productivity',
      tamilKicker: 'Un Thozhanai Pola Naan Irrupen!',
      description:
        'Muruga Care is your mindful personal sanctuary. Master your tasks and daily schedule with calmness, clarity, and zero stress.',
      pose: 'murugan_state_study',
    },
    {
      title: 'Parandhu Vaa Reminders',
      tamilKicker: 'Anbodu Namma Vel Nirkkum!',
      description:
        'Meet the signature Parandhu Vaa jumping mascot! Gentle, joyful alerts that pop in to care for you without aggressive sirens or shouty notifications.',
      pose: 'murugan_state_remind',
    },
    {
      title: 'Digital Wellbeing & Rest',
      tamilKicker: 'Kanngalukkum Manadhirkkum Amaithi!',
      description:
        'Set thoughtful limits for addictive social media apps. Murugan steps in warmly to help you break free from endless doom-scrolling.',
      pose: 'murugan_state_peace',
    },
    {
      title: 'Rituals & Theertham Streaks',
      tamilKicker: 'Dhinam Oru Vetri, Perum Magizhchi!',
      description:
        'Log your hydration with the animated South Indian Theertham reservoir, maintain holy streaks with Golden Vels, and celebrate every win.',
      pose: 'murugan_state_celebrate',
    },
  ];

  const handleNext = () => {
    if (soundEnabled) playTempleBell(0.3);
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      if (soundEnabled) playVictoryChime();
      onFinish({ name, nickname: nickname.trim() || 'Kanna', tone });
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#49321F]/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-[#FFF2DC] border-2 border-[#D6A43B] rounded-3xl shadow-floating relative overflow-hidden flex flex-col animate-pop-scale">
        <PeacockCornerMotif position="top-right" size={28} className="absolute top-3 right-3" />

        {/* Top Progress Bar */}
        <div className="px-6 pt-5 pb-3 border-b border-[#D6A43B]/20 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3, 4].map((stepIdx) => (
              <span
                key={stepIdx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentStep === stepIdx
                    ? 'w-8 bg-[#F28C28]'
                    : stepIdx < currentStep
                    ? 'w-4 bg-[#087F78]'
                    : 'w-3 bg-[#FFE0C2]'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#D6A43B] font-display">
            Step {currentStep + 1} of 5
          </span>
        </div>

        {/* Dynamic Body Content */}
        <div className="p-6 sm:p-8 flex flex-col items-center text-center">
          {currentStep < 4 ? (
            <div className="flex flex-col items-center transition-opacity duration-300">
              {/* Mascot Pose Illustration */}
              <div className="relative mb-3">
                <div className="absolute -inset-2 rounded-full bg-[#FFE0C2] blur-md" />
                <BalaMurugan pose={slides[currentStep].pose} size={150} showCloud={true} />
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-[#087F78] mb-1 font-display">
                {slides[currentStep].tamilKicker}
              </span>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#49321F] font-display mb-3">
                {slides[currentStep].title}
              </h2>

              <p className="text-sm text-[#49321F]/80 leading-relaxed max-w-sm mb-4 font-sans">
                {slides[currentStep].description}
              </p>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center text-left transition-opacity duration-300">
              {/* Peeking Murugan Header */}
              <div className="flex items-center gap-3 w-full bg-[#FFE0C2]/60 p-3 rounded-2xl border border-[#D6A43B]/30 mb-5">
                <BalaMurugan pose="murugan_state_remind" size={64} showCloud={false} />
                <div>
                  <h3 className="text-base font-bold text-[#49321F] font-display">
                    Vanakkam! Tell me about yourself
                  </h3>
                  <p className="text-xs text-[#49321F]/70">
                    Murugan will call you by your affectionate name!
                  </p>
                </div>
              </div>

              {/* Nickname Input */}
              <div className="w-full mb-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#49321F] mb-1">
                  Your Name / Preferred Nickname
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="e.g. Kanna, Vignesh, Ammu"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D6A43B]/40 focus:border-[#087F78] focus:ring-2 focus:ring-[#087F78]/20 outline-none text-sm font-medium text-[#49321F]"
                />
                <span className="text-[11px] text-[#49321F]/60 mt-1 block">
                  e.g. "Kanna! Water kudikka time aachu!"
                </span>
              </div>

              {/* Tone Selector */}
              <div className="w-full mb-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#49321F] mb-1.5">
                  Choose Murugan's Voice & Personality Tone
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTone('anbudan')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      tone === 'anbudan'
                        ? 'border-[#F28C28] bg-[#FFE0C2] shadow-xs'
                        : 'border-[#D6A43B]/30 bg-white/60 hover:bg-white'
                    }`}
                  >
                    <Heart size={16} className="mx-auto mb-1 text-[#D94B83]" />
                    <div className="font-bold text-xs text-[#49321F]">Anbudan</div>
                    <div className="text-[10px] text-[#49321F]/70">Loving & Caring</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTone('veeram')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      tone === 'veeram'
                        ? 'border-[#F28C28] bg-[#FFE0C2] shadow-xs'
                        : 'border-[#D6A43B]/30 bg-white/60 hover:bg-white'
                    }`}
                  >
                    <Shield size={16} className="mx-auto mb-1 text-[#2455A4]" />
                    <div className="font-bold text-xs text-[#49321F]">Veeram</div>
                    <div className="text-[10px] text-[#49321F]/70">Warrior Coach</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTone('thozhan')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      tone === 'thozhan'
                        ? 'border-[#F28C28] bg-[#FFE0C2] shadow-xs'
                        : 'border-[#D6A43B]/30 bg-white/60 hover:bg-white'
                    }`}
                  >
                    <Smile size={16} className="mx-auto mb-1 text-[#087F78]" />
                    <div className="font-bold text-xs text-[#49321F]">Thozhan</div>
                    <div className="text-[10px] text-[#49321F]/70">Best Friend</div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 bg-[#FFE0C2]/40 border-t border-[#D6A43B]/20 flex items-center justify-between">
          {currentStep > 0 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#49321F] hover:bg-[#FFE0C2] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="text-xs font-bold text-[#D6A43B] hover:text-[#F28C28] transition-colors cursor-pointer"
            >
              Skip Tour
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#F28C28] to-[#D6A43B] text-white font-bold text-xs sm:text-sm shadow-md hover:brightness-105 active:scale-95 transition-all flex items-center gap-1.5 border border-[#FFF2DC]/40 cursor-pointer"
          >
            {currentStep === 4 ? (
              <>
                <VelIcon size={16} glow={true} />
                <span>Thodangalaam! (Let's Begin)</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <ChevronRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
