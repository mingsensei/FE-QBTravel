import React from 'react';
import { Link } from 'react-router-dom';

// Định nghĩa kiểu dữ liệu cho một địa điểm
interface Destination {
  icon: string;
  name: string;
  description: string;
}

// Dữ liệu mẫu - trong ứng dụng thật, dữ liệu này sẽ đến từ API hoặc state
const destinations: Destination[] = [
  {
    icon: '⛵️',
    name: 'Nyhavn',
    description: 'Khám phá bến cảng đầy màu sắc',
  },
  {
    icon: '🎢',
    name: 'Tivoli Gardens',
    description: 'Công viên giải trí lâu đời nhất thế giới',
  },
  {
    icon: '🏛️',
    name: 'Christiansborg Palace',
    description: 'Tham quan Tòa nhà Quốc hội Đan Mạch',
  },
];

const Itinerary: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {/* Header */}
      <header className="bg-white p-5 border-b border-slate-200 text-center shadow-sm">
        <h1 className="text-xl font-bold text-slate-800">Chuyến Đi Của Tôi</h1>
      </header>

      {/* Thông tin chuyến đi */}
      <main className="pb-24">
        <div className="p-5">
          <h2 className="text-3xl font-bold text-slate-800">Khám Phá Scandinavia</h2>
          <p className="text-base text-slate-500 mt-1">20 Tháng 9 - 30 Tháng 9, 2024</p>
        </div>

        {/* Tiêu đề danh sách */}
        <div className="px-5 py-2 text-sm font-medium text-slate-500 uppercase tracking-wider border-b border-t border-slate-200 bg-white">
          Copenhagen, Denmark
        </div>

        {/* Danh sách địa điểm */}
        <div className="p-5">
          {destinations.map((item, index) => (
            <div key={index} className="flex items-center bg-white p-4 rounded-xl shadow-sm mb-4">
              <span className="text-2xl mr-4">{item.icon}</span>
              <div className="flex-grow">
                <h3 className="text-lg font-bold text-slate-800">{item.name}</h3>
                <p className="text-sm text-slate-500">{item.description}</p>
              </div>
            </div>
          ))}

          {/* Nút 'Thêm địa điểm' mới, thay thế cho nút nổi */}
          <Link
            to="/search"
            className="flex items-center justify-center w-full bg-white p-4 mt-4 rounded-xl border-2 border-dashed border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-slate-400 transition-all duration-200"
          >
            <span className="text-xl font-bold text-blue-500">+</span>
            <span className="ml-3 font-semibold">Thêm địa điểm</span>
          </Link>
        </div>
      </main>

      {/* Nút '+' nổi đã được xóa */}
    </div>
  );
};

export default Itinerary;
