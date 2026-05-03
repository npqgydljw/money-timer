import requests
from bs4 import BeautifulSoup
import re
import os
from urllib.parse import urljoin, urlparse
from requests_html import HTMLSession
import time

class WebCrawler:
    def __init__(self, max_depth=2, timeout=10):
        self.max_depth = max_depth
        self.timeout = timeout
        self.visited_urls = set()
        self.text_data = []
        self.file_links = []
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        # 初始化HTMLSession
        self.session = HTMLSession()
    
    def crawl(self, url, depth=0):
        if depth > self.max_depth:
            return
        
        if url in self.visited_urls:
            return
        
        self.visited_urls.add(url)
        print(f"爬取: {url}")
        
        try:
            # 使用HTMLSession获取页面内容
            r = self.session.get(url, headers=self.headers, timeout=self.timeout)
            
            # 等待页面加载完成
            r.html.render(sleep=3, timeout=self.timeout)
            
            # 获取页面内容
            page_source = r.html.html
            
            # 打印内容长度
            print(f"内容长度: {len(page_source)} 字符")
            
            # 打印部分响应内容，以便了解网站结构
            print("\n部分响应内容:")
            try:
                print(page_source[:500] + "..." if len(page_source) > 500 else page_source)
            except Exception as e:
                print(f"打印内容失败: {str(e)}")
            print("\n")
            
            # 提取文本内容
            # 使用lxml解析器，更强大
            soup = BeautifulSoup(page_source, 'lxml')
            
            # 提取文本
            text = soup.get_text(separator='\n', strip=True)
            
            # 尝试提取文章标题和正文
            article_title = self._extract_article_title(soup)
            article_content = self._extract_article_content(soup)
            
            if article_title and article_content:
                # 这是一个文章页面
                self.text_data.append({
                    'source': url,
                    'article_title': article_title,
                    'article_content': article_content
                })
            else:
                # 普通页面
                if text:
                    self.text_data.append({
                        'source': url,
                        'content': text
                    })
            
            # 提取文件链接
            file_extensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx']
            links_found = 0
            subpages_crawled = 0
            
            # 1. 尝试从HTML中查找链接
            links = soup.find_all(['a', 'area'], href=True)
            print(f"通过 find_all 找到 {len(links)} 个链接元素")
            
            for a in links:
                href = a.get('href')
                if href:
                    absolute_url = urljoin(url, href)
                    links_found += 1
                    
                    # 检查是否为文件链接
                    parsed_url = urlparse(absolute_url)
                    path = parsed_url.path
                    
                    for ext in file_extensions:
                        if path.lower().endswith(ext):
                            self.file_links.append(absolute_url)
                            break
                    
                    # 爬取子页面
                    if self._is_valid_url(absolute_url) and self._is_same_domain(url, absolute_url):
                        # 过滤掉一些不需要爬取的链接
                        if not any(keyword in absolute_url for keyword in ['javascript:', '#', 'mailto:', 'tel:']):
                            subpages_crawled += 1
                            self.crawl(absolute_url, depth + 1)
            
            # 2. 尝试从JavaScript中提取链接
            scripts = soup.find_all('script')
            print(f"找到 {len(scripts)} 个脚本标签")
            
            if links_found == 0:
                print("未发现链接，尝试从JavaScript中提取")
                # 正则表达式匹配可能的URL
                import re
                url_pattern = r'https?://[\w\-._~:/?#[\]@!$&\'()*+,;=.]+'
                
                for script in scripts:
                    if script.string:
                        # 提取脚本中的URL
                        script_urls = re.findall(url_pattern, script.string)
                        for script_url in script_urls:
                            if self._is_valid_url(script_url) and self._is_same_domain(url, script_url):
                                links_found += 1
                                # 爬取子页面
                                subpages_crawled += 1
                                self.crawl(script_url, depth + 1)
            
            # 3. 手动添加一些可能的子页面链接
            if links_found == 0:
                print("未发现链接，手动添加一些可能的子页面")
                # 手动添加一些常见的子页面路径
                common_paths = [
                    '/zwgk/tzgg/',  # 通知公告
                    '/zwgk/gsgg/',  # 公示公告
                    '/zwgk/bmxxgk/',  # 部门信息公开
                    '/zwgk/zcjd/',  # 政策解读
                    '/zwgk/zdlyxx/',  # 重点领域信息
                    '/zwgk/jsjgg/',  # 结果公示
                    '/zwgk/tjxx/',  # 统计信息
                ]
                
                for path in common_paths:
                    subpage_url = urljoin(url, path)
                    links_found += 1
                    subpages_crawled += 1
                    self.crawl(subpage_url, depth + 1)
            
            print(f"在 {url} 发现 {links_found} 个链接，爬取了 {subpages_crawled} 个子页面")
                    
        except Exception as e:
            print(f"爬取 {url} 失败: {str(e)}")
    
    def _is_valid_url(self, url):
        parsed = urlparse(url)
        return bool(parsed.scheme) and bool(parsed.netloc)
    
    def _is_same_domain(self, base_url, test_url):
        base_domain = urlparse(base_url).netloc
        test_domain = urlparse(test_url).netloc
        return base_domain == test_domain
    
    def get_text_data(self):
        return self.text_data
    
    def get_file_links(self):
        return self.file_links
    
    def _extract_article_title(self, soup):
        """提取文章标题"""
        # 尝试不同的标题标签
        title_selectors = [
            'h1',
            'h2',
            'title',
            '.title',
            '.article-title',
            '.main-title',
            '.artTitle',
            'div[class*="title"]',
            'span[class*="title"]'
        ]
        
        for selector in title_selectors:
            elements = soup.select(selector)
            if elements:
                title = elements[0].get_text(strip=True)
                if title and len(title) > 5:
                    return title
        
        return None
    
    def _extract_article_content(self, soup):
        """提取文章正文"""
        # 尝试不同的正文标签
        content_selectors = [
            '.content',
            '.article-content',
            '.main-content',
            '.artContent',
            'div[class*="content"]',
            'div[class*="article"]',
            'article',
            '.text',
            '.body'
        ]
        
        for selector in content_selectors:
            elements = soup.select(selector)
            if elements:
                content = elements[0].get_text(separator='\n', strip=True)
                if content and len(content) > 100:
                    return content
        
        # 如果没有找到特定的正文标签，尝试获取所有段落
        paragraphs = soup.find_all('p')
        if paragraphs:
            content = '\n'.join([p.get_text(strip=True) for p in paragraphs if p.get_text(strip=True)])
            if content and len(content) > 100:
                return content
        
        return None
    
    def clear_data(self):
        self.visited_urls.clear()
        self.text_data.clear()
        self.file_links.clear()
    
    def close(self):
        """关闭HTMLSession"""
        if hasattr(self, 'session'):
            self.session.close()