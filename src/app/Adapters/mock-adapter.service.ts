import { Injectable } from '@angular/core';
import { TaskListStore } from '../@core/session-store/task-list-store';
import { ITaskList } from '../@core/session-store/taskListModel';

@Injectable({
	providedIn: 'root',
})
export class MockAdapter
{
	constructor(
		private store: TaskListStore,
	)
	{
	}

	private generateFakeList(id: string, title: string, content: string[]): ITaskList
	{
		return {
			id, title, content,
		};
	}

	// api call to retrive DB records
	public loadAll()
	{
		for (let i = 0; i < 5; i++)
		{
			this.store.upsert(i.toString(), this.generateFakeList(i.toString(), 'List #' + i, ['item 1', 'item 2', 'item 3']));
		}
	}

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
