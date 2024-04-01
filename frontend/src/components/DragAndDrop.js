import React from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { setPriority } from "../slices/bookingSlice";

const DrapAndDrop = () => {
  const dispatch = useDispatch();
  const priority = useSelector((state) => state.booking.priority);

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

  const handleDragEnd = (event) => {
    const { active, over } = event;
    const getItemPosition = (id) =>
      priority.findIndex((item) => item.id === id);
    if (active.id !== over.id) {
      const oldIndex = getItemPosition(active.id);
      const newIndex = getItemPosition(over.id);
      const newPriorityArray = arrayMove(priority, oldIndex, newIndex);
      dispatch(setPriority(newPriorityArray));
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
        <SortableContext
          items={priority}
          strategy={verticalListSortingStrategy}
        >
          {priority.map((item) => (
            <SortableItem key={item.id} id={item.id} item={item.item} />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
};

export default DrapAndDrop;
