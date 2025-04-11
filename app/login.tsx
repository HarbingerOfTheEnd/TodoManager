import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    StatusBar,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import styled from 'styled-components/native';

const screenWidth = Dimensions.get('window').width;

const Container = styled(KeyboardAvoidingView)`
    flex: 1;
    justify-content: center;
    padding: ${screenWidth * 0.05}px;
    background-color: ${(props) => props.theme.colors.background};
`;

const Logo = styled.Image`
    height: 80px;
    width: 80px;
    align-self: center;
    margin-bottom: 40px;
`;

const Title = styled.Text`
    font-size: 28px;
    font-weight: bold;
    color: ${(props) => props.theme.colors.text};
    text-align: center;
    margin-bottom: 30px;
`;

const FormContainer = styled.View`
    width: 100%;
    max-width: 500px;
    align-self: center;
`;

const InputContainer = styled.View`
    margin-bottom: 20px;
`;

const InputLabel = styled.Text`
    font-size: 16px;
    margin-bottom: 8px;
    color: ${(props) => props.theme.colors.text};
    font-weight: 500;
`;

const Input = styled.TextInput`
    border-width: 1px;
    border-color: ${(props) => props.theme.colors.border};
    background-color: ${(props) => props.theme.colors.card};
    padding: 16px;
    border-radius: 8px;
    font-size: 16px;
`;

const LoginButton = styled(TouchableOpacity)`
    background-color: ${(props) => (props.disabled ? '#a0a0a0' : props.theme.colors.primary)};
    padding: 16px;
    border-radius: 8px;
    align-items: center;
    margin-top: 10px;
`;

const ButtonText = styled.Text`
    color: white;
    font-size: 18px;
    font-weight: bold;
`;

const ForgotPasswordText = styled.Text`
    color: ${(props) => props.theme.colors.primary};
    font-size: 16px;
    text-align: center;
    margin-top: 20px;
`;

export default function Login(): JSX.Element {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (): Promise<void> => {
        Keyboard.dismiss();

        if (username.trim() && password.trim()) {
            setIsLoading(true);

            setTimeout(() => {
                setIsLoading(false);
                router.replace('/home');
            }, 1500);
        } else {
            Alert.alert('Error', 'Please enter both username and password');
        }
    };

    const handleForgotPassword = (): void => {
        Alert.alert(
            'Reset Password',
            'Password reset functionality will be implemented here',
        );
    };

    const dismissKeyboard = (): void => {
        Keyboard.dismiss();
    };

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <Container>
                <StatusBar barStyle="dark-content" />

                <FormContainer>
                    <Logo source={{ uri: '/api/placeholder/80/80' }} />
                    <Title>Welcome Back</Title>

                    <InputContainer>
                        <InputLabel>Username</InputLabel>
                        <Input
                            placeholder="Enter your username"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                            returnKeyType="next"
                            placeholderTextColor="#888888"
                        />
                    </InputContainer>

                    <InputContainer>
                        <InputLabel>Password</InputLabel>
                        <Input
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            returnKeyType="done"
                            onSubmitEditing={handleLogin}
                            placeholderTextColor="#888888"
                        />
                    </InputContainer>

                    <LoginButton
                        onPress={handleLogin}
                        disabled={
                            isLoading || !username.trim() || !password.trim()
                        }
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" size="small" />
                        ) : (
                            <ButtonText>Log In</ButtonText>
                        )}
                    </LoginButton>

                    <TouchableOpacity onPress={handleForgotPassword}>
                        <ForgotPasswordText>
                            Forgot Password?
                        </ForgotPasswordText>
                    </TouchableOpacity>
                </FormContainer>
            </Container>
        </TouchableWithoutFeedback>
    );
}
