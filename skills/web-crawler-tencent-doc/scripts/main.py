import sys
import os

# 添加当前目录到Python路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from crawler import WebCrawler
from file_processor import FileProcessor
import argparse

class WebCrawlerTencentDoc:
    def __init__(self, max_depth=2, timeout=10):
        self.crawler = WebCrawler(max_depth=max_depth, timeout=timeout)
        self.file_processor = FileProcessor()
        self.tencent_doc = None
    
    def crawl_and_save(self, url, secret_id=None, secret_key=None, spreadsheet_token=None):
        """爬取网址并保存到本地文件"""
        try:
            # 1. 爬取网页内容
            print(f"开始爬取: {url}")
            self.crawler.crawl(url)
            
            # 2. 获取爬取的文本数据
            web_data = self.crawler.get_text_data()
            print(f"网页文本数据: {len(web_data)} 条")
            
            # 3. 处理文件链接
            file_links = self.crawler.get_file_links()
            print(f"发现文件链接: {len(file_links)} 个")
            
            file_data = self.file_processor.process_file_links(file_links)
            print(f"文件文本数据: {len(file_data)} 条")
            
            # 4. 合并数据
            all_data = web_data + file_data
            print(f"总数据: {len(all_data)} 条")
            
            if not all_data:
                print("未提取到任何数据")
                return None
            
            # 5. 保存到本地Excel文件
            print("保存数据到本地Excel文件...")
            import pandas as pd
            import datetime
            
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"crawler_data_{timestamp}.xlsx"
            
            # 准备数据
            data = []
            for item in all_data:
                source = item.get('source', '')
                
                # 检查是否为文章数据
                if 'article_title' in item and 'article_content' in item:
                    article_title = item.get('article_title', '')
                    article_content = item.get('article_content', '')
                    
                    # 处理内容过长的情况
                    if len(article_content) > 50000:
                        article_content = article_content[:50000] + '...（内容过长，已截断）'
                    
                    # 确保字符串编码正确
                    try:
                        if isinstance(source, str):
                            source = source.encode('utf-8', errors='replace').decode('utf-8')
                        if isinstance(article_title, str):
                            article_title = article_title.encode('utf-8', errors='replace').decode('utf-8')
                        if isinstance(article_content, str):
                            article_content = article_content.encode('utf-8', errors='replace').decode('utf-8')
                    except Exception as e:
                        print(f"编码处理失败: {str(e)}")
                    
                    data.append({'来源': source, '文章标题': article_title, '文章正文': article_content})
                else:
                    # 普通页面数据
                    content = item.get('content', '')
                    
                    # 处理内容过长的情况
                    if len(content) > 50000:
                        content = content[:50000] + '...（内容过长，已截断）'
                    
                    # 确保字符串编码正确
                    try:
                        if isinstance(source, str):
                            source = source.encode('utf-8', errors='replace').decode('utf-8')
                        if isinstance(content, str):
                            content = content.encode('utf-8', errors='replace').decode('utf-8')
                    except Exception as e:
                        print(f"编码处理失败: {str(e)}")
                    
                    data.append({'来源': source, '文章标题': '', '文章正文': content})
            
            # 创建DataFrame并保存到Excel
            df = pd.DataFrame(data)
            df.to_excel(filename, index=False, engine='openpyxl')
            
            print(f"数据已成功保存到本地Excel文件: {filename}")
            print("请手动将该文件导入到腾讯文档表格中")
            print(f"腾讯文档链接: https://docs.qq.com/sheet/{spreadsheet_token}")
            
            return filename
            
        except Exception as e:
            print(f"执行过程中发生错误: {str(e)}")
            return None
        finally:
            # 清理数据
            self.crawler.clear_data()
            # 关闭Selenium WebDriver
            self.crawler.close()

def main():
    parser = argparse.ArgumentParser(description='爬取网页和文件内容并保存到腾讯文档')
    parser.add_argument('url', help='要爬取的网址')
    parser.add_argument('--max-depth', type=int, default=3, help='爬取深度')
    parser.add_argument('--timeout', type=int, default=10, help='请求超时时间')
    parser.add_argument('--secret-id', help='腾讯云API密钥ID')
    parser.add_argument('--secret-key', help='腾讯云API密钥Key')
    parser.add_argument('--spreadsheet-token', help='腾讯文档表格令牌，用于更新现有表格')
    
    args = parser.parse_args()
    
    crawler = WebCrawlerTencentDoc(max_depth=args.max_depth, timeout=args.timeout)
    document_url = crawler.crawl_and_save(
        args.url,
        secret_id=args.secret_id,
        secret_key=args.secret_key,
        spreadsheet_token=args.spreadsheet_token
    )
    
    if document_url:
        print(f"\n腾讯文档链接: {document_url}")
    else:
        print("\n操作失败，请检查错误信息")

if __name__ == "__main__":
    main()