import { Button } from 'react-native';
import { useRouter } from 'expo-router';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.colors.background};
`;

const Title = styled.Text`
  font-size: 48px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 16px;
`;

const Description = styled.Text`
  font-size: 18px;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 32px;
  text-align: center;
  padding: 0 20px;
`;

export default function NotFound(): JSX.Element {
    const router = useRouter();

    return (
        <Container>
            <Title>404</Title>
            <Description>
                Oops! The page you're looking for doesn't exist.
            </Description>
            <Button title="Go Home" onPress={() => router.replace('/home')} />
        </Container>
    );
}
