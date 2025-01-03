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
  LogOut,
  SquareMenu,
  Wallpaper,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { VersionSwitcher } from "./ConfigSwitcher";
import { useEffect } from "react";

const items = [
  {
    title: "Domains",
    url: "/domains",
    icon: Globe,
  },
  {
    title: "Site",
    url: "/",
    icon: Home,
  },
  {
    title: "Hero",
    url: "/hero",
    icon: Wallpaper,
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
  const { configs, selectedDomain, customDomain } = useDataContext();
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const { user } = useUser();

  useEffect(() => {
    setOpenMobile(true);
  }, [setOpenMobile]);

  return (
    <Sidebar variant="floating">
      <SidebarHeader>
        <VersionSwitcher domains={configs.map((c) => c.domain ?? "")} />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => {
                      const prodUrl =
                        customDomain ||
                        `https://${selectedDomain.replaceAll(" ", "")}.ezrest.se`;

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
          <SidebarGroupLabel>Application</SidebarGroupLabel>
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
