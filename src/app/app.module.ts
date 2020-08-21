import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MockAdapter } from '../app/Adapters/mock-adapter.service';
import { environment } from '../environments/environment';
import { TaskListQuery } from './@core/session-store/task-list-query';
import { TaskListStore } from './@core/session-store/task-list-store';
import { TaskListService } from './@core/session-store/task-list.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfirmDeleteDialogComponent } from './confirm-delete-dialog/confirm-delete-dialog.component';
import { ListCardNameComponent } from './list-card-name/list-card-name.component';
import { ListViewComponent } from './list-view/list-view.component';
import { RestoreDialogComponent } from './restore-dialog/restore-dialog.component';
import { BackupRestoreService } from './services/backup-restore.service';
import { UtilityService } from './services/utility.service';

const matModules = [
	MatCardModule,
	MatIconModule,
	MatButtonModule,
	MatCheckboxModule,
	MatFormFieldModule,
	MatInputModule,
	MatDialogModule,
];

@NgModule({
	declarations: [
		AppComponent,
		ListCardNameComponent,
		ListViewComponent,
		RestoreDialogComponent,
		ConfirmDeleteDialogComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		ReactiveFormsModule,
		...matModules,
		ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
	],
	providers: [
		UtilityService,
		TaskListService,
		TaskListStore,
		TaskListQuery,
		MockAdapter,
		BackupRestoreService,
	],
	bootstrap: [AppComponent],
})

export class AppModule { }
