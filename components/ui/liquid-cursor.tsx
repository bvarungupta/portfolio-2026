"use client";

import { ComponentProps, useEffect, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

export type LiquidCursorProps = Omit<ComponentProps<"div">, "children"> & {
    size?: number;
    strong?: boolean;
    children?: React.ReactNode;
};

export const LiquidCursor = ({
    size = 70,
    strong = true,
    className,
    children,
    ...props
}: LiquidCursorProps) => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const prevPos = useRef({ x: 0, y: 0 });
    const prevAngle = useRef(0);

    useEffect(() => {
        const cursor = cursorRef.current;
        if (!cursor) return;

        const clickDrop = () => {
            if (!cursorRef.current) return;

            gsap.to(cursorRef.current, {
                scale: 1.25,
                duration: 0.25,
                ease: "power2.out",
                onComplete: () => {
                    gsap.to(cursorRef.current, {
                        scale: 1,
                        duration: 0.4,
                        ease: "bounce.out",
                    });
                },
            });
        };

        const moveDrop = (e: MouseEvent) => {
            if (!cursorRef.current) return;

            const dx = e.clientX - prevPos.current.x;
            const dy = e.clientY - prevPos.current.y;

            const distance = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);

            let delta = angle - prevAngle.current;
            if (delta > 180) delta -= 360;
            if (delta < -180) delta += 360;

            const smoothingFactor = 0.2;
            const smoothAngle = prevAngle.current + delta * smoothingFactor;

            const maxStretch = 1.25;
            const stretch = Math.min(distance / 25, maxStretch);

            const absDx = Math.abs(dx);
            const absDy = Math.abs(dy);
            const total = absDx + absDy || 1;
            const xRatio = absDx / total;

            const scaleX = 1 + xRatio * stretch;
            const scaleY = 1 - xRatio * stretch * 0.3;

            gsap.to(cursorRef.current, {
                duration: 0.8,
                left: e.clientX - size / 2,
                top: e.clientY - size / 2,
                scaleX,
                scaleY,
                rotate: smoothAngle,
                ease: "power2.out",
            });

            // Keep inner label upright and readable while droplet stretches
            if (contentRef.current) {
                gsap.to(contentRef.current, {
                    duration: 0.8,
                    rotate: -smoothAngle,
                    ease: "power2.out",
                });
            }

            prevAngle.current = smoothAngle;
            prevPos.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener("click", clickDrop);
        window.addEventListener("mousemove", moveDrop);

        return () => {
            window.removeEventListener("click", clickDrop);
            window.removeEventListener("mousemove", moveDrop);
        };
    }, [size]);

    const lightStyle = {
        background: `
            radial-gradient(circle, 
                rgba(255, 255, 255, 0.45) 90%,  
                rgba(255, 255, 255, 0.2) 70%, 
                transparent 20%                
            )
        `,
        border: "1px solid rgba(255, 255, 255, 0.4)",
    };

    const strongStyle = {
        background: `
            radial-gradient(125.95% 106.37% at 32.61% 3.41%,
            rgba(255, 255, 255, 0.75) 0%,
            rgba(255, 255, 255, 0.55) 28.13%,
            rgba(252, 252, 252, 0.45) 45.31%,
            rgba(248, 248, 248, 0.38) 66.67%,
            rgba(243, 243, 243, 0.3) 100%)
        `,
        boxShadow: `
            0 10px 24px rgba(0, 0, 0, 0.15),
            inset -4px -8px 12px rgba(255, 255, 255, 0.35),
            inset 3px 3px 8px rgba(255, 255, 255, 0.5),
            inset 5px 10px 14px rgba(255, 255, 255, 0.25)
        `,
        border: "1px solid rgba(255, 255, 255, 0.6)",
    };

    return (
        <div
            {...props}
            ref={cursorRef}
            className={cn(
                "pointer-events-none fixed z-[99999] rounded-full flex items-center justify-center select-none backdrop-blur-[8px] saturate-[180%]",
                className,
            )}
            style={{
                height: size,
                width: size,
                willChange: "transform, left, top",
                ...(strong ? strongStyle : lightStyle),
            }}
        >
            <div ref={contentRef} className="flex items-center justify-center">
                {children}
            </div>
        </div>
    );
};

export default LiquidCursor;
