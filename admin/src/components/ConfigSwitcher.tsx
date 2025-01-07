import { Check, ChevronsUpDown, Globe } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useDataContext } from "./DataContextProvider";
import { useState } from "react";

export function ConfigSwitcher({ domains }: { domains: string[] }) {
  const { selectedDomain, setSelectedDomain } = useDataContext();
  const [open, setOpen] = useState(false);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Globe className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">Domains</span>
                <span className="">{selectedDomain}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            onFocusOutside={() => setOpen(false)}
            className="w-[--radix-dropdown-menu-trigger-width]"
            align="start"
          >
            {domains.length === 0 && (
              <span className="m-auto block p-2 text-center text-sm text-muted-foreground">
                No domains yet
              </span>
            )}
            {domains.map((version) => (
              <DropdownMenuItem
                key={version}
                onSelect={() => setSelectedDomain(version)}
              >
                {version}{" "}
                {version === selectedDomain && <Check className="ml-auto" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
