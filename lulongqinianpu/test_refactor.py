from playwright.sync_api import sync_playwright
import time

def test_page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # 访问页面
        page.goto('http://localhost:8080/陆陇其弟子_可视化.html')
        
        # 等待页面加载完成
        page.wait_for_load_state('networkidle')
        
        # 等待数据加载（给 fetch 请求一些时间）
        time.sleep(2)
        
        # 截图查看页面状态
        page.screenshot(path='test_screenshot.png', full_page=True)
        
        # 获取页面内容
        content = page.content()
        
        # 检查是否成功加载了弟子记录
        chronicle_container = page.locator('#chronicleContainer')
        cards = chronicle_container.locator('.chronicle-card').all()
        
        print(f"找到 {len(cards)} 个弟子记录卡片")
        
        # 检查筛选按钮是否正常工作
        filter_buttons = page.locator('.filter-btn').all()
        print(f"找到 {len(filter_buttons)} 个筛选按钮")
        
        # 测试筛选功能
        if len(filter_buttons) > 0:
            # 点击"日记"筛选按钮
            diary_button = page.locator('.filter-btn[data-filter="diary"]')
            if diary_button.count() > 0:
                diary_button.click()
                time.sleep(1)
                
                # 检查筛选后的结果
                filtered_cards = chronicle_container.locator('.chronicle-card').all()
                print(f"筛选后找到 {len(filtered_cards)} 个卡片")
                
                # 验证筛选结果是否正确
                for card in filtered_cards[:3]:  # 检查前3个
                    category_class = card.get_attribute('class')
                    if 'diary' in category_class:
                        print("✓ 筛选功能正常工作")
                        break
        
        # 检查是否有错误提示
        if "数据加载失败" in content:
            print("✗ 数据加载失败")
        else:
            print("✓ 数据加载成功")
        
        browser.close()

if __name__ == "__main__":
    test_page()
