import { MessageBase } from "./message-base.class";

export class Message extends MessageBase {
  channel: string;

	constructor(obj: any) {
    super(obj);
    this.channel = obj.channel;
	}
}
