import TourismHeader from '../components/TourismHeader';
import TourismFooter from '../components/TourismFooter';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <TourismHeader />
      
      {/* Main content area - add your tourism content here */}
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Discover <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">Quang Binh</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Explore the breathtaking landscapes, UNESCO World Heritage sites, and hidden gems of Vietnam's adventure capital.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-primary to-primary-glow text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Start Exploring
              </button>
              <button className="border-2 border-primary text-primary font-semibold px-8 py-4 rounded-full hover:bg-primary hover:text-white transition-all duration-300">
                View Interactive Map
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <TourismFooter />
    </div>
  );
};

export default Index;
