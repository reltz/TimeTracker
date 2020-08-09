import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import { v4 } from 'uuid';
import { TaskListQuery } from './@core/session-store/task-list-query';
import { TaskListService } from './@core/session-store/task-list.service';
import { IList } from './@core/session-store/taskListModel';
import { RestoreDialogComponent } from './restore-dialog/restore-dialog.component';
import { BackupRestoreService } from './services/backup-restore.service';
import { PwaService } from './services/pwa.service';
import { UtilityService } from './services/utility.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit
{
	public title: string;
	public hideList: boolean;
	public allLists$: Observable<IList[]>;
	public isThereActive$: Observable<boolean>;
	constructor(
		protected readonly service: TaskListService,
		protected readonly query: TaskListQuery,
		protected readonly backupRestore: BackupRestoreService,
		protected readonly utility: UtilityService,
		protected readonly dialog: MatDialog,
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

	public download()
	{
		const link = document.createElement("a");
		link.href = this.backupRestore.downloadBackup();

		const dateTime = this.utility.getCurrentDateTime();

		link.download = 'RodTaskList-backup-' + dateTime + '.txt';
		link.click();
	}

	public handleRestore()
	{
		this.dialog.open(RestoreDialogComponent)
			.afterClosed();
	}
}
