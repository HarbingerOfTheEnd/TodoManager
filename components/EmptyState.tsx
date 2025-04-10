import styled from 'styled-components/native';

const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

const Message = styled.Text`
    font-size: 18px;
    color: ${(props) => props.theme.colors.text};
`;

export default function EmptyState(): JSX.Element {
    return (
        <Container>
            <Message>No tasks yet! Add one to get started.</Message>
        </Container>
    );
}
