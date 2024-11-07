import { Timestamp } from "@angular/fire/firestore";

export class Member {
	id?: string;
	member: string;
	email: string;
	password: string;
	avatar: string;
  isOnline: boolean;

	constructor(obj: any) {
		this.id = obj.id;
		this.member = obj.member;
		this.email = obj.email;
		this.password = obj.password;
		this.avatar = obj.avatar;
    this.isOnline = obj.isOnline;
	}
}
