// DraggableMenu.tsx
import {
  DndContext,
  useDraggable,
  useSensor,
  useSensors,
  PointerSensor
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

function DraggableButton() {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'draggable-button',
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    position: 'relative' as const,
    top: '20px',
    left: '20px',
    zIndex: 50,
    cursor: 'move',
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <button className="space-y-1.5" onClick={() => console.log('Open sidebar')}>
        <div className="w-6 h-0.5 bg-[var(--accent)]"></div>
        <div className="w-6 h-0.5 bg-[var(--accent)]"></div>
        <div className="w-6 h-0.5 bg-[var(--accent)]"></div>
      </button>
    </div>
  );
}

export default function DraggableMenuWrapper() {
  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <DndContext sensors={sensors}>
      <DraggableButton />
    </DndContext>
  );
}
