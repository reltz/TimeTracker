import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { IList } from './taskListModel';

export interface TaskListState extends EntityState<IList> {
	active: string;
}

export function createInitialState(): TaskListState {
	return {
		active: '',
	};
}

/**
 * Store - part of the @datorama/akita library architecture for state management
 */
@StoreConfig({ name: 'taskList' })
export class TaskListStore extends EntityStore<TaskListState, IList>{
	constructor() {
		super(createInitialState());
	}
}
