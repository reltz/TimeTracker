import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MockAdapter } from '../app/Adapters/mock-adapter.service';
import { environment } from '../environments/environment';
import { TimeTrackerQuery } from './@core/session-store/time-tracker-query';
import { TimeTrackerStore } from './@core/session-store/time-tracker-store';
import { TimeTrackerService } from './@core/session-store/time-tracker.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfirmDeleteDialogComponent } from './confirm-delete-dialog/confirm-delete-dialog.component';
import { LogCardNameComponent } from './log-card-name/log-card-name.component';
import { LogViewComponent } from './log-view/log-view.component';
import { RestoreDialogComponent } from './restore-dialog/restore-dialog.component';
import { BackupRestoreService } from './services/backup-restore.service';
import { UtilityService } from './services/utility.service';
import { SingleViewComponent } from './single-view/single-view.component';

const matModules = [
	MatCardModule,
	MatIconModule,
	MatButtonModule,
	MatCheckboxModule,
	MatFormFieldModule,
	MatOptionModule,
	MatSelectModule,
	MatInputModule,
	MatDialogModule,
	MatDividerModule,
];

@NgModule({
	declarations: [
		AppComponent,
		LogCardNameComponent,
		LogViewComponent,
		RestoreDialogComponent,
		ConfirmDeleteDialogComponent,
		SingleViewComponent,
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
		TimeTrackerService,
		TimeTrackerStore,
		TimeTrackerQuery,
		MockAdapter,
		BackupRestoreService,
	],
	bootstrap: [AppComponent],
})

export class AppModule { }
