import { Component, inject } from '@angular/core';
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../shared/services/firestore/firestore.service';
import { finalize } from 'rxjs/operators';
import { Firestore } from '@angular/fire/firestore';
import { GlobalVariablesService } from '../shared/services/global-variables/global-variables.service';

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



  constructor(public firestore: Firestore, public globalVariables: GlobalVariablesService) { }

  addImage(item: any) {
    console.log(item)
    this.profilePicture = `./assets/img/avatar/avatar-${item}.svg`;
  }

  handleFileInput(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.file = file;

      // getDownloadURL(starsRef)
      //   .then((url) => {
      //     console.log(url)
      //   })
      //   .catch((error) => {
      //     // A full list of error codes is available at
      //     // https://firebase.google.com/docs/storage/web/handle-errors
      //     switch (error.code) {
      //       case 'storage/object-not-found':
      //         // File doesn't exist
      //         break;
      //       case 'storage/unauthorized':
      //         // User doesn't have permission to access the object
      //         break;
      //       case 'storage/canceled':
      //         // User canceled the upload
      //         break;

      //       // ...

      //       case 'storage/unknown':
      //         // Unknown error occurred, inspect the server response
      //         break;
      //     }
      //   });
    }
  }

  addMember() {
    if (this.file) {
      const storage = getStorage();
      const starsRef = ref(storage, `images/${this.file.name}`);

      uploadBytes(starsRef, this.file).then((snapshot) => {
        console.log('Uploaded a blob or file!');
        console.log(snapshot)
        console.log(this.file)
      });

      this.globalVariables.newMember[0].avatar = this.file.name;
      console.log(this.globalVariables.newMember)
    }
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
}
