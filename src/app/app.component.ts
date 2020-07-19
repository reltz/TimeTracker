import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { v4 } from 'uuid';
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
	public isThereActive$: Observable<boolean>;
	constructor(
		private service: TaskListService,
		private query: TaskListQuery,
	)
	{

	}
	public ngOnInit()
	{
		this.isThereActive$ = this.query.isThereActive$;
		this.service.loadAll();
		this.service.setActive("0");
		this.allLists$ = this.query.selectAll();
		this.title = 'TITLE';
	}

	public addNewList(): void
	{
		this.service.upsert({
			title: 'Title',
			id: v4(),
			content: [],
		});
	}
}
