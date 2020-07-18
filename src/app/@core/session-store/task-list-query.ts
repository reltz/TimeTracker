import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { TaskListState, TaskListStore } from './task-list-store';

@Injectable()
export class TaskListQuery extends QueryEntity<TaskListState> {

	constructor(protected store: TaskListStore)
	{
		super(store);
	}
}
