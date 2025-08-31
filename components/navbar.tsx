import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Kbd } from "@heroui/kbd";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  TwitterIcon,
  GithubIcon,
  DiscordIcon,
  QQIcon,
  HeartFilledIcon,
  SearchIcon,
  Logo,
} from "@/components/icons";

/**
 * 网站的导航栏组件。
 * 包含 Logo、网站标题、导航链接、社交媒体链接、主题切换、搜索框和赞助链接。
 * 具有响应式设计，在小屏幕上会显示为可切换的菜单。
 */
export const Navbar = () => {
  /**
   * 搜索输入框组件。
   * 包含搜索图标、占位符、键盘快捷键提示 (Command + K)。
   */
  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        // 在大屏幕上显示键盘快捷键提示
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  return (
    // HeroUI 的 Navbar 组件，设置最大宽度和固定定位
    <HeroUINavbar maxWidth="xl" position="sticky">
      {/* 导航栏左侧内容：Logo、网站标题和主要导航链接 */}
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        {/* 网站 Logo 和标题 */}
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">Moeus.site</p>
          </NextLink>
        </NavbarBrand>
        {/* 主要导航链接，在大屏幕上显示 */}
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      {/* 导航栏右侧内容：社交媒体链接、主题切换、搜索框和赞助链接 */}
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        {/* 社交媒体图标和主题切换，在小屏幕以上显示 */}
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal aria-label="QQ" href={siteConfig.links.qq}>
            <QQIcon className="text-default-500" />
          </Link>

          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
        {/* 搜索输入框，在大屏幕上显示 */}
        <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
        {/* 赞助按钮，在中等屏幕以上显示 */}
        <NavbarItem className="hidden md:flex">
          <Button
            isExternal
            as={Link}
            className="text-sm font-normal text-default-600 bg-default-100"
            href={siteConfig.links.sponsor}
            startContent={<HeartFilledIcon className="text-danger" />}
            variant="flat"
          >
            Sponsor
          </Button>
        </NavbarItem>
      </NavbarContent>

      {/* 移动端导航栏内容：Github 图标、主题切换和菜单切换按钮 */}
      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal aria-label="Github" href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle /> {/* 菜单切换按钮 ，触发NavbarMenu查看菜单 */}
      </NavbarContent>

      {/* 响应式菜单：仅在小屏幕下显示，包含搜索框和菜单项 */}
      <NavbarMenu>
        {searchInput} {/* 移动端菜单中的搜索框 */}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
