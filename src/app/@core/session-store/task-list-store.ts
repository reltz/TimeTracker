import { Store, StoreConfig, EntityStore, EntityState } from '@datorama/akita';
import { ITaskList } from './taskListModel';

export interface TaskListState extends EntityState<ITaskList>
{ }

export function createInitialState(): TaskListState
{
	return {};
}

@StoreConfig({ name: 'taskList' })
export class TaskListStore extends EntityStore<TaskListState, ITaskList>{
	constructor()
	{
		super(createInitialState());
	}
}
