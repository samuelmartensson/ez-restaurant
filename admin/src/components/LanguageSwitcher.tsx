import { Check, ChevronsUpDown, Languages } from "lucide-react";

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

export function LanguageSwitcher({ languages }: { languages: string[] }) {
  const { selectedLanguage, setSelectedLanguage } = useDataContext();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded">
                <Languages className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="">{selectedLanguage}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width]"
            align="start"
          >
            {languages.length === 0 && (
              <span className="m-auto block p-2 text-center text-sm text-muted-foreground">
                No domains yet
              </span>
            )}
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang}
                onSelect={() => setSelectedLanguage(lang)}
              >
                {lang}{" "}
                {lang === selectedLanguage && <Check className="ml-auto" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
