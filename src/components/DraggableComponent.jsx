import React, { useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'

const DraggableComponent = ({ component, isSelected, onSelect, onDelete, onMove }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // 组件渲染逻辑
  const renderComponent = () => {
    const { type, props } = component
    
    switch (type) {
      case 'button':
        return (
          <button style={props.style} className="btn btn-primary">
            {props.text}
          </button>
        )
      case 'input':
        return (
          <input 
            type="text" 
            placeholder={props.placeholder} 
            style={props.style} 
            className="property-input"
          />
        )
      case 'text':
        return (
          <div style={props.style}>
            {props.content}
          </div>
        )
      case 'image':
        return (
          <img 
            src={props.src} 
            alt="" 
            style={{ ...props.style, objectFit: 'cover', borderRadius: '4px' }}
          />
        )
      case 'card':
        return (
          <div style={{ ...props.style, border: '1px solid #e0e0e0', borderRadius: '8px', padding: '16px' }}>
            <h3 style={{ marginBottom: '8px', fontSize: '16px' }}>{props.title}</h3>
            <p style={{ fontSize: '14px', color: '#666' }}>{props.content}</p>
          </div>
        )
      case 'chart':
        return (
          <div style={{ ...props.style, border: '1px solid #e0e0e0', borderRadius: '8px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div>图表组件 - {props.type}</div>
          </div>
        )
      case 'form':
        return (
          <form style={{ ...props.style, border: '1px solid #e0e0e0', borderRadius: '8px', padding: '16px' }}>
            {props.fields.map((field, index) => (
              <div key={index} style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>{field}:</label>
                <input type="text" className="property-input" style={{ width: '100%' }} />
              </div>
            ))}
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>提交</button>
          </form>
        )
      case 'nav':
        return (
          <nav style={{ ...props.style, display: 'flex', gap: '20px', alignItems: 'center', padding: '0 20px', borderBottom: '1px solid #e0e0e0' }}>
            {props.items.map((item, index) => (
              <a key={index} href="#" style={{ textDecoration: 'none', color: '#333' }}>{item}</a>
            ))}
          </nav>
        )
      case 'footer':
        return (
          <footer style={{ ...props.style, padding: '20px', borderTop: '1px solid #e0e0e0', textAlign: 'center', color: '#666' }}>
            {props.content}
          </footer>
        )
      case 'slider':
        return (
          <div style={{ ...props.style, border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div>轮播图组件</div>
          </div>
        )
      default:
        return (
          <div style={{ ...props.style, border: '1px solid #e0e0e0', borderRadius: '8px', padding: '16px' }}>
            未知组件
          </div>
        )
    }
  }

  // 拖拽逻辑
  const handleMouseDown = (e) => {
    e.stopPropagation()
    setIsDragging(true)
    const rect = e.currentTarget.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
    onSelect()
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    
    const canvasRect = document.querySelector('.canvas').getBoundingClientRect()
    const x = e.clientX - canvasRect.left - dragOffset.x
    const y = e.clientY - canvasRect.top - dragOffset.y
    
    onMove(component.id, x, y)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // 组件挂载时添加全局事件监听
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  return (
    <div
      className={`draggable-component ${isSelected ? 'selected' : ''}`}
      style={{
        left: `${component.x}px`,
        top: `${component.y}px`,
        cursor: isDragging ? 'grabbing' : 'move'
      }}
      onMouseDown={handleMouseDown}
      onClick={onSelect}
    >
      {/* 组件内容 */}
      {renderComponent()}
      
      {/* 选中时显示删除按钮 */}
      {isSelected && (
        <button
          className="btn btn-secondary"
          style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            width: '24px',
            height: '24px',
            padding: '0',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ff4d4f',
            color: 'white',
            borderRadius: '50%'
          }}
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
        >
          ×
        </button>
      )}
    </div>
  )
}

export default DraggableComponent
