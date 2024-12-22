"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  isSelected: React.ReactNode;
  category: string;
  setCategory: (value: string) => void;
  items: { id: number; name: string }[];
  selectedCategory: number;
  setSelectedCategory: (value: number) => void;
  onClick: () => void;
  onDelete: () => void;
  onBadgeClick: (value: {
    isSelected: boolean;
    id: number;
    name: string;
  }) => void;
}

const MenuCategories = ({
  category,
  isSelected,
  setCategory,
  items,
  selectedCategory,
  onClick,
  onDelete,
  onBadgeClick,
}: Props) => {
  return (
    <div className="mb-8">
      <div className="text-xl mb-2">Categories</div>
      <div className="flex flex-wrap gap-2 mb-2">
        <Input
          className="max-w-[250px]"
          placeholder="Add category..."
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <Button onClick={onClick}>
          {isSelected ? "Update category" : "Add category"}
        </Button>
        {isSelected && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete{" "}
                  <span className="font-bold">{category}</span>.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="destructive" type="button" onClick={onDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className="flex flex-wrap gap-1">
        {items.map(({ id, name }) => {
          const parsedId = Number(id);
          const isSelected = selectedCategory === parsedId;

          return (
            <Badge
              variant={selectedCategory === parsedId ? "default" : "outline"}
              onClick={() => {
                onBadgeClick({ id: parsedId, isSelected, name });
              }}
              className="text-base cursor-pointer select-none"
              key={parsedId}
            >
              {name}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export default MenuCategories;
