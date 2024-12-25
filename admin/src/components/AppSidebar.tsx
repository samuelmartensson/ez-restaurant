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
import { SignOutButton, UserButton } from "@clerk/nextjs";
import { CreditCard, Globe, Home, SquareMenu, Wallpaper } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { VersionSwitcher } from "./ConfigSwitcher";
import { useEffect } from "react";

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
  const { configs, selectedDomain } = useDataContext();
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

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
                      window.location.href =
                        process.env.NODE_ENV === "production"
                          ? `https://${selectedDomain.replaceAll(" ", "")}.ezrest.se`
                          : `http://localhost:3001?key=${selectedDomain}`;
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
            <SidebarGroupLabel>Customer</SidebarGroupLabel>
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
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
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
