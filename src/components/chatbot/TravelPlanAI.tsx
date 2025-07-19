import React, { useState } from 'react';
import { MapPin, Calendar, Clock, Loader2, Sparkles, ArrowLeft, List, FileText, ChevronsRight } from 'lucide-react';

// Giả lập một component App chính để chứa TravelPlannerAI
const App = () => {
  const [showPlanner, setShowPlanner] = useState(true);
  
  if (showPlanner) {
    return <TravelPlannerAI onBack={() => setShowPlanner(false)} />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome Home</h1>
        <button 
          onClick={() => setShowPlanner(true)}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Go to Travel Planner
        </button>
      </div>
    </div>
  );
};


interface TravelPlannerAIProps {
  onBack: () => void;
}

const TravelPlannerAI: React.FC<TravelPlannerAIProps> = ({ onBack }) => {
  const [userInput, setUserInput] = useState('');
  const [travelPlan, setTravelPlan] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleGeneratePlan = async () => {
    if (!userInput.trim()) {
      setError('Vui lòng nhập yêu cầu du lịch của bạn');
      return;
    }

    setIsLoading(true);
    setError('');
    setTravelPlan('');

    try {
      const response = await fetch('http://localhost:5001/plan-trip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: userInput
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `Yêu cầu thất bại với mã trạng thái ${response.status}` }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setTravelPlan(data.travel_plan);
      setShowResult(true);
    } catch (err: any) {
      setError(`Lỗi khi tạo lộ trình: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToInput = () => {
    setShowResult(false);
    setTravelPlan('');
    setError('');
  };

  const handleNewPlan = () => {
    setUserInput('');
    setShowResult(false);
    setTravelPlan('');
    setError('');
  };

  // Hàm được cập nhật để phân tích cú pháp Markdown
  const formatTravelPlan = (plan: string) => {
    const lines = plan.split('\n');

    const renderLine = (line: string) => {
        // Xử lý chữ in đậm (**text**)
        const parts = line.split(/(\*\*.*?\*\*)/g).filter(Boolean);
        return parts.map((part, i) => 
            part.startsWith('**') ? <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong> : part
        );
    };

    return lines.map((line, index) => {
        const trimmedLine = line.trim();
        if (trimmedLine === '') return null;

        // Tiêu đề (## Tiêu đề)
        const headerMatch = trimmedLine.match(/^(#{2,3})\s+(.*)/);
        if (headerMatch) {
            const level = headerMatch[1].length;
            const text = headerMatch[2];
            if (level === 2) return <h2 key={index} className="text-xl font-bold text-blue-700 mt-6 mb-3 border-b-2 border-blue-200 pb-2 flex items-center gap-2"><FileText size={20}/> {text}</h2>;
            if (level === 3) return <h3 key={index} className="text-lg font-semibold text-blue-600 mt-4 mb-2">{text}</h3>;
        }

        // Dòng thời gian (07:00 - 08:00: ...)
        const timeMatch = trimmedLine.match(/^(\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}):\s*(.*)/);
        if (timeMatch) {
            const time = timeMatch[1];
            const activity = timeMatch[2];
            return (
                <div key={index} className="relative pl-8 my-4">
                    <div className="absolute left-0 top-1 flex items-center">
                        <Clock className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="font-bold text-gray-800">{time}</p>
                    <p className="text-gray-700">{renderLine(activity)}</p>
                </div>
            );
        }

        // Danh sách (* hoặc -)
        const listMatch = trimmedLine.match(/^[\*\-]\s+(.*)/);
        if (listMatch) {
            const text = listMatch[1];
            return (
                <div key={index} className="flex items-start gap-3 mb-2 pl-4">
                    <ChevronsRight className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <p className="text-gray-700">{renderLine(text)}</p>
                </div>
            );
        }

        // Đoạn văn bản thường
        return (
            <p key={index} className="mb-2 text-gray-700 leading-relaxed">
                {renderLine(trimmedLine)}
            </p>
        );
    }).filter(Boolean);
  };

  if (showResult && travelPlan) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 sticky top-0 z-10 flex items-center flex-wrap gap-4">
            <button
              onClick={handleBackToInput}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Nhập lại
            </button>
            <h2 className="text-xl font-bold text-gray-800 flex-grow">Lộ Trình Du Lịch AI</h2>
            <button
              onClick={handleNewPlan}
              className="ml-auto flex items-center gap-2 px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Tạo lộ trình mới
            </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">Yêu cầu của bạn:</h3>
          <p className="text-gray-600 italic">"{userInput}"</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
          <div className="prose max-w-none">
            {formatTravelPlan(travelPlan)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white min-h-screen">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </button>
        <h2 className="text-2xl font-bold text-gray-800">AI Travel Planner</h2>
      </div>

      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Tạo Lộ Trình Bằng AI</h1>
        </div>
        <p className="text-gray-600">
          Nhập yêu cầu của bạn và để AI tạo lộ trình du lịch chi tiết
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="travel-input" className="block text-sm font-medium text-gray-700 mb-2">
            Mô tả chuyến du lịch của bạn
          </label>
          <textarea
            id="travel-input"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ví dụ: Tôi muốn đi du lịch Quảng Bình 1 ngày từ 7h sáng đến 6h tối, thích khám phá hang động và các hoạt động mạo hiểm."
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
            <p className="font-bold">Đã xảy ra lỗi</p>
            <p>{error}</p>
          </div>
        )}

        <button
          onClick={handleGeneratePlan}
          disabled={isLoading || !userInput.trim()}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 text-lg font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Đang tạo lộ trình...
            </>
          ) : (
            <>
              <MapPin className="w-6 h-6" />
              Tạo Lộ Trình Du Lịch
            </>
          )}
        </button>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Gợi ý:</h3>
          <ul className="text-blue-700 text-sm space-y-1 list-disc list-inside">
            <li>Nêu rõ thời gian (ví dụ: 1 ngày, từ 7h đến 18h)</li>
            <li>Chỉ định địa điểm (ví dụ: ở trung tâm Đồng Hới)</li>
            <li>Mô tả sở thích (ví dụ: hang động, biển, ẩm thực)</li>
            <li>Đề cập ngân sách hoặc các yêu cầu đặc biệt (ví dụ: chi phí thấp, không đi bộ nhiều)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
