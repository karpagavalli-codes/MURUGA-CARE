import React, { useState } from 'react';
import { CompanionTone, ReminderItem, CharacterPose } from '../../types';
import { PeacockCornerMotif, VelIcon } from '../common/Decorations';
import { BalaMurugan } from '../mascot/BalaMurugan';
import { Bell, Heart, Shield, Smile, Play, Clock, Sparkles } from 'lucide-react';
import { playTempleBell } from '../../utils/audio';

interface RemindersViewProps {
  currentTone: CompanionTone;
  onChangeTone: (tone: CompanionTone) => void;
  onTriggerPresetReminder: (reminder: ReminderItem) => void;
  onTestPose?: (pose: CharacterPose, quote: string, sub: string, cat: string) => void;
  soundEnabled?: boolean;
}

export const RemindersView: React.FC<RemindersViewProps> = ({
  currentTone,
  onChangeTone,
  onTriggerPresetReminder,
  onTestPose,
  soundEnabled = true,
}) => {
  const [selectedGalleryPose, setSelectedGalleryPose] = useState<CharacterPose>('thinking');

  const [reminders, setReminders] = useState<ReminderItem[]>([
    {
      id: 'r-hydration',
      title: 'Hydration Routine',
      tanglishTitle: 'Kanna! Water kudikka time aachu! 💧',
      category: 'hydration',
      time: 'Every 2 Hours',
      recurrence: 'Recurring Routine',
      enabled: true,
      pose: 'hydration',
    },
    {
      id: 'r-study',
      title: 'Daily Study Session',
      tanglishTitle: 'Kanna, konjam padikkalama? 📖',
      category: 'focus',
      time: '10:00 AM',
      recurrence: 'Routine',
      enabled: true,
      pose: 'study',
    },
    {
      id: 'r-focus',
      title: 'Deep Focus Sprint',
      tanglishTitle: "Let's focus together, Kanna! ✨",
      category: 'focus',
      time: '02:00 PM',
      recurrence: 'Happening Soon',
      enabled: true,
      pose: 'encouraging',
    },
    {
      id: 'r-completed',
      title: 'Milestone Celebration',
      tanglishTitle: 'Super! Namma task complete pannitom! 🎉',
      category: 'celebration',
      time: 'On Task Done',
      recurrence: 'Trigger on Goal',
      enabled: true,
      pose: 'celebrating',
    },
    {
      id: 'r-break',
      title: 'Gentle Rest & Stretch',
      tanglishTitle: 'Konjam rest eduthukalama? 🌿',
      category: 'screentime',
      time: 'After 45m Session',
      recurrence: 'Rest Interval',
      enabled: true,
      pose: 'break',
    },
  ]);

  const toggleReminder = (id: string) => {
    if (soundEnabled) playTempleBell(0.3);
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const galleryPoses: {
    id: CharacterPose;
    label: string;
    description: string;
    quote: string;
  }[] = [
    {
      id: 'blessing',
      label: '3D Signature Guardian',
      description: 'Official 3D animated character holding the golden Vel with hand rested naturally on waist, golden aura, and divine smile',
      quote: 'Naan Un Thozhan! Anbudan Kaapom! 🙏✨',
    },
    {
      id: 'thinking',
      label: '3D Thinking Murugan',
      description: 'Thoughtful arched brow, curious tilt, and glowing divine thought-sparkle',
      quote: 'Kanna! Enna plan pannalam innaiku? 🤔',
    },
    {
      id: 'happy',
      label: '3D Happy & Smiling',
      description: 'Glossy expressive dark eyes, rosy blushed cheeks, and warm joyful presence',
      quote: 'Vanakkam Kanna! Nalla thodanguvom! 😊',
    },
    {
      id: 'hydration',
      label: '3D Hydration Routine',
      description: 'Standing beside cool refreshing Theertham water droplets with sparkling ripples',
      quote: 'Kanna! Water kudikka time aachu! 💧',
    },
    {
      id: 'study',
      label: '3D Study Companion',
      description: 'Sacred Gyanam aura and ancient golden palm-leaf wisdom motif',
      quote: 'Kanna, konjam padikkalama? 📖✨',
    },
    {
      id: 'encouraging',
      label: '3D Focus & Encouraging',
      description: 'Radiant golden Vel with sunbeam pulse and motivational courage glow',
      quote: "Let's focus together, Kanna! Namma mudiyum! 🚀",
    },
    {
      id: 'celebrating',
      label: '3D Celebrating Murugan',
      description: 'Star-struck shining catchlights, celebratory falling flower petals (malar thooval), and golden sparkles',
      quote: 'Super! Namma task complete pannitom! 🎉✨',
    },
    {
      id: 'worried',
      label: '3D Tenderly Worried',
      description: 'Sympathetic soft brow curve and glossy catchlights monitoring screen limits',
      quote: 'Kanna, screen time romba aaiduchu! Kannu valikkum! 🥺',
    },
    {
      id: 'sad',
      label: '3D Sad & Adorable',
      description: 'Puppy-dog eyes with gentle comforting rose-amber glow when tasks are overdue',
      quote: 'Kanna, task innum mudikkalayaa? Seekiram pannuvoma?',
    },
    {
      id: 'break',
      label: '3D Break & Rest',
      description: 'Relaxed posture encouraging gentle breathing, eye rest, and body stretch',
      quote: 'Konjam rest eduthukalama? 🌿🧘',
    },
    {
      id: 'sleepy',
      label: '3D Sleepy Murugan',
      description: 'Softly closed peaceful eyelids, lavender night aura, and floating crescent moon with Zzz runes',
      quote: 'Kanna, phone-ah vachitu thoongalaam! 🌙✨',
    },
    {
      id: 'excited',
      label: '3D Excited Murugan',
      description: 'Golden starburst reflections in pupils with celebratory golden sparkle particles',
      quote: 'Mass! Innaiku streak record break pannitom! 🌟',
    },
    {
      id: 'peaceful',
      label: '3D Calm & Peaceful',
      description: 'Tranquil meditative serenity on the golden cloud pedestal',
      quote: 'Om Saravanabhavaya Namaha 🪷',
    },
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#49321F] font-display">
            Reminder Pop-Up & Character Studio
          </h1>
          <p className="text-xs sm:text-sm text-[#49321F]/70">
            Intelligent companion alerts tuned to the official devotional storybook art style
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#FFE0C2]/80 px-3 py-1.5 rounded-2xl border border-[#D6A43B]/30 self-start sm:self-auto">
          <Bell size={16} className="text-[#F28C28]" />
          <span className="text-xs font-bold text-[#49321F] font-display">
            5 Storybook Reminders Active
          </span>
        </div>
      </div>

      {/* Official Character Expression Gallery (PART 4 of Spec) */}
      <div className="bg-[#FFF5EB] border-2 border-[#D6A43B] rounded-3xl p-6 shadow-ambient">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-lg font-bold text-[#49321F] font-display flex items-center gap-2">
              <Sparkles size={18} className="text-[#F28C28]" />
              <span>Official Character Expressions Gallery</span>
            </h2>
            <p className="text-xs text-[#49321F]/70">
              The SAME Bala Murugan character with wavy dark curls, golden crown & peacock plume across every emotion
            </p>
          </div>
        </div>

        {/* Gallery Carousel & Live Preview */}
        <div className="flex flex-col md:flex-row items-center gap-6 pt-3">
          {/* Large Preview */}
          <div className="w-full md:w-56 bg-white/80 rounded-2xl p-4 border border-[#D6A43B]/30 flex flex-col items-center text-center shadow-xs">
            <BalaMurugan pose={selectedGalleryPose} size={150} showCloud={true} />
            <span className="text-xs font-bold text-[#49321F] mt-1 capitalize font-display">
              {galleryPoses.find((g) => g.id === selectedGalleryPose)?.label}
            </span>
            <p className="text-[11px] text-[#49321F]/70 mt-0.5 line-clamp-2">
              {galleryPoses.find((g) => g.id === selectedGalleryPose)?.description}
            </p>

            <button
              type="button"
              onClick={() => {
                const item = galleryPoses.find((g) => g.id === selectedGalleryPose);
                if (item && onTestPose) {
                  onTestPose(item.id, item.quote, item.description, item.label);
                }
              }}
              className="mt-3 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#F28C28] to-[#D6A43B] text-white text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
            >
              <Play size={12} fill="currentColor" />
              <span>Preview Pop-Up</span>
            </button>
          </div>

          {/* Emotion Buttons Grid */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-2 w-full">
            {galleryPoses.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (soundEnabled) playTempleBell(0.2);
                  setSelectedGalleryPose(item.id);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedGalleryPose === item.id
                    ? 'border-[#F28C28] bg-[#FFE0C2] shadow-xs'
                    : 'border-[#D6A43B]/30 bg-white/70 hover:bg-white'
                }`}
              >
                <div className="font-bold text-xs text-[#49321F] truncate font-display">
                  {item.label}
                </div>
                <div className="text-[10px] text-[#49321F]/60 truncate font-sans">
                  "{item.quote}"
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Part 3 Specified Reminders List */}
      <div className="bg-[#FFF5EB] rounded-3xl p-6 border border-[#D6A43B]/30 shadow-ambient">
        <h2 className="text-lg font-bold text-[#49321F] font-display mb-1">
          Configured Storybook Routine Alerts
        </h2>
        <p className="text-xs text-[#49321F]/70 mb-4">
          Each alert triggers a cute entrance bounce and displays an expression appropriate to the task
        </p>

        <div className="space-y-3">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className={`p-4 rounded-2xl bg-white border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                reminder.enabled
                  ? 'border-[#D6A43B]/40 shadow-xs'
                  : 'border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Mini Mascot Preview */}
                <div className="w-12 h-12 rounded-xl bg-[#FFE0C2]/50 flex items-center justify-center shrink-0 border border-[#D6A43B]/20 overflow-hidden">
                  <BalaMurugan pose={reminder.pose} size={48} showCloud={false} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#087F78] bg-[#087F78]/10 px-2 py-0.5 rounded-full">
                      {reminder.title}
                    </span>
                    <span className="text-xs text-[#49321F]/60 font-mono flex items-center gap-1">
                      <Clock size={12} />
                      {reminder.time}
                    </span>
                  </div>

                  <p className="text-sm font-bold text-[#49321F]">
                    "{reminder.tanglishTitle}"
                  </p>
                </div>
              </div>

              {/* Actions & Switch */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                {/* Test Jump Pop-Up Button */}
                <button
                  type="button"
                  onClick={() => onTriggerPresetReminder(reminder)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#FFE0C2] hover:bg-[#FFD166] text-[#49321F] text-xs font-bold transition-all flex items-center gap-1.5 border border-[#D6A43B]/40 cursor-pointer shadow-xs active:scale-95"
                  title="Preview Parandhu Vaa Pop-Up for this alert"
                >
                  <Play size={12} fill="currentColor" className="text-[#F28C28]" />
                  <span>Test Bounce & Card</span>
                </button>

                {/* Switch toggle */}
                <button
                  type="button"
                  onClick={() => toggleReminder(reminder.id)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    reminder.enabled ? 'bg-[#087F78]' : 'bg-[#D6A43B]/40'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      reminder.enabled ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
