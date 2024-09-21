import { Member } from "./member.class";

export class Channel {
	id: string;
	name: string;
	description: string;
	members: Member[];
	creator: string;

	constructor(obj:any) {
		this.id = obj.id
		this.name = obj.name
		this.description = obj.description
		this.members = obj.members
		this.creator = obj.creator
	}
}
