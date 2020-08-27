import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TimeTrackerQuery } from '../@core/session-store/time-tracker-query';
import { TimeTrackerService } from '../@core/session-store/time-tracker.service';
import { ILog } from '../@core/session-store/timeTrackerModel';

@Component({
	selector: 'app-multi-view',
	templateUrl: './multi-view.component.html',
	styleUrls: ['./multi-view.component.scss'],
})
export class MultiViewComponent implements OnInit
{
	public allLogs$: Observable<ILog[]>;

	constructor(
		protected readonly service: TimeTrackerService,
		protected readonly query: TimeTrackerQuery,
	) { }

	public ngOnInit(): void
	{
		this.allLogs$ = this.query.selectAll();
	}

}
