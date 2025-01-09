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
  Clock,
  CreditCard,
  Globe,
  Home,
  Info,
  LogOut,
  SquareMenu,
  Wallpaper,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConfigSwitcher } from "./ConfigSwitcher";
import { useEffect } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";

const items = [
  {
    title: "General",
    url: "/",
    icon: Home,
  },
  {
    title: "Hero",
    url: "/hero",
    icon: Wallpaper,
  },
  {
    title: "About",
    url: "/about",
    icon: Info,
  },
  {
    title: "Open hours",
    url: "/open-hours",
    icon: Clock,
  },
  {
    title: "Menu",
    url: "/menu",
    icon: SquareMenu,
  },
];

export function AppSidebar() {
  const { configs, selectedConfig, selectedDomain, customDomain } =
    useDataContext();
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const { user } = useUser();

  useEffect(() => {
    setOpenMobile(true);
  }, [setOpenMobile]);

  return (
    <Sidebar>
      <SidebarHeader className="gap-1">
        <ConfigSwitcher domains={configs.map((c) => c.domain ?? "")} />
        <LanguageSwitcher languages={selectedConfig?.languages ?? []} />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Website</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setOpenMobile(false)}
                    asChild
                    isActive={"/domains" === pathname}
                  >
                    <Link href="/domains">
                      <Globe />
                      <span>Domain</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
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
                    <Globe />
                    <span>My site</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => setOpenMobile(false)}
                    asChild
                    isActive={item.url === pathname}
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
      </SidebarContent>
      <SidebarFooter>
        <SidebarContent>
          <SidebarGroup>
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
