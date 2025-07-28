// src/types/global.d.ts
declare module 'navigation/AppNavigator' {
  import { FC } from 'react';
  const AppNavigator: FC;
  export default AppNavigator;
}

declare module 'styles/colors' {
  export const colors: {
    background: string;
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    textSecondary: string;
    glass: string;
    glassBorder: string;
  };
}