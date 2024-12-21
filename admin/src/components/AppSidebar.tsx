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
} from "@/components/ui/sidebar";
import { SignOutButton, UserButton } from "@clerk/nextjs";
import { Globe, Home, SquareMenu, Wallpaper } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { VersionSwitcher } from "./ConfigSwitcher";

const items = [
  {
    title: "Domain",
    url: "/domain",
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
    title: "Menu",
    url: "/menu",
    icon: SquareMenu,
  },
];

export function AppSidebar() {
  const { configs } = useDataContext();
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <VersionSwitcher domains={configs.map((c) => c.domain ?? "")} />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>User</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <UserButton
                    showName
                    appearance={{ layout: { logoPlacement: "none" } }}
                  />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.url === pathname}>
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
            <SidebarGroupLabel>Customer</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/">
                      <Globe />
                      <span>My site</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <SignOutButton />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </SidebarFooter>
    </Sidebar>
  );
}
