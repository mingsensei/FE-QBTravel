import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Plus, Eye, X } from 'lucide-react';

// Types
interface Itinerary {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface ItineraryListProps {
  onSelectItinerary: (itinerary: Itinerary) => void;
  onCreateNew: () => void;
}

// Create Modal Component
const CreateItineraryModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'DRAFT'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      alert('Vui lòng nhập tiêu đề lịch trình');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      setFormData({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'DRAFT'
      });
      onClose();
    } catch (error) {
      console.error('Lỗi tạo lịch trình:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Tạo lịch trình mới</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1 h-auto"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Tiêu đề lịch trình <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập tiêu đề lịch trình"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Mô tả
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mô tả cho lịch trình"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Ngày bắt đầu
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Ngày kết thúc
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                min={formData.startDate}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang tạo...' : 'Tạo lịch trình'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ItineraryList: React.FC<ItineraryListProps> = ({ onSelectItinerary, onCreateNew }) => {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchItineraries = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      
      const res = await fetch('http://localhost:8081/api/itinerary/by-user/2', {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      if (!res.ok) throw new Error('Không thể tải dữ liệu lịch trình');
      const data = await res.json();
      setItineraries(data);
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi gọi API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItineraries();
  }, []);

  const handleCreateItinerary = async (formData: any) => {
    try {
      // Lấy token từ localStorage hoặc context
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      
      const res = await fetch('http://localhost:8081/api/itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Không thể tạo lịch trình');
      }

      const newItinerary = await res.json();
      
      // Refresh danh sách lịch trình
      await fetchItineraries();
      
      // Hiển thị thông báo thành công
      alert('Tạo lịch trình thành công!');
    } catch (error: any) {
      alert(`Lỗi: ${error.message}`);
      throw error;
    }
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate).toLocaleDateString();
    const end = new Date(endDate).toLocaleDateString();
    return `${start} - ${end}`;
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} ngày`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Lịch trình của tôi
              </h1>
              <p className="text-gray-600">
                Quản lý và theo dõi các chuyến đi của bạn
              </p>
            </div>
            <Button 
              onClick={() => setShowCreateModal(true)} 
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Tạo lịch trình mới
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải lịch trình...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Itinerary Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {itineraries.map((itinerary) => (
              <Card key={itinerary.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-white">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{itinerary.title}</CardTitle>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {itinerary.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Date and Duration */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDateRange(itinerary.startDate, itinerary.endDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{calculateDuration(itinerary.startDate, itinerary.endDate)}</span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="w-3 h-3" />
                    <span>Quảng Bình</span>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      itinerary.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                      itinerary.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {itinerary.status === 'DRAFT' ? 'Nháp' :
                       itinerary.status === 'PUBLISHED' ? 'Đã xuất bản' : itinerary.status}
                    </span>
                  </div>

                  {/* Action Button */}
                  <Button 
                    onClick={() => onSelectItinerary(itinerary)}
                    className="w-full gap-2"
                    variant="outline"
                  >
                    <Eye className="w-4 h-4" />
                    Xem chi tiết
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {itineraries.length === 0 && !loading && !error && (
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-green-100 mb-6 flex items-center justify-center mx-auto">
              <Calendar className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có lịch trình nào</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              Tạo lịch trình đầu tiên của bạn để bắt đầu khám phá những điểm đến tuyệt vời ở Quảng Bình.
            </p>
            <Button 
              onClick={() => setShowCreateModal(true)} 
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Tạo lịch trình đầu tiên
            </Button>
          </div>
        )}

        {/* Create Modal */}
        <CreateItineraryModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateItinerary}
        />
      </div>
    </div>
  );
};

export default ItineraryList;