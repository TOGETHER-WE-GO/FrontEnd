import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  base64ToFile,
  Dimensions,
  ImageCroppedEvent,
  ImageTransform,
} from 'ngx-image-cropper';
import { User } from 'oidc-client';
import { Subscription } from 'rxjs';
import {
  PlaceFeatureType,
  PlaceSearch,
  TripPlanCreate,
  TripPlanItineraryCreate,
} from 'src/app/shared/models';
import {
  TokenStorageService,
  PostService,
  UINotificationService,
  TransmitService,
} from 'src/app/shared/services';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { PlaceService } from 'src/app/shared/services/place.service';
import { Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-trip-plan-form',
  templateUrl: './trip-plan-form.component.html',
  styleUrls: ['./trip-plan-form.component.scss'],
})
export class TripPlanFormComponent implements OnInit, OnDestroy {
  filterValue = '';

  formGroup1: FormGroup;
  formGroup2: FormGroup;
  imageUrl: string;
  userInfo: any;
  selectedFormIndex: number = 0;
  placeSearchs: PlaceSearch[][] = [];
  selectedPlaces: PlaceSearch[][] = [];
  caption = '';

  locations: PlaceFeatureType[] = [];
  selectedLocations: string[] = [];

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
        items: 3,
      },
      400: {
        items: 2,
      },
      600: {
        items: 3,
      },
      800: {
        items: 4,
      },
      940: {
        items: 6,
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
    private placeService: PlaceService,
    public bsModalRef: BsModalRef,
    private transmitService: TransmitService,
    private uiNotificationService: UINotificationService
  ) {
    this.formGroup1 = this.formBuilder.group({
      title: '',
      startDate: '',
      endDate: '',
      city: [],
      displayImage: '',
      caption: '',
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
    this.subscription.add(
      this.placeService
        .getPlaceLocation()
        .subscribe((response: PlaceFeatureType[]) => {
          this.locations = response;
        })
    );
  }

  onOptionsSelected(value: string) {
    if (this.selectedLocations.includes(value)) {
      const index = this.selectedLocations.indexOf(value, 0);
      if (index > -1) {
        this.selectedLocations.splice(index, 1);
      }
    } else {
      this.selectedLocations.push(value);
    }
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

  onChoosePlace(item: PlaceSearch, index: number) {
    if (this.selectedPlaces[index]) {
      if (!this.selectedPlaces[index].includes(item)) {
        this.selectedPlaces[index].push(item);
        this.phoneForms
          .at(this.selectedFormIndex)
          .get('places')
          .value.push(item);
      }
    } else {
      this.selectedPlaces[index] = [item];
      this.phoneForms.at(this.selectedFormIndex).patchValue({
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

  submit() {
    this.transmitService.setValue({type: 'trip-create', data: true});
    const tripPlan: TripPlanCreate = {
      title: this.formGroup1.get('title').value,
      note: this.formGroup1.get('caption').value,
      startDate: this.formGroup1.get('startDate').value,
      endDate: this.formGroup1.get('endDate').value,
      locations: this.selectedLocations,
      userId: this.userInfo.nameid,
      userName: this.userInfo.name,
      userAvatar: this.userInfo.avatar,
      displayImage: this.formGroup1.get('displayImage').value,
      tripPlanItineraries: [],
    };

    this.formGroup2.get('phones').value.forEach((element: any) => {
      const itinerary: TripPlanItineraryCreate = {
        title: element.title,
        description: element.description,
        startDate: element.startDate,
        endDate: element.endDate,
        places: element.places,
      };
      tripPlan.tripPlanItineraries.push(itinerary);
    });

    this.subscription.add(
      this.postService.createTripPlan(tripPlan).subscribe(
        (response: any) => {
          if (response) {
            this.uiNotificationService.showSuccess('Create TripPlan Success !');
            this.bsModalRef.hide();
          } else {
            this.uiNotificationService.showError('Create TripPlan Failed !');
          }
          setTimeout(() => {
            this.transmitService.setValue({type: 'trip-create', data: false});
          }, 1000);
        },
        (error) => {
          this.uiNotificationService.showError(error.error.title);
          setTimeout(() => {
            this.transmitService.setValue({type: 'trip-create', data: false});
          }, 1000);
        }
      )
    );
  }

  onFileSelected(event: any): void {
    this.imageChangedEvent = event;
  }

  onSaveDisplayImage() {
    this.transmitService.setValue({type: 'trip-create', data: true});
    const file = base64ToFile(this.croppedImage) as File;

    if (file) {
      this.subscription.add(
        this.postService.uploadImage(file).subscribe(
          (response) => {
            console.log('Upload success:', response);
            this.formGroup1.patchValue({
              displayImage: response,
            });

            this.transmitService.setValue({type: 'trip-create', data: false});
            this.uiNotificationService.showSuccess('Upload Image Success !');
          },
          (error) => {
            this.transmitService.setValue({type: 'trip-create', data: false});
            this.uiNotificationService.showError('Upload Image Fail !');
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
