import { useState, useEffect } from 'react';

const FULL_TEXT = 'SUBHODEEP MONDAL';
const TYPING_SPEED = 120; // ms per character
const HOLD_DURATION = 800; // ms to hold after typing completes

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation = ({ onComplete }: IntroAnimationProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [phase, setPhase] = useState<'typing' | 'merging' | 'done'>('typing');

  // Typing phase
  useEffect(() => {
    if (phase !== 'typing') return;
    if (displayedText.length < FULL_TEXT.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(FULL_TEXT.slice(0, displayedText.length + 1));
      }, TYPING_SPEED + Math.random() * 60); // slight randomness
      return () => clearTimeout(timeout);
    } else {
      // Typing done, hold then merge
      const timeout = setTimeout(() => setPhase('merging'), HOLD_DURATION);
      return () => clearTimeout(timeout);
    }
  }, [displayedText, phase]);

  // Merging phase — wait for CSS transition then signal done
  useEffect(() => {
    if (phase !== 'merging') return;
    const timeout = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 1000);
    return () => clearTimeout(timeout);
  }, [phase, onComplete]);

  if (phase === 'done') return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-transparent transition-opacity duration-700 ${
        phase === 'merging' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="relative">
        {/* Cursor-like caret */}
        <h1
          className="font-serif text-2xl md:text-4xl tracking-[0.35em] uppercase text-foreground select-none"
          style={{ minHeight: '1.2em' }}
        >
          {displayedText}
          <span
            className={`inline-block w-[2px] h-[1em] bg-vermillion ml-1 align-middle ${
              displayedText.length < FULL_TEXT.length ? 'animate-pulse' : 'opacity-0'
            }`}
          />
        </h1>

        {/* Ink line that draws under the text */}
        <div
          className="h-[1.5px] bg-foreground mt-3 transition-all duration-700 ease-out origin-left"
          style={{
            width: `${(displayedText.length / FULL_TEXT.length) * 100}%`,
          }}
        />
      </div>
    </div>
  );
};

export default IntroAnimation;
