import EmptyState from '@/components/EmptyState';
import TaskItem from '@/components/TaskItem';
import type { Task, TaskFilter } from '@/lib/types';
import { useTasksStore } from '@/store/useTaskStore';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
    flex: 1;
    background-color: ${(props) => props.theme.colors.background};
`;

const FilterContainer = styled.View`
    flex-direction: row;
    justify-content: space-around;
    padding: 16px 0;
`;

const FilterButton = styled.TouchableOpacity<{ active: boolean }>`
    padding: 8px 16px;
    border-radius: 20px;
    background-color: ${(props) =>
        props.active ? props.theme.colors.primary : 'transparent'};
`;

const FilterText = styled.Text<{ active: boolean }>`
    color: ${(props) => (props.active ? '#fff' : props.theme.colors.text)};
`;

const Fab = styled.TouchableOpacity`
    position: absolute;
    right: 24px;
    bottom: 24px;
    width: 56px;
    height: 56px;
    border-radius: 28px;
    justify-content: center;
    align-items: center;
    background-color: ${(props) => props.theme.colors.primary};
`;

const FabText = styled.Text`
    font-size: 24px;
    color: #fff;
`;

const ITEM_HEIGHT = 72;

export default function Home(): JSX.Element {
    const router = useRouter();
    const { tasks, loadTasks } = useTasksStore();
    const [filter, setFilter] = useState<TaskFilter>('All');

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    const onPressTask = useCallback(
        (id: string) => {
            router.push({ pathname: '/tasks/[id]', params: { id } });
        },
        [router],
    );

    const renderItem = useCallback(
        ({ item }: { item: Task }) => (
            <TaskItem task={item} onPress={() => onPressTask(item.id)} />
        ),
        [onPressTask],
    );

    const keyExtractor = useCallback((item: Task) => item.id, []);

    const getItemLayout = useCallback(
        (_data: ArrayLike<Task> | null | undefined, index: number) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
        }),
        [],
    );

    const filtered = tasks.filter((t) =>
        filter === 'All'
            ? true
            : filter === 'Completed'
              ? t.completed
              : !t.completed,
    );

    return (
        <Container>
            <FilterContainer>
                {(['All', 'Completed', 'Pending'] as const).map((f) => (
                    <FilterButton
                        key={f}
                        active={filter === f}
                        onPress={() => setFilter(f)}
                    >
                        <FilterText active={filter === f}>{f}</FilterText>
                    </FilterButton>
                ))}
            </FilterContainer>

            {filtered.length ? (
                <FlatList
                    data={filtered}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    getItemLayout={getItemLayout}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={5}
                    removeClippedSubviews
                    onEndReachedThreshold={0.5}
                />
            ) : (
                <EmptyState />
            )}

            <Fab onPress={() => router.push('/tasks/new')}>
                <FabText>+</FabText>
            </Fab>
        </Container>
    );
}
