import fitz  # PyMuPDF
import os
from PIL import Image
import io

def pdf_to_images(pdf_path, output_dir="pdf_images"):
    """将PDF每一页转换为PNG图片"""
    # 创建输出目录
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # 打开PDF
    pdf_document = fitz.open(pdf_path)
    image_files = []
    
    print(f"PDF共有 {len(pdf_document)} 页")
    
    for page_num in range(len(pdf_document)):
        # 获取页面
        page = pdf_document[page_num]
        
        # 将页面渲染为图片 (使用2倍缩放以获得更好的质量)
        mat = fitz.Matrix(2, 2)
        pix = page.get_pixmap(matrix=mat)
        
        # 保存图片
        image_filename = f"page_{page_num + 1:03d}.png"
        image_path = os.path.join(output_dir, image_filename)
        pix.save(image_path)
        image_files.append(image_filename)
        
        print(f"已转换第 {page_num + 1} 页 -> {image_filename}")
    
    pdf_document.close()
    print(f"\n完成！共转换 {len(image_files)} 页")
    return image_files

if __name__ == "__main__":
    pdf_path = "Zhu_Xi_s_Double_Helix.pdf"
    images = pdf_to_images(pdf_path)
