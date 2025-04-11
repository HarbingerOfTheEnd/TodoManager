import EmptyState from '@/components/EmptyState';
import TaskItem from '@/components/TaskItem';
import type { Task, TaskFilter } from '@/lib/types';
import { useTasksStore } from '@/store/useTaskStore';
import theme from '@/styles/theme';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Platform,
    RefreshControl,
    StatusBar,
    StyleSheet,
} from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
    flex: 1;
    background-color: ${(props) => props.theme.colors.background};
    padding-top: ${Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0}px;
`;

const Header = styled.View`
    padding: 16px;
    border-bottom-width: 1px;
    border-bottom-color: ${(props) => props.theme.colors.border};
`;

const Title = styled.Text`
    font-size: 24px;
    font-weight: bold;
    color: ${(props) => props.theme.colors.text};
    margin-bottom: 8px;
`;

const SubTitle = styled.Text`
    font-size: 14px;
    color: ${(props) => props.theme.colors.text}99;
`;

const FilterContainer = styled.View`
    flex-direction: row;
    justify-content: space-between;
    padding: 12px 16px;
    background-color: ${(props) => props.theme.colors.card};
    border-radius: 8px;
    margin: 0 16px 16px;
`;

const FilterButton = styled.TouchableOpacity<{ active: boolean }>`
    padding: 8px 16px;
    border-radius: 20px;
    background-color: ${(props) =>
        props.active
            ? props.theme.colors.primary
            : props.theme.colors.background};
`;

const FilterText = styled.Text<{ active: boolean }>`
    color: ${(props) => (props.active ? '#fff' : props.theme.colors.text)};
    font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
`;

const ListContainer = styled.View`
    flex: 1;
    padding: 0 16px;
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

const LoadingContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;

const CountBadge = styled.View`
    background-color: ${(props) => props.theme.colors.notification};
    border-radius: 12px;
    padding: 2px 8px;
    margin-left: 8px;
`;

const CountText = styled.Text`
    color: #fff;
    font-size: 12px;
    font-weight: bold;
`;

const FilterBadge = styled.View`
    flex-direction: row;
    align-items: center;
`;

const ITEM_HEIGHT = 72;

const styles = StyleSheet.create({
    filterContainer: {
        ...Platform.select({
            ios: {
                shadowOpacity: 0.1,
                shadowRadius: 4,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
            },
            android: {
                elevation: 2,
            },
        }),
    },
    fab: {
        ...Platform.select({
            ios: {
                shadowOpacity: 0.3,
                shadowRadius: 4,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
            },
            android: {
                elevation: 5,
            },
        }),
    },
});

export default function Home(): JSX.Element {
    const router = useRouter();
    const { tasks, loadTasks } = useTasksStore();
    const [filter, setFilter] = useState<TaskFilter>('All');
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await loadTasks();
            setIsLoading(false);
        };

        loadData();
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

    const completedCount = tasks.filter((t) => t.completed).length;
    const pendingCount = tasks.filter((t) => !t.completed).length;

    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        await loadTasks();
        setIsRefreshing(false);
    }, [loadTasks]);

    if (isLoading) {
        return (
            <Container>
                <StatusBar barStyle="dark-content" />
                <Header>
                    <Title>My Tasks</Title>
                    <SubTitle>Loading your tasks...</SubTitle>
                </Header>
                <LoadingContainer>
                    <ActivityIndicator
                        size="large"
                        color={theme.colors.primary}
                    />
                </LoadingContainer>
            </Container>
        );
    }

    return (
        <Container>
            <StatusBar barStyle="dark-content" />

            <Header>
                <Title>My Tasks</Title>
                <SubTitle>
                    {tasks.length
                        ? `You have ${pendingCount} pending and ${completedCount} completed tasks`
                        : 'Create your first task to get started'}
                </SubTitle>
            </Header>

            <FilterContainer style={styles.filterContainer}>
                {(['All', 'Completed', 'Pending'] as const).map((f) => (
                    <FilterButton
                        key={f}
                        active={filter === f}
                        onPress={() => setFilter(f)}
                    >
                        <FilterBadge>
                            <FilterText active={filter === f}>{f}</FilterText>
                            {f === 'All' && tasks.length > 0 && (
                                <CountBadge>
                                    <CountText>{tasks.length}</CountText>
                                </CountBadge>
                            )}
                            {f === 'Completed' && completedCount > 0 && (
                                <CountBadge>
                                    <CountText>{completedCount}</CountText>
                                </CountBadge>
                            )}
                            {f === 'Pending' && pendingCount > 0 && (
                                <CountBadge>
                                    <CountText>{pendingCount}</CountText>
                                </CountBadge>
                            )}
                        </FilterBadge>
                    </FilterButton>
                ))}
            </FilterContainer>

            <ListContainer>
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
                        contentContainerStyle={{ paddingBottom: 88 }}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={onRefresh}
                                colors={[theme.colors.primary]}
                                tintColor={theme.colors.primary}
                            />
                        }
                    />
                ) : (
                    <EmptyState />
                )}
            </ListContainer>

            <Fab style={styles.fab} onPress={() => router.push('/tasks/new')}>
                <Feather name="plus" size={24} color="#fff" />
            </Fab>
        </Container>
    );
}
