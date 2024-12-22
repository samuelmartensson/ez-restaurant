"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  btnLabel: React.ReactNode;
  category: string;
  setCategory: (value: string) => void;
  items: { id: number; name: string }[];
  selectedCategory: number;
  setSelectedCategory: (value: number) => void;
  onClick: () => void;
  onBadgeClick: (value: {
    isSelected: boolean;
    id: number;
    name: string;
  }) => void;
}

const MenuCategories = ({
  category,
  btnLabel: selected,
  setCategory,
  items,
  selectedCategory,
  onClick,
  onBadgeClick,
}: Props) => {
  return (
    <div className="mb-8">
      <div className="text-xl mb-2">Categories</div>
      <div className="flex gap-2 mb-2">
        <Input
          placeholder="Add category..."
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <Button onClick={onClick}>
          {selected ? "Update category" : "Add category"}
        </Button>
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
