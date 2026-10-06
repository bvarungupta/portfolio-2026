'use client';

import * as React from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
  type HTMLMotionProps,
  type SpringOptions,
  type MotionValue,
} from 'framer-motion';

import { cn } from '@/lib/utils';

type CursorContextType = {
  /** MotionValues for 120fps GPU updates without triggering React re-renders */
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  isActive: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  cursorRef: React.RefObject<HTMLDivElement | null>;
};

const CursorContext = React.createContext<CursorContextType | undefined>(
  undefined,
);

export const useCursor = (): CursorContextType => {
  const context = React.useContext(CursorContext);
  if (!context) {
    throw new Error('useCursor must be used within a CursorProvider');
  }
  return context;
};

export type CursorProviderProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  /** When true, wraps children directly and acts as the container. When false, listens to parentElement. */
  asContainer?: boolean;
};

export function CursorProvider({
  children,
  className,
  asContainer = true,
  ...props
}: CursorProviderProps) {
  const [isActive, setIsActive] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const cursorRef = React.useRef<HTMLDivElement>(null);

  // Use MotionValues to eliminate 60Hz-240Hz React re-renders on mousemove
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  React.useEffect(() => {
    const target = asContainer
      ? containerRef.current
      : containerRef.current?.parentElement;

    if (!target) return;

    if (getComputedStyle(target).position === 'static') {
      target.style.position = 'relative';
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = target.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
      setIsActive(true);
    };

    const handleMouseEnter = () => setIsActive(true);
    const handleMouseLeave = () => setIsActive(false);

    target.addEventListener('mousemove', handleMouseMove);
    target.addEventListener('mouseenter', handleMouseEnter);
    target.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      target.removeEventListener('mousemove', handleMouseMove);
      target.removeEventListener('mouseenter', handleMouseEnter);
      target.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [asContainer, mouseX, mouseY]);

  return (
    <CursorContext.Provider
      value={{ mouseX, mouseY, isActive, containerRef, cursorRef }}
    >
      <div
        ref={containerRef}
        data-slot="cursor-provider"
        data-cursor="none"
        className={cn(asContainer && 'relative overflow-hidden', className)}
        {...props}
      >
        {children}
      </div>
    </CursorContext.Provider>
  );
}

export type CursorProps = HTMLMotionProps<'div'> & {
  children?: React.ReactNode;
};

export function Cursor({
  children,
  className,
  style,
  ...props
}: CursorProps) {
  const { mouseX, mouseY, isActive, containerRef, cursorRef } = useCursor();

  React.useEffect(() => {
    const target = containerRef.current;
    if (target && isActive) {
      target.style.cursor = 'none';
    }
    return () => {
      if (target) target.style.cursor = 'default';
    };
  }, [containerRef, isActive]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          ref={cursorRef}
          data-slot="cursor"
          className={cn(
            'pointer-events-none z-[9999] absolute -translate-x-1/2 -translate-y-1/2 will-change-transform',
            className,
          )}
          style={{
            top: mouseY,
            left: mouseX,
            ...style,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export type Align =
  | 'top'
  | 'top-left'
  | 'top-right'
  | 'bottom'
  | 'bottom-left'
  | 'bottom-right'
  | 'left'
  | 'right'
  | 'center';

export type CursorFollowProps = HTMLMotionProps<'div'> & {
  sideOffset?: number;
  align?: Align;
  transition?: SpringOptions;
  children: React.ReactNode;
};

export function CursorFollow({
  sideOffset = 15,
  align = 'bottom-right',
  children,
  className,
  style,
  transition = { stiffness: 500, damping: 50, bounce: 0 },
  ...props
}: CursorFollowProps) {
  const { mouseX, mouseY, isActive } = useCursor();
  const cursorFollowRef = React.useRef<HTMLDivElement>(null);

  const springX = useSpring(mouseX, transition);
  const springY = useSpring(mouseY, transition);

  const [offsets, setOffsets] = React.useState({ x: sideOffset, y: sideOffset });

  // Measure once or when align/offset changes to prevent layout thrashing
  React.useEffect(() => {
    const rect = cursorFollowRef.current?.getBoundingClientRect();
    const width = rect?.width ?? 60;
    const height = rect?.height ?? 30;

    let ox = 0;
    let oy = 0;

    switch (align) {
      case 'center':
        ox = -width / 2;
        oy = -height / 2;
        break;
      case 'top':
        ox = -width / 2;
        oy = -height - sideOffset;
        break;
      case 'top-left':
        ox = -width - sideOffset;
        oy = -height - sideOffset;
        break;
      case 'top-right':
        ox = sideOffset;
        oy = -height - sideOffset;
        break;
      case 'bottom':
        ox = -width / 2;
        oy = sideOffset;
        break;
      case 'bottom-left':
        ox = -width - sideOffset;
        oy = sideOffset;
        break;
      case 'bottom-right':
        ox = sideOffset;
        oy = sideOffset;
        break;
      case 'left':
        ox = -width - sideOffset;
        oy = -height / 2;
        break;
      case 'right':
        ox = sideOffset;
        oy = -height / 2;
        break;
    }

    setOffsets({ x: ox, y: oy });
  }, [align, sideOffset, isActive]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          ref={cursorFollowRef}
          data-slot="cursor-follow"
          className={cn(
            'pointer-events-none z-[9998] absolute will-change-transform',
            className,
          )}
          style={{
            top: springY,
            left: springX,
            x: offsets.x,
            y: offsets.y,
            ...style,
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
