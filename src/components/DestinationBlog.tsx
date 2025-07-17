// DestinationBlog.tsx
import { CoverSection } from '@/components/CoverSection';
import { DetailsSection } from '@/components/DetailsSection';
import { Gallery } from '@/components/Gallery';
import { VideoSection } from '@/components/VideoSection';
import { ReviewsSection } from '@/components/ReviewsSection';
import { TravelTips } from '@/components/TravelTips';
import { Calendar, Package, Utensils } from 'lucide-react';

export function DestinationBlog() {
    const destinationData = {
        title: "Phong Nha Cave",
        tagline: "Discover the underground wonders of Vietnam's most spectacular cave system",
        location: "Phong Nha-Ke Bang National Park, Quang Binh Province",
        backgroundImage: "https://images.pexels.com/photos/3532548/pexels-photo-3532548.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        detailsTitle: "About Phong Nha Cave",
        detailsContent: [
            "Phong Nha Cave is one of Vietnam's most magnificent natural wonders, located in the heart of Phong Nha-Ke Bang National Park. This spectacular limestone cave system stretches for over 44 kilometers, making it one of the longest wet caves in the world.",
            "The cave features stunning stalactites and stalagmites formations, underground rivers, and massive chambers that will leave you in awe. The journey through the cave includes both walking passages and boat rides through the underground waterways, offering a unique and unforgettable experience.",
            "Designated as a UNESCO World Heritage Site, Phong Nha Cave represents millions of years of geological evolution. The cave's pristine beauty and scientific significance make it a must-visit destination for nature lovers and adventure seekers alike."
        ],
        galleryImages: [
            {
                url: "https://images.pexels.com/photos/3532548/pexels-photo-3532548.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1",
                alt: "Phong Nha Cave entrance"
            },
            {
                url: "https://images.pexels.com/photos/2693212/pexels-photo-2693212.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1",
                alt: "Underground river in cave"
            },
            {
                url: "https://images.pexels.com/photos/3532549/pexels-photo-3532549.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1",
                alt: "Stalactites formation"
            },
            {
                url: "https://images.pexels.com/photos/2693213/pexels-photo-2693213.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1",
                alt: "Cave chamber"
            },
            {
                url: "https://images.pexels.com/photos/3532550/pexels-photo-3532550.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1",
                alt: "Boat tour in cave"
            },
            {
                url: "https://images.pexels.com/photos/2693214/pexels-photo-2693214.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1",
                alt: "Cave lighting"
            }
        ],
        videos: [
            {
                id: "1",
                title: "Phong Nha Cave Boat Tour Experience",
                thumbnail: "https://images.pexels.com/photos/3532548/pexels-photo-3532548.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&dpr=1",
                duration: "5:32",
                views: "125K",
                embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                comments: [
                    {
                        id: "1",
                        author: "Sarah Chen",
                        content: "Absolutely breathtaking! The boat ride through the cave was magical.",
                        timestamp: "2 days ago"
                    },
                    {
                        id: "2",
                        author: "Mark Wilson",
                        content: "Amazing video quality! Really captures the beauty of the cave.",
                        timestamp: "1 week ago"
                    }
                ]
            },
            {
                id: "2",
                title: "Underground Wonders: Phong Nha's Hidden Chambers",
                thumbnail: "https://images.pexels.com/photos/2693212/pexels-photo-2693212.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&dpr=1",
                duration: "8:15",
                views: "89K",
                embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                comments: [
                    {
                        id: "3",
                        author: "Emily Johnson",
                        content: "The formations are incredible! Planning my trip now.",
                        timestamp: "3 days ago"
                    }
                ]
            },
            {
                id: "3",
                title: "Phong Nha Cave: A Geological Marvel",
                thumbnail: "https://images.pexels.com/photos/3532549/pexels-photo-3532549.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&dpr=1",
                duration: "6:45",
                views: "156K",
                embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                comments: [
                    {
                        id: "4",
                        author: "David Kim",
                        content: "Educational and beautiful. Great documentary work!",
                        timestamp: "5 days ago"
                    }
                ]
            }
        ],
        reviews: [
            {
                id: "1",
                author: "Jennifer Martinez",
                rating: 5,
                comment: "An absolutely incredible experience! The cave formations are breathtaking and the boat tour was perfectly organized. A must-visit when in Quang Binh!",
                date: "March 15, 2024"
            },
            {
                id: "2",
                author: "Michael Chen",
                rating: 5,
                comment: "The underground river boat ride was magical. The guide was knowledgeable and the whole experience exceeded expectations.",
                date: "March 10, 2024"
            },
            {
                id: "3",
                author: "Anna Thompson",
                rating: 4,
                comment: "Beautiful cave with stunning formations. The tour was well-organized though it can get crowded during peak season.",
                date: "March 8, 2024"
            },
            {
                id: "4",
                author: "Roberto Silva",
                rating: 5,
                comment: "One of the most impressive natural wonders I've ever seen. The scale of the cave system is mind-blowing!",
                date: "March 5, 2024"
            },
            {
                id: "5",
                author: "Lisa Wang",
                rating: 4,
                comment: "Fantastic experience! Bring a waterproof camera - the photo opportunities are endless.",
                date: "March 2, 2024"
            },
            {
                id: "6",
                author: "James Rodriguez",
                rating: 5,
                comment: "The boat tour through the cave was unforgettable. The lighting and acoustics create an otherworldly atmosphere.",
                date: "February 28, 2024"
            }
        ],
        travelTips: [
            {
                id: "1",
                title: "Best Time to Visit",
                description: "Visit during dry season (February to August) for optimal cave conditions. Avoid heavy rain periods when water levels may be too high for boat tours.",
                icon: Calendar,
                color: "hsl(147 60% 45%)"
            },
            {
                id: "2",
                title: "What to Bring",
                description: "Bring waterproof bags, comfortable walking shoes with good grip, and a light jacket as caves can be cool and humid.",
                icon: Package,
                color: "hsl(173 58% 39%)"
            },
            {
                id: "3",
                title: "Local Food",
                description: "Try local specialties like Quang Binh noodles and grilled fish. Don't miss the fresh spring rolls and local coffee after your cave adventure.",
                icon: Utensils,
                color: "hsl(43 74% 66%)"
            }
        ]
    };

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center">
            <div className="w-full max-w-7xl bg-white shadow-lg">
                <CoverSection
                    title={destinationData.title}
                    tagline={destinationData.tagline}
                    location={destinationData.location}
                    backgroundImage={destinationData.backgroundImage}
                />
                <DetailsSection
                    title={destinationData.detailsTitle}
                    content={destinationData.detailsContent}
                />
                <Gallery images={destinationData.galleryImages} />
                <VideoSection videos={destinationData.videos} />
                <ReviewsSection reviews={destinationData.reviews} />
                <TravelTips tips={destinationData.travelTips} />
            </div>
        </div>
    );
}
