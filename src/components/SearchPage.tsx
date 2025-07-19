import React from 'react';
import { Link } from 'react-router-dom';

// Định nghĩa kiểu dữ liệu cho một địa điểm gợi ý
interface SuggestedDestination {
  id: number;
  name: string;
  type: string;
}

// Dữ liệu mẫu
const suggestedDestinations: SuggestedDestination[] = [
  { id: 1, name: 'Bãi biển Mỹ Khê', type: 'Bãi biển' },
  { id: 2, name: 'Bà Nà Hills', type: 'Khu du lịch' },
  { id: 3, name: 'Phố cổ Hội An', type: 'Di sản văn hóa' },
  { id: 4, name: 'Ngũ Hành Sơn', type: 'Danh thắng' },
];

const SearchPage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {/* Header với nút quay lại */}
      <header className="bg-white p-4 border-b border-slate-200 flex items-center gap-4 sticky top-0 z-10">
        <Link to="/itinerary" className="text-blue-500 font-semibold text-lg">
          ‹ Quay lại
        </Link>
        <h1 className="text-xl font-bold text-slate-800 text-center flex-grow">Tìm Địa Điểm</h1>
      </header>

      <main className="p-5">
        {/* Thanh tìm kiếm */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm bãi biển, núi, thành phố..."
            className="w-full bg-white pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        {/* Danh sách kết quả */}
        <div>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Gợi ý cho bạn</h2>
          <div className="space-y-3">
            {suggestedDestinations.map((dest) => (
              // Mỗi item là một Link đến trang chi tiết với ID tương ứng
              <Link
                key={dest.id}
                to={`/destination/${dest.id}`}
                className="block bg-white p-5 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <h3 className="text-lg font-bold text-slate-800">{dest.name}</h3>
                <p className="text-sm font-semibold text-blue-500">{dest.type}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
