import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { ITaskList } from './taskListModel';

export interface TaskListState extends EntityState<ITaskList>
{
	active: string;
}

export function createInitialState(): TaskListState
{
	return {
		active: '',
	};
}

/**
 * Store - part of the @datorama/akita library architecture for state management
 */
@StoreConfig({ name: 'taskList' })
export class TaskListStore extends EntityStore<TaskListState, ITaskList>{
	constructor()
	{
		super(createInitialState());
	}
}
