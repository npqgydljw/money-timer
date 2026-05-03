import React, { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'
import PropertiesPanel from './components/PropertiesPanel'

function App() {
  // 组件库定义
  const componentLibrary = [
    { id: 'button', name: '按钮', type: 'button', defaultProps: { text: '按钮', style: { width: 100, height: 40 } } },
    { id: 'input', name: '输入框', type: 'input', defaultProps: { placeholder: '请输入...', style: { width: 200, height: 40 } } },
    { id: 'text', name: '文本', type: 'text', defaultProps: { content: '文本内容', style: { width: 150, height: 30 } } },
    { id: 'image', name: '图片', type: 'image', defaultProps: { src: 'https://via.placeholder.com/150', style: { width: 150, height: 150 } } },
    { id: 'card', name: '卡片', type: 'card', defaultProps: { title: '卡片标题', content: '卡片内容', style: { width: 250, height: 150 } } },
    { id: 'chart', name: '图表', type: 'chart', defaultProps: { type: 'bar', data: [10, 20, 30, 40], style: { width: 300, height: 200 } } },
    { id: 'form', name: '表单', type: 'form', defaultProps: { fields: ['姓名', '邮箱', '电话'], style: { width: 300, height: 250 } } },
    { id: 'nav', name: '导航栏', type: 'nav', defaultProps: { items: ['首页', '产品', '关于我们', '联系我们'], style: { width: 1200, height: 60 } } },
    { id: 'footer', name: '页脚', type: 'footer', defaultProps: { content: '© 2024 原型工具', style: { width: 1200, height: 100 } } },
    { id: 'slider', name: '轮播图', type: 'slider', defaultProps: { images: [1, 2, 3].map(() => 'https://via.placeholder.com/800x300'), style: { width: 800, height: 300 } } }
  ]

  // 模板定义
  const templates = [
    {
      id: 'ecommerce',
      name: '电商模板',
      components: [
        { id: 'nav-1', type: 'nav', x: 0, y: 0, props: { items: ['首页', '商品分类', '购物车', '我的订单'], style: { width: 1200, height: 60 } } },
        { id: 'slider-1', type: 'slider', x: 200, y: 80, props: { images: [1, 2, 3].map(() => 'https://via.placeholder.com/800x300'), style: { width: 800, height: 300 } } },
        { id: 'card-1', type: 'card', x: 100, y: 420, props: { title: '热门商品1', content: '商品描述', style: { width: 250, height: 200 } } },
        { id: 'card-2', type: 'card', x: 380, y: 420, props: { title: '热门商品2', content: '商品描述', style: { width: 250, height: 200 } } },
        { id: 'card-3', type: 'card', x: 660, y: 420, props: { title: '热门商品3', content: '商品描述', style: { width: 250, height: 200 } } },
        { id: 'footer-1', type: 'footer', x: 0, y: 660, props: { content: '© 2024 电商平台', style: { width: 1200, height: 100 } } }
      ]
    },
    {
      id: 'social',
      name: '社交网络模板',
      components: [
        { id: 'nav-1', type: 'nav', x: 0, y: 0, props: { items: ['首页', '消息', '发现', '我的'], style: { width: 1200, height: 60 } } },
        { id: 'card-1', type: 'card', x: 200, y: 80, props: { title: '用户动态1', content: '这是一条动态内容...', style: { width: 800, height: 150 } } },
        { id: 'card-2', type: 'card', x: 200, y: 260, props: { title: '用户动态2', content: '这是另一条动态内容...', style: { width: 800, height: 150 } } },
        { id: 'card-3', type: 'card', x: 200, y: 440, props: { title: '用户动态3', content: '这是第三条动态内容...', style: { width: 800, height: 150 } } },
        { id: 'footer-1', type: 'footer', x: 0, y: 660, props: { content: '© 2024 社交网络', style: { width: 1200, height: 100 } } }
      ]
    },
    {
      id: 'dashboard',
      name: '仪表盘模板',
      components: [
        { id: 'nav-1', type: 'nav', x: 0, y: 0, props: { items: ['仪表盘', '数据统计', '用户管理', '设置'], style: { width: 1200, height: 60 } } },
        { id: 'chart-1', type: 'chart', x: 100, y: 100, props: { type: 'bar', data: [10, 20, 30, 40, 50], style: { width: 500, height: 300 } } },
        { id: 'chart-2', type: 'chart', x: 650, y: 100, props: { type: 'line', data: [5, 15, 10, 25, 20], style: { width: 500, height: 300 } } },
        { id: 'card-1', type: 'card', x: 100, y: 450, props: { title: '今日访问量', content: '12,345', style: { width: 250, height: 150 } } },
        { id: 'card-2', type: 'card', x: 380, y: 450, props: { title: '活跃用户', content: '4,567', style: { width: 250, height: 150 } } },
        { id: 'card-3', type: 'card', x: 660, y: 450, props: { title: '转化率', content: '23.5%', style: { width: 250, height: 150 } } },
        { id: 'footer-1', type: 'footer', x: 0, y: 660, props: { content: '© 2024 数据分析平台', style: { width: 1200, height: 100 } } }
      ]
    }
  ]

  // 状态管理
  const [components, setComponents] = useState([])
  const [selectedComponent, setSelectedComponent] = useState(null)
  const [currentTemplate, setCurrentTemplate] = useState(null)
  const [nextId, setNextId] = useState(1)

  // 添加组件
  const addComponent = (componentType, x, y) => {
    const componentDef = componentLibrary.find(c => c.type === componentType)
    if (componentDef) {
      const newComponent = {
        id: `${componentType}-${nextId}`,
        type: componentType,
        x,
        y,
        props: { ...componentDef.defaultProps }
      }
      setComponents([...components, newComponent])
      setNextId(nextId + 1)
      setSelectedComponent(newComponent)
    }
  }

  // 更新组件属性
  const updateComponent = (id, newProps) => {
    setComponents(components.map(comp => 
      comp.id === id ? { ...comp, props: { ...comp.props, ...newProps } } : comp
    ))
    if (selectedComponent && selectedComponent.id === id) {
      setSelectedComponent({ ...selectedComponent, props: { ...selectedComponent.props, ...newProps } })
    }
  }

  // 选择组件
  const selectComponent = (component) => {
    setSelectedComponent(component)
  }

  // 删除组件
  const deleteComponent = (id) => {
    setComponents(components.filter(comp => comp.id !== id))
    if (selectedComponent && selectedComponent.id === id) {
      setSelectedComponent(null)
    }
  }

  // 移动组件
  const moveComponent = (id, x, y) => {
    setComponents(components.map(comp => 
      comp.id === id ? { ...comp, x, y } : comp
    ))
  }

  // 应用模板
  const applyTemplate = (templateId) => {
    const template = templates.find(t => t.id === templateId)
    if (template) {
      setComponents(template.components)
      setCurrentTemplate(template.id)
      setSelectedComponent(null)
    }
  }

  // 生成代码
  const generateCode = () => {
    // 简单的React代码生成示例
    const componentCode = components.map(comp => {
      const { type, props } = comp
      let code = ''
      
      switch (type) {
        case 'button':
          code = `<button style={{ ${Object.entries(props.style).map(([k, v]) => `${k}: ${v}`).join(', ')} }}>${props.text}</button>`
          break
        case 'input':
          code = `<input type="text" placeholder="${props.placeholder}" style={{ ${Object.entries(props.style).map(([k, v]) => `${k}: ${v}`).join(', ')} }} />`
          break
        case 'text':
          code = `<div style={{ ${Object.entries(props.style).map(([k, v]) => `${k}: ${v}`).join(', ')} }}>${props.content}</div>`
          break
        case 'image':
          code = `<img src="${props.src}" style={{ ${Object.entries(props.style).map(([k, v]) => `${k}: ${v}`).join(', ')} }} alt="" />`
          break
        case 'card':
          code = `<div style={{ ${Object.entries(props.style).map(([k, v]) => `${k}: ${v}`).join(', ')}, border: '1px solid #e0e0e0', borderRadius: '8px', padding: '16px' }}><h3>${props.title}</h3><p>${props.content}</p></div>`
          break
        case 'chart':
          code = `<div style={{ ${Object.entries(props.style).map(([k, v]) => `${k}: ${v}`).join(', ')} }}>图表组件</div>`
          break
        case 'form':
          code = `<form style={{ ${Object.entries(props.style).map(([k, v]) => `${k}: ${v}`).join(', ')} }}>${props.fields.map(field => `<div><label>${field}:</label><input type="text" /></div>`).join('')}</form>`
          break
        case 'nav':
          code = `<nav style={{ ${Object.entries(props.style).map(([k, v]) => `${k}: ${v}`).join(', ')}, display: 'flex', gap: '20px', alignItems: 'center' }}>${props.items.map(item => `<a href="#">${item}</a>`).join('')}</nav>`
          break
        case 'footer':
          code = `<footer style={{ ${Object.entries(props.style).map(([k, v]) => `${k}: ${v}`).join(', ')} }}>${props.content}</footer>`
          break
        case 'slider':
          code = `<div style={{ ${Object.entries(props.style).map(([k, v]) => `${k}: ${v}`).join(', ')} }}>轮播图组件</div>`
          break
        default:
          code = `<div style={{ ${Object.entries(props.style).map(([k, v]) => `${k}: ${v}`).join(', ')} }}>未知组件</div>`
      }
      
      return `<div style={{ position: 'absolute', left: '${comp.x}px', top: '${comp.y}px' }}>${code}</div>`
    }).join('\n')

    const fullCode = `
import React from 'react'

function App() {
  return (
    <div style={{ position: 'relative', width: '1200px', height: '800px', margin: '0 auto', border: '1px solid #e0e0e0' }}>
      ${componentCode}
    </div>
  )
}

export default App
    `.trim()

    // 复制到剪贴板
    navigator.clipboard.writeText(fullCode)
    alert('代码已复制到剪贴板！')
  }

  // 分享原型
  const sharePrototype = () => {
    // 简单的分享功能示例
    const prototypeData = JSON.stringify({ components, currentTemplate })
    const encodedData = btoa(prototypeData)
    const shareUrl = `${window.location.origin}?proto=${encodedData}`
    navigator.clipboard.writeText(shareUrl)
    alert('分享链接已复制到剪贴板！')
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <Sidebar 
          components={componentLibrary} 
          templates={templates}
          currentTemplate={currentTemplate}
          onApplyTemplate={applyTemplate}
        />
        <Editor 
          components={components}
          onAddComponent={addComponent}
          onSelectComponent={selectComponent}
          onDeleteComponent={deleteComponent}
          onMoveComponent={moveComponent}
          selectedComponent={selectedComponent}
          onGenerateCode={generateCode}
          onSharePrototype={sharePrototype}
        />
        <PropertiesPanel 
          component={selectedComponent}
          onUpdateComponent={updateComponent}
        />
      </div>
    </DndProvider>
  )
}

export default App
