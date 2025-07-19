import React from 'react';
import { Link, useParams } from 'react-router-dom';

// Trong ứng dụng thật, bạn sẽ dùng useParams để lấy ID và fetch dữ liệu từ API
// const { id } = useParams();

const DestinationDetails: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <div className="relative">
        {/* Ảnh nền */}
        <div
          className="h-72 bg-cover bg-center rounded-b-2xl"
          style={{ backgroundImage: "url('https://source.unsplash.com/random/800x600?hoian')" }}
        >
          {/* Lớp phủ tối mờ để nút quay lại nổi bật hơn */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-b-2xl"></div>
        </div>

        {/* Nút quay lại */}
        <Link
          to="/search"
          className="absolute top-5 left-5 w-10 h-10 bg-black/30 text-white rounded-full flex items-center justify-center text-2xl font-bold hover:bg-black/50 transition"
        >
          ‹
        </Link>
      </div>

      {/* Nội dung chi tiết */}
      <main className="p-5 pb-28">
        <h1 className="text-3xl font-bold text-slate-800">Phố cổ Hội An</h1>
        <p className="text-base text-slate-500 mt-1 mb-4">Quảng Nam, Việt Nam</p>
        <p className="text-base text-slate-600 leading-relaxed">
          Hội An là một thành phố cổ kính nằm ở hạ lưu sông Thu Bồn. Nơi đây nổi tiếng với kiến trúc nhà cổ, những con
          hẻm nhỏ xinh xắn được trang trí bằng đèn lồng rực rỡ và nền ẩm thực phong phú. Du khách có thể đi dạo, khám
          phá các cửa hàng thủ công mỹ nghệ và thưởng thức những món ăn đặc sản.
        </p>
      </main>

      {/* Nút hành động cố định ở cuối trang */}
      <footer className="fixed bottom-0 left-0 w-full bg-white p-4 border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <Link
          to="/itinerary"
          className="block w-full bg-blue-500 text-white text-center font-bold py-4 rounded-xl hover:bg-blue-600 transition"
        >
          Thêm vào chuyến đi
        </Link>
      </footer>
    </div>
  );
};

export default DestinationDetails;
