"use client"; // 根组件标记为客户端组件，控制渲染时机
import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// 工具函数保留
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 1. 根组件：控制 SSR/CSR 分离，服务端只渲染占位，客户端渲染完整动画
export const BackgroundBeamsWithCollision = ({
  className,
}: {
  className?: string;
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  // 核心状态：标记是否为客户端环境（服务端初始为 false，客户端挂载后为 true）
  const [isClient, setIsClient] = useState(false);

  // 客户端挂载后，标记为客户端环境（仅客户端执行）
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 光束配置保留（纯数据，服务端可安全处理）
  const beams = [
    { initialX: 10, translateX: 10, duration: 7, repeatDelay: 3, delay: 2 },
    { initialX: 600, translateX: 600, duration: 3, repeatDelay: 3, delay: 4 },
    { initialX: 100, translateX: 100, duration: 7, repeatDelay: 7, className: "h-6" },
    { initialX: 400, translateX: 400, duration: 5, repeatDelay: 14, delay: 4 },
    { initialX: 800, translateX: 800, duration: 11, repeatDelay: 2, className: "h-20" },
    { initialX: 1000, translateX: 1000, duration: 4, repeatDelay: 2, className: "h-12" },
    { initialX: 1200, translateX: 1200, duration: 6, repeatDelay: 4, delay: 2, className: "h-6" },
    { initialX: 50, translateX: 50, duration: 6, repeatDelay: 5, delay: 1, className: "h-8" },
    { initialX: 150, translateX: 150, duration: 8, repeatDelay: 6, className: "h-4" },
    { initialX: 200, translateX: 200, duration: 5, repeatDelay: 8, delay: 3 },
    { initialX: 300, translateX: 300, duration: 9, repeatDelay: 4, className: "h-16" },
    { initialX: 350, translateX: 350, duration: 4, repeatDelay: 10, delay: 5, className: "h-10" },
    { initialX: 500, translateX: 500, duration: 7, repeatDelay: 7 },
    { initialX: 550, translateX: 550, duration: 10, repeatDelay: 3, delay: 2, className: "h-6" },
    { initialX: 700, translateX: 700, duration: 6, repeatDelay: 9, className: "h-14" },
    { initialX: 900, translateX: 900, duration: 8, repeatDelay: 5, delay: 4 },
    { initialX: 1100, translateX: 1100, duration: 5, repeatDelay: 6, className: "h-8" },
    { initialX: 1300, translateX: 1300, duration: 7, repeatDelay: 8, delay: 1 },
    { initialX: 250, translateX: 350, duration: 12, repeatDelay: 6, className: "h-10" },
    { initialX: 950, translateX: 850, duration: 10, repeatDelay: 4, delay: 3, className: "h-12" },
  ];

  return (
    <div
      ref={parentRef}
      // 服务端/客户端统一容器结构（避免DOM层级不匹配）
      className={cn(
        "pointer-events-none fixed inset-0 z-50 overflow-hidden bg-transparent",
        className,
      )}
    >
      {/* 关键：仅客户端渲染光束组件，服务端渲染空div（占位，保持DOM结构一致） */}
      {isClient ? (
        beams.map((beam, index) => (
          <CollisionMechanism
            key={`${index}-${beam.initialX}-beam`} // 确保key唯一
            beamOptions={beam}
            parentRef={parentRef}
          />
        ))
      ) : (
        // 服务端占位：空div，与客户端渲染的光束数量一致（避免DOM数量不匹配）
        beams.map((_, index) => (
          <div key={`${index}-server-placeholder`} className="hidden" />
        ))
      )}
    </div>
  );
};

// 2. 碰撞检测组件：仅客户端执行（依赖window、getBoundingClientRect）
interface CollisionMechanismProps {
  parentRef: React.RefObject<HTMLDivElement>;
  beamOptions?: {
    initialX?: number;
    translateX?: number;
    initialY?: number;
    translateY?: number;
    rotate?: number;
    className?: string;
    duration?: number;
    delay?: number;
    repeatDelay?: number;
  };
}

const CollisionMechanism = React.forwardRef<
  HTMLDivElement,
  CollisionMechanismProps
>(({ parentRef, beamOptions = {} }, ref) => {
  const beamRef = useRef<HTMLDivElement>(null);
  const [collision, setCollision] = useState<{
    detected: boolean;
    coordinates: { x: number; y: number } | null;
  }>({ detected: false, coordinates: null });
  const [beamKey, setBeamKey] = useState(0);
  const [cycleCollisionDetected, setCycleCollisionDetected] = useState(false);

  // 碰撞检测：仅客户端执行（依赖window和DOM元素）
  useEffect(() => {
    const checkCollision = () => {
      // 双重保险：确保window存在且父容器、光束容器已挂载
      if (!window || !beamRef.current || !parentRef.current || cycleCollisionDetected) return;

      const beamRect = beamRef.current.getBoundingClientRect();
      const parentRect = parentRef.current.getBoundingClientRect();
      const windowBottom = window.innerHeight;

      // 检测光束触底
      if (beamRect.bottom >= windowBottom) {
        const relativeX = beamRect.left - parentRect.left + beamRect.width / 2;
        const relativeY = windowBottom - parentRect.top;

        setCollision({ detected: true, coordinates: { x: relativeX, y: relativeY } });
        setCycleCollisionDetected(true);
      }
    };

    // 客户端定时检测碰撞（50ms间隔，视觉流畅）
    const animationInterval = setInterval(checkCollision, 50);
    return () => clearInterval(animationInterval); // 组件卸载清理
  }, [cycleCollisionDetected, parentRef]);

  // 碰撞后重置状态
  useEffect(() => {
    if (collision.detected && collision.coordinates) {
      // 2秒后隐藏爆炸效果
      const hideExplosionTimer = setTimeout(() => {
        setCollision({ detected: false, coordinates: null });
        setCycleCollisionDetected(false);
      }, 2000);

      // 2秒后重置光束（触发重新渲染，避免动画状态残留）
      const resetBeamTimer = setTimeout(() => {
        setBeamKey((prevKey) => prevKey + 1);
      }, 2000);

      // 清理定时器
      return () => {
        clearTimeout(hideExplosionTimer);
        clearTimeout(resetBeamTimer);
      };
    }
  }, [collision]);

  // 光束默认配置（避免undefined）
  const defaultOptions = {
    initialX: 0,
    translateX: 0,
    initialY: "-200px",
    translateY: "1800px",
    rotate: 0,
    duration: 8,
    delay: 0,
    repeatDelay: 0,
    className: "",
    ...beamOptions,
  };

  return (
    <>
      {/* 光束动画：仅客户端渲染（Framer Motion动画） */}
      <motion.div
        key={beamKey}
        ref={beamRef}
        // 客户端直接启动动画（无需initial状态，因为服务端不渲染此元素）
        animate="animate"
        initial="initial"
        variants={{
          initial: {
            translateY: defaultOptions.initialY,
            translateX: `${defaultOptions.initialX}px`,
            rotate: defaultOptions.rotate,
          },
          animate: {
            translateY: defaultOptions.translateY,
            translateX: `${defaultOptions.translateX}px`,
            rotate: defaultOptions.rotate,
          },
        }}
        transition={{
          duration: defaultOptions.duration,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
          delay: defaultOptions.delay,
          repeatDelay: defaultOptions.repeatDelay,
        }}
        className={cn(
          "absolute left-0 top-20 m-auto h-14 w-px rounded-full bg-gradient-to-t from-indigo-500 via-purple-500 to-transparent",
          defaultOptions.className,
        )}
      />

      {/* 爆炸效果：仅客户端渲染（依赖碰撞状态） */}
      <AnimatePresence>
        {collision.detected && collision.coordinates && (
          <Explosion
            key={`explosion-${collision.coordinates.x}-${collision.coordinates.y}`}
            style={{
              left: `${collision.coordinates.x}px`,
              top: `${collision.coordinates.y}px`,
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
});

CollisionMechanism.displayName = "CollisionMechanism"; // 保留displayName，方便调试

// 3. 爆炸效果组件：仅客户端渲染（依赖随机值和动画）
interface ExplosionProps extends React.HTMLProps<HTMLDivElement> {}

const Explosion = ({ ...props }: ExplosionProps) => {
  const [spans, setSpans] = useState<
    Array<{
      id: number;
      initialX: number;
      initialY: number;
      directionX: number;
      directionY: number;
    }>
  >([]);

  // 客户端挂载后生成随机爆炸粒子（避免服务端生成随机值导致不匹配）
  useEffect(() => {
    const randomSpans = Array.from({ length: 20 }, (_, index) => ({
      id: index,
      initialX: 0,
      initialY: 0,
      directionX: Math.floor(Math.random() * 80 - 40), // 随机X方向偏移
      directionY: Math.floor(Math.random() * -50 - 10), // 随机Y方向偏移
    }));
    setSpans(randomSpans);
  }, []);

  return (
    <div {...props} className={cn("absolute z-50 h-2 w-2", props.className)}>
      {/* 爆炸光晕 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute -inset-x-10 top-0 m-auto h-2 w-10 rounded-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent blur-sm"
      />

      {/* 爆炸粒子：仅客户端渲染（spans为空时不渲染，服务端时为空） */}
      {spans.map((span) => (
        <motion.span
          key={span.id}
          initial={{ x: span.initialX, y: span.initialY, opacity: 1 }}
          animate={{ x: span.directionX, y: span.directionY, opacity: 0 }}
          transition={{ duration: Math.random() * 1.5 + 0.5, ease: "easeOut" }}
          className="absolute h-1 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500"
        />
      ))}
    </div>
  );
};