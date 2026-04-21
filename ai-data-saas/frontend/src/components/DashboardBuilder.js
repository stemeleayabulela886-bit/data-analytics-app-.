import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const initialItems = [
  { id: "kpi", content: "📊 KPI Cards" },
  { id: "chart", content: "📈 Chart Visualization" },
  { id: "clean", content: "🧹 Cleaning Report" }
];

function DashboardBuilder() {
  const [items, setItems] = useState(initialItems);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reordered = Array.from(items);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);

    setItems(reordered);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mt-6">
      <h2 className="text-xl font-semibold mb-4">🎨 Dashboard Builder (Drag to Reorder)</h2>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="dashboard">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`space-y-2 p-4 rounded-lg ${
                snapshot.isDraggingOver ? "bg-blue-50" : "bg-gray-50"
              }`}
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`bg-white p-4 mb-2 shadow rounded-lg border-l-4 border-blue-500 cursor-move ${
                        snapshot.isDragging ? "shadow-lg bg-blue-50" : ""
                      }`}
                    >
                      <p className="font-semibold">{item.content}</p>
                      <p className="text-xs text-gray-500">☰ Drag to reorder</p>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default DashboardBuilder;
