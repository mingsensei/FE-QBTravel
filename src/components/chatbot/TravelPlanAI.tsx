import React, { useState } from 'react';
import { MapPin, Calendar, Clock, Loader2, Sparkles, ArrowLeft, List } from 'lucide-react';

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
      const response = await fetch('http://localhost:6000/plan-trip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: userInput
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setTravelPlan(data.travel_plan);
      setShowResult(true);
    } catch (err) {
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

  const formatTravelPlan = (plan: string) => {
    return plan.split('\n').map((line, index) => {
      if (line.trim() === '') return null;
      
      const timeMatch = line.match(/(\d{1,2}:\d{2})/);
      const isTimeEntry = timeMatch && line.includes(':');
      const isSectionHeader = line.includes('===') || 
        (line === line.toUpperCase() && line.length > 10 && !timeMatch);
      
      if (line.includes('===')) {
        return null;
      }
      
      if (isSectionHeader) {
        return (
          <div key={index} className="text-lg font-bold text-blue-600 mt-4 mb-2 border-b-2 border-blue-200 pb-1">
            {line.trim()}
          </div>
        );
      }
      
      if (isTimeEntry) {
        return (
          <div key={index} className="flex items-start gap-3 mb-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
            <span className="text-gray-800 leading-relaxed">{line.trim()}</span>
          </div>
        );
      }
      
      return (
        <div key={index} className="mb-2 text-gray-700 leading-relaxed pl-4">
          {line.trim()}
        </div>
      );
    }).filter(Boolean);
  };

  if (showResult && travelPlan) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleBackToInput}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Nhập lại
          </button>
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <List className="w-5 h-5" />
            Về danh sách
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Lộ Trình Du Lịch AI</h2>
          <button
            onClick={handleNewPlan}
            className="ml-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Tạo lộ trình mới
          </button>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">Yêu cầu của bạn:</h3>
          <p className="text-gray-600 italic">"{userInput}"</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
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
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <p className="text-red-700 font-medium">Lỗi</p>
            </div>
            <p className="text-red-600 mt-1">{error}</p>
          </div>
        )}

        <button
          onClick={handleGeneratePlan}
          disabled={isLoading || !userInput.trim()}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Đang tạo lộ trình...
            </>
          ) : (
            <>
              <MapPin className="w-5 h-5" />
              Tạo Lộ Trình Du Lịch
            </>
          )}
        </button>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Gợi ý:</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Nêu rõ thời gian (từ giờ nào đến giờ nào)</li>
            <li>• Chỉ định địa điểm cụ thể</li>
            <li>• Mô tả sở thích và hoạt động mong muốn</li>
            <li>• Đề cập đến ngân sách hoặc các yêu cầu đặc biệt</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TravelPlannerAI;