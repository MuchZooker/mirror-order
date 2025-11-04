<template>
  <div class="order-templates-view">
    <!-- <div class="page-header">
      <h1>订单模板管理</h1>
      <p class="page-description">创建和管理订单模板，支持导出Excel</p>
    </div> -->

    <!-- <div class="template-actions">
      <button class="btn btn-primary" @click="addNewTemplate">
        <span class="btn-icon">➕</span>
        添加新模板
      </button>
      <button class="btn btn-secondary" @click="clearAllTemplates" :disabled="templates.length === 0">
        <span class="btn-icon">🗑️</span>
        清空所有
      </button>
    </div> -->

    <!-- 添加/编辑模板表单 -->
    <div v-if="showForm" class="template-form-section">
      <!-- <div class="form-header">
        <h3>{{ isEditing ? '编辑模板' : '添加新模板' }}</h3>
        <button class="btn btn-secondary" @click="cancelForm">
          <span class="btn-icon">✖️</span>
          取消
        </button>
      </div> -->

      <div class="form-content" id="form-content">
        <div class="form-group">
          <label>User *</label>
          <input v-model="currentTemplate.name" type="text" class="form-input" placeholder="UserName">
        </div>

        <!-- 多行数据输入区域 -->
        <div class="items-section">
          <div class="items-header">
            <h4>Detail</h4>
            <button type="button" class="btn btn-primary btn-sm" @click="addNewItem">
              <span class="btn-icon">➕</span>
              Add Row
            </button>
          </div>

          <div class="items-list">
            <div v-for="(item, itemIndex) in currentTemplate.items" :key="item.id" class="item-row">
              <div class="item-number">{{ itemIndex + 1 }}</div>

              <div class="item-fields">

                <div class="form-group">
                  <label>Picture</label>
                  <div class="image-upload">
                    <input :ref="`itemFileInput_${itemIndex}`" type="file" multiple accept="image/*"
                      @change="handleItemImageUpload($event, itemIndex)" class="file-input">
                    
                    <div v-if="item.image" class="image-preview">
                      <img :src="item.image" alt="Preview" class="preview-img">
                      <button type="button" class="remove-image" @click="removeItemImage(itemIndex)">×</button>
                    </div>
                    <button  v-if="item.image==''" type="button" class="upload-btn" vis @click="$refs[`itemFileInput_${itemIndex}`][0].click()">
                      <span class="btn-icon">📷</span>
                      Select Photo
                    </button>
                  </div>
                </div>

                <div class="form-group">
                  <label>DESCRIPTION</label>
                  <input v-model="item.description"  type="text" class="form-input-des" placeholder="Des">
                </div>
                <div class="form-group">
                  <label>USD UNIT PRC ($) *</label>
                  <input v-model.number="item.price" type="number" step="0.01" class="form-input" placeholder="0.00">
                </div>

                <div class="form-group">
                  <label>QTY *</label>
                  <input v-model.number="item.quantity" type="number" class="form-input" placeholder="0">
                </div>

                <div class="form-group">
                  <label>AMOUNT ($)</label>
                  <div class="item-total">${{ calculateItemTotal(item) }}</div>
                </div>
              </div>

              <div class="item-actions">
                <button type="button" class="btn btn-danger btn-sm" @click="removeItem(itemIndex)"
                  :disabled="currentTemplate.items.length <= 1">
                  <span class="btn-icon">🗑️</span>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <div class="total-preview">
            <span class="total-label">Total：</span>
            <span class="total-value">${{ calculateTotal(currentTemplate) }}</span>
          </div>
          <div class="action-buttons">
            <!-- <button class="btn btn-secondary" @click="cancelForm">Cancel</button> -->
            <!-- <RouterLink to="/order-template/122"> -->
            <!-- <button class="btn btn-secondary" @click="detailForm">详情</button> -->
            <!-- </RouterLink> -->
            <!-- <button class="btn btn-primary" @click="saveTemplate" :disabled="!isValidTemplate">
              {{ isEditing ? '更新' : '添加' }}
            </button> -->
           <button class="btn btn-success" @click="exportToPDF">
              <span class="btn-icon">📊</span>
              Export Pdf
            </button>
            <button class="btn btn-success" @click="exportToExcel">
              <span class="btn-icon">📊</span>
              Export Excel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="templates-content">
      <div v-if="templates.length === 0" class="empty-state">
        <div class="empty-icon">📋</div>
        <h3>暂无订单模板</h3>
        <p>点击"添加新模板"开始创建您的第一个订单模板</p>
      </div>

      <div v-else class="templates-grid">
        <div v-for="(template, index) in templates" :key="template.id" class="template-card">
          <div class="template-header">
            <h3>模板 #{{ index + 1 }}</h3>
            <div class="template-actions">
              <button class="action-btn edit-btn" @click="editTemplate(index)">
                <span class="btn-icon">✏️</span>
                编辑
              </button>
              <button class="action-btn delete-btn" @click="deleteTemplate(index)">
                <span class="btn-icon">🗑️</span>
                删除
              </button>
            </div>
          </div>

          <div class="template-preview">
            <div class="preview-details">
              <h4 class="template-name">{{ template.name || '未命名模板' }}</h4>

              <div class="template-items">
                <div class="items-summary">
                  <span class="items-count">{{ template.items ? template.items.length : 0 }} 个产品</span>
                  <span class="total-price">总价: ¥{{ calculateTotal(template) }}</span>
                </div>

                <div v-if="template.items && template.items.length > 0" class="items-preview">
                  <div v-for="(item, index) in template.items.slice(0, 3)" :key="item.id || index" class="item-preview">
                    <div class="item-info">
                      <div class="item-image">
                        <img v-if="item.image" :src="item.image" :alt="item.name" class="item-thumbnail">
                        <div v-else class="no-image">无图片</div>
                      </div>
                      <div class="item-details">
                        <span class="item-name">{{ item.name || '未命名产品' }}</span>
                        <span class="item-desc">{{ item.description || '无描述' }}</span>
                        <span class="item-price">¥{{ item.price || 0 }} × {{ item.quantity || 0 }}</span>
                      </div>
                    </div>
                  </div>
                  <div v-if="template.items.length > 3" class="more-items">
                    ...还有 {{ template.items.length - 3 }} 个产品
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';

