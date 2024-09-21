export class DirectMessage {
  id?: string;
	sender: string;
	receiver: string;
	text: string;
	time: string;
	avatar: string;
	creationDate: string;
  timeStamp: number;

	constructor(obj: any) {
    this.id = obj.id;
		this.sender = obj.sender;
		this.receiver = obj.receiver;
		this.text = obj.text;
		this.time = obj.time;
		this.avatar = obj.avatar;
		this.creationDate = obj.creationDate;
    this.timeStamp = obj.timeStamp;
	}
}
