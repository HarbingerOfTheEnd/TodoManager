import type { Task } from '@/lib/types';
import { useTasksStore } from '@/store/useTaskStore';
import DateTimePicker, {
    type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Platform, View } from 'react-native';
import uuid from 'react-native-uuid';
import styled from 'styled-components/native';

const Container = styled.View`
    flex: 1;
    padding: 16px;
    background-color: ${(props) => props.theme.colors.background};
`;

const Input = styled.TextInput`
    border-width: 1px;
    border-color: ${(props) => props.theme.colors.border};
    padding: 12px;
    margin-bottom: 12px;
    border-radius: 4px;
    background-color: #fff;
`;

const Label = styled.Text`
    margin-bottom: 4px;
    color: ${(props) => props.theme.colors.text};
`;

const DateButton = styled.TouchableOpacity`
    padding: 12px;
    background-color: ${(props) => props.theme.colors.card};
    border-width: 1px;
    border-color: ${(props) => props.theme.colors.border};
    border-radius: 4px;
    margin-bottom: 12px;
`;

const DateButtonText = styled.Text`
    color: ${(props) => props.theme.colors.text};
`;

export default function TaskScreen(): JSX.Element {
    const { id } = useLocalSearchParams<{ id: string }>();
    const isNew = useMemo(() => id === 'new', [id]);
    const router = useRouter();
    const { tasks, addTask, updateTask } = useTasksStore();

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
            alert('Title is required');
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
                Alert.alert('Invalid date', 'Please choose a future date.');
                return;
            }
            setDueDate(selected);
        }
    };

    return (
        <Container>
            <Label>Title</Label>
            <Input value={title} onChangeText={setTitle} />

            <Label>Description</Label>
            <Input value={description} onChangeText={setDescription} />

            {!isNew && (
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 12,
                    }}
                >
                    <Button
                        title={
                            completed ? 'Mark as Pending' : 'Mark as Completed'
                        }
                        onPress={() => setCompleted((c) => !c)}
                    />
                </View>
            )}

            <Label>Due Date</Label>
            <DateButton onPress={() => setShowPicker(true)}>
                <DateButtonText>
                    {dueDate
                        ? dueDate.toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                          })
                        : 'Select due date'}
                </DateButtonText>
            </DateButton>

            {showPicker && (
                <DateTimePicker
                    value={dueDate || new Date()}
                    mode="date"
                    display="default"
                    minimumDate={new Date()}
                    onChange={onChangeDate}
                />
            )}

            <Button title="Save" onPress={handleSave} />
        </Container>
    );
}
