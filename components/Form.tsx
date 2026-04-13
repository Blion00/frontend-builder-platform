'use client';

import { useState, useEffect } from 'react';
import { getTemplates, generateDocument } from '../lib/api';

interface Template {
  id: number;
  name: string;
  file_path?: string;
  fields?: string[];
  labels?: Record<string, string>;
  defaults?: Record<string, string>;
}

const DEFAULT_LABELS: Record<string, string> = {
  don_vi_cap_tren: 'Đơn vị cấp trên',
  don_vi: 'Đơn vị',
  ten_giao_an: 'Tên giáo án',
  phan: 'Phần',
  cap_bac_nguoi_ky_bia: 'Cấp bậc người ký bìa',
  ho_ten_nguoi_ky_bia: 'Họ tên người ký bìa',
  nguoi_phe_duyet: 'Người phê duyệt',
  ngay: 'Ngày',
  thang: 'Tháng',
  nam: 'Năm',
  phan_doi_ngu: 'Phần đội ngũ',
  bai: 'Bài',
  cua_ai: 'Của ai',
  dia_diem_thong_qua: 'Địa điểm thông qua',
  chi_tiet_thong_qua: 'Chi tiết thông qua',
  dia_diem_phe_duyet: 'Địa điểm phê duyệt',
  chi_tiet_phe_duyet: 'Chi tiết phê duyệt',
  noi_dung_giao_an: 'Nội dung giáo án',
  chi_tiet_noi_dung_giao_an: 'Chi tiết nội dung giáo án',
  thuc_hanh_huan_luyen: 'Thực hành huấn luyện',
  chi_tiet_thuc_hanh: 'Chi tiết thực hành',
  ket_luan: 'Kết luận',
  chuc_vu_nguoi_ky_trang_2: 'Chức vụ người ký trang 2',
  cap_bac_trang_2: 'Cấp bậc người ký trang 2',
  ho_ten_trang_2: 'Họ tên người ký trang 2',
  muc_dich: 'Mục đích',
  yeu_cau: 'Yêu cầu',
  doi_voi_chi_huy: 'Đối với chỉ huy',
  doi_voi_tieu_doi: 'Đối với tiểu đội',
  noi_dung_1: 'Nội dung 1',
  noi_dung_2: 'Nội dung 2',
  noi_dung_3: 'Nội dung 3',
  trong_tam: 'Trọng tâm',
  to_chuc_1: 'Tổ chức 1',
  to_chuc_2: 'Tổ chức 2',
  phuong_phap: 'Phương pháp',
  phuong_phap_1: 'Phương pháp 1',
  dia_diem_boi_duong: 'Địa điểm bồi dưỡng',
  dia_diem_thuc_hanh: 'Địa điểm thực hành',
  tai_lieu_1: 'Tài liệu 1',
  tai_lieu_2: 'Tài liệu 2',
  cap_bac_nguoi_ky_trang_2: 'Cấp bậc người ký trang 2',
  ho_ten_nguoi_ky_trang_2: 'Họ tên người ký trang 2',
  y_nghia: 'Ý nghĩa',
  vi_tri_1: 'Vị trí 1',
  vi_tri_2: 'Vị trí 2',
  vi_tri_3: 'Vị trí 3',
  vi_tri_4: 'Vị trí 4',
  khau_lenh: 'Khẩu lệnh',
  dong_tac: 'Động tác',
  dong_tac_1: 'Động tác 1',
  chu_y: 'Chú ý',
};

