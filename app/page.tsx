"use client";
import { useEffect } from "react";
import { useTheme } from "next-themes";
import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { button as buttonStyles } from "@heroui/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import fluidCursor from "@/components/fluidcursor_monitor";
import { BackgroundBeamsWithCollision } from "@/components/background-beams-with-collision";

import GitHubCalendar from "react-github-calendar";

export default function Home() {
  const { resolvedTheme } = useTheme();
  // 副作用，获取canvas并更新流体光标
  useEffect(() => {
    fluidCursor();
  }, []);

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      {/* <FluidCursor /> 流体光标的依赖canvas，fluidCursor根据id更改canvas实现流体光标  */}
      <div className="fixed top-0 left-0 z-2 pointer-events-none">
        <canvas className="w-screen h-screen pointer-events-none" id="fluid" />
      </div>
      <BackgroundBeamsWithCollision />
      {/* 主体内容 */}
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title({ size: "md" })}>Right way to get&nbsp;</span>
        <span className={title({ color: "violet", size: "lg" })}>start</span>
        <span className={title({ size: "md" })}>ed&nbsp;</span>
        <br />
        <span className={title({ size: "md" })}>is all you need.</span>
        <div className={subtitle({ class: "mt-4" })}>
          计算机是一门越学越觉得还需要学更多内容的学科
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          isExternal
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          href="/articles"
        >
          阅读最新文章
        </Link>
        <Link
          isExternal
          className={buttonStyles({ variant: "bordered", radius: "full" })}
          href={siteConfig.links.github}
        >
          <GithubIcon size={20} />
          GitHub
        </Link>
      </div>

      <div className="mt-8">
        <Snippet hideCopyButton hideSymbol variant="bordered">
          <span>
            Building by framework <Code color="primary">Next.js</Code>
          </span>
        </Snippet>
      </div>
      <div className="flex justify-center pt-4">
        <GitHubCalendar
          username="Moeus"
          fontSize={12}
          errorMessage=""
          colorScheme={
            resolvedTheme !== "system"
              ? (resolvedTheme as "light" | "dark")
              : undefined
          }
        />
      </div>
    </section>
  );
}
