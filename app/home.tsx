import EmptyState from '@/components/EmptyState';
import TaskItem from '@/components/TaskItem';
import { useTasksStore } from '@/store/useTaskStore';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import type { TaskFilter } from '@/lib/types';

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

export default function Home(): JSX.Element {
    const router = useRouter();
    const { tasks, loadTasks } = useTasksStore();
    const [filter, setFilter] = useState<TaskFilter>('All');

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

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
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TaskItem
                            task={item}
                            onPress={() => router.push(`/task/${item.id}`)}
                        />
                    )}
                />
            ) : (
                <EmptyState />
            )}

            <Fab onPress={() => router.push('/task/new')}>
                <FabText>+</FabText>
            </Fab>
        </Container>
    );
}
