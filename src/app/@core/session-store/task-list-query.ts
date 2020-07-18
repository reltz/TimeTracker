import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
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
			// tap(state => console.warn('state is ', state)),
			map(state => state.active),
			tap(active => console.info('active is ', active)),
			switchMap(id => this.selectEntity(id)),
		);
}
