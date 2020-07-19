import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';
import { TaskListState, TaskListStore } from './task-list-store';
import { ITaskList } from './taskListModel';

@Injectable()
export class TaskListQuery extends QueryEntity<TaskListState> {

	constructor(protected store: TaskListStore)
	{
		super(store);
	}

	public activeList$: Observable<ITaskList> = this.select()
		.pipe(
			map(state => state.active),
			tap(active => console.info('active is ', active)),
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
