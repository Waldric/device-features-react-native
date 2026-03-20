export interface TravelEntry {
  id: string;       
  imageUri: string;
  address: string;   
  createdAt: string; 
}

// Strict navigation param list for type-safe routing
export type RootStackParamList = {
  Home: undefined;
  AddEntry: undefined;
};

// Theme shape consumed by ThemeContext and all themed components
export interface AppTheme {
  dark: boolean;
  colors: {
    background: string;
    card: string;
    text: string;
    subText: string;
    border: string;
    primary: string;
    danger: string;
    buttonText: string;
  };
}
