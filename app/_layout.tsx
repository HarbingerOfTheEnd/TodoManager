import theme from '@/styles/theme';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from 'styled-components/native';

export default function RootLayout(): JSX.Element {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider theme={theme}>
                <Stack screenOptions={{ headerShown: false }} />
            </ThemeProvider>
        </GestureHandlerRootView>
    );
}
