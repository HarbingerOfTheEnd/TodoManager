import type { Task } from '@/lib/types';
import { useTasksStore } from '@/store/useTaskStore';
import { format } from 'date-fns';
import { Alert, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import styled from 'styled-components/native';

const ItemContainer = styled(Animated.View)`
    background-color: ${(props) => props.theme.colors.card};
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 8px;
`;

const ContentContainer = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const TextContainer = styled.View`
    flex: 1;
`;

const Title = styled.Text<{ completed: boolean }>`
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 4px;
    text-decoration: ${(props) => (props.completed ? 'line-through' : 'none')};
    color: ${(props) => props.theme.colors.text};
    opacity: ${(props) => (props.completed ? 0.7 : 1)};
`;

const DueDate = styled.Text<{ isOverdue: boolean }>`
    font-size: 14px;
    color: ${(props) => (props.isOverdue ? '#EF4444' : props.theme.colors.text)};
    opacity: 0.8;
`;

const StatusIndicator = styled.View<{ completed: boolean }>`
    width: 12px;
    height: 12px;
    border-radius: 6px;
    background-color: ${(props) => (props.completed ? '#10B981' : '#F59E0B')};
    margin-right: 12px;
`;

const RowContainer = styled.View`
    flex-direction: row;
    align-items: center;
`;

const DeleteContainer = styled(Animated.View)`
    position: absolute;
    right: 0;
    height: 100%;
    justify-content: center;
    align-items: center;
    background-color: #EF4444;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
`;

const DeleteText = styled.Text`
    color: white;
    font-weight: bold;
    padding: 0 16px;
`;

type Props = {
    task: Task;
    onPress: () => void;
};

export default function TaskItem({ task, onPress }: Props): JSX.Element {
    const deleteTask = useTasksStore((state) => state.deleteTask);

    const translateX = useSharedValue(0);

    const confirmDelete = () => {
        Alert.alert(
            'Delete Task',
            'Are you sure you want to delete this task?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                    onPress: () => {
                        translateX.value = withSpring(0);
                    },
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => deleteTask(task.id),
                },
            ],
        );
    };

    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            translateX.value = Math.min(0, Math.max(-100, event.translationX));
        })
        .onEnd((event) => {
            if (event.translationX < -50) {
                translateX.value = withSpring(-80);
            } else {
                translateX.value = withSpring(0);
            }
        });

    const tapGesture = Gesture.Tap().onEnd(() => {
        if (translateX.value < -40) {
            runOnJS(confirmDelete)();
        } else {
            runOnJS(onPress)();
        }
    });

    const composed = Gesture.Simultaneous(panGesture, tapGesture);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    const deleteAnimatedStyle = useAnimatedStyle(() => {
        return {
            width: withTiming(Math.abs(translateX.value)),
        };
    });

    const isOverdue = () => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        return dueDate < today && !task.completed;
    };

    const formatDueDate = () => {
        if (!task.dueDate) return null;
        const dueDate = new Date(task.dueDate);
        return format(dueDate, 'MMM d, yyyy');
    };

    return (
        <GestureDetector gesture={composed}>
            <Animated.View>
                <DeleteContainer style={deleteAnimatedStyle}>
                    <DeleteText>Delete</DeleteText>
                </DeleteContainer>

                <ItemContainer style={[styles.shadow, animatedStyle]}>
                    <ContentContainer>
                        <RowContainer>
                            <StatusIndicator completed={task.completed} />

                            <TextContainer>
                                <Title completed={task.completed}>
                                    {task.title}
                                </Title>

                                {task.dueDate && (
                                    <DueDate isOverdue={isOverdue()}>
                                        {isOverdue() ? 'Overdue: ' : 'Due: '}
                                        {formatDueDate()}
                                    </DueDate>
                                )}
                            </TextContainer>
                        </RowContainer>
                    </ContentContainer>
                </ItemContainer>
            </Animated.View>
        </GestureDetector>
    );
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
});
