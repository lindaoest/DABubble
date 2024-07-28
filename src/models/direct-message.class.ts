export class DirectMessage {
	sender: string;
	receiver: string;
	text: string;
	time: string;
	avatar: string;
	creationDate: string;

	constructor(obj: any) {
		this.sender = obj.sender;
		this.receiver = obj.receiver;
		this.text = obj.text;
		this.time = obj.time;
		this.avatar = obj.avatar;
		this.creationDate = obj.creationDate;
	}
}