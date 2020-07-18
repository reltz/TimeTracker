import { Injectable } from '@angular/core';
import { TaskListStore } from './task-list-store';
import { ITaskList } from './taskListModel';

@Injectable({
	providedIn: 'root',
})
export class TaskListService
{
	constructor(
		private store: TaskListStore,
	)
	{ }

	public upsert(taskList: ITaskList)
	{
		this.store.upsert(taskList.id, taskList);
	}

	public update(taskList: Partial<ITaskList>)
	{
		this.store.update(taskList.id, taskList);
	}

	public delete(id: string)
	{
		this.store.remove(id);
	}
}
