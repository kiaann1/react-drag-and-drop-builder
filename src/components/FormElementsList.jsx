import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const FORM_BUILDER_DROPZONE_ID = "form-builder-dropzone";

export default function FormElementsList({
  palette,
  formElements,
  setFormElements,
  renderElement,
  renderPaletteItem
}) {
  const [activeId, setActiveId] = useState(null);
  const [draggedPaletteItem, setDraggedPaletteItem] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  function SortableItem({ id, children }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition: "transform 200ms cubic-bezier(0.22, 1, 0.36, 1)",
      zIndex: isDragging ? 50 : 1,
      background: isDragging ? "#f0f4ff" : undefined,
      boxShadow: isDragging ? "0 2px 8px rgba(0,0,0,0.12)" : undefined,
      opacity: isDragging ? 0.8 : 1,
      cursor: isDragging ? "grabbing" : "grab"
    };
    return (
      <div ref={setNodeRef} style={style} className="dnd-draggable" {...attributes} {...listeners}>
        {children}
      </div>
    );
  }

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    if (event.active.data.current?.fromPalette) {
      setDraggedPaletteItem(event.active.data.current.item);
    }
  };

  const handleDragEnd = (event) => {
    setActiveId(null);
    setDraggedPaletteItem(null);
    const { active, over } = event;
    if (!over) return;

    if (active.data.current?.fromPalette && over.id === FORM_BUILDER_DROPZONE_ID) {
      const newElement = {
        ...draggedPaletteItem,
        id: Date.now().toString()
      };
      setFormElements([...formElements, newElement]);
      return;
    }

    if (
      !active.data.current?.fromPalette &&
      active.id !== over.id &&
      formElements.some(el => el.id === active.id) &&
      formElements.some(el => el.id === over.id)
    ) {
      const oldIndex = formElements.findIndex(el => el.id === active.id);
      const newIndex = formElements.findIndex(el => el.id === over.id);
      setFormElements(arrayMove(formElements, oldIndex, newIndex));
    }
  };

  const handlePaletteClick = (item) => {
    setFormElements([
      ...formElements,
      { ...item, id: Date.now().toString() }
    ]);
  };

  return (
    <div className="flex gap-8">
      <div
        id="form-builder-dropzone"
        style={{
          minHeight: 200,
          background: "#f9fafb",
          border: "2px dashed #cbd5e1",
          borderRadius: 8,
          padding: 16,
          flex: 1,
          position: "relative"
        }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={formElements.map(el => el.id)}
            strategy={verticalListSortingStrategy}
          >
            {formElements.map(el => (
              <SortableItem key={el.id} id={el.id}>
                {renderElement(el)}
              </SortableItem>
            ))}
          </SortableContext>
          <DragOverlay dropAnimation={null}>
            {activeId && draggedPaletteItem
              ? (
                <div
                  style={{
                    pointerEvents: "none",
                    width: 220,
                    maxWidth: 220,
                    minWidth: 0,
                    boxSizing: "border-box",
                    background: "#fff",
                    border: "1px solid #cbd5e1",
                    borderRadius: 8,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
                    padding: 12,
                    textAlign: "center",
                    display: "block",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontWeight: 500,
                  }}
                >
                  {draggedPaletteItem.label || draggedPaletteItem.type}
                </div>
              )
              : activeId
              ? (
                <div
                  style={{
                    pointerEvents: "none",
                    width: 220,
                    maxWidth: 220,
                    minWidth: 0,
                    boxSizing: "border-box",
                    background: "#fff",
                    border: "1px solid #cbd5e1",
                    borderRadius: 8,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
                    padding: 12,
                    textAlign: "center",
                    display: "block",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontWeight: 500,
                  }}
                >
                  {(() => {
                    const el = formElements.find(el => el.id === activeId);
                    return el ? (el.label || el.type) : "";
                  })()}
                </div>
              )
              : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}