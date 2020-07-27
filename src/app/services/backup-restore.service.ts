import { Injectable } from '@angular/core';
import { MockAdapter } from '../Adapters/mock-adapter.service';

@Injectable({
	providedIn: 'root',
})
export class BackupRestoreService
{
	constructor(
		protected readonly api: MockAdapter,
	) { }
	private fileUrl: any;
	private readonly localDBName: string = 'RodTaskListApp';

	public downloadBackup()
	{
		const data = localStorage.getItem(this.localDBName);
		const blob = new Blob([data], { type: 'text/txt' });

		this.fileUrl = this.createObjectURL(blob);
		return this.fileUrl;
	}

	public restore(content: string)
	{
		console.warn('restoring: ', content);
		this.api.restoreData(content);
	}

	private createObjectURL(file)
	{
		if (webkitURL)
		{
			console.warn('webkit!!');
			if (this.fileUrl)
			{
				webkitURL.revokeObjectURL(this.fileUrl);
			}
			return webkitURL.createObjectURL(file);
		} else if (URL && URL.createObjectURL)
		{
			console.warn('NO WEBKIT');
			if (this.fileUrl)
			{
				URL.revokeObjectURL(this.fileUrl);
			}
			return URL.createObjectURL(file);
		} else
		{
			return null;
		}
	}
}