// 模板数据
const templates = ref([]);
const showForm = ref(true);
const isEditing = ref(false);
const editingIndex = ref(-1);

import router from '../router/index'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
// 当前编辑的模板
const currentTemplate = ref({
  id: Date.now(),
  name: '',
  items: [
    {
      id: Date.now(),
      name: '',
      description: '',
      image: '',
      price: 0,
      quantity: 0
    }
  ]
});

// 计算总价
const calculateTotal = (template) => {
  if (template.items && template.items.length > 0) {
    return template.items.reduce((total, item) => {
      return total + ((item.price || 0) * (item.quantity || 0));
    }, 0).toFixed(2);
  }
  return '0.00';
};

// 验证模板是否有效
const isValidTemplate = computed(() => {
  return currentTemplate.value.name.trim() &&
    currentTemplate.value.items.length > 0 &&
    currentTemplate.value.items.every(item =>
      item.name.trim() && item.price > 0 && item.quantity > 0
    );
});

// 添加新模板
const addNewTemplate = () => {
  currentTemplate.value = {
    id: Date.now(),
    name: '',
    items: [
      {
        id: Date.now(),
        name: '',
        description: '',
        image: '',
        price: 0,
        quantity: 0
      }
    ]
  };
  isEditing.value = false;
  showForm.value = true;
};

// 编辑模板
const editTemplate = (index) => {
  currentTemplate.value = { ...templates.value[index] };
  editingIndex.value = index;
  isEditing.value = true;
  showForm.value = true;
};

// 删除模板
const deleteTemplate = (index) => {
  if (confirm('确定要删除这个模板吗？')) {
    templates.value.splice(index, 1);
  }
};

