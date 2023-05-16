import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit {
  formGroup1: FormGroup;
  formGroup2: FormGroup;
  imageUrl: string;
  @ViewChild('fileInput') fileInput: ElementRef;
  constructor(private formBuilder: FormBuilder) {
    this.formGroup1 = this.formBuilder.group({
      file: [''],
      field1: ['initial value for field 1'],
    });

    this.formGroup2 = this.formBuilder.group({
      field2: ['initial value for field 2'],
    });
  }

  ngOnInit(): void {}

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      // Read the file as a data URL
      const reader = new FileReader();
      reader.readAsDataURL(file);

      // Once the file is read, set the image URL
      reader.onload = () => {
        this.imageUrl = reader.result as string;
      };
    }

    // Perform any desired actions with the selected file, such as uploading to a server.
  }

  handleFileInput(): void {
    this.fileInput.nativeElement.click();
  }
}
