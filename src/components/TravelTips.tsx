import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Package, Utensils } from 'lucide-react';
import { type LucideIcon } from 'lucide-react';

interface TipCard {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

interface TravelTipsProps {
  tips: TipCard[];
}

export function TravelTips({ tips }: TravelTipsProps) {
  return (
    <section className="py-12 lg:py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-12 text-center">
          Travel Tips
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip) => {
            const Icon = tip.icon;
            return (
              <Card key={tip.id} className="hover:shadow-lg transition-shadow duration-300 border-l-4" style={{ borderLeftColor: tip.color }}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${tip.color}20` }}
                    >
                      <Icon className="h-6 w-6" style={{ color: tip.color }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-3">{tip.title}</h3>
                      <p className="text-gray-700 leading-relaxed">{tip.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}