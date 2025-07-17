import Homepage from '../components/Homepage';
import TourismHeader from '../components/TourismHeader';
import TourismFooter from '../components/TourismFooter';

const Index = () => {
  return (
    <div className="min-h-screen">
      <TourismHeader />
      <Homepage />
      <TourismFooter />
    </div>
  );
};

export default Index;
