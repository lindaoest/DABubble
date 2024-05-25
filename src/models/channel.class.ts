export class Channel {
	name: string;
	description: string;

	constructor(obj:any) {
		this.name = obj.name,
		this.description = obj.description
	}
}