import { Injectable } from '@angular/core';
import { Channel } from '../../../../models/channel.class';
import { Member } from '../../../../models/member.class';
import { Messenges } from '../../../../models/messenges.class';

@Injectable({
  providedIn: 'root'
})
export class FirestoreHelperService {

  constructor() { }

  allMessages(obj: any): { text: any; time: any; avatar: any; creationDate: any; }[] | undefined {
    if (obj.messages) {
      let allMessages = [];
      for (let i = 0; i < obj.messages.length; i++) {
        let message = obj.messages[i];
        allMessages.push({
          text: message.text,
          time: message.time,
          avatar: message.avatar,
          creationDate: message.creationDate
        });
      }
      return allMessages;
    }
    return undefined;
  }

  groupMessagesByDateAndChannel(messages: any[]): { [channel: string]: { [date: string]: any[] } } {
    return messages.reduce((groups, message) => {
      if (!message.channel || !message.creationDate) {
        console.warn('Message without creationDate or channel:', message);
        return groups;
      }
      const channel = message.channel; // z.B. 'grafik' oder 'editing'
      const date = message.creationDate; // YYYY-MM-DD

      if (!groups[channel]) {
        groups[channel] = {};
      }

      if (!groups[channel][date]) {
        groups[channel][date] = [];
      }

      groups[channel][date].push(message);

      // Sortiere die Nachrichten nach Zeit
      groups[channel][date].sort((a:any, b:any) => a.time.localeCompare(b.time));

      return groups;
    }, {});
  }

  groupDirectMessages(direct_messages: any[]): { [key: string]: any[] } {
    return direct_messages.reduce((groups, direct_message) => {
      if (!direct_message.sender || !direct_message.receiver || !direct_message.creationDate) {
        console.warn('direct_message:', direct_message);
        return groups;
      }

      const senderReceiverKey = this.createSenderReceiverKey(direct_message.sender, direct_message.receiver);
      const dateKey = direct_message.creationDate;

      if (!groups[senderReceiverKey]) {
        groups[senderReceiverKey] = {};
      }

      if (!groups[senderReceiverKey][dateKey]) {
        groups[senderReceiverKey][dateKey] = [];
      }

      groups[senderReceiverKey][dateKey].push(direct_message);
      return groups;
    }, {});
  }

  createSenderReceiverKey(sender: string, receiver: string): string {
    const participants = [sender, receiver].sort();  // Ensure consistent ordering
    return participants.join('-');
  }


  getCleanJson(obj: Member) {
    return {
      member: obj.member,
      email: obj.email,
      password: obj.password,
      avatar: obj.avatar
    }
  }

  getCleanJsonForMessenges(obj: Messenges) {
    return {
      channel: obj.channel,
      text: obj.text,
      time: obj.time,
      sender: obj.sender,
      avatar: obj.avatar,
      creationDate: obj.creationDate
    }
  }

  getCleanJsonForChannel(obj: Channel) {
    return {
      name: obj.name,
      description: obj.description,
      members: obj.members
    }
  }

  getCleanJsonForDirectMessage(obj: any) {
    return {
      text: obj.text,
      time: obj.time,
      avatar: obj.avatar,
      creationDate: obj.creationDate
    }
  }
}
