import React from 'react'

const PropertiesPanel = ({ component, onUpdateComponent }) => {
  // 如果没有选中组件，显示提示信息
  if (!component) {
    return (
      <div className="properties-panel">
        <div className="properties-header">属性编辑</div>
        <div className="properties-content">
          <p style={{ color: '#999', textAlign: 'center', margin: '40px 0' }}>
            请选择一个组件进行编辑
          </p>
        </div>
      </div>
    )
  }

  // 处理属性变更
  const handlePropertyChange = (propertyPath, value) => {
    // 支持嵌套属性，如 style.width
    const [parent, child] = propertyPath.split('.')
    
    if (child) {
      // 嵌套属性更新
      onUpdateComponent(component.id, {
        [parent]: {
          ...component.props[parent],
          [child]: value
        }
      })
    } else {
      // 直接属性更新
      onUpdateComponent(component.id, {
        [propertyPath]: value
      })
    }
  }

  // 渲染通用属性编辑
  const renderCommonProperties = () => {
    return (
      <div className="property-group">
        <h3 style={{ fontSize: '16px', marginBottom: '16px', color: '#333' }}>通用属性</h3>
        
        {/* 位置属性 */}
        <div className="property-group">
          <label className="property-label">X 坐标</label>
          <input
            type="number"
            className="property-input"
            value={component.x}
            onChange={(e) => onUpdateComponent(component.id, { x: parseInt(e.target.value) || 0 })}
          />
        </div>
        
        <div className="property-group">
          <label className="property-label">Y 坐标</label>
          <input
            type="number"
            className="property-input"
            value={component.y}
            onChange={(e) => onUpdateComponent(component.id, { y: parseInt(e.target.value) || 0 })}
          />
        </div>
        
        {/* 尺寸属性 */}
        <div className="property-group">
          <label className="property-label">宽度</label>
          <input
            type="number"
            className="property-input"
            value={component.props.style.width}
            onChange={(e) => handlePropertyChange('style.width', parseInt(e.target.value) || 0)}
          />
        </div>
        
        <div className="property-group">
          <label className="property-label">高度</label>
          <input
            type="number"
            className="property-input"
            value={component.props.style.height}
            onChange={(e) => handlePropertyChange('style.height', parseInt(e.target.value) || 0)}
          />
        </div>
      </div>
    )
  }

  // 根据组件类型渲染特定属性
  const renderComponentSpecificProperties = () => {
    const { type, props } = component
    
    switch (type) {
      case 'button':
        return (
          <div className="property-group">
            <h3 style={{ fontSize: '16px', marginBottom: '16px', color: '#333' }}>按钮属性</h3>
            <div className="property-group">
              <label className="property-label">按钮文本</label>
              <input
                type="text"
                className="property-input"
                value={props.text}
                onChange={(e) => handlePropertyChange('text', e.target.value)}
              />
            </div>
          </div>
        )
      
      case 'input':
        return (
          <div className="property-group">
            <h3 style={{ fontSize: '16px', marginBottom: '16px', color: '#333' }}>输入框属性</h3>
            <div className="property-group">
              <label className="property-label">占位文本</label>
              <input
                type="text"
                className="property-input"
                value={props.placeholder}
                onChange={(e) => handlePropertyChange('placeholder', e.target.value)}
              />
            </div>
          </div>
        )
      
      case 'text':
        return (
          <div className="property-group">
            <h3 style={{ fontSize: '16px', marginBottom: '16px', color: '#333' }}>文本属性</h3>
            <div className="property-group">
              <label className="property-label">文本内容</label>
              <textarea
                className="property-input"
                value={props.content}
                onChange={(e) => handlePropertyChange('content', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        )
      
      case 'image':
        return (
          <div className="property-group">
            <h3 style={{ fontSize: '16px', marginBottom: '16px', color: '#333' }}>图片属性</h3>
            <div className="property-group">
              <label className="property-label">图片 URL</label>
              <input
                type="text"
                className="property-input"
                value={props.src}
                onChange={(e) => handlePropertyChange('src', e.target.value)}
              />
            </div>
          </div>
        )
      
      case 'card':
        return (
          <div className="property-group">
            <h3 style={{ fontSize: '16px', marginBottom: '16px', color: '#333' }}>卡片属性</h3>
            <div className="property-group">
              <label className="property-label">卡片标题</label>
              <input
                type="text"
                className="property-input"
                value={props.title}
                onChange={(e) => handlePropertyChange('title', e.target.value)}
              />
            </div>
            <div className="property-group">
              <label className="property-label">卡片内容</label>
              <textarea
                className="property-input"
                value={props.content}
                onChange={(e) => handlePropertyChange('content', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        )
      
      case 'chart':
        return (
          <div className="property-group">
            <h3 style={{ fontSize: '16px', marginBottom: '16px', color: '#333' }}>图表属性</h3>
            <div className="property-group">
              <label className="property-label">图表类型</label>
              <select
                className="property-input"
                value={props.type}
                onChange={(e) => handlePropertyChange('type', e.target.value)}
              >
                <option value="bar">柱状图</option>
                <option value="line">折线图</option>
                <option value="pie">饼图</option>
              </select>
            </div>
          </div>
        )
      
      case 'form':
        return (
          <div className="property-group">
            <h3 style={{ fontSize: '16px', marginBottom: '16px', color: '#333' }}>表单属性</h3>
            <div className="property-group">
              <label className="property-label">字段列表</label>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                （当前不支持动态修改字段）
              </p>
              <div style={{ fontSize: '14px', color: '#999' }}>
                {props.fields.join(', ')}
              </div>
            </div>
          </div>
        )
      
      case 'nav':
        return (
          <div className="property-group">
            <h3 style={{ fontSize: '16px', marginBottom: '16px', color: '#333' }}>导航栏属性</h3>
            <div className="property-group">
              <label className="property-label">导航项</label>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                （当前不支持动态修改导航项）
              </p>
              <div style={{ fontSize: '14px', color: '#999' }}>
                {props.items.join(', ')}
              </div>
            </div>
          </div>
        )
      
      case 'footer':
        return (
          <div className="property-group">
            <h3 style={{ fontSize: '16px', marginBottom: '16px', color: '#333' }}>页脚属性</h3>
            <div className="property-group">
              <label className="property-label">页脚内容</label>
              <input
                type="text"
                className="property-input"
                value={props.content}
                onChange={(e) => handlePropertyChange('content', e.target.value)}
              />
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="properties-panel">
      <div className="properties-header">属性编辑</div>
      <div className="properties-content">
        {/* 组件信息 */}
        <div className="property-group">
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
            组件类型: {component.type}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>
            组件 ID: {component.id}
          </div>
        </div>
        
        {/* 通用属性 */}
        {renderCommonProperties()}
        
        {/* 组件特定属性 */}
        {renderComponentSpecificProperties()}
      </div>
    </div>
  )
}

export default PropertiesPanel
