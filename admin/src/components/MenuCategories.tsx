"use client";

import { Badge, BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

type Item = { id: number; name: string; order: number };
interface Props {
  isSelected: React.ReactNode;
  category: string;
  setCategory: (value: string) => void;
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  selectedCategory: number;
  setSelectedCategory: (value: number) => void;
  onClick: () => void;
  onDelete: () => void;
  onBadgeClick: (value: {
    isSelected: boolean;
    id: number;
    name: string;
  }) => void;
  onOrderChange: (items: Item[]) => void;
}

const DraggableBadge = ({
  draggableId,
  onMovePrev,
  onMoveNext,
  ...props
}: BadgeProps & {
  draggableId: number;
  onMovePrev: () => void;
  onMoveNext: () => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: draggableId,
    });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(
      transform && { y: 0, scaleY: 1, x: transform.x, scaleX: 1 }
    ),
    transition,
    cursor: "move",
  };

  return (
    <Badge
      {...props}
      style={style}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="whitespace-nowrap text-base"
    >
      <ChevronLeft
        onClick={(e) => {
          e.stopPropagation();
          onMovePrev();
        }}
        size={16}
      />
      {props.children}
      <ChevronRight
        onClick={(e) => {
          e.stopPropagation();
          onMoveNext();
        }}
        size={16}
      />
    </Badge>
  );
};

const MenuCategories = ({
  category,
  isSelected,
  setCategory,
  items,
  setItems,
  selectedCategory,
  onClick,
  onDelete,
  onBadgeClick,
  onOrderChange,
}: Props) => {
  const sensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 10 },
  });

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      const activeIndex = items.findIndex((i) => i.id === active.id);
      const overIndex = items.findIndex((i) => i.id === over?.id);
      const result = arrayMove(items, activeIndex, overIndex);
      setItems(result);
      onOrderChange(result);
    }
  };

  const onMoveClick = ({
    activeId,
    dir,
  }: {
    activeId: number;
    dir: "left" | "right";
  }) => {
    const activeIndex = items.findIndex((i) => i.id === activeId);
    let overIndex = activeIndex + 1;
    if (dir === "left") overIndex = activeIndex - 1;
    const result = arrayMove(items, activeIndex, overIndex);
    setItems(result);
    onOrderChange(result);
  };

  return (
    <DndContext sensors={[sensor]} onDragEnd={onDragEnd}>
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-2">
          <Input
            className="flex-1"
            placeholder="Add category..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <Button className="ml-auto" onClick={onClick}>
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
                    This action cannot be undone. This will permanently delete
                    the <span className="font-bold">{category}</span> category
                    and all its items.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="destructive"
                    type="button"
                    onClick={onDelete}
                  >
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <SortableContext items={items} strategy={horizontalListSortingStrategy}>
          <div
            style={{ maxWidth: "calc(100vw - 24px)" }}
            className="flex overflow-auto gap-1 py-2"
          >
            {items.map(({ id, name }) => {
              const parsedId = Number(id);
              const isSelected = selectedCategory === parsedId;

              return (
                <DraggableBadge
                  onMoveNext={() => onMoveClick({ activeId: id, dir: "right" })}
                  onMovePrev={() => onMoveClick({ activeId: id, dir: "left" })}
                  draggableId={id}
                  variant={
                    selectedCategory === parsedId ? "default" : "outline"
                  }
                  onClick={() => {
                    onBadgeClick({ id: parsedId, isSelected, name });
                  }}
                  className="text-base cursor-pointer select-none"
                  key={parsedId}
                >
                  {name}
                </DraggableBadge>
              );
            })}
          </div>
        </SortableContext>
      </div>
    </DndContext>
  );
};

export default MenuCategories;
