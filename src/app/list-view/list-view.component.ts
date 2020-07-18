import { Component, OnDestroy, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { filter, takeWhile, tap } from 'rxjs/operators';
import { TaskListQuery } from '../@core/session-store/task-list-query';
import { TaskListService } from '../@core/session-store/task-list.service';
import { ITaskList } from './../@core/session-store/taskListModel';

@Component({
	selector: 'app-list-view',
	templateUrl: './list-view.component.html',
	styleUrls: ['./list-view.component.scss'],
})
export class ListViewComponent implements OnInit, OnDestroy
{
	public currentList$: Observable<ITaskList>;
	public formGroup: FormGroup;
	public contentFormGroup: FormGroup;
	private isAlive = true;
	public controlsArraySize: string[];

	constructor(
		private query: TaskListQuery,
		private svc: TaskListService,
	)
	{

	}

	public ngOnInit(): void
	{
		this.contentFormGroup = new FormGroup({});
		this.formGroup = new FormGroup({
			content: this.contentFormGroup,
		});

		this.currentList$ = this.query.activeList$;
		this.controlsArraySize = [];

		this.currentList$.pipe(
			takeWhile(() => this.isAlive),
			tap(() =>
			{
				this.formGroup = new FormGroup({});
				this.contentFormGroup = new FormGroup({});
				this.controlsArraySize = [];
			}),
		).subscribe(values =>
		{
			this.formGroup.addControl('name', new FormControl(values.title));
			this.formGroup.addControl('id', new FormControl(values.id));
			values.content.forEach(item =>
			{
				this.contentFormGroup.addControl(item, new FormControl(item));
			});
			Object.keys(this.contentFormGroup.controls).forEach(item =>
			{
				this.controlsArraySize.push(item);
			});
		});
	}

	public ngOnDestroy()
	{
		this.isAlive = false;
	}

	public addItem()
	{
		this.formGroup.controls.name;
	}

	public saveList()
	{
		const id = this.formGroup.get('id').value;
		const content: string[] = [];

		Object.keys(this.contentFormGroup.controls).forEach(item =>
		{
			content.push(this.contentFormGroup.get(item).value);
		});

		this.svc.update({ id, content });
		this.query.selectEntity(id).subscribe(it => console.warn('content is ', it.content));
	}
}
