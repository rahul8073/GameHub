import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

 

  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{headerShown:false,}} />
        <Stack.Screen name="flopybird" options={{title:"Flopy Bird"}} />
        <Stack.Screen name="Snake" options={{title:"Snake"}}/>
        <Stack.Screen name="sudoku" options={{title:"Sudoku"}} />
        <Stack.Screen name="TicTacToe" options={{title:"TicTacToe"}} />
      </Stack>
      <StatusBar style="auto" />
    </>

  );
}