const DEFAULT_FIELDS = [
  'don_vi_cap_tren',
  'don_vi',
  'ten_giao_an',
  'phan',
  'cap_bac_nguoi_ky_bia',
  'ho_ten_nguoi_ky_bia',
  'nguoi_phe_duyet',
  'ngay',
  'thang',
  'nam',
  'phan_doi_ngu',
  'bai',
  'cua_ai',
  'dia_diem_thong_qua',
  'chi_tiet_thong_qua',
  'dia_diem_phe_duyet',
  'chi_tiet_phe_duyet',
  'noi_dung_giao_an',
  'chi_tiet_noi_dung_giao_an',
  'thuc_hanh_huan_luyen',
  'chi_tiet_thuc_hanh',
  'ket_luan',
  'chuc_vu_nguoi_ky_trang_2',
  'cap_bac_trang_2',
  'ho_ten_trang_2',
  'muc_dich',
  'yeu_cau',
  'doi_voi_chi_huy',
  'doi_voi_tieu_doi',
  'noi_dung_1',
  'noi_dung_2',
  'noi_dung_3',
  'trong_tam',
  'to_chuc_1',
  'to_chuc_2',
  'phuong_phap',
  'phuong_phap_1',
  'dia_diem_boi_duong',
  'dia_diem_thuc_hanh',
  'tai_lieu_1',
  'tai_lieu_2',
  'cap_bac_nguoi_ky_trang_2',
  'ho_ten_nguoi_ky_trang_2',
  'y_nghia',
  'vi_tri_1',
  'vi_tri_2',
  'vi_tri_3',
  'vi_tri_4',
  'khau_lenh',
  'dong_tac',
  'dong_tac_1',
  'chu_y',
];

const MOCK_DATA: Record<string, string> = {
  don_vi_cap_tren: 'BỘ TƯ LỆNH THỦ ĐÔ',
  don_vi: 'LỮ ĐOÀN CÔNG BINH 279',
  ten_giao_an: 'HUẤN LUYỆN ĐIỀU LỆNH ĐỘI NGŨ',
  phan: 'Khám súng',
  cap_bac_nguoi_ky_bia: 'THƯỢNG TÁ',
  ho_ten_nguoi_ky_bia: 'NGUYỄN VĂN A',
  nguoi_phe_duyet: 'TRUNG ĐOÀN TRƯỞNG',
  phan_doi_ngu: 'Động tác nghiêm, nghỉ, quay tại chỗ',
  bai: 'Bài 1: Động tác từng người không súng',
  cua_ai: 'Đại đội 1, Tiểu đoàn 4',
  dia_diem_thong_qua: 'Phòng họp Tiểu đoàn 4',
  chi_tiet_thong_qua: 'Thông qua toàn bộ nội dung lý thuyết và kế hoạch thực hành',
  dia_diem_phe_duyet: 'Phòng chỉ huy Trung đoàn',
  chi_tiet_phe_duyet: 'Phê duyệt để tổ chức huấn luyện',
  noi_dung_giao_an: '- Mục đích: Huấn luyện cho bộ đội nắm chắc động tác.\n- Yêu cầu: Thực hành chuẩn xác, thống nhất.',
  chi_tiet_noi_dung_giao_an: '1. Ý nghĩa của điều lệnh đội ngũ.\n2. Các cử động đằng trước bước, đằng sau quay.',
  thuc_hanh_huan_luyen: 'Tổ chức chia tiểu đội luyện tập 3 bước: \n- B1: Từng người tự nghiên cứu.\n- B2: Tiểu đội trưởng hô cho tiểu đội tập.\n- B3: Tập tổng hợp.',
  chi_tiet_thuc_hanh: 'Thời gian tập: 45 phút.\nNgười phụ trách: Các tiểu đội trưởng.',
  ket_luan: 'Đơn vị hoàn thành tốt nội dung, tác phong nghiêm túc, đạt loại Khá.',
  chuc_vu_nguoi_ky_trang_2: 'Tiểu đoàn trưởng',
  cap_bac_trang_2: 'Thiếu tá',
  ho_ten_trang_2: 'Trần Văn B',
  muc_dich: 'Huấn luyện cho bộ đội nắm chắc thuần thục động tác.',
  yeu_cau: 'Nắm chắc lý thuyết, thực hành chuẩn xác, thống nhất, đảm bảo an toàn.',
  doi_voi_chi_huy: 'Thông qua giáo án, chuẩn bị thực địa tư thế tác phong nghiêm chỉnh.',
  doi_voi_tieu_doi: 'Tuyệt đối chấp hành mệnh lệnh, chú ý quan sát, luyện tập tích cực.',
  noi_dung_1: '1. Ý nghĩa, yêu cầu của điều lệnh đội ngũ.',
  noi_dung_2: '2. Động tác nghiêm, nghỉ, quay tại chỗ.',
  noi_dung_3: '3. Động tác tiến, lùi, qua phải, qua trái.',
  trong_tam: 'Bước 2 và Bước 3 trong động tác.',
  to_chuc_1: 'Lấy trung đội làm đơn vị học tập.',
  to_chuc_2: 'Lấy tiểu đội làm đơn vị luyện tập.',
  phuong_phap: 'Theo 3 bước: làm nhanh, làm chậm phân tích, làm tổng hợp.',
  phuong_phap_1: 'Chia nhỏ luyện tập, sai đâu sửa đó.',
  dia_diem_boi_duong: 'Phòng giao ban đại đội / Sân cỏ',
  dia_diem_thuc_hanh: 'Thao trường huấn luyện',
  tai_lieu_1: 'Sách Điều lệnh đội ngũ tập 1, 2.',
  tai_lieu_2: 'Tài liệu hướng dẫn huấn luyện năm 2026.',
  cap_bac_nguoi_ky_trang_2: 'Thiếu tá',
  ho_ten_nguoi_ky_trang_2: 'Trần Văn B',
  y_nghia: 'Nhằm thống nhất hàng ngũ, hình thành thói quen rèn luyện kỷ luật.',
  vi_tri_1: 'Vị trí chuẩn bị chỉ huy cách đội hình 3 - 5 bước.',
  vi_tri_2: 'Vị trí tập hợp cách đội hình 3 - 5 bước chếch về trước.',
  vi_tri_3: 'Hướng mặt quan sát trực diện đội hình.',
  vi_tri_4: 'Thay đổi vị trí linh hoạt khi sửa tập.',
  khau_lenh: 'Tiểu đội X - TẬP HỢP',
  dong_tac: 'Nghe dứt động lệnh, nhanh chóng chạy vào vị trí tập hợp.',
  dong_tac_1: 'Giữ đúng khoảng cách, cự ly và tư thế nghiêm.',
  chu_y: 'Hô khẩu lệnh dõng dạc, động tác sửa rõ ràng.',
};

