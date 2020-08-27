import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { ILog } from './timeTrackerModel';

export interface TimeTrackerState extends EntityState<ILog>
{
	active: string;
}

export function createInitialState(): TimeTrackerState
{
	return {
		active: '',
	};
}

/**
 * Store - part of the @datorama/akita library architecture for state management
 */
@StoreConfig({ name: 'timeTracker' })
export class TimeTrackerStore extends EntityStore<TimeTrackerState, ILog>{
	constructor()
	{
		super(createInitialState());
	}
}
