"use client";
import { useDataContext } from "@/components/DataContextProvider";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { SignOutButton, useUser } from "@clerk/nextjs";
import {
  BarChart,
  Clock,
  CreditCard,
  Globe,
  Home,
  Image,
  Images,
  Info,
  Instagram,
  Languages,
  LogOut,
  Newspaper,
  ScreenShare,
  Settings2,
  SquareMenu,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { ConfigSwitcher } from "./ConfigSwitcher";
import { LanguageSwitcher } from "./LanguageSwitcher";

const settings = [
  {
    title: "General settings",
    url: "/",
    icon: Settings2,
  },
  {
    title: "Languages",
    url: "/languages",
    icon: Languages,
  },
  {
    title: "Media, Theme & Font",
    url: "/?media=true",
    icon: Image,
  },
  {
    title: "Social channels",
    url: "/?socials=true",
    icon: Instagram,
  },
];

const sections = [
  {
    title: "Home page",
    url: "/hero",
    icon: Home,
  },
  {
    title: "Menu page",
    url: "/menu",
    icon: SquareMenu,
  },
  {
    title: "About page",
    url: "/about",
    icon: Info,
  },
  {
    title: "Gallery",
    url: "/gallery",
    icon: Images,
  },
  {
    title: "News",
    url: "/news",
    icon: Newspaper,
  },
  {
    title: "Open hours",
    url: "/open-hours",
    icon: Clock,
  },
];

const groups = [
  { title: "Sections", items: sections },
  { title: "Settings", items: settings },
];

export function AppSidebar() {
  const { configs, selectedConfig, selectedDomain, customDomain } =
    useDataContext();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { setOpenMobile } = useSidebar();
  const { user } = useUser();

  useEffect(() => {
    setOpenMobile(true);
  }, [setOpenMobile]);

  return (
    <Sidebar>
      <SidebarHeader className="gap-1">
        <ConfigSwitcher domains={configs.map((c) => c.domain ?? "")} />
        {(selectedConfig?.languages ?? []).length > 1 && (
          <LanguageSwitcher languages={selectedConfig?.languages ?? []} />
        )}
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Website</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => {
                      const prodUrl = customDomain
                        ? `https://${customDomain}`
                        : `https://${selectedDomain.replaceAll(" ", "")}.ezrest.se`;

                      window.open(
                        process.env.NODE_ENV === "production"
                          ? prodUrl
                          : `http://localhost:3001?key=${selectedDomain}`,
                        "_blank",
                      );
                    }}
                    disabled={!selectedDomain}
                  >
                    <ScreenShare />
                    <span>Preview my site</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setOpenMobile(false)}
                    asChild
                    isActive={"/domains" === pathname}
                  >
                    <Link href="/domains">
                      <Globe />
                      <span>Domain & DNS</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setOpenMobile(false)}
                    asChild
                    isActive={"/analytics" === pathname}
                  >
                    <Link href="/analytics">
                      <BarChart />
                      <span>Analytics</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </SidebarHeader>
      <SidebarContent className="shadow-inner">
        {groups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => setOpenMobile(false)}
                      asChild
                      isActive={
                        item.url ===
                        `${pathname}${!!searchParams.toString() ? `?${searchParams.toString()}` : ""}`
                      }
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t shadow-2xl md:shadow-none md:shadow-black">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="h-auto font-bold">
              My account
            </SidebarGroupLabel>
            <SidebarGroupLabel>{user?.fullName}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setOpenMobile(false)}
                    asChild
                    isActive={"/subscription" === pathname}
                  >
                    <Link href="/subscription">
                      <CreditCard />
                      <span>Manage subscription</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SignOutButton>
                    <SidebarMenuButton>
                      <LogOut /> Sign out
                    </SidebarMenuButton>
                  </SignOutButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </SidebarFooter>
    </Sidebar>
  );
}
