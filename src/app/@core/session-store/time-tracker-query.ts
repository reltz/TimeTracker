import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { TimeTrackerState, TimeTrackerStore } from './time-tracker-store';
import { ILog } from './timeTrackerModel';

/**
 * Query - part of the @datorama/akita library for state management. this should be used to retrieve information from the store.
 */
@Injectable()
export class TimeTrackerQuery extends QueryEntity<TimeTrackerState> {

	constructor(protected store: TimeTrackerStore)
	{
		super(store);
	}

	public activeLog$: Observable<ILog> = this.select()
		.pipe(
			map(state => state.active),
			filter(active => active !== ''),
			switchMap(id => this.selectEntity(id)),
		);

	public isThereActive$ = this.select()
		.pipe(
			map(state => state.active),
			map(active =>
			{
				return active === '' || active === null
					? false : true;
			}),
		);
}
