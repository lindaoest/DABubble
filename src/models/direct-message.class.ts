export class DirectMessage {
	sender: string;
	receiver: string;
	messages: [ {text: string}];

	constructor(obj: any) {
		this.sender = obj.sender;
		this.receiver = obj.receiver;
		this.messages = [
			{text: obj.messages[0].text}
		]
	}
}