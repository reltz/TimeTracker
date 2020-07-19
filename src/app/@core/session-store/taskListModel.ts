export interface ITaskList
{
	id: string;
	title: string;
	content: string[];
}

// Second prototype - TODO
export interface IList
{
	id: string;
	title: string;
	content: {
		id: string;
		isChecked: boolean;
		text: string;
	}[];
}
