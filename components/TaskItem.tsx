import type { Task } from '@/lib/types';
import { useTasksStore } from '@/store/useTaskStore';
import { Alert, Text, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import styled from 'styled-components/native';

const ItemContainer = styled.View`
    background-color: ${(props) => props.theme.colors.card};
    padding: 16px;
    border-bottom-width: 1px;
    border-bottom-color: ${(props) => props.theme.colors.border};
`;

const Title = styled.Text<{ completed: boolean }>`
    font-size: 16px;
    text-decoration: ${(props) => (props.completed ? 'line-through' : 'none')};
    color: ${(props) => props.theme.colors.text};
`;

const RightAction = styled.TouchableOpacity`
    background-color: red;
    justify-content: center;
    align-items: center;
    width: 80px;
`;

const ActionText = styled.Text`
    color: #fff;
    font-weight: bold;
`;

type Props = {
    task: Task;
    onPress: () => void;
};

export default function TaskItem({ task, onPress }: Props): JSX.Element {
    const deleteTask = useTasksStore((state) => state.deleteTask);

    const renderRightActions = () => (
        <RightAction
            onPress={() =>
                Alert.alert(
                    'Delete Task',
                    'Are you sure you want to delete this task?',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        {
                            text: 'Delete',
                            style: 'destructive',
                            onPress: () => deleteTask(task.id),
                        },
                    ],
                )
            }
        >
            <ActionText>Delete</ActionText>
        </RightAction>
    );

    return (
        <Swipeable renderRightActions={renderRightActions}>
            <TouchableOpacity onPress={onPress}>
                <ItemContainer>
                    <Title completed={task.completed}>{task.title}</Title>
                    {task.dueDate && (
                        <Text>
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                        </Text>
                    )}
                </ItemContainer>
            </TouchableOpacity>
        </Swipeable>
    );
}
