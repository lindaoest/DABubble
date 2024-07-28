import { Injectable } from '@angular/core';
import { Channel } from '../../../../models/channel.class';
import { Member } from '../../../../models/member.class';

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
      return groups;
    }, {});
  }

  groupDirectMessagesBySender(direct_messages: any[]): { [key: string]: any[] } {
    return direct_messages.reduce((groups, direct_message) => {
      if (!direct_message.sender) {
        console.warn('direct_message:', direct_message);
        return groups;
      }
      const sender = direct_message.sender;

      if (!groups[sender]) {
        groups[sender] = [];
      }

      groups[sender].push(direct_message);
      return groups;
    }, {});
  }

  getCleanJson(obj: Member) {
    return {
      member: obj.member,
      email: obj.email,
      password: obj.password,
      avatar: obj.avatar
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
