import { Outlet } from "react-router-dom";
import TourismHeader from '@/components/TourismHeader';
import TourismFooter from '@/components/TourismFooter';
import {ChatBot} from "@/components/chatbot";

export default function MainLayout() {
    return (
        <>
            <TourismHeader />
            <main>
                <Outlet />
            </main>
            <TourismFooter />
        </>
    );
}

