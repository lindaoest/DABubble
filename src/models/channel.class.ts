export class Channel {
	name: string;
	description: string;
	members: [];

	constructor(obj:any) {
		this.name = obj.name
		this.description = obj.description
		this.members = obj.members
	}
}