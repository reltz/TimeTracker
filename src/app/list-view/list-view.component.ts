import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, takeWhile, tap, timestamp } from 'rxjs/operators';
import { v4 } from 'uuid';
import { TaskListQuery } from '../@core/session-store/task-list-query';
import { TaskListService } from '../@core/session-store/task-list.service';
import { IContent, IList } from './../@core/session-store/taskListModel';

@Component({
	selector: 'app-list-view',
	templateUrl: './list-view.component.html',
	styleUrls: ['./list-view.component.scss'],
})
export class ListViewComponent implements OnInit, OnDestroy {
	@ViewChild('focusTitle') public title: ElementRef;
	public currentList$: Observable<IList>;
	public formGroup: FormGroup;
	public allContent: FormArray;
	private isAlive = true;

	constructor(
		private query: TaskListQuery,
		private svc: TaskListService,
	) { }

	public ngOnInit(): void {
		this.formGroup = new FormGroup({
			id: new FormControl(''),
			name: new FormControl(''),
		});

		this.currentList$ = this.query.activeList$;

		combineLatest(this.currentList$, this.query.isThereActive$).pipe(
			filter(([cur, active]) => !!cur && !!active),
			takeWhile(() => this.isAlive),
			tap(() => {
				this.allContent = new FormArray([]);
			}),
			map(([cur, active]) => cur),
		).subscribe(values => {
			if (this.formGroup.controls.id.value === values.id) {
				this.formGroup.markAsPristine();
			}
			else {
				this.formGroup.controls.id.setValue(values.id);
				this.formGroup.controls.name.setValue(values.title);
			}

			this.formGroup.controls.name.setValue(values.title);
			values.content.forEach(item => {
				this.allContent.push(this.createContentControls(item.id, item.text, item.isChecked));
			});
		});

	}

	public ngOnDestroy() {
		this.isAlive = false;
	}

	public addItem(): void {
		const id = v4();
		this.allContent.push(this.createContentControls(id, ''));
	}

	public deleteItem(itemId: string): void {
		const id = this.formGroup.get('id').value;
		const content = this.mapFormGroupToListContent(itemId);
		console.info('deleting : final content: ', content);

		this.svc.update({ id, content });
	}

	public saveList() {
		const id = this.formGroup.get('id').value;
		const content = this.mapFormGroupToListContent();
		this.svc.update({ id, content, title: this.formGroup.get('name').value });
	}

	public selectAllText() {
		this.title.nativeElement.select();
	}

	public toggleCheck(itemId: string) {
		const toUpdate = this.allContent.controls.find(group => group.value.id === itemId).get('isChecked');
		toUpdate.setValue(!toUpdate.value);
		this.saveList();
		console.warn('is checked??', this.allContent.controls)
	}

	private mapFormGroupToListContent(itemId?: string): IContent[] {
		const content: IContent[] = [];

		this.allContent.controls.forEach(each => {
			const id = each.get('id').value;
			const text = each.get('text').value;
			const isChecked = each.get('isChecked').value;

			if (itemId !== id) {
				content.push({
					id,
					text,
					isChecked,
				});
			}
		});
		return content;
	}

	private createContentControls(id: string, text: string, isChecked: boolean = false) {
		return new FormGroup({
			id: new FormControl(id),
			text: new FormControl(text),
			isChecked: new FormControl(isChecked),
		});
	}

}
