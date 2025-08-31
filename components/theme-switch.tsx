"use client";

import { FC, useEffect } from "react";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { SwitchProps, useSwitch } from "@heroui/switch";
import { useTheme } from "next-themes";
import { useIsSSR } from "@react-aria/ssr";
import clsx from "clsx";

import { SunFilledIcon, MoonFilledIcon } from "@/components/icons";

export interface ThemeSwitchProps {
  className?: string;
  classNames?: SwitchProps["classNames"];
}

// 判断是否为东八区白天（例如：6:00-18:00）
const isEastEightDaytime = () => {
  const now = new Date();
  // 转换为东八区时间（UTC+8）
  const utcHour = now.getUTCHours();
  const eastEightHour = (utcHour + 8) % 24;

  // 定义白天时段为6:00到18:00
  return eastEightHour >= 6 && eastEightHour < 18;
};

export const ThemeSwitch: FC<ThemeSwitchProps> = ({
  className,
  classNames,
}) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const isSSR = useIsSSR();

  // 初始化主题：首次加载且无保存的主题时，根据东八区时间设置
  useEffect(() => {
    // 仅在客户端且没有保存的主题时执行
    if (!isSSR && !theme) {
      setTheme(isEastEightDaytime() ? "light" : "dark");
    }
  }, [isSSR, theme, setTheme]);

  const onChange = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // 使用resolvedTheme获取实际生效的主题
  const effectiveTheme = resolvedTheme || theme;
  const {
    Component,
    slots,
    isSelected,
    getBaseProps,
    getInputProps,
    getWrapperProps,
  } = useSwitch({
    isSelected: effectiveTheme === "light" || isSSR,
    "aria-label": `Switch to ${effectiveTheme === "light" || isSSR ? "dark" : "light"} mode`,
    onChange,
  });

  return (
    <Component
      {...getBaseProps({
        className: clsx(
          "px-px transition-opacity hover:opacity-80 cursor-pointer",
          className,
          classNames?.base,
        ),
      })}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <div
        {...getWrapperProps()}
        className={slots.wrapper({
          class: clsx(
            [
              "w-auto h-auto",
              "bg-transparent",
              "rounded-lg",
              "flex items-center justify-center",
              "group-data-[selected=true]:bg-transparent",
              "!text-default-500",
              "pt-px",
              "px-0",
              "mx-0",
            ],
            classNames?.wrapper,
          ),
        })}
      >
        {!isSelected || isSSR ? (
          <SunFilledIcon size={22} />
        ) : (
          <MoonFilledIcon size={22} />
        )}
      </div>
    </Component>
  );
};
