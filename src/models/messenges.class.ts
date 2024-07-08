export class Messenges {
	id?: string;
	channel: string;
	text: string;
	time: string;
	sender: string;
	avatar: string;


	constructor(obj: any) {
		this.id = obj.id;
		this.channel = obj.channel;
		this.text = obj.text;
		this.time = obj.time;
		this.sender = obj.sender;
		this.avatar = obj.avatar;
	}
}