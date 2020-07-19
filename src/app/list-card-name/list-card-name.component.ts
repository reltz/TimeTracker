import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, takeWhile, tap } from 'rxjs/operators';
import { TaskListQuery } from '../@core/session-store/task-list-query';
import { TaskListService } from '../@core/session-store/task-list.service';

@Component({
	selector: 'app-list-card-name',
	templateUrl: './list-card-name.component.html',
	styleUrls: ['./list-card-name.component.scss'],
})
export class ListCardNameComponent implements OnInit, OnDestroy
{
	@Input() public id: string;
	public listName$: Observable<string>;
	private isAlive: boolean = true;
	public isActiveOne: boolean;

	constructor(
		private query: TaskListQuery,
		private svc: TaskListService,
	) { }

	public ngOnInit(): void
	{
		this.listName$ = this.query.selectEntity(this.id)
			.pipe(
				takeWhile(() => this.isAlive),
				filter(list => !!list),
				map(list => list.title),
			);

		combineLatest(this.query.activeList$, this.query.isThereActive$)
			.pipe(
				takeWhile(() => this.isAlive),
				filter(([curr, active]) => !!active),
				map(([curr, active]) => curr),
			).subscribe(active =>
			{
				active.id === this.id
					? this.isActiveOne = true
					: this.isActiveOne = false;
			});
	}

	public clickHandler()
	{
		this.svc.setActive(this.id);
	}

	public deleteList()
	{
		if (this.isActiveOne)
		{
			this.svc.unsetActive();
		}
		this.svc.delete(this.id);
	}

	public ngOnDestroy()
	{
		this.isAlive = false;
	}
}