// 清空所有模板
const clearAllTemplates = () => {
  if (confirm('确定要清空所有模板吗？此操作不可恢复！')) {
    templates.value = [];
  }
};

// 保存模板
const saveTemplate = () => {
  if (!isValidTemplate.value) return;

  if (isEditing.value) {
    templates.value[editingIndex.value] = { ...currentTemplate.value };
  } else {
    templates.value.push({ ...currentTemplate.value });
  }

  cancelForm();
};

// 取消表单
const cancelForm = () => {
  showForm.value = false;
  currentTemplate.value = {
    id: null,
    name: '',
    items: [
      {
        id: Date.now(),
        name: '',
        description: '',
        image: '',
        price: 0,
        quantity: 0
      }
    ]
  };
  isEditing.value = false;
  editingIndex.value = -1;
};


// 表单详情
const detailForm = () => {
  router.push({
    name: 'OrderTemplateDetails',
    params: { id: 111 },
    state: { template: JSON.stringify(currentTemplate.value) }
  });
};

// 处理图片上传
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      currentTemplate.value.image = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// 移除图片
const removeImage = () => {
  currentTemplate.value.image = '';
};

// 处理产品图片上传
const handleItemImageUpload = (event, itemIndex) => {
  const files = event.target.files;


  for (let i = 0; i < files.length; i++) {

    const file = files[i];
    const reader = new FileReader();
    if (i == 0) {
      reader.onload = (e) => {
        currentTemplate.value.items[itemIndex].image = e.target.result;
      };
    } else {
      reader.onload = (e) => {
        addNewItem();
        currentTemplate.value.items[currentTemplate.value.items.length - 1].image = e.target.result;
      };
    }

    reader.readAsDataURL(file);
  }



  // if (file) {
  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     currentTemplate.value.items[itemIndex].image = e.target.result;
  //   };
  //   reader.readAsDataURL(file);
  // }
};

// 移除产品图片
const removeItemImage = (itemIndex) => {
  currentTemplate.value.items[itemIndex].image = '';
};

// 添加新行
const addNewItem = () => {
  currentTemplate.value.items.push({
    id: Date.now(),
    name: '',
    description: '',
    image: '',
    price: 0,
    quantity: 0
  });
};

// 删除行
const removeItem = (itemIndex) => {
  if (currentTemplate.value.items.length > 1) {
    currentTemplate.value.items.splice(itemIndex, 1);
  }
};

// 计算单行总价
const calculateItemTotal = (item) => {
  return ((item.price || 0) * (item.quantity || 0)).toFixed(2);
};


