import { useRef } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface SwipeOptions {
  threshold?: number; // minimum distance in px
  allowedTime?: number; // maximum time in ms
}

export function useSwipe<T extends HTMLElement = HTMLDivElement>(
  handlers: SwipeHandlers,
  options: SwipeOptions = {}
) {
  const { threshold = 45, allowedTime = 650 } = options;
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const onTouchStart = (e: React.TouchEvent<T>) => {
    // Only track single touch gestures
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  };

  const onTouchEnd = (e: React.TouchEvent<T>) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const dt = Date.now() - touchStartRef.current.time;

    touchStartRef.current = null;

    // Discard gesture if it took too long
    if (dt > allowedTime) return;

    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    // Horizontal swipe: horizontal displacement must exceed threshold and be dominant over vertical
    if (absDx >= threshold && absDx > absDy * 1.25) {
      if (dx < 0) {
        handlers.onSwipeLeft?.();
      } else {
        handlers.onSwipeRight?.();
      }
    } else if (absDy >= threshold && absDy > absDx * 1.25) {
      if (dy < 0) {
        handlers.onSwipeUp?.();
      } else {
        handlers.onSwipeDown?.();
      }
    }
  };

  return { onTouchStart, onTouchEnd };
}
