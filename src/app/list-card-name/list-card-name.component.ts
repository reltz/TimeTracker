import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, takeWhile } from 'rxjs/operators';
import { TaskListQuery } from '../@core/session-store/task-list-query';

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

	constructor(private query: TaskListQuery) { }

	public ngOnInit(): void
	{
		this.listName$ = this.query.selectEntity(this.id)
			.pipe(
				takeWhile(() => this.isAlive),
				filter(list => !!list),
				map(list => list.title),
			);
	}

	public ngOnDestroy()
	{
		this.isAlive = false;
	}

}