const exportToPDF = async () => {
  
  // 添加数据行
  const template = currentTemplate.value;
  if (template.name == '') {
    alert('客户名不能为空');
    return;
  }
  if (template.items.length === 0) {
    alert('没有数据可导出');
    return;
  }
  // 获取要转换的DOM元素
  const element = document.getElementById('form-content');
  if (!element) {
    console.error(`Element with id '${elementId}' not found.`);
    return;
  }

  try {
    // 使用html2canvas将DOM元素转换为Canvas
    // 可以根据需要调整配置项，例如缩放比例以提高清晰度{citation:4}
    const canvas = await html2canvas(element, {
      scale: 2, // 提高缩放比例可能改善清晰度，但会增加文件大小{citation:4}
      useCORS: true, // 如果需要加载跨域图片，请设置此项
      logging: false // 关闭调试日志
    });

    // 从Canvas获取图片数据
    const imgData = canvas.toDataURL('image/jpeg', 1.0); // 也可使用'image/png'

    // 计算PDF页面尺寸（这里以A4为例）
    const pdf = new jsPDF('p', 'mm', 'a4'); // 方向(p:纵向, l:横向)、单位、格式
    const pdfWidth = pdf.internal.pageSize.getWidth()*0.9;
    const pdfHeight = pdf.internal.pageSize.getHeight()*0.9;

    // 计算图片在PDF中显示的尺寸，保持宽高比并适应页面宽度
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgPDFWidth = imgWidth * ratio;
    const imgPDFHeight = imgHeight * ratio;

    // 将图片添加到PDF（居中显示）
    const x = pdf.internal.pageSize.getWidth()*0.05;
    const y = pdf.internal.pageSize.getHeight()*0.05;

    pdf.addImage(imgData, 'JPEG', x, y, imgPDFWidth, imgPDFHeight);
    
    // 保存PDF
    pdf.save('exported.pdf');
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
}


// 导出Excel
const exportToExcel = async () => {


  // 添加数据行
  const template = currentTemplate.value;
  if (template.name == '') {
    alert('客户名不能为空');
    return;
  }
  if (template.items.length === 0) {
    alert('没有数据可导出');
    return;
  }

  try {
    // 创建ExcelJS工作簿
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet');

    const rowCompany = worksheet.getRow(1);
    rowCompany.getCell(1).font = {
      bold: true,
      size: 22,
      name:'Arial',
      italic:true,
      underline:true
    };
    rowCompany.getCell(1).value = " Hangzhou Oscar Technology Co. , Ltd.";


    const rowCompanyDetail = worksheet.getRow(2);
    rowCompanyDetail.getCell(1).font = {
      bold: true,
      size: 22,
      name:'Times New Roman',
      italic:true
    };
    rowCompanyDetail.getCell(1).value = " No. 101 Binkang Road, Xixing Street, Binjiang District, Hangzhou City,Zhejiang Province, China";


    const rowCompanyDetailTel = worksheet.getRow(3);
    rowCompanyDetailTel.getCell(1).font = {
      bold: true,
      size: 22,
      name:'Times New Roman',
      italic:true
    };
    rowCompanyDetailTel.getCell(1).value = "MOBILE PHONE NO:0086-13626696955 TEL PHONE NO:0086-579-85893698 FAX NO:0086-579-85893698";



    const row1 = worksheet.getRow(6);
    row1.getCell(1).font = {
      bold: true,
      size: 12,
      name:'Arial'
    };
    row1.getCell(1).value = "Bill To";

    const row2 = worksheet.getRow(8);
    row2.getCell(1).font = {
      bold: true,
      size: 12,
      name:'Arial'
    };
    row2.getCell(1).value = "Address";

    const row3 = worksheet.getRow(10);
    row3.getCell(1).font = {
      bold: true,
      size: 12,
      name:'Arial'
    };
    row3.getCell(1).value = "TEL";

    const row4 = worksheet.getRow(12);
    row4.getCell(1).font = {
      bold: true,
      size: 12,
      name:'Arial'
    };
    row4.getCell(1).value = "EMAIL";




    // 设置列标题
    worksheet.columns = [
      { width: 10 },
      { width: 40 },
      { width: 25 },

      { width: 10 },
      { width: 10 },
      { width: 20 },
      { width: 15 },
      { width: 15 }
    ];

    // // 设置表头样式
    // worksheet.getRow(1).font = { bold: true, size: 14 };
    // worksheet.getRow(1).fill = {
    //   type: 'pattern',
    //   pattern: 'solid',
    //   fgColor: { argb: 'FFE0E0E0' }
    // };

    let sty = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };



    let startRow = 14;
    const row = worksheet.getRow(startRow - 1);
    row.getCell(1).value = "REF NO";

    row.getCell(1).font = { bold: true, size: 12 ,name:'Arial' };
    row.getCell(1).border = sty;
    row.getCell(2).value = "PICTURE";
    row.getCell(2).border = sty;
    row.getCell(2).font = { bold: true, size: 10 ,name:'Arial' };
    row.getCell(3).value = "DESCRIPTION";
    row.getCell(3).border = sty;
    row.getCell(3).font = { bold: true, size: 10 ,name:'Arial' };
    row.getCell(4).value = "QTY";
    row.getCell(4).border = sty;
    row.getCell(4).font = { bold: true, size: 10 ,name:'Arial' };
    row.getCell(5).value = "UNIT";
    row.getCell(5).font = { bold: true, size: 10 ,name:'Arial' };
    row.getCell(5).border = sty;
    row.getCell(6).value = "USD UNIT PRC";
    row.getCell(6).border = sty;
    row.getCell(6).font = { bold: true, size: 10 ,name:'Arial' };
    row.getCell(7).value = "AMOUNT";
    row.getCell(7).border = sty;
    row.getCell(7).font = { bold: true, size: 10 ,name:'Arial' };

    
    row.getCell(8).value = "LINKS";
    row.getCell(8).border = sty;
    row.getCell(8).font = { bold: true, size: 10 ,name:'Arial' };
    
    row.getCell(9).value = "F列填写含成本，运费，利润的单价";
    row.getCell(9).font = { bold: true, size: 10 ,name:'Arial',color: { argb: 'FFFF0000' } };
    if (template.items && template.items.length > 0) {
      for (let itemIndex = 0; itemIndex < template.items.length; itemIndex++) {
        const item = template.items[itemIndex];
        const rowNumber = itemIndex + startRow; // 从第2行开始（第1行是标题）
        // 添加基本数据
        const row = worksheet.getRow(rowNumber);
        // 设置基本数据
        row.getCell(1).value = itemIndex + 1;


        row.getCell(1).font = {
          bold: true,
          size: 22
        };
        row.getCell(1).border = sty;

        row.getCell(3).value = item.description || '';
        row.getCell(3).font = {
          bold: true,name:'Arial',size:14
        };

        row.getCell(6).numFmt = '"$"#,##0.00';
        row.getCell(6).value = (item.price || 0);
        row.getCell(6).font = {
          bold: true,name:'Arial',size:10
        };
        row.getCell(4).value = item.quantity || 0;

        row.getCell(4).font = {
          bold: true,name:'Arial',size:12
        };
        row.getCell(5).value = 'pcs';

        row.getCell(5).font = {
          bold: true,name:'Arial',size:10
        };

        row.getCell(7).numFmt = '"$"#,##0.00';
        //公式
        row.getCell(7).value = {
          formula: '=D' + rowNumber + " * F" + rowNumber, // 设置公式
        };

        row.getCell(7).font = {
          bold: true,name:'Arial',size:10
        };

        row.getCell(2).border = sty;
        row.getCell(3).border = sty;
        row.getCell(4).border = sty;
        row.getCell(5).border = sty;
        row.getCell(6).border = sty;
        row.getCell(7).border = sty;
        row.getCell(8).border = sty;
        // 设置行高以适应图片

        // 如果有图片，添加到图片列
        if (item.image) {
          row.height = 160;
          try {
            // 将base64图片转换为Uint8Array
            const base64Data = item.image.split(',')[1];
            const binaryString = atob(base64Data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }

            // 检测图片格式
            let extension = 'png';
            if (item.image.startsWith('data:image/jpeg')) {
              extension = 'jpeg';
            } else if (item.image.startsWith('data:image/gif')) {
              extension = 'gif';
            } else if (item.image.startsWith('data:image/webp')) {
              extension = 'webp';
            }

            // 添加图片到工作表
            const imageId = workbook.addImage({
              buffer: bytes,
              extension: extension
            });

            // 将图片添加到指定单元格
            worksheet.addImage(imageId, {
              tl: { col: 1, row: itemIndex + startRow-1, offsetX: -20, offsetY: -20 }, // 图片列（G列）
              br: { col: 2, row: itemIndex + startRow, offsetX: -20, offsetY: -20 }, // 右下角位置
              editAs: 'oneCell',
              hyperlinks: {
                tooltip: `产品${itemIndex + 1}图片`
              }
            });
            // 设置图片单元格的值
            // row.getCell(2).value = '图片已嵌入';
          } catch (error) {
            console.error('添加图片失败:', error);
            row.getCell(2).value = '图片添加失败';
          }
        } else {

          row.height = 50;
        }
      }

      // 总金额
      const row = worksheet.getRow(template.items.length + startRow);
       row.height = 25;
      row.getCell(4).value = {
        formula: 'SUM(D2:' + 'D' + (template.items.length + 1) + ')', // 设置公式
      };

      row.getCell(4).font = {
        color: { argb: '00000000' },
        bold: true,name:'Arial',
        size: 10
      };
      row.getCell(4).border = sty;
      row.getCell(6).value = 'TOTAL PRICE';
      row.getCell(6).font = {
        color: { argb: '00000000' },
        bold: true,name:'Arial',
        size: 10
      };
      row.getCell(7).font = {
        color: { argb: 'FFFF0000' },
        bold: true,name:'Arial',
        size: 11
      };
      row.getCell(7).border = sty;

      row.getCell(7).numFmt = '"$"#,##0.00';
      row.getCell(7).value = {
        formula: 'SUM(G' + startRow + ':G' + (template.items.length + startRow - 1) + ')', // 设置公式
      };


      const row3 = worksheet.getRow(template.items.length + startRow + 1);
       row3.height = 25;
      row3.getCell(6).value = 'HANGDING CHARGE';
      //  row3.getCell(7).numFmt ='"$"#,##0.00';
      row3.getCell(7).value = '0'

      row3.getCell(6).font = {
        color: { argb: '00000000' },
        bold: true,name:'Arial',size:10
      };
      row3.getCell(7).font = {
        color: { argb: 'FFFF0000' },
        bold: true,name:'Arial',size:10
      };


      const row4 = worksheet.getRow(template.items.length + startRow + 2);
       row4.height = 25;
      row4.getCell(6).value = 'COMPANY PRODUCTS';
      //  row4.getCell(7).numFmt ='"$"#,##0.00';
      row4.getCell(7).value = '0'

      row4.getCell(6).font = {
        color: { argb: '00000000' },
        bold: true,name:'Arial',size:10
      };
      row4.getCell(7).font = {
        color: { argb: 'FFFF0000' },
        bold: true,name:'Arial',size:10
      };


      const row5 = worksheet.getRow(template.items.length + startRow + 3);
       row5.height = 25;
      row5.getCell(6).value = 'TOTAL CAF';
      row5.getCell(7).numFmt = '"$"#,##0.00';
      row5.getCell(7).value = {
        formula: 'SUM(G' + (template.items.length + startRow) + ':G' + (template.items.length + startRow + 2) + ')', // 设置公式
      };

      row5.getCell(6).font = {
        color: { argb: '00000000' },
        bold: true,name:'Arial',size:10
      };
      row5.getCell(7).font = {
        color: { argb: 'FFFF0000' },
        bold: true,name:'Arial',size:10
      };


    }
    // 设置所有行的对齐方式
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
    });

    // 导出文件
    const fileName = `${template.name}_${new Date().toISOString().split('T')[0]}.xlsx`;
    const buffer = await workbook.xlsx.writeBuffer();

    // 创建下载链接
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);

    alert('Excel文件导出成功！');
  } catch (error) {
    console.error('导出Excel失败:', error);
    alert('导出失败，请重试');
  }
};
</script>

