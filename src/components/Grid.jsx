import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import AACButton from './AACButton'
import SortableButton from './SortableButton'

export default function Grid({ buttons, editMode, onSpeak, onDrillDown, onContextMenu, showLabels, onReorder }) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  )

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    onReorder(active.id, over.id)
  }

  if (!editMode) {
    return (
      <div className="grid">
        {buttons.map(btn => (
          <AACButton
            key={btn.id}
            btn={btn}
            editMode={false}
            showLabels={showLabels}
            onSpeak={onSpeak}
            onHoldSpeak={onDrillDown}
            onContextMenu={onContextMenu}
          />
        ))}
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={buttons.map(b => b.id)}
        strategy={rectSortingStrategy}
      >
        <div className="grid">
          {buttons.map(btn => (
            <SortableButton
              key={btn.id}
              btn={btn}
              showLabels={showLabels}
              onContextMenu={onContextMenu}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}