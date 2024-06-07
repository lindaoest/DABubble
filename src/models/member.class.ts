export class Member {
	member: string;
	email: string;
	password: string;
	avatar: string;

	constructor(obj: any) {
		this.member = obj.member
		this.email = obj.email
		this.password = obj.password
		this.avatar = obj.avatar
	}
}