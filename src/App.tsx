import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./pages/MainLayout.tsx";
import NotFound from "./pages/NotFound";
import LoginRegister from "./components/LoginRegister";
import MapPage from "./pages/MapPage";
import UserProfile  from "./components/user/UserProfile.tsx";
import {DestinationBlog} from "@/components/DestinationBlog.tsx";
import {QuangBinhProducts} from "@/components/QuangBinhProducts.tsx";
import Homepage from "@/components/Homepage.tsx";
import {ThreeDMap} from "@/components/ThreeMap.tsx";
import {UploadForm} from "@/components/UploadForm.tsx";

import Itinerary from "@/components/Itinerary.tsx";
import SearchPage from "@/components/SearchPage.tsx";
import DestinationDetails from "@/components/DestinationDetails.tsx";
import {DestinationsPage} from "@/components/destinations/DestinationsPage.tsx";
const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Homepage />} />
              <Route path="/user" element={<UserProfile />} />g
              <Route path="/destination-blog" element={<DestinationBlog />} />
              <Route path="/destinations" element={<DestinationsPage />} />
              <Route path="/products" element={<QuangBinhProducts/>}/>
              <Route path="/upload" element={<UploadForm/>}/>
              {/* --- Thêm các route mới cho luồng kế hoạch chuyến đi --- */}
              <Route path="/itinerary" element={<Itinerary />} />
              <Route path="/search" element={<SearchPage />} />
              {/* Route động cho trang chi tiết, :id là một parameter */}
              <Route path="/destination/:id" element={<DestinationDetails />} />

            </Route>
            <Route path="/map" element={<ThreeDMap/>}/>
            <Route path="/login" element={<LoginRegister />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
);

export default App;