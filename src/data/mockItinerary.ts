import { Itinerary, Challenge } from '@/types/itinerary';

export const mockChallenges: Challenge[] = [
  {
    id: 'ch1',
    title: 'Chụp ảnh với thạch nhũ',
    description: 'Chụp một bức ảnh đẹp với hệ thống thạch nhũ trong hang động',
    type: 'photo',
    completed: false,
    points: 50
  },
  {
    id: 'ch2', 
    title: 'Video thuyền trong hang',
    description: 'Quay video ngắn về chuyến đi thuyền trong hang động',
    type: 'video',
    completed: false,
    points: 75
  },
  {
    id: 'ch3',
    title: 'Check-in tại Thiên Đường',
    description: 'Check-in tại Hang Thiên Đường',
    type: 'checkin',
    completed: true,
    points: 25
  }
];

export const mockItinerary: Itinerary = {
  id: 'itin1',
  title: 'Khám phá Quảng Bình 3 ngày',
  description: 'Hành trình khám phá vẻ đẹp thiên nhiên Quảng Bình',
  startDate: '2024-07-20',
  endDate: '2024-07-22',
  stops: [
    {
      id: 'stop1',
      destinationId: 'phong-nha-cave',
      name: 'Phong Nha Cave',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
      coordinates: [106.2677, 17.5984],
      scheduledTime: '09:00',
      duration: '3 giờ',
      challenges: [mockChallenges[0], mockChallenges[1]],
      posts: []
    },
    {
      id: 'stop2',
      destinationId: 'paradise-cave',
      name: 'Paradise Cave',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      coordinates: [106.2513, 17.5859],
      scheduledTime: '14:00',
      duration: '2 giờ',
      challenges: [mockChallenges[2]],
      posts: []
    },
    {
      id: 'stop3',
      destinationId: 'nhat-le-beach',
      name: 'Nhat Le Beach',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
      coordinates: [106.6235, 17.4833],
      scheduledTime: '17:00',
      duration: '1.5 giờ',
      challenges: [],
      posts: []
    }
  ],
  createdAt: '2024-07-15T10:00:00Z',
  updatedAt: '2024-07-18T15:30:00Z'
};