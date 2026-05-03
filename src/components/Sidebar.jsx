import React from 'react'
import { useDrag } from 'react-dnd'

// 可拖拽组件项
const DraggableComponentItem = ({ component }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'COMPONENT',
    item: { componentType: component.type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }))

  return (
    <div
      ref={drag}
      className="component-item"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {component.name}
    </div>
  )
}

const Sidebar = ({ components, templates, currentTemplate, onApplyTemplate }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">快速原型工具</div>
      
      {/* 模板选择 */}
      <div className="template-selector">
        <h3>模板选择</h3>
        <div className="template-grid">
          {templates.map(template => (
            <div
              key={template.id}
              className={`template-item ${currentTemplate === template.id ? 'active' : ''}`}
              onClick={() => onApplyTemplate(template.id)}
            >
              {template.name}
            </div>
          ))}
        </div>
      </div>
      
      {/* 组件库 */}
      <div className="component-list">
        <h3>组件库</h3>
        {components.map(component => (
          <DraggableComponentItem key={component.id} component={component} />
        ))}
      </div>
    </div>
  )
}

export default Sidebar
