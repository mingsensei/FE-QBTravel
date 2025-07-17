import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./pages/MainLayout.tsx";
import NotFound from "./pages/NotFound";
import LoginRegister from "./components/LoginRegister";
import UserProfile  from "./components/user/UserProfile.tsx";
import {DestinationBlog} from "@/components/DestinationBlog.tsx";
import {QuangBinhProducts} from "@/components/QuangBinhProducts.tsx";
import Homepage from "@/components/Homepage.tsx";
import {ThreeDMap} from "@/components/ThreeMap.tsx";

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
              <Route path="/user" element={<UserProfile />} />
              <Route path="/destination-blog" element={<DestinationBlog />} />
              <Route path="/products" element={<QuangBinhProducts/>}/>
              <Route path="/map" element={<ThreeDMap/>}/>

            </Route>
            <Route path="/login" element={<LoginRegister />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
);

export default App;
