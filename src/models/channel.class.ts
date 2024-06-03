export class Channel {
	id: string;
	name: string;
	description: string;
	members: [];

	constructor(obj:any) {
		this.id = obj.id
		this.name = obj.name
		this.description = obj.description
		this.members = obj.members
	}
}