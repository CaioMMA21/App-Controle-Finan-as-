import React from 'react';
import { Provider as PaperProvider, MD3DarkTheme } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <PaperProvider theme={MD3DarkTheme}>
      <AppNavigator />
    </PaperProvider>
  );
}
