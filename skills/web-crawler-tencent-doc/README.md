# 网页爬虫与腾讯文档存储技能

## 功能介绍

本技能可以：
- 爬取指定网址的所有文本数据
- 识别并读取网页中的PDF、Word、Excel等文件，提取其中的文本内容
- 将所有提取的文本数据保存到腾讯文档的表格中

## 安装

### 1. 克隆代码

```bash
git clone <repository-url>
cd web-crawler-tencent-doc
```

### 2. 安装依赖

```bash
pip install requests beautifulsoup4 pdfplumber python-docx openpyxl tencentcloud-sdk-python
```

### 3. 配置腾讯云API密钥

#### 方法一：设置环境变量

```bash
# Windows
set TENCENTCLOUD_SECRET_ID=your_secret_id
set TENCENTCLOUD_SECRET_KEY=your_secret_key

# Linux/Mac
export TENCENTCLOUD_SECRET_ID=your_secret_id
export TENCENTCLOUD_SECRET_KEY=your_secret_key
```

#### 方法二：在运行时指定

通过命令行参数 `--secret-id` 和 `--secret-key` 指定。

## 使用方法

### 命令行使用

```bash
python scripts/main.py https://example.com --max-depth 2 --timeout 10
```

### Python代码使用

```python
from web_crawler_tencent_doc import WebCrawlerTencentDoc

# 初始化爬虫
crawler = WebCrawlerTencentDoc(max_depth=2, timeout=10)

# 爬取网址并保存到腾讯文档
url = "https://example.com"
document_url = crawler.crawl_and_save(
    url,
    secret_id="your_secret_id",
    secret_key="your_secret_key"
)

print(f"数据已保存到腾讯文档: {document_url}")
```

## 核心模块

### 1. WebCrawler
- 爬取网页内容，提取文本和文件链接
- 支持设置爬取深度和超时时间
- 避免重复爬取同一URL

### 2. FileProcessor
- 下载文件到临时目录
- 提取PDF、Word、Excel等文件中的文本
- 支持多种文件格式

### 3. TencentDocManager
- 创建腾讯文档表格
- 批量更新表格数据
- 返回可访问的文档链接

## 配置选项

配置文件位于 `references/config.json`：

- `crawler.max_depth` - 爬取深度，默认为2
- `crawler.timeout` - 请求超时时间，默认为10秒
- `file_processor.download_timeout` - 文件下载超时时间，默认为30秒

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