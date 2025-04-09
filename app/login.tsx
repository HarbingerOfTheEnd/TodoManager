import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import styled from 'styled-components/native';

const Container = styled(KeyboardAvoidingView)`
    flex: 1;
    justify-content: center;
    padding: 16px;
    background-color: ${(props) => props.theme.colors.background};
`;

const Input = styled.TextInput`
    border-width: 1px;
    border-color: ${(props) => props.theme.colors.border};
    padding: 12px;
    margin-bottom: 12px;
    border-radius: 4px;
`;

export default function Login(): JSX.Element {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = (): void => {
        if (username.trim() && password.trim()) {
            router.replace('/home');
        } else {
            Alert.alert('Error', 'Please enter both username and password');
        }
    };

    return (
        <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <Input
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <Input
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Login" onPress={handleLogin} />
        </Container>
    );
}
