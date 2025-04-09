import theme from '@/styles/theme';
import { Stack } from 'expo-router';
import { ThemeProvider } from 'styled-components/native';

export default function RootLayout(): JSX.Element {
    return (
        <ThemeProvider theme={theme}>
            <Stack screenOptions={{ headerShown: false }} />
        </ThemeProvider>
    );
}
