export type Task = {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    dueDate?: string;
};

export type TaskFilter = 'All' | 'Completed' | 'Pending';
