"use client";

import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useScroll, useSpring, useTransform } from "framer-motion";
import { motion } from "framer-motion";
import { Menu, PlusCircle, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useBreakpoints } from "@/hooks/useBreakpoints";
import { useWindow } from "@/hooks/useWindow";
import { cn } from "@/lib/utils";

import { Button } from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

interface Link {
  title: React.ReactNode;
  href: string;
  description?: string;
}

interface LinkGroup {
  group: string;
  links: Link[];
}

const links: (Link | LinkGroup)[] = [
  {
    group: "Accounts",
    links: [
      {
        title: "Accounts",
        href: "/accounts",
        description: "Veiw all ID accounts",
      },
      {
        title: "My Accounts",
        href: "/my-accounts",
        description: "Manage your IDs",
      },
    ],
  },
  {
    title: (
      <span className="flex items-center gap-2">
        <PlusCircle className="size-4" />
        Create
      </span>
    ),
    href: "/new",
  },
];

export function Header() {
  const { scrollY } = useScroll();
  const { height } = useWindow();
  const { min, max } = useBreakpoints();
  const pathname = usePathname();

  const scrollOffset = (height ?? 1000) / 2;

  const position = useTransform(scrollY, [300, scrollOffset], [100, 0]);
  const translation = useSpring(position, { damping: 25, stiffness: 300 });

  const renderGroup = (group: LinkGroup, idx: number) => (
    <NavigationMenuItem key={idx}>
      <NavigationMenuTrigger>{group.group}</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[300px] gap-3 p-4">
          {group.links.map((link, index) => (
            <ListItem key={index} title={link.title as any} href={link.href}>
              {link.description}
            </ListItem>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );

  const renderLink = (link: Link, idx: number) => (
    <NavigationMenuItem key={idx}>
      <Link href={link.href} legacyBehavior passHref>
        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
          {link.title}
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  );

  const renderNav = (linkOrGroup: Link | LinkGroup, index: number) => {
    return "title" in linkOrGroup
      ? renderLink(linkOrGroup as Link, index)
      : renderGroup(linkOrGroup as LinkGroup, index);
  };

  const scrollToTop = () => {
    window?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const LogoWrapper = ({ children }: { children: React.ReactNode }) => {
    if (pathname !== "/") {
      return <Link href="/">{children}</Link>;
    }

    return (
      <motion.div
        onClick={scrollToTop}
        className="cursor-pointer"
        style={{ translateY: translation }}
      >
        {children}
      </motion.div>
    );
  };

  const MobileNav = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="IDSwapp"
            width={200}
            height={200}
            className="w-[150px] md:w-[200px]"
          />
        </Link>
        <div className="flex flex-col-reverse gap-4 py-4">
          {links.map((linkOrGroup, idx) => {
            if ("title" in linkOrGroup) {
              const link = linkOrGroup as Link;
              return (
                <Link
                  key={idx}
                  href={link.href}
                  className="text-lg font-medium"
                >
                  {link.title}
                </Link>
              );
            }
            const group = linkOrGroup as LinkGroup;
            return (
              <div key={idx} className="flex flex-col gap-2">
                {group.links.map((link, index) => (
                  <Link key={index} href={link.href}>
                    {link.title}
                  </Link>
                ))}
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="fixed top-0 z-50 w-full bg-background py-4">
      <div className="container relative flex w-full items-center justify-between pl-4">
        <div className="flex items-center gap-4">
          <MobileNav />
          <NavigationMenu className="hidden md:block">
            <NavigationMenuList>{links.map(renderNav)}</NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="absolute inset-x-0 mx-auto w-fit overflow-hidden max-xs:hidden">
          <LogoWrapper>
            <Image
              src="/logo.svg"
              alt="IDSwapp"
              width={200}
              height={200}
              className="w-[150px] md:w-[200px]"
            />
          </LogoWrapper>
        </div>

        <ConnectButton
          label={min("sm") ? ((<Wallet />) as any as string) : undefined}
          accountStatus="avatar"
          showBalance={min("lg")}
          chainStatus="icon"
        />
      </div>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
