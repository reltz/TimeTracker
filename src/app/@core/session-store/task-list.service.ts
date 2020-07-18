import { Injectable } from '@angular/core';
import { MockAdapter } from 'src/app/Adapters/mock-adapter.service';
import { TaskListStore } from './task-list-store';
import { ITaskList } from './taskListModel';

@Injectable({
	providedIn: 'root',
})
export class TaskListService
{
	constructor(
		private store: TaskListStore,
		private api: MockAdapter,
	) { }

	public loadAll()
	{
		this.api.loadAll();
	}

	public upsert(taskList: ITaskList)
	{
		this.api.upsert(taskList);
	}

	public update(taskList: Partial<ITaskList>)
	{
		this.api.update(taskList);
	}

	public delete(id: string)
	{
		this.api.delete(id);
	}

	public setActive(id: string)
	{
		this.store.update({ active: id }, null);
	}
}
