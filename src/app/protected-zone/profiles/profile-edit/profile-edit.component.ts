import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TokenStorageService, TransmitService, UserService } from 'src/app/shared/services';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/models/users/user.model';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],
})
export class ProfileEditComponent implements OnInit, OnDestroy {
  public userId: string | null = null;
  public userProfile: User;
  form: any = {};
  @ViewChild('fileInput') fileInput: ElementRef;

  private subscription = new Subscription();

  constructor(
    private userService: UserService,
    private tokenService: TokenStorageService,
    private fb: FormBuilder,
    private bsModalRef: BsModalRef,
    private transmitService: TransmitService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: this.fb.control(
        this.userProfile.firstName,
        Validators.required
      ),
      lastName: this.fb.control(this.userProfile.lastName, Validators.required),
      userName: this.fb.control(this.userProfile.userName, Validators.required),
      bioIntro: this.fb.control(this.userProfile.bioIntro),
      email: this.fb.control(this.userProfile.email, Validators.required),
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  handleFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFormSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      this.subscription.add(
        this.userService
          .updateUserProfile(this.userId, formValue)
          .subscribe((response: User) => {
            this.tokenService.updateUserInfo('', response.userName);
            this.userService.isChangeProfile$.next(true);
            this.bsModalRef.hide();
          })
      );
    }
  }

  onFileSelected(event: any): void {
    this.transmitService.setValue({type: 'profile-update', data: true });
    const file: File = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    this.subscription.add(
      this.userService.uploadAvatar(this.userId, formData).subscribe(
        (response) => {
          this.userProfile.avatar = response.avatar;
          this.tokenService.updateUserInfo(response.avatar, '');
          this.userService.isChangeProfile$.next(true);
          this.transmitService.setValue({type: 'profile-update', data: false });
        },
        (error) => {
          this.transmitService.setValue({type: 'profile-update', data: false });
          console.error('Error uploading image:', error);
        }
      )
    );
    // Perform any desired actions with the selected file, such as uploading to a server.
  }
}
