import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { ReactNode } from "react";

const MobileDrawer = ({
  children,
  open,
  setIsOpen,
  title,
}: {
  open: boolean;
  title: ReactNode;
  setIsOpen?: (state: boolean) => void;
  children: ReactNode;
}) => {
  const isMobile = useIsMobile();

  if (!isMobile) return children;

  return (
    <Drawer
      open={open}
      onOpenChange={setIsOpen}
      onAnimationEnd={(open) => open && setIsOpen?.(false)}
    >
      <DrawerContent className="min-h-[80svh]">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <div className="p-2">{children}</div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileDrawer;
