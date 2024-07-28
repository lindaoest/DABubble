export class DirectMessage {
	sender: string;
	receiver: string;
	messages: {
		text: string,
		time: string,
		avatar: string,
		creationDate: string
	};

	constructor(obj: any) {
		this.sender = obj.sender;
		this.receiver = obj.receiver;
		this.messages =
			{
				text: obj.messages[0].text,
				time: obj.messages[0].time,
				avatar: obj.messages[0].avatar,
				creationDate: obj.messages[0].creationDate
			}
	}
}