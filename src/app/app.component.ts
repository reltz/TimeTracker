import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskListQuery } from './@core/session-store/task-list-query';
import { TaskListService } from './@core/session-store/task-list.service';
import { ITaskList } from './@core/session-store/taskListModel';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit
{
	public title: string;
	public allLists$: Observable<ITaskList[]>;
	constructor(
		private service: TaskListService,
		private query: TaskListQuery,
	)
	{

	}
	public ngOnInit()
	{
		this.allLists$ = this.query.selectAll();
		this.title = 'TITLE';
		const newList: ITaskList = {
			id: '123',
			title: 'Test Title',
			content: ['item1 ', 'item 2'],
		};

		this.service.upsert(newList);
	}
}
