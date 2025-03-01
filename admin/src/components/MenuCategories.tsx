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
import {
  ChevronLeft,
  ChevronRight,
  MoveHorizontal,
  Plus,
  Save,
  Trash,
} from "lucide-react";
import React, { Dispatch, SetStateAction, useState } from "react";

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
      className="flex gap-1 whitespace-nowrap rounded-full text-xs md:text-base"
    >
      <Button
        className="h-8"
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
        className="h-8"
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
  const [isAdd, setIsAdd] = useState(false);
  const [isReorder, setIsReorder] = useState(false);
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
        <h2 className="mb-4 text-lg font-bold">Categories</h2>
        <div className="mb-2 flex flex-wrap gap-2 overflow-auto">
          {isReorder && (
            <Badge className="self-center bg-blue-500 text-base font-normal text-white">
              Drag or click the arrows to change the category order.
            </Badge>
          )}
          {!isReorder && (
            <>
              <div className="grid flex-1 gap-1">
                {(isAdd || isSelected) && (
                  <Input
                    autoFocus
                    className="min-w-48 flex-1 duration-150"
                    placeholder="Add category..."
                    value={category.name}
                    onChange={(e) =>
                      setCategory((s) => ({ ...s, name: e.target.value }))
                    }
                  />
                )}
                {isSelected && (
                  <Input
                    className="flex-1"
                    placeholder="Category description"
                    value={category.description}
                    onChange={(e) =>
                      setCategory((s) => ({
                        ...s,
                        description: e.target.value,
                      }))
                    }
                  />
                )}
              </div>
              <Button
                onClick={() => {
                  if (isAdd || isSelected) {
                    onClick();
                  }
                  setIsAdd((s) => !s);
                }}
              >
                {isSelected ? <Save /> : <Plus />}
                {isSelected ? "Save" : "Add category"}
              </Button>
              {isSelected && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="size-12"
                      size="icon"
                      variant="destructive"
                    >
                      <Trash />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete the{" "}
                        <span className="font-bold">{category.name}</span>{" "}
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
            </>
          )}
          <Button
            className="ml-auto"
            variant={isReorder ? "default" : "outline"}
            onClick={() => {
              setIsReorder((s) => !s);
              if (isReorder) {
                onClick();
              }
            }}
          >
            {isReorder ? <Save /> : <MoveHorizontal />}
            {isReorder ? "Save order" : "Change order"}
          </Button>
        </div>
        <SortableContext items={items} strategy={horizontalListSortingStrategy}>
          <div
            key={items.length}
            style={{ maxWidth: "100%" }}
            className="mb-4 flex gap-1 overflow-auto py-2 duration-300 animate-in fade-in-0 slide-in-from-top-1"
          >
            {items.map(({ id, name, description }) => {
              const parsedId = Number(id);
              const isSelected = selectedCategory === parsedId;

              if (!isReorder) {
                return (
                  <Badge
                    onClick={() => {
                      onBadgeClick({
                        id: parsedId,
                        isSelected,
                        name,
                        description,
                      });
                    }}
                    variant={
                      selectedCategory === parsedId ? "default" : "secondary"
                    }
                    className="flex cursor-pointer gap-1 whitespace-nowrap rounded-full text-xs md:text-base"
                    key={id}
                  >
                    <div className="size-10 h-8" />
                    {name}
                    <div className="size-10 h-8" />
                  </Badge>
                );
              }

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
      </div>
    </DndContext>
  );
};

export default MenuCategories;
