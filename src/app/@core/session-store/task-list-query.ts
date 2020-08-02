import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { TaskListState, TaskListStore } from './task-list-store';
import { IList } from './taskListModel';

/**
 * Query - part of the @datorama/akita library for state management. this should be used to retrieve information from the store.
 */
@Injectable()
export class TaskListQuery extends QueryEntity<TaskListState> {

	constructor(protected store: TaskListStore) {
		super(store);
	}

	public activeList$: Observable<IList> = this.select()
		.pipe(
			map(state => state.active),
			filter(active => active !== ''),
			switchMap(id => this.selectEntity(id)),
		);

	public isThereActive$ = this.select()
		.pipe(
			map(state => state.active),
			map(active => {
				return active === '' || active === null
					? false : true;
			}),
		);
}
