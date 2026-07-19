import { Wifi, Waves, ChefHat, Car, Wind, Tv, Dumbbell, WashingMachine, PawPrint, Utensils } from 'lucide-react';

export const AMENITIES = [
  { value: 'wifi', label: 'Fast Wi-Fi', icon: Wifi },
  { value: 'ocean_view', label: 'Ocean / garden view', icon: Waves },
  { value: 'kitchen', label: 'Fully-equipped kitchen', icon: ChefHat },
  { value: 'parking', label: 'Free parking on premises', icon: Car },
  { value: 'ac', label: 'Central air conditioning', icon: Wind },
  { value: 'tv', label: 'TV with streaming', icon: Tv },
  { value: 'gym', label: 'Gym access', icon: Dumbbell },
  { value: 'washer', label: 'Washer & dryer', icon: WashingMachine },
  { value: 'pets', label: 'Pets allowed', icon: PawPrint },
  { value: 'breakfast', label: 'Breakfast included', icon: Utensils },
];