<style scoped>
.order-templates-view {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 30px;
  text-align: center;
}

.page-header h1 {
  color: #333;
  margin-bottom: 10px;
  font-size: 2.5rem;
}

.page-description {
  color: #666;
  font-size: 1.1rem;
}

.template-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.template-form-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  /* max-width: 1000px; */
  margin-left: auto;
  margin-right: auto;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.form-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #eee;
  margin-top: 10px;
}

.total-preview {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.total-label {
  color: #666;
  font-weight: 500;
}

.total-value {
  color: #e74c3c;
  font-size: 1.2rem;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

/* 多行数据样式 */
.items-section {
  margin-top: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.items-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #dee2e6;
}

.items-header h4 {
  margin: 0;
  color: #333;
  font-size: 1.2rem;
}

.btn-sm {
  padding: 8px 12px;
  font-size: 0.85rem;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.item-row {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  transition: box-shadow 0.3s ease;
}

.item-row:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.item-number {
  width: 30px;
  height: 30px;
  background: #007bff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.item-fields {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
  flex: 1;
}

.item-fields .form-group {
  margin-bottom: 0;
}

.item-total {
  padding: 8px 12px;
  background: #e3f2fd;
  border-radius: 6px;
  color: #1976d2;
  font-weight: 600;
  text-align: center;
  border: 1px solid #bbdefb;
}

.item-actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background-color: #c82333;
}

.btn-danger:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

/* 模板预览样式 */
.template-items {
  margin-top: 15px;
}

.items-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 6px;
  font-size: 0.9rem;
}

.items-count {
  color: #666;
  font-weight: 500;
}

.total-price {
  color: #e74c3c;
  font-weight: 600;
}

.items-preview {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.item-preview {
  padding: 8px;
  background: white;
  border-radius: 6px;
  font-size: 0.85rem;
  border: 1px solid #e9ecef;
  margin-bottom: 5px;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.item-image {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
}

.item-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  width: 100%;
  height: 100%;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 0.7rem;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.item-name {
  color: #333;
  font-weight: 500;
  font-size: 0.9rem;
}

.item-desc {
  color: #666;
  font-size: 0.8rem;
}

.item-price {
  color: #e74c3c;
  font-weight: 600;
  font-size: 0.85rem;
}

.more-items {
  text-align: center;
  color: #666;
  font-size: 0.8rem;
  font-style: italic;
  padding: 5px;
}

.btn {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background-color: #218838;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #545b62;
}

.btn-icon {
  font-size: 1rem;
}

.templates-content {
  /* max-width: 1200px; */
  margin: 0 auto;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-state h3 {
  color: #333;
  margin-bottom: 10px;
  font-size: 1.5rem;
}

.empty-state p {
  color: #666;
  font-size: 1.1rem;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
}

.template-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.template-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.template-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.template-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
}

.template-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;
}

.edit-btn {
  background-color: #17a2b8;
  color: white;
}

.edit-btn:hover {
  background-color: #138496;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.delete-btn:hover {
  background-color: #c82333;
}

.template-preview {
  display: flex;
  gap: 15px;
}

.preview-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.template-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 0.9rem;
}

.preview-details {
  flex: 1;
}

.template-name {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
}

.template-description {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 15px;
  line-height: 1.4;
}

.template-meta {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-label {
  color: #666;
  font-size: 0.8rem;
  font-weight: 500;
}

.meta-value {
  color: #333;
  font-weight: 600;
  font-size: 0.9rem;
}

.total-price {
  color: #e74c3c;
  font-size: 1.1rem;
}


.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}


.form-input-des {
  width: 100%;
  height: 100px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}
.form-input,
.form-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #007bff;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.image-upload {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.file-input {
  display: none;
}

.upload-btn {
  padding: 10px 16px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #666;
}

.upload-btn:hover {
  border-color: #007bff;
  background: #e3f2fd;
  color: #007bff;
}

.image-preview {
  position: relative;
  display: inline-block;
}

.preview-img {
 
    width: 100%;
    aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.remove-image {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
}

.total-preview {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: 600;
  color: #e74c3c;
  text-align: center;
}


@media (max-width: 768px) {
  .templates-grid {
    grid-template-columns: 1fr;
  }

  .template-preview {
    flex-direction: column;
  }

  .preview-image {
    width: 100%;
    height: 150px;
  }

  .template-meta {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .template-actions {
    flex-direction: column;
    align-items: center;
  }

  .form-actions {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .action-buttons {
    justify-content: center;
  }

  .item-fields {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .item-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .item-image {
    align-self: center;
  }

  .item-row {
    flex-direction: column;
    gap: 10px;
  }

  .item-number {
    align-self: flex-start;
  }

  .item-actions {
    align-self: flex-end;
  }

  .items-summary {
    flex-direction: column;
    gap: 5px;
    text-align: center;
  }
}
</style>
