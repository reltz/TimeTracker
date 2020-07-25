import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class BackupRestoreService
{
	private fileUrl: any;
	private readonly localDBName: string = 'RodTaskListApp';

	public downloadBackup()
	{
		const data = localStorage.getItem(this.localDBName);
		const blob = new Blob([data], { type: 'text/txt' });

		this.fileUrl = this.createObjectURL(blob);
		return this.fileUrl;
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
