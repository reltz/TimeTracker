import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'app-confirm-delete-dialog',
	templateUrl: './confirm-delete-dialog.component.html',
	styleUrls: ['./confirm-delete-dialog.component.scss'],
})
export class ConfirmDeleteDialogComponent
{
	constructor(
		@Inject(MAT_DIALOG_DATA) public data,
		protected readonly dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>,
	)
	{ }
}
