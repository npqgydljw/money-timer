import React from 'react'
import { useDrop } from 'react-dnd'
import DraggableComponent from './DraggableComponent'

const Editor = ({ 
  components, 
  onAddComponent, 
  onSelectComponent, 
  onDeleteComponent,
  onMoveComponent,
  selectedComponent,
  onGenerateCode,
  onSharePrototype
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'COMPONENT',
    drop: (item, monitor) => {
      const canvasRect = document.querySelector('.canvas').getBoundingClientRect()
      const offset = monitor.getClientOffset()
      if (offset) {
        const x = offset.x - canvasRect.left
        const y = offset.y - canvasRect.top
        onAddComponent(item.componentType, x, y)
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }))

  return (
    <div className="editor">
      {/* 编辑器头部 */}
      <div className="editor-header">
        <div className="editor-title">原型编辑区</div>
        <div className="editor-actions">
          <button className="btn btn-secondary" onClick={onGenerateCode}>
            生成代码
          </button>
          <button className="btn btn-primary" onClick={onSharePrototype}>
            分享原型
          </button>
        </div>
      </div>
      
      {/* 主编辑画布 */}
      <div className="canvas-container">
        <div 
          ref={drop}
          className="canvas"
          style={{ backgroundColor: isOver ? '#f0f8ff' : 'white' }}
        >
          {/* 渲染所有组件 */}
          {components.map(component => (
            <DraggableComponent
              key={component.id}
              component={component}
              isSelected={selectedComponent?.id === component.id}
              onSelect={() => onSelectComponent(component)}
              onDelete={() => onDeleteComponent(component.id)}
              onMove={onMoveComponent}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Editor
