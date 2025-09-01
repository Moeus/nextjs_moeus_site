"use client"; // 关键：标记为客户端组件，避免SSR执行客户端特有API
import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BackgroundBeamsWithCollision = ({
  className,
}: {
  className?: string;
}) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const beams = [
    // 原有光束保持不变
    {
    // 初始水平位置（单位：px），光束从该X坐标开始下落
    initialX: 10,
    // 运动时的水平位置（单位：px）：
    // - 若与initialX相同，光束垂直下落；
    // - 若与initialX不同，光束会沿水平方向偏移（如斜向运动）
    translateX: 10,
    // 单次下落动画的持续时间（单位：秒），数值越小下落速度越快
    duration: 7,
    // 每次动画循环之间的间隔时间（单位：秒），即光束落地后停顿多久重新开始下落
    repeatDelay: 3,
    // 首次动画开始前的延迟时间（单位：秒），用于错开多个光束的启动时间，避免同步
    delay: 2,
    // 可选：自定义样式类，用于覆盖默认高度（如h-6、h-10等），不设置则使用默认高度h-14
    // className: "h-8" 雨滴长度
    },
    {
      initialX: 600,
      translateX: 600,
      duration: 3,
      repeatDelay: 3,
      delay: 4,
    },
    {
      initialX: 100,
      translateX: 100,
      duration: 7,
      repeatDelay: 7,
      className: "h-6",
    },
    {
      initialX: 400,
      translateX: 400,
      duration: 5,
      repeatDelay: 14,
      delay: 4,
    },
    {
      initialX: 800,
      translateX: 800,
      duration: 11,
      repeatDelay: 2,
      className: "h-20",
    },
    {
      initialX: 1000,
      translateX: 1000,
      duration: 4,
      repeatDelay: 2,
      className: "h-12",
    },
    {
      initialX: 1200,
      translateX: 1200,
      duration: 6,
      repeatDelay: 4,
      delay: 2,
      className: "h-6",
    },

    // 新增光束 - 左侧区域
    {
      initialX: 50,
      translateX: 50,
      duration: 6,
      repeatDelay: 5,
      delay: 1,
      className: "h-8",
    },
    {
      initialX: 150,
      translateX: 150,
      duration: 8,
      repeatDelay: 6,
      className: "h-4",
    },
    {
      initialX: 200,
      translateX: 200,
      duration: 5,
      repeatDelay: 8,
      delay: 3,
    },

    // 新增光束 - 中间区域
    {
      initialX: 300,
      translateX: 300,
      duration: 9,
      repeatDelay: 4,
      className: "h-16",
    },
    {
      initialX: 350,
      translateX: 350,
      duration: 4,
      repeatDelay: 10,
      delay: 5,
      className: "h-10",
    },
    {
      initialX: 500,
      translateX: 500,
      duration: 7,
      repeatDelay: 7,
    },
    {
      initialX: 550,
      translateX: 550,
      duration: 10,
      repeatDelay: 3,
      delay: 2,
      className: "h-6",
    },

    // 新增光束 - 右侧区域
    {
      initialX: 700,
      translateX: 700,
      duration: 6,
      repeatDelay: 9,
      className: "h-14",
    },
    {
      initialX: 900,
      translateX: 900,
      duration: 8,
      repeatDelay: 5,
      delay: 4,
    },
    {
      initialX: 1100,
      translateX: 1100,
      duration: 5,
      repeatDelay: 6,
      className: "h-8",
    },
    {
      initialX: 1300,
      translateX: 1300,
      duration: 7,
      repeatDelay: 8,
      delay: 1,
    },

    // 新增斜向光束（增加水平位移变化）
    {
      initialX: 250,
      translateX: 350, // 斜向右下方运动
      duration: 12,
      repeatDelay: 6,
      className: "h-10",
    },
    {
      initialX: 950,
      translateX: 850, // 斜向左下方运动
      duration: 10,
      repeatDelay: 4,
      delay: 3,
      className: "h-12",
    },
  ];

  return (
    <div
      ref={parentRef}
      className={cn(
        "pointer-events-none fixed inset-0 z-50 overflow-hidden bg-transparent",
        className,
      )}
    >
      {/* 修复key：用index+initialX确保唯一，避免重复导致渲染异常 */}
      {beams.map((beam, index) => (
        <CollisionMechanism
          key={`${index}-${beam.initialX}-beam`}
          beamOptions={beam}
          parentRef={parentRef}
        />
      ))}
    </div>
  );
};

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
  }>({
    detected: false,
    coordinates: null,
  });
  const [beamKey, setBeamKey] = useState(0);
  const [cycleCollisionDetected, setCycleCollisionDetected] = useState(false);
  // 新增：标记是否为客户端环境，避免SSR动画状态不匹配
  const [isClient, setIsClient] = useState(false);

  // 客户端挂载后标记isClient为true
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const checkCollision = () => {
      // 关键：服务端无window，直接跳过，避免执行客户端API
      if (typeof window === "undefined") return;

      if (beamRef.current && parentRef.current && !cycleCollisionDetected) {
        const beamRect = beamRef.current.getBoundingClientRect();
        const parentRect = parentRef.current.getBoundingClientRect();
        const windowBottom = window.innerHeight;

        if (beamRect.bottom >= windowBottom) {
          const relativeX =
            beamRect.left - parentRect.left + beamRect.width / 2;
          const relativeY = windowBottom - parentRect.top;

          setCollision({
            detected: true,
            coordinates: {
              x: relativeX,
              y: relativeY,
            },
          });
          setCycleCollisionDetected(true);
        }
      }
    };

    const animationInterval = setInterval(checkCollision, 50);

    return () => clearInterval(animationInterval);
  }, [cycleCollisionDetected, parentRef]);

  useEffect(() => {
    if (collision.detected && collision.coordinates) {
      setTimeout(() => {
        setCollision({ detected: false, coordinates: null });
        setCycleCollisionDetected(false);
      }, 2000);

      setTimeout(() => {
        setBeamKey((prevKey) => prevKey + 1);
      }, 2000);
    }
  }, [collision]);

  return (
    <>
      <motion.div
        key={beamKey}
        ref={beamRef}
        // 修复：客户端挂载后才启动动画，服务端保持初始状态
        animate={isClient ? "animate" : "initial"}
        initial={{
          translateY: beamOptions.initialY || "-200px",
          translateX: beamOptions.initialX || "0px",
          rotate: beamOptions.rotate || 0,
        }}
        // 新增initial变体：服务端渲染时的静态状态，避免与客户端差异
        variants={{
          initial: {
            translateY: beamOptions.initialY || "-200px",
            translateX: beamOptions.initialX || "0px",
            rotate: beamOptions.rotate || 0,
          },
          animate: {
            translateY: beamOptions.translateY || "1800px",
            translateX: beamOptions.translateX || "0px",
            rotate: beamOptions.rotate || 0,
          },
        }}
        transition={{
          duration: beamOptions.duration || 8,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
          delay: beamOptions.delay || 0,
          repeatDelay: beamOptions.repeatDelay || 0,
        }}
        className={cn(
          "absolute left-0 top-20 m-auto h-14 w-px rounded-full bg-gradient-to-t from-indigo-500 via-purple-500 to-transparent",
          beamOptions.className,
        )}
      />
      <AnimatePresence>
        {collision.detected && collision.coordinates && (
          <Explosion
            key={`${collision.coordinates.x}-${collision.coordinates.y}`}
            className=""
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

CollisionMechanism.displayName = "CollisionMechanism";

interface ExplosionProps extends React.HTMLProps<HTMLDivElement> {}

const Explosion = ({ ...props }: ExplosionProps) => {
  // 修复：用useState存储spans，客户端挂载后再生成随机值（避免SSR/client不一致）
  const [spans, setSpans] = useState<
    Array<{
      id: number;
      initialX: number;
      initialY: number;
      directionX: number;
      directionY: number;
    }>
  >([]);

  // 客户端挂载后生成随机spans，服务端渲染时spans为空
  useEffect(() => {
    const randomSpans = Array.from({ length: 20 }, (_, index) => ({
      id: index,
      initialX: 0,
      initialY: 0,
      directionX: Math.floor(Math.random() * 80 - 40),
      directionY: Math.floor(Math.random() * -50 - 10),
    }));
    setSpans(randomSpans);
  }, []);

  return (
    <div {...props} className={cn("absolute z-50 h-2 w-2", props.className)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute -inset-x-10 top-0 m-auto h-2 w-10 rounded-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent blur-sm"
      ></motion.div>
      {/* 只渲染客户端生成的spans（服务端时为空，无差异） */}
      {spans.map((span) => (
        <motion.span
          key={span.id}
          initial={{ x: span.initialX, y: span.initialY, opacity: 1 }}
          animate={{
            x: span.directionX,
            y: span.directionY,
            opacity: 0,
          }}
          transition={{ duration: Math.random() * 1.5 + 0.5, ease: "easeOut" }}
          className="absolute h-1 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500"
        />
      ))}
    </div>
  );
};
