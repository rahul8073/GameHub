import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

export default function RootLayout() {

  useEffect(() => {
     async function prepare() {
       try {
         // Prevent the splash screen from auto-hiding
         await SplashScreen.preventAutoHideAsync();
         // Simulate a delay (for demonstration)
         await new Promise(resolve => setTimeout(resolve, 2000));
       } catch (e) {
         console.warn(e);
       } finally {
         // Hide the splash screen after initialization
         await SplashScreen.hideAsync();
       }
     }
 
     prepare();
   }, []);

  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{headerShown:false,}} />
        <Stack.Screen name="flopybird" options={{title:"Flopy Bird"}} />
        <Stack.Screen name="Snake" options={{title:"Snake"}}/>
        <Stack.Screen name="sudoku" options={{title:"Sudoku"}} />
        <Stack.Screen name="TicTacToe" options={{title:"TicTacToe"}} />
      </Stack>
      <StatusBar backgroundColor='#fff' />
    </>

  );
}
