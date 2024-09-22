export class Thread {
  id?: string;
	channel: string;
	text: string;
	time: string;
	sender: string;
	avatar: string;
	creationDate: number;
  timeStamp: number;;
  message: {}

  constructor(obj: any) {
    this.id = obj.id;
		this.channel = obj.channel;
		this.text = obj.text;
		this.time = obj.time;
		this.sender = obj.sender;
		this.avatar = obj.avatar;
		this.creationDate = obj.creationDate;
    this.timeStamp = obj.timeStamp;
    this.message = obj.message;
  }
}