const toLabel = (key: string, customLabels?: Record<string, string>) => {
  const labels = { ...DEFAULT_LABELS, ...customLabels };
  return labels[key] || key;
};

const buildDefaultDataForTemplate = (template: Template | null) => {
  if (!template) return {};

  const today = new Date();
  const todayDay = String(today.getDate()).padStart(2, '0');
  const todayMonth = String(today.getMonth() + 1).padStart(2, '0');
  const todayYear = String(today.getFullYear());

  const data: Record<string, string> = {};
  const fields = template.fields && template.fields.length ? template.fields : DEFAULT_FIELDS;
  const defaults = template.defaults || {};

  fields.forEach((key) => {
    let value = defaults[key] || '';

    // Sử dụng dữ liệu giả (mock data) nếu không có giá trị mặc định
    if (!value && MOCK_DATA[key]) {
      value = MOCK_DATA[key];
    }

    // Auto-fill date fields with today's date when not defined in defaults
    if (key === 'ngay' && !defaults.ngay) value = todayDay;
    if (key === 'thang' && !defaults.thang) value = todayMonth;
    if (key === 'nam' && !defaults.nam) value = todayYear;

    if (['don_vi_cap_tren', 'don_vi', 'ten_giao_an', 'cap_bac_nguoi_ky_bia'].includes(key)) {
      value = value.toUpperCase();
    }

    data[key] = value;
  });

  return data;
};

const showValue = (value?: string) => (value && value.trim() ? value : '................');

const getFormFieldValue = (data: Record<string, string>, keys: string[]) => {
  for (const key of keys) {
    if (data[key] && data[key].trim()) {
      return data[key];
    }
  }
  return '';
};

const getPreviewVariant = (template?: Template | null) => {
  const filePath = template?.file_path || '';
  if (filePath.includes('phe_duyet_mau_01.docx')) {
    return {
      coverTitle: 'KẾ HOẠCH HUẤN LUYỆN',
      approveTitle: 'THÔNG QUA',
      approveSubTitle: 'CỦA TIỂU ĐOÀN TRƯỞNG',
      signerTitle: 'TIỂU ĐOÀN TRƯỞNG',
      section1: '1. Thông qua giáo án:',
      section4: '4. Kết luận:',
    };
  }
  if (filePath.includes('phe_duyet_mau_02.docx')) {
    return {
      coverTitle: 'GIÁO ÁN',
      approveTitle: 'NHẬN XÉT',
      approveSubTitle: 'CỦA CHÍNH TRỊ VIÊN',
      signerTitle: 'CHÍNH TRỊ VIÊN',
      section1: '1. Nhận xét giáo án:',
      section4: '4. Kiến nghị:',
    };
  }
  return {
    coverTitle: 'GIÁO ÁN',
    approveTitle: 'PHÊ DUYỆT',
    approveSubTitle: 'CỦA ĐẠI ĐỘI TRƯỞNG',
    signerTitle: showValue(undefined),
    section1: '1. Phê duyệt giáo án:',
    section4: '4. Kết luận:',
  };
};

