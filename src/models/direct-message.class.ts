import { MessageBase } from "./message-base.class";

export class DirectMessage extends MessageBase {
	receiver: string;

	constructor(obj: any) {
    super(obj);
		this.receiver = obj.receiver;
	}
}
