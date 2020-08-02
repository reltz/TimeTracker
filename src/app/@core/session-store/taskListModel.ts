export interface IList {
	id: string;
	title: string;
	content: IContent[];
}

export interface IContent {
	id: string;
	isChecked: boolean;
	text: string;
}
