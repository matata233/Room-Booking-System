import React, { useState } from "react";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDragIndicator } from "react-icons/md";

const DrapAndDrop = () => {
  // SortableItem component
  const SortableItem = ({ id, item }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="group flex cursor-move touch-none items-center justify-between rounded-md bg-white p-2 hover:shadow-md"
      >
        <div key={id}>{item}</div>
        <MdDragIndicator className="size-6 text-gray-200 group-hover:text-theme-dark-blue" />
      </div>
    );
  };

  const [items, setItems] = useState([
    {
      id: 1,
      item: "Proximity",
    },
    {
      id: 2,
      item: "Seats",
    },
    {
      id: 3,
      item: "AV Equipment",
    },
    {
      id: 4,
      item: "CV Equipment",
    },
  ]);

  const handleDragEnd = (event) => {
    const { active, over } = event; // active: dragged item, over: item being dragged over
    const getItemPosition = (id) => items.findIndex((item) => item.id === id);
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = getItemPosition(active.id);
        const newIndex = getItemPosition(over.id);
        const newItemsArray = arrayMove(items, oldIndex, newIndex);
        //  send newItemsArray to the server

        return newItemsArray;
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCorners}
    >
      <div className="flex w-80 flex-col gap-2 rounded-lg bg-gray-200 p-4">
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id} item={item.item} />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
};

export default DrapAndDrop;
