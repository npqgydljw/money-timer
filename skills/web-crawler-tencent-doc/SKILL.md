---
name: web-crawler-tencent-doc
description: 爬取指定网址的所有文本数据，支持读取PDF、Word、Excel等文件中的文本，并将提取的所有文本数据保存到腾讯文档表格中。当用户需要批量获取网页和文件内容并统一存储时使用。
---

# 网页爬虫与腾讯文档存储技能

## 功能概述

本技能可以：
1. 爬取指定网址的所有文本数据
2. 识别并读取网页中的PDF、Word、Excel等文件，提取其中的文本内容
3. 将所有提取的文本数据保存到腾讯文档的表格中

## 技术实现

### 核心依赖

- Python 3.8+
- requests - 发送HTTP请求
- BeautifulSoup4 - 解析HTML
- pdfplumber - 提取PDF文本
- python-docx - 读取Word文档
- openpyxl - 读取Excel文件
- tencentcloud-sdk-python - 操作腾讯文档

### 工作流程

1. **输入处理**：接收用户提供的网址
2. **网页爬取**：爬取网页内容，提取文本和文件链接
3. **文件处理**：下载并解析PDF、Word、Excel等文件
4. **数据整合**：将所有提取的文本数据整合为表格格式
5. **腾讯文档存储**：创建或更新腾讯文档表格，保存数据

## 使用方法

### 基本用法

1. 提供需要爬取的网址
2. 等待爬取完成
3. 获取生成的腾讯文档链接

### 示例

```python
from web_crawler_tencent_doc import WebCrawler

# 初始化爬虫
crawler = WebCrawler()

# 爬取网址并保存到腾讯文档
url = "https://example.com"
document_url = crawler.crawl_and_save(url)

print(f"数据已保存到腾讯文档: {document_url}")
```

## 详细步骤

### 1. 环境配置

安装必要的依赖：

```bash
pip install requests beautifulsoup4 pdfplumber python-docx openpyxl tencentcloud-sdk-python
```

### 2. 腾讯云配置

需要配置腾讯云API密钥：

1. 登录腾讯云控制台
2. 创建API密钥
3. 配置环境变量：
   - TENCENTCLOUD_SECRET_ID
   - TENCENTCLOUD_SECRET_KEY

### 3. 运行爬虫

```python
# 导入模块
from web_crawler_tencent_doc import WebCrawler

# 创建爬虫实例
crawler = WebCrawler()

# 爬取指定网址
url = "https://example.com"
document_url = crawler.crawl_and_save(url)

print(f"爬取完成，数据已保存到: {document_url}")
```

## 脚本说明

### 主要脚本文件

- `scripts/crawler.py` - 核心爬虫逻辑
- `scripts/file_processor.py` - 文件处理模块
- `scripts/tencent_doc.py` - 腾讯文档操作模块
- `scripts/main.py` - 主入口脚本

### 配置文件

- `references/config.json` - 配置文件，包含腾讯云API信息和爬虫设置

## 注意事项

1. 遵守网站的robots.txt规则
2. 控制爬取频率，避免对目标网站造成压力
3. 确保有足够的存储空间下载和处理文件
4. 腾讯云API需要有相应的权限
5. 对于大型网站，可能需要设置合理的超时时间和重试机制

## 错误处理

- 网络错误：自动重试3次
- 文件解析错误：跳过无法解析的文件
- 腾讯文档API错误：记录错误并返回详细信息

## 扩展功能

- 支持自定义爬取深度
- 支持过滤特定类型的文件
- 支持增量爬取
- 支持数据去重

## 性能优化

- 使用多线程下载文件
- 增量解析和存储
- 缓存已处理的URL
- 使用异步IO提高爬取速度