import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { v4 as makeUUid } from 'uuid';
import { TimeTrackerQuery } from '../@core/session-store/time-tracker-query';
import { TimeTrackerService } from '../@core/session-store/time-tracker.service';
import { ILog } from '../@core/session-store/timeTrackerModel';

@Component({
	selector: 'app-single-view',
	templateUrl: './single-view.component.html',
	styleUrls: ['./single-view.component.scss'],
})
export class SingleViewComponent implements OnInit
{
	public hideList: boolean = false;
	public allLogs$: Observable<ILog[]>;
	public isThereActive$: Observable<boolean>;

	constructor(
		protected readonly service: TimeTrackerService,
		protected readonly query: TimeTrackerQuery,
	) { }

	public ngOnInit(): void
	{
		this.isThereActive$ = this.query.isThereActive$;

		this.allLogs$ = this.query.selectAll();

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
			id: makeUUid(),
			content: [],
			totalTime: '8h',
		});
	}

	public toogleList()
	{
		this.hideList = !this.hideList;
	}
}
