import { Component } from '@angular/core';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../shared/services/firestore/firestore.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-choose-avatar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './choose-avatar.component.html',
  styleUrl: './choose-avatar.component.scss'
})
export class ChooseAvatarComponent {

  profilePicture = "./assets/img/channels/profile.svg";
  fileToUpload: File | null = null;
  file: File | null = null;

  constructor(private channelFirestore: FirestoreService) { }

  addImage(item: any) {
    console.log(item)
    this.profilePicture = `./assets/img/avatar/avatar-${item}.svg`;
  }

  // onSubmit() {
  //   const storage = getStorage();
  //   if (this.file) {
  //     const filePath = `uploads/${this.file.name}`;
  //     const fileRef = storage.ref(filePath);
  //     const task = storage.upload(filePath, this.file);

  //     task.snapshotChanges().pipe(
  //       finalize(() => {
  //         fileRef.getDownloadURL().subscribe(url => {
  //           this.saveFileData(url);
  //         });
  //       })
  //     ).subscribe();
  //   }
  // }

  // private saveFileData(url: string): void {
  //   const memberData = { url: url };
  //   this.firestore.collection('members').add(memberData).then(() => {
  //     console.log('File URL saved in Firestore');
  //   }).catch(error => {
  //     console.error('Error saving file URL in Firestore: ', error);
  //   });
  // }

  handleFileInput(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.file = file;
      console.log(this.file)
    }
  }
}
