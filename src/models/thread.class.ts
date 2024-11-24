import { MessageBase } from "./message-base.class";
import { Message } from "./message.class";

export class Thread extends MessageBase {
  message: MessageBase;

  constructor(obj: any) {
    super(obj);
    this.message = new MessageBase(obj.message);
  }
}
