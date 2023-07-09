import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  base64ToFile,
  Dimensions,
  ImageCroppedEvent,
  ImageTransform,
} from 'ngx-image-cropper';
import { User } from 'oidc-client';
import { map, Observable, startWith, Subscription } from 'rxjs';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {
  Itinerary,
  ItineraryCreate,
  PostCreate,
  PlaceSearch,
} from 'src/app/shared/models';
import {
  NotificationService,
  PlaceService,
  PostService,
  TokenStorageService,
  TransmitService,
  UINotificationService,
} from 'src/app/shared/services';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit, OnDestroy {
  formGroup1: FormGroup;
  formGroup2: FormGroup;
  imageUrl: string;
  userInfo: any;
  thumbnails: string[][] = [];
  selectedFormIndex: number = 0;
  placeSearchs: PlaceSearch[][] = [];
  selectedPlaces: PlaceSearch[][] = [];

  // ckEditor
  editor = ClassicEditor;

  // image
  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  aspectRatio: number = 3 / 2;

  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  // carousel config
  customOptions: any = {
    loop: false,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 8,
      },
      400: {
        items: 8,
      },
      740: {
        items: 8,
      },
      940: {
        items: 8,
      },
    },
    nav: true,
  };

  private subscription = new Subscription();

  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('thumbnailInput') thumbnailInput: ElementRef;
  constructor(
    private formBuilder: FormBuilder,
    private tokenService: TokenStorageService,
    private postService: PostService,
    public bsModalRef: BsModalRef,
    private placeService: PlaceService,
    private transmitService: TransmitService,
    private uiNotificationService: UINotificationService
  ) {
    this.formGroup1 = this.formBuilder.group({
      displayImage: '',
      caption: '',
      public: false,
    });

    this.formGroup2 = this.formBuilder.group({
      phones: this.formBuilder.array([]),
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.userInfo = this.tokenService.getUserTokenInfo();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter((value as string) || ''))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  get phoneForms() {
    return this.formGroup2.get('phones') as FormArray;
  }

  addPhone() {
    const phone = this.formBuilder.group({
      title: '',
      description: '',
      startDate: Date,
      endDate: Date,
      thumbnails: [],
      places: [],
    });

    this.phoneForms.push(phone);
  }

  deletePhone(i: any) {
    this.phoneForms.removeAt(i);
  }

  handleFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  handleThumbnailInput(i: number): void {
    this.selectedFormIndex = i;
    this.thumbnailInput.nativeElement.click();
  }

  onThumbnailSelected(event: any, index: number): void {
    const file: File = event.target.files[0];

    if (file) {
      this.transmitService.setValue({ type: 'post-create', data: true });
      this.subscription.add(
        this.postService.uploadImage(file).subscribe(
          (response) => {
            if (response.imageUrl == null) {
              this.transmitService.setValue({
                type: 'post-create',
                data: false,
              });
              this.uiNotificationService.showError('Upload Image Failed !');
              return;
            }

            if (
              this.phoneForms.at(this.selectedFormIndex).get('thumbnails').value
            )
              this.phoneForms
                .at(this.selectedFormIndex)
                .get('thumbnails')
                .value.push(response);
            else
              this.phoneForms.at(this.selectedFormIndex).patchValue({
                thumbnails: [response],
              });

            // Read the file as a data URL
            const reader = new FileReader();
            reader.readAsDataURL(file);

            // Once the file is read, set the image URL
            reader.onload = () => {
              let items = this.thumbnails[this.selectedFormIndex];
              if (items) {
                items.push(reader.result as string);
                this.thumbnails[this.selectedFormIndex] = items;
              } else {
                this.thumbnails[this.selectedFormIndex] = [
                  reader.result as string,
                ];
              }
            };
            
            this.transmitService.setValue({ type: 'post-create', data: false });
            this.uiNotificationService.showSuccess('Upload Successfully !');
          },
          (error) => {
            this.transmitService.setValue({ type: 'post-create', data: false });
            this.uiNotificationService.showError('Upload Image Failed !');
          }
        )
      );
    }

    // Perform any desired actions with the selected file, such as uploading to a server.
  }

  submit() {
    this.transmitService.setValue({ type: 'post-create', data: true });
    const post: PostCreate = {
      caption: this.formGroup1.get('caption').value,
      userId: this.userInfo.nameid,
      userName: this.userInfo.name,
      public: !this.formGroup1.get('public').value,
      userAvatar: this.userInfo.avatar,
      displayImage: this.formGroup1.get('displayImage').value,
      itineraries: [],
    };

    this.formGroup2.get('phones').value.forEach((element: any) => {
      const itinerary: ItineraryCreate = {
        title: element.title,
        description: element.description,
        startDate: element.startDate,
        endDate: element.endDate,
        images: element.thumbnails,
        places: element.places,
      };
      post.itineraries.push(itinerary);
    });

    this.subscription.add(
      this.postService.createPost(post).subscribe(
        (response: any) => {
          if (response == true) {
            this.uiNotificationService.showSuccess(
              'Create Post Successfully !'
            );
            this.bsModalRef.hide();
          } else {
            this.uiNotificationService.showError('Create Post Failed !');
          }
          this.transmitService.setValue({ type: 'post-create', data: false });
        },
        (error) => {
          this.uiNotificationService.showError('Create Post Failed !');

          this.transmitService.setValue({ type: 'post-create', data: false });
        }
      )
    );
  }

  onChoosePlace(item: PlaceSearch, index: number) {
    if (this.selectedPlaces[index]) {
      if (!this.selectedPlaces[index].includes(item)) {
        this.selectedPlaces[index].push(item);
        this.phoneForms.at(index).get('places').value.push(item);
      }
    } else {
      this.selectedPlaces[index] = [item];
      this.phoneForms.at(index).patchValue({
        places: [item],
      });
    }
  }

  onSearchPlace(event: any, index: number) {
    const key = event.target.value;
    if (key && key.length >= 3) {
      this.placeService
        .searchPlace(key)
        .subscribe((response: PlaceSearch[]) => {
          this.placeSearchs[index] = response;
        });
    }
  }

  onFileSelected(event: any): void {
    this.imageChangedEvent = event;
    // const file: File = event.target.files[0];

    // if (file) {
    //   this.subscription.add(
    //     this.postService.uploadImage(file).subscribe(
    //       (response) => {
    //         console.log('Upload success:', response);
    //         this.formGroup1.patchValue({
    //           displayImage: response,
    //         });
    //       },
    //       (error) => {
    //         console.error('Upload error:', error);
    //       }
    //     )
    //   );

    //   // Read the file as a data URL
    //   const reader = new FileReader();
    //   reader.readAsDataURL(file);

    //   // Once the file is read, set the image URL
    //   reader.onload = () => {
    //     this.imageUrl = reader.result as string;
    //   };
    // }
  }

  onSaveDisplayImage() {
    this.transmitService.setValue({ type: 'post-create', data: true });
    const file = base64ToFile(this.croppedImage) as File;

    if (file) {
      this.subscription.add(
        this.postService.uploadImage(file).subscribe(
          (response) => {
            console.log('Upload success:', response);
            this.formGroup1.patchValue({
              displayImage: response,
            });
            this.transmitService.setValue({ type: 'post-create', data: false });
            this.uiNotificationService.showSuccess(
              'Upload Image Successfully !'
            );
          },
          (error) => {
            console.error('Upload error:', error);
            this.transmitService.setValue({ type: 'post-create', data: false });
            this.uiNotificationService.showError('Upload Image Failed !');
          }
        )
      );
    }
  }

  base64ToFile(data: any, filename: any) {
    const arr = data.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  imageLoaded() {
    this.showCropper = true;
    console.log('Image loaded');
  }

  cropperReady(sourceImageDimensions: Dimensions) {
    console.log('Cropper ready', sourceImageDimensions);
  }

  loadImageFailed() {
    console.log('Load failed');
  }

  rotateLeft() {
    this.canvasRotation--;
    this.flipAfterRotate();
  }

  rotateRight() {
    this.canvasRotation++;
    this.flipAfterRotate();
  }

  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH,
    };
  }

  flipHorizontal() {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH,
    };
  }

  flipVertical() {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV,
    };
  }

  resetImage() {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {};
  }

  zoomOut() {
    this.scale -= 0.1;
    this.transform = {
      ...this.transform,
      scale: this.scale,
    };
  }

  zoomIn() {
    this.scale += 0.1;
    this.transform = {
      ...this.transform,
      scale: this.scale,
    };
  }

  toggleContainWithinAspectRatio() {
    this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }

  updateRotation() {
    this.transform = {
      ...this.transform,
      rotate: this.rotation,
    };
  }
}
