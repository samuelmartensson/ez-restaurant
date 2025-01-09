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
import React, { Dispatch, SetStateAction } from "react";

type Item = { id: number; name: string; order: number; description: string };
interface Props {
  isSelected: React.ReactNode;
  category: { name: string; description: string };
  setCategory: Dispatch<
    SetStateAction<{
      name: string;
      description: string;
    }>
  >;
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
    description: string;
  }) => void;
  onOrderChange: (items: Item[]) => void;
}

const DraggableBadge = ({
  draggableId,
  onMovePrev,
  onMoveNext,
  onClick,
  ...props
}: BadgeProps & {
  draggableId: number;
  onMovePrev: () => void;
  onMoveNext: () => void;
  onClick: () => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: draggableId,
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(
      transform && { y: 0, scaleY: 1, x: transform.x, scaleX: 1 },
    ),
    transition,
    cursor: "move",
    zIndex: isDragging ? 2 : 1,
  };

  return (
    <Badge
      {...props}
      style={style}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      className="flex gap-1 whitespace-nowrap rounded-full text-sm"
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onMovePrev();
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <ChevronLeft />
      </Button>
      {props.children}
      <Button
        type="button"
        size="icon"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          onMoveNext();
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <ChevronRight />
      </Button>
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
      <div className="sticky top-0 z-10 mb-4 overflow-auto bg-white">
        <SortableContext items={items} strategy={horizontalListSortingStrategy}>
          <div
            style={{ maxWidth: "100%" }}
            className="mb-4 flex gap-1 overflow-auto py-2"
          >
            {items.map(({ id, name, description }) => {
              const parsedId = Number(id);
              const isSelected = selectedCategory === parsedId;

              return (
                <DraggableBadge
                  onMoveNext={() => onMoveClick({ activeId: id, dir: "right" })}
                  onMovePrev={() => onMoveClick({ activeId: id, dir: "left" })}
                  draggableId={id}
                  variant={
                    selectedCategory === parsedId ? "default" : "secondary"
                  }
                  onClick={() => {
                    onBadgeClick({
                      id: parsedId,
                      isSelected,
                      name,
                      description,
                    });
                  }}
                  className="cursor-pointer select-none text-base"
                  key={parsedId}
                >
                  <div className="select-none">{name}</div>
                </DraggableBadge>
              );
            })}
          </div>
        </SortableContext>
        <div className="mb-2 flex flex-wrap gap-2 overflow-auto">
          <Input
            className="flex-1"
            placeholder="Add category..."
            value={category.name}
            onChange={(e) =>
              setCategory((s) => ({ ...s, name: e.target.value }))
            }
          />
          {isSelected && (
            <div className="w-full">
              <Input
                className="flex-1"
                placeholder="Category description"
                value={category.description}
                onChange={(e) =>
                  setCategory((s) => ({ ...s, description: e.target.value }))
                }
              />
            </div>
          )}
          {isSelected && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="ml-auto" variant="destructive">
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    the <span className="font-bold">{category.name}</span>{" "}
                    category and all its items.
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
          <Button onClick={onClick}>
            {isSelected ? "Update category" : "Add category"}
          </Button>
        </div>
      </div>
    </DndContext>
  );
};

export default MenuCategories;
