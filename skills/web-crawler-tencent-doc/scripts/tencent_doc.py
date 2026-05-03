import os
from tencentcloud.common import credential
from tencentcloud.common.profile.client_profile import ClientProfile
from tencentcloud.common.profile.http_profile import HttpProfile
from tencentcloud.lark.v20220616 import lark_client, models
import json

class TencentDocManager:
    def __init__(self, secret_id=None, secret_key=None):
        self.secret_id = secret_id or os.environ.get('TENCENTCLOUD_SECRET_ID')
        self.secret_key = secret_key or os.environ.get('TENCENTCLOUD_SECRET_KEY')
        
        if not self.secret_id or not self.secret_key:
            raise ValueError("请配置腾讯云API密钥")
        
        self.client = self._init_client()
    
    def _init_client(self):
        """初始化腾讯云客户端"""
        cred = credential.Credential(self.secret_id, self.secret_key)
        httpProfile = HttpProfile()
        httpProfile.endpoint = "lark.tencentcloudapi.com"
        
        clientProfile = ClientProfile()
        clientProfile.httpProfile = httpProfile
        
        return lark_client.LarkClient(cred, "", clientProfile)
    
    def create_spreadsheet(self, title):
        """创建腾讯文档表格"""
        try:
            req = models.CreateSheetRequest()
            req.Title = title
            
            resp = self.client.CreateSheet(req)
            return resp.SpreadsheetToken
        except Exception as e:
            print(f"创建表格失败: {str(e)}")
            return None
    
    def add_sheet(self, spreadsheet_token, sheet_name):
        """添加工作表"""
        try:
            req = models.AddSheetRequest()
            req.SpreadsheetToken = spreadsheet_token
            req.Sheets = [{
                "SheetName": sheet_name,
                "Index": 0
            }]
            
            resp = self.client.AddSheet(req)
            return resp.Sheets[0].SheetId
        except Exception as e:
            print(f"添加工作表失败: {str(e)}")
            return None
    
    def batch_update_values(self, spreadsheet_token, sheet_id, data):
        """批量更新表格数据"""
        try:
            req = models.BatchUpdateValuesRequest()
            req.SpreadsheetToken = spreadsheet_token
            
            # 构建请求数据
            range_data = {
                "SheetId": sheet_id,
                "Values": data
            }
            req.Ranges = [range_data]
            
            resp = self.client.BatchUpdateValues(req)
            return True
        except Exception as e:
            print(f"更新表格数据失败: {str(e)}")
            return False
    
    def get_spreadsheet_url(self, spreadsheet_token):
        """获取表格链接"""
        return f"https://docs.qq.com/sheet/{spreadsheet_token}"
    
    def save_data_to_spreadsheet(self, data, title="爬虫数据"):
        """保存数据到腾讯文档表格"""
        # 创建表格
        spreadsheet_token = self.create_spreadsheet(title)
        if not spreadsheet_token:
            return None
        
        # 添加工作表
        sheet_id = self.add_sheet(spreadsheet_token, "数据")
        if not sheet_id:
            return None
        
        # 构建表格数据
        table_data = [['来源', '内容']]
        
        for item in data:
            source = item.get('source', '')
            content = item.get('content', '')
            
            # 处理内容过长的情况
            if len(content) > 50000:
                content = content[:50000] + '...（内容过长，已截断）'
            
            table_data.append([source, content])
        
        # 批量更新数据
        success = self.batch_update_values(spreadsheet_token, sheet_id, table_data)
        if success:
            return self.get_spreadsheet_url(spreadsheet_token)
        else:
            return None
    
    def update_existing_spreadsheet(self, data, spreadsheet_token):
        """更新指定的腾讯文档表格"""
        try:
            # 获取表格信息
            req = models.GetSpreadsheetRequest()
            req.SpreadsheetToken = spreadsheet_token
            resp = self.client.GetSpreadsheet(req)
            
            # 使用第一个工作表
            if resp.Sheets:
                sheet_id = resp.Sheets[0].SheetId
            else:
                # 如果没有工作表，添加一个
                sheet_id = self.add_sheet(spreadsheet_token, "数据")
                if not sheet_id:
                    return None
            
            # 构建表格数据
            table_data = [['来源', '内容']]
            
            for item in data:
                source = item.get('source', '')
                content = item.get('content', '')
                
                # 处理内容过长的情况
                if len(content) > 50000:
                    content = content[:50000] + '...（内容过长，已截断）'
                
                table_data.append([source, content])
            
            # 批量更新数据
            success = self.batch_update_values(spreadsheet_token, sheet_id, table_data)
            if success:
                return self.get_spreadsheet_url(spreadsheet_token)
            else:
                return None
        except Exception as e:
            print(f"更新表格失败: {str(e)}")
            return None