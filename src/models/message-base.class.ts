export class MessageBase {
  id?: string;
	text: string;
	time: string;
	sender: string;
	avatar: string;
	creationDate: number;
  timeStamp: number;

  constructor(obj: any) {
		this.id = obj.id;
		this.text = obj.text;
		this.time = obj.time;
		this.sender = obj.sender;
		this.avatar = obj.avatar;
		this.creationDate = obj.creationDate;
    this.timeStamp = obj.timeStamp;
	}
}
