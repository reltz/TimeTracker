import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { v4 } from 'uuid';
import { TaskListQuery } from '../@core/session-store/task-list-query';
import { TaskListService } from '../@core/session-store/task-list.service';
import { IList } from '../@core/session-store/taskListModel';

@Component({
	selector: 'app-single-view',
	templateUrl: './single-view.component.html',
	styleUrls: ['./single-view.component.scss'],
})
export class SingleViewComponent implements OnInit
{
	public hideList: boolean = false;
	public allLists$: Observable<IList[]>;
	public isThereActive$: Observable<boolean>;

	constructor(
		protected readonly service: TaskListService,
		protected readonly query: TaskListQuery,
	) { }

	public ngOnInit(): void
	{
		this.isThereActive$ = this.query.isThereActive$;

		this.allLists$ = this.query.selectAll();

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
