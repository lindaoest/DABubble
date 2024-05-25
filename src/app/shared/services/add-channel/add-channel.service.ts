import { Injectable } from '@angular/core';
import { Channel } from '../../../../models/channel.class';

@Injectable({
  providedIn: 'root'
})
export class AddChannelService {

  private channel!: Channel;

  setChannel(newChannel: Channel) {
    this.channel = newChannel;
  }

  getChannel(): Channel {
    return this.channel;
  }
}
