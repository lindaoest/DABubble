import { Message } from "./message.class";

export class Thread extends Message {
  message: Message;

  constructor(obj: any) {
    super(obj);
    this.message = new Message(obj.message);
  }
}
