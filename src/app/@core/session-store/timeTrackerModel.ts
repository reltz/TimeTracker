export interface ILog
{
	id: string;
	title: string;
	totalTime: string;
	content: IContent[];
}

export interface IContent
{
	id: string;
	isChecked: boolean;
	text: string;
	time: string;
}
