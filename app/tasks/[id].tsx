import type { Task } from '@/lib/types';
import { useTasksStore } from '@/store/useTaskStore';
import DateTimePicker, {
    type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    useWindowDimensions,
} from 'react-native';
import uuid from 'react-native-uuid';
import styled from 'styled-components/native';

const Container = styled(KeyboardAvoidingView)`
    flex: 1;
    background-color: ${(props) => props.theme.colors.background};
`;

const ContentContainer = styled(ScrollView)`
    flex: 1;
    padding: 20px;
`;

const FormGroup = styled.View`
    margin-bottom: 20px;
`;

const Input = styled.TextInput`
    border-width: 1px;
    border-color: ${(props) => props.theme.colors.border};
    padding: 16px;
    border-radius: 8px;
    background-color: #fff;
    font-size: 16px;
`;

const TextArea = styled(Input).attrs({
    multiline: true,
    numberOfLines: 5,
})`
    min-height: 120px;
`;

const Label = styled.Text`
    margin-bottom: 8px;
    color: ${(props) => props.theme.colors.text};
    font-size: 16px;
    font-weight: 600;
`;

const DateButton = styled.TouchableOpacity`
    padding: 16px;
    background-color: ${(props) => props.theme.colors.card};
    border-width: 1px;
    border-color: ${(props) => props.theme.colors.border};
    border-radius: 8px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

const DateButtonText = styled.Text`
    color: ${(props) => props.theme.colors.text};
    font-size: 16px;
`;

const SaveButton = styled.TouchableOpacity`
    background-color: ${(props) => props.theme.colors.primary || '#007AFF'};
    padding: 16px;
    border-radius: 8px;
    align-items: center;
    margin-top: 10px;
`;

const SaveButtonText = styled.Text`
    color: #fff;
    font-size: 18px;
    font-weight: 600;
`;

const StatusButton = styled.TouchableOpacity<{ completed: boolean }>`
    background-color: ${(props) => (props.completed ? '#10B981' : '#F59E0B')};
    padding: 12px 16px;
    border-radius: 8px;
    align-items: center;
`;

const StatusButtonText = styled.Text`
    color: #fff;
    font-size: 16px;
    font-weight: 600;
`;

const HeaderText = styled.Text`
    font-size: 24px;
    font-weight: 700;
    color: ${(props) => props.theme.colors.text};
    margin-bottom: 20px;
`;

const CalendarIcon = styled.Text`
    font-size: 20px;
`;

export default function TaskScreen(): JSX.Element {
    const { id } = useLocalSearchParams<{ id: string }>();
    const isNew = useMemo(() => id === 'new', [id]);
    const router = useRouter();
    const { tasks, addTask, updateTask } = useTasksStore();
    const { height } = useWindowDimensions();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [completed, setCompleted] = useState(false);
    const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
    const [showPicker, setShowPicker] = useState(false);

    useEffect(() => {
        if (!isNew) {
            const task = tasks.find((t) => t.id === id);
            if (task) {
                setTitle(task.title);
                setDescription(task.description || '');
                setCompleted(task.completed);
                setDueDate(task.dueDate ? new Date(task.dueDate) : undefined);
            }
        }
    }, [id, tasks, isNew]);

    const handleSave = () => {
        if (!title.trim()) {
            Alert.alert('Required Field', 'Please enter a task title');
            return;
        }

        const task: Task = {
            id: isNew ? uuid.v4().toString() : (id as string),
            title,
            description,
            completed,
            dueDate: dueDate?.toISOString(),
        };

        if (isNew) addTask(task);
        else updateTask(task);

        router.back();
    };

    const onChangeDate = (_: DateTimePickerEvent, selected?: Date) => {
        setShowPicker(Platform.OS === 'ios');
        if (selected) {
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            if (selected < now) {
                Alert.alert('Invalid Date', 'Please choose a future date.');
                return;
            }
            setDueDate(selected);
        }
    };

    const toggleDatePicker = () => {
        setShowPicker(true);
    };

    const formatDate = (date?: Date) => {
        if (!date) return 'Select due date';
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <Container behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ContentContainer
                showsVerticalScrollIndicator={false}
                contentContainerStyle={
                    height < 500 ? { paddingBottom: 40 } : {}
                }
            >
                <HeaderText>
                    {isNew ? 'Create New Task' : 'Edit Task'}
                </HeaderText>

                <FormGroup>
                    <Label>Title</Label>
                    <Input
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Enter task title"
                        returnKeyType="next"
                    />
                </FormGroup>

                <FormGroup>
                    <Label>Description</Label>
                    <TextArea
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Enter task details"
                        style={{ textAlignVertical: 'top' }}
                    />
                </FormGroup>

                {!isNew && (
                    <FormGroup>
                        <Label>Status</Label>
                        <StatusButton
                            completed={completed}
                            onPress={() => setCompleted((c) => !c)}
                            style={styles.shadow}
                        >
                            <StatusButtonText>
                                {completed ? 'Completed' : 'Pending'}
                            </StatusButtonText>
                        </StatusButton>
                    </FormGroup>
                )}

                <FormGroup>
                    <Label>Due Date</Label>
                    <DateButton
                        onPress={toggleDatePicker}
                        style={styles.shadow}
                    >
                        <DateButtonText>{formatDate(dueDate)}</DateButtonText>
                        <CalendarIcon>📅</CalendarIcon>
                    </DateButton>
                </FormGroup>

                {showPicker && (
                    <DateTimePicker
                        value={dueDate || new Date()}
                        mode="date"
                        display="default"
                        minimumDate={new Date()}
                        onChange={onChangeDate}
                    />
                )}

                <SaveButton onPress={handleSave} style={styles.shadow}>
                    <SaveButtonText>Save Task</SaveButtonText>
                </SaveButton>
            </ContentContainer>
        </Container>
    );
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
});