export default function DocForm() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number>();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const previewVariant = getPreviewVariant(selectedTemplate || undefined);

  // Get fields to render from selected template or use defaults
  const fieldsToRender = selectedTemplate?.fields?.length ? selectedTemplate.fields : DEFAULT_FIELDS;
  const templateLabels = selectedTemplate?.labels || {};

  const loadTemplates = async () => {
    setTemplatesLoading(true);
    try {
      const response = await getTemplates();
      if (response.success) {
        setTemplates(response.data);
        if (response.data.length > 0) {
          setSelectedTemplateId(response.data[0].id);
        }
      }
    } catch (error) {
      console.error('Load templates error:', error);
    } finally {
      setTemplatesLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  // Load selected template details and set form data
  useEffect(() => {
    const loadTemplateDetails = async () => {
      if (selectedTemplateId) {
        try {
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
          const res = await fetch(`${baseUrl}/templates/${selectedTemplateId}`);
          if (res.ok) {
            const data = await res.json();
            const template = data.data as Template;
            setSelectedTemplate(template);
            // Build form data based on template defaults
            setFormData(buildDefaultDataForTemplate(template));
          } else {
            throw new Error('Failed to load template');
          }
        } catch (error) {
          console.error('Load template details error:', error);
          // Fallback: use default template with default fields
          setSelectedTemplate({
            id: selectedTemplateId,
            name: templates.find(t => t.id === selectedTemplateId)?.name || 'Template',
            fields: DEFAULT_FIELDS,
            labels: DEFAULT_LABELS,
          });
          setFormData(buildDefaultDataForTemplate({
            id: selectedTemplateId,
            name: 'Template',
            fields: DEFAULT_FIELDS,
            defaults: {},
          }));
        }
      }
    };
    loadTemplateDetails();
  }, [selectedTemplateId, templates]);

  const handleGenerate = async () => {
    if (!selectedTemplateId) {
      alert('Vui lòng chọn template');
      return;
    }

    setLoading(true);
    try {
      const response = await generateDocument(selectedTemplateId, formData);
      if (response.success) {
        const byteCharacters = atob(response.data.content);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i += 1) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: response.data.mimeType });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = response.data.filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Generate error:', error);
      alert('Tạo tài liệu thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateChange = (value: string) => {
    if (!value) {
      setSelectedTemplateId(undefined);
      setSelectedTemplate(null);
      return;
    }
    const nextId = Number(value);
    if (!Number.isNaN(nextId)) {
      setSelectedTemplateId(nextId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Tạo Tài Liệu</h2>

      <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
        <label className="block text-sm font-semibold mb-2 text-red-700">
          ★ CHỌN MẪU VĂN BẢN (TÙY CHỌN)
        </label>
        <select
          value={selectedTemplateId ?? ''}
          onChange={(e) => handleTemplateChange(e.target.value)}
          className="w-full p-2 border rounded bg-white"
          disabled={templatesLoading}
        >
          <option value="">
            {templatesLoading
              ? 'Đang tải danh sách template...'
              : 'Chọn template từ hệ thống'}
          </option>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <div className="mt-2 text-xs text-gray-600">
          {selectedTemplate
            ? `Đang chọn: ${selectedTemplate.name}${selectedTemplate.file_path ? ` (${selectedTemplate.file_path})` : ''}`
            : 'Chưa chọn template. Bạn có thể chọn để điền dữ liệu đúng mẫu.'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 items-start">
        <div className="order-1 lg:order-1 p-4 border rounded bg-gray-100">
          <h3 className="font-semibold mb-4">Mẫu văn bản (xem trước)</h3>
          <div className="h-[70vh] min-h-[520px] overflow-y-auto overflow-x-hidden p-3 bg-gray-200 rounded">
            <div className="flex flex-col items-center gap-6">
              {selectedTemplate?.file_path?.includes('Đội ngũ tiểu đội.docx') ? (
                <>
                  <div className="w-[595px] min-h-[842px] bg-white shadow p-8 text-[14px] leading-6 text-black border border-gray-300 [font-family:'Times_New_Roman',Times,serif]">
                    <div className="h-full border-2 border-gray-700 px-7 py-6">
                      <div className="text-center font-bold text-lg mb-6">GIÁO ÁN HUẤN LUYỆN ĐIỀU LỆNH ĐỘI NGŨ</div>
                      
                      <p className="mt-2 font-bold uppercase">I. MỤC ĐÍCH, YÊU CẦU</p>
                      <p>1. Mục đích: {showValue(formData.muc_dich)}</p>
                      <p>2. Yêu cầu: {showValue(formData.yeu_cau)}</p>
                      <p className="ml-4">- {showValue(formData.doi_voi_chi_huy)}</p>
                      <p className="ml-4">- {showValue(formData.doi_voi_tieu_doi)}</p>
                      
                      <p className="mt-4 font-bold uppercase">II. NỘI DUNG</p>
                      <p>{showValue(formData.noi_dung_1)}</p>
                      <p>{showValue(formData.noi_dung_2)}</p>
                      <p>{showValue(formData.noi_dung_3)}</p>
                      <p className="italic ml-4">Trọng tâm: {showValue(formData.trong_tam)}</p>
                      
                      <p className="mt-4 font-bold uppercase">III. TỔ CHỨC VÀ PHƯƠNG PHÁP</p>
                      <p>1. Tổ chức: {showValue(formData.to_chuc_1)}</p>
                      <p className="ml-4">{showValue(formData.to_chuc_2)}</p>
                      <p>2. Phương pháp: {showValue(formData.phuong_phap_1)}</p>
                      <p className="ml-4">{showValue(formData.phuong_phap)}</p>
                      
                      <p className="mt-4 font-bold uppercase">IV. ĐỊA ĐIỂM, VẬT CHẤT</p>
                      <p>1. Địa điểm:</p>
                      <p className="ml-4">- Nơi bồi dưỡng: {showValue(formData.dia_diem_boi_duong)}</p>
                      <p className="ml-4">- Thao trường: {showValue(formData.dia_diem_thuc_hanh)}</p>
                      <p>2. Vật chất, tài liệu:</p>
                      <p className="ml-4">- {showValue(formData.tai_lieu_1)}</p>
                      <p className="ml-4">- {showValue(formData.tai_lieu_2)}</p>
                      
                      <div className="mt-8 text-right font-semibold">
                        <div>{showValue(formData.chuc_vu_nguoi_ky_trang_2)}</div>
                        <div className="mt-10">{showValue(formData.cap_bac_nguoi_ky_trang_2) || showValue(formData.cap_bac_trang_2)}</div>
                        <div>{showValue(formData.ho_ten_nguoi_ky_trang_2) || showValue(formData.ho_ten_trang_2)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="w-[595px] min-h-[842px] bg-white shadow p-8 text-[14px] leading-6 text-black border border-gray-300 [font-family:'Times_New_Roman',Times,serif]">
                    <div className="h-full border-2 border-gray-700 px-7 py-6">
                      <div className="text-center font-bold mb-4 uppercase">Phần hai: THỰC HÀNH HUẤN LUYỆN</div>
                      
                      <p className="font-bold uppercase">I. NỘI DUNG</p>
                      <div className="text-center mb-4">
                        <p className="italic">Vấn đề huấn luyện 1</p>
                        <p className="font-bold uppercase">TẬP HỢP ĐỘI HÌNH TIỂU ĐỘI HÀNG NGANG</p>
                      </div>

                      <p>Ý nghĩa: {showValue(formData.y_nghia)}</p>
                      
                      <p className="font-bold mt-2">1. Vị trí của tiểu đội trưởng</p>
                      <p>- {showValue(formData.vi_tri_1)};</p>
                      <p>- {showValue(formData.vi_tri_2)};</p>
                      <p>- {showValue(formData.vi_tri_3)};</p>
                      <p>- {showValue(formData.vi_tri_4)}.</p>

                      <p className="font-bold mt-2">2. Đội hình tiểu đội 1 hàng ngang</p>
                      <p>Thực hiện thứ tự như sau:</p>
                      <p className="ml-4">- Tập hợp;</p>
                      <p className="ml-4">- Điểm số;</p>
                      <p className="ml-4">- Chỉnh đốn hàng ngũ;</p>
                      <p className="ml-4">- Giải tán.</p>

                      <p className="mt-2 font-semibold">a) Tập hợp</p>
                      <p>- Khẩu lệnh: <span className="font-bold uppercase">{showValue(formData.khau_lenh)}</span>.</p>
                      <p>- Động tác: {showValue(formData.dong_tac)};</p>

                      <div className="my-8 flex justify-center items-center h-32 border-2 border-dashed border-gray-300 rounded text-gray-400 bg-gray-50 italic">
                        [ Khu vực mô phỏng / chèn hình ảnh sơ đồ đội hình hàng ngang ]
                      </div>

                      <p className="text-center italic mt-2">Tiểu đội 1 hàng ngang</p>
                      <p className="mt-2">{showValue(formData.dong_tac_1)}.</p>
                      <p>Chú ý: {showValue(formData.chu_y)}.</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-[595px] min-h-[842px] bg-white shadow p-8 text-[14px] leading-6 text-black border border-gray-300 [font-family:'Times_New_Roman',Times,serif]">
                    <div className="h-full border-2 border-gray-700 px-10 py-8 flex flex-col">
                      <div className="text-center font-semibold mt-2">
                        <div>{showValue(formData.don_vi_cap_tren)}</div>
                        <div>{showValue(formData.don_vi)}</div>
                      </div>

                      <div className="flex-1 flex items-center justify-center">
                        <div className="text-center font-semibold">
                          <div className="text-[14px] leading-8">{previewVariant.coverTitle}</div>
                          <div className="text-[14px] mt-3 uppercase">{showValue(formData.ten_giao_an)}</div>
                          <div className="text-[14px] mt-2">{showValue(formData.phan_doi_ngu)}</div>
                        </div>
                      </div>

                      <div className="text-center font-semibold mb-6">
                        <div>{showValue(formData.cap_bac_nguoi_ky_bia)} {showValue(formData.ho_ten_nguoi_ky_bia)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="w-[595px] min-h-[842px] bg-white shadow p-8 text-[14px] leading-6 text-black border border-gray-300 [font-family:'Times_New_Roman',Times,serif]">
                    <div className="h-full border-2 border-gray-700 px-7 py-6">
                      <div className="text-center font-semibold mt-1">
                        <div>{showValue(formData.nguoi_phe_duyet)}</div>
                        <div className="font-normal">
                          Ngày {showValue(formData.ngay)} tháng {showValue(formData.thang)} năm {showValue(formData.nam)}
                        </div>
                        <div className="text-[14px] mt-2">{previewVariant.approveTitle}</div>
                        <div className="text-[14px]">{previewVariant.approveSubTitle}</div>
                      </div>

                      <div className="mt-4 space-y-1.5">
                        <p><span className="font-semibold">{previewVariant.section1}</span> {showValue(formData.ten_giao_an)}.</p>
                        <p>Phần: {showValue(formData.phan_doi_ngu)}</p>
                        <p>Bài: {showValue(formData.bai)}</p>
                        <p>Của {showValue(formData.cua_ai)}</p>

                        <p className="mt-2"><span className="font-semibold">2. Địa điểm phê duyệt:</span></p>
                        <p>a. Thông qua tại: {showValue(formData.dia_diem_thong_qua)}</p>
                        <p>{showValue(formData.chi_tiet_thong_qua)}</p>
                        <p className="tracking-widest text-gray-700">......................................................................</p>
                        <p>b. Phê duyệt tại: {showValue(formData.dia_diem_phe_duyet)}</p>
                        <p>{showValue(formData.chi_tiet_phe_duyet)}</p>
                        <p className="tracking-widest text-gray-700">.......................................................................</p>

                        <p className="mt-2"><span className="font-semibold">3. Nội dung phê duyệt:</span></p>
                        <p>a. Nội dung giáo án: {showValue(getFormFieldValue(formData, ['noi_dung_giao_an', 'noi_dung_phe_duyet']))}</p>
                        <p>{showValue(formData.chi_tiet_noi_dung_giao_an)}</p>
                        <p className="tracking-widest text-gray-700">.......................................................................</p>
                        <p>b. Thực hành huấn luyện: {showValue(formData.thuc_hanh_huan_luyen)}</p>
                        <p>{showValue(formData.chi_tiet_thuc_hanh)}</p>
                        <p className="tracking-widest text-gray-700">.......................................................................</p>

                        <p className="mt-2"><span className="font-semibold">{previewVariant.section4}</span></p>
                        <p>{showValue(formData.ket_luan)}</p>
                        <p className="tracking-widest text-gray-700">.......................................................................</p>
                      </div>

                      <div className="mt-8 text-right font-semibold">
                        <div>
                          {previewVariant.signerTitle === showValue(undefined)
                            ? showValue(formData.chuc_vu_nguoi_ky_trang_2)
                            : previewVariant.signerTitle}
                        </div>
                        <div className="mt-10">{showValue(formData.cap_bac_trang_2)}</div>
                        <div>{showValue(formData.ho_ten_trang_2)}</div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="order-2 lg:order-2 p-4 border rounded bg-white">
          <h3 className="font-semibold mb-4">Thông tin nhập liệu</h3>
          {selectedTemplate ? (
            <>
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm font-semibold text-blue-900">Template: {selectedTemplate.name}</p>
                <p className="text-xs text-blue-700">Số field: {fieldsToRender.length}</p>
              </div>
              <div className="space-y-3 h-[65vh] min-h-[480px] overflow-y-auto pr-2">
                {fieldsToRender.map((key) => {
                  const isLongField = key.includes('chi_tiet') || key.includes('noi_dung') || key.includes('ket_luan') || key === 'cua_ai' || key === 'muc_dich' || key === 'yeu_cau' || key === 'trong_tam' || key.includes('doi_voi') || key.includes('to_chuc') || key.includes('phuong_phap') || key.includes('tai_lieu');
                  const isDateField = ['ngay', 'thang', 'nam'].includes(key);
                  return (
                    <div key={key}>
                      <label className="block text-sm font-medium mb-1">{toLabel(key, templateLabels)}</label>
                      {isLongField ? (
                        <textarea
                          rows={3}
                          value={formData[key] || ''}
                          onChange={(e) => {
                            let val = e.target.value;
                            if (['don_vi_cap_tren', 'don_vi', 'ten_giao_an', 'cap_bac_nguoi_ky_bia'].includes(key)) {
                              val = val.toUpperCase();
                            }
                            setFormData((prev) => ({ ...prev, [key]: val }));
                          }}
                          className="w-full p-2 border rounded"
                        />
                      ) : (
                        <input
                          type={isDateField ? 'number' : 'text'}
                          inputMode={isDateField ? 'numeric' : 'text'}
                          min={key === 'ngay' ? 1 : key === 'thang' ? 1 : key === 'nam' ? 1900 : undefined}
                          max={key === 'ngay' ? 31 : key === 'thang' ? 12 : key === 'nam' ? 9999 : undefined}
                          value={formData[key] || ''}
                          onChange={(e) => {
                            let val = e.target.value;
                            if (['don_vi_cap_tren', 'don_vi', 'ten_giao_an', 'cap_bac_nguoi_ky_bia'].includes(key)) {
                              val = val.toUpperCase();
                            }
                            setFormData((prev) => ({ ...prev, [key]: val }));
                          }}
                          className="w-full p-2 border rounded"
                          placeholder={isDateField ? `Nhập ${toLabel(key, templateLabels).toLowerCase()}` : undefined}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="h-[70vh] min-h-[520px] flex items-center justify-center text-gray-500">
              <p>Chọn template từ danh sách để bắt đầu</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-x-4">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Đang tạo...' : 'Tạo & Tải về'}
        </button>
        {selectedTemplate && (
          <span className="text-sm text-gray-500">
            Template: {selectedTemplate?.name} ({selectedTemplate?.file_path})
          </span>
        )}
      </div>
    </div>
  );
}

