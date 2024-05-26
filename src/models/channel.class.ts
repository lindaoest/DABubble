export class Channel {
	name: string;
	description: string;
	members: string;

	constructor(obj:any) {
		this.name = obj.name
		this.description = obj.description
		this.members = obj.members
	}
}