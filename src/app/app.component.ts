import { Component, OnInit } from '@angular/core';
import { entitiesToArray, entitiesToMap } from '@datorama/akita';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
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
	public hideList: boolean;
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
		this.allLists$ = this.query.selectAll();
		this.title = 'Rod\'s TaskList App';
		this.query.select()
			.pipe(
				take(1),
				map(state => state.ids[0]),
				filter(ent => !!ent),
			).subscribe(id => this.service.setActive(id));
	}

	public addNewList(): void
	{
		this.service.upsert({
			title: 'Title',
			id: v4(),
			content: [],
		});
	}

	public toogleList()
	{
		this.hideList = !this.hideList;
	}
}
