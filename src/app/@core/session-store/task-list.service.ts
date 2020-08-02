import { Injectable } from '@angular/core';
import { MockAdapter } from 'src/app/Adapters/mock-adapter.service';
import { TaskListStore } from './task-list-store';
import { IList } from './taskListModel';

@Injectable({
	providedIn: 'root',
})
export class TaskListService {
	constructor(
		private store: TaskListStore,
		private api: MockAdapter,
	) { }

	public loadAll() {
		this.api.loadAll();
	}

	public upsert(taskList: IList) {
		this.api.upsert(taskList);
		this.setActive(taskList.id);
	}

	public update(taskList: Partial<IList>) {
		this.api.update(taskList);
	}

	public delete(id: string) {
		this.api.delete(id);
	}

	public setActive(id: string) {
		this.store.update({ active: id });
	}

	public unsetActive() {
		this.store.update({ active: '' });
	}
}
