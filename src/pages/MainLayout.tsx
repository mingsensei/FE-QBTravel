import { Outlet } from "react-router-dom";
import TourismHeader from '@/components/TourismHeader';
import TourismFooter from '@/components/TourismFooter';

export default function MainLayout() {
    return (
        <>
            <TourismHeader />
            <main>
                <Outlet />   {/* Render child route tại đây */}
            </main>
            <TourismFooter />
        </>
    );
}

