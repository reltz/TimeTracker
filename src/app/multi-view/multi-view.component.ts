import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskListQuery } from '../@core/session-store/task-list-query';
import { TaskListService } from '../@core/session-store/task-list.service';
import { IList } from '../@core/session-store/taskListModel';

@Component({
	selector: 'app-multi-view',
	templateUrl: './multi-view.component.html',
	styleUrls: ['./multi-view.component.scss'],
})
export class MultiViewComponent implements OnInit
{
	public allLists$: Observable<IList[]>;

	constructor(
		protected readonly service: TaskListService,
		protected readonly query: TaskListQuery,
	) { }

	public ngOnInit(): void
	{
		this.allLists$ = this.query.selectAll();
	}

}
