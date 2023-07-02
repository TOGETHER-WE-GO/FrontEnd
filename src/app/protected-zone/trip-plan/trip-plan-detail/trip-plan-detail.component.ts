import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import {
  TripPlan,
  Message,
  Token,
  ChatGroup,
  Member,
} from 'src/app/shared/models';
import {
  SignalRService,
  TokenStorageService,
  ChatGroupService,
  PostService,
} from '../../../shared/services';
@Component({
  selector: 'app-trip-plan-detail',
  templateUrl: './trip-plan-detail.component.html',
  styleUrls: ['./trip-plan-detail.component.scss'],
})
export class TripPlanDetailComponent implements OnInit {
  alignMessage = 'chat-message-right';
  user: Token;
  messages: Message[] = [];
  chatGroup: ChatGroup;
  tripPlanId: string;
  tripPlanIdentifier: string;
  tripPlanDetail: TripPlan = {} as TripPlan;
  activePanel: number | null = null;
  isMember: boolean;

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
        items: 4,
      },
      740: {
        items: 5,
      },
      940: {
        items: 6,
      },
    },
    nav: true,
  };

  private subscription = new Subscription();
  @ViewChild('sendMessage') sendMessage: ElementRef;
  constructor(
    private signalRService: SignalRService,
    private tokenService: TokenStorageService,
    private chatGroupService: ChatGroupService,
    private postService: PostService,
    public bsModalRef: BsModalRef
  ) {}

  ngOnInit(): void {
    this.user = this.tokenService.getUserTokenInfo();
    this.fetchTripPlanDetail();
    this.fetchChatGroup();
    this.chatGroupService
      .getChatGroupDetail(this.tripPlanIdentifier)
      .subscribe((response: ChatGroup) => {
        this.chatGroup = response;
        this.messages = response.messages;
      });
    if (this.signalRService.checkConnection()) {
      this.signalRService.joinGroup(this.tripPlanIdentifier);
    }

    this.subscribeMessageEvent();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  fetchChatGroup() {
    this.subscription.add(
      this.chatGroupService
        .checkIfUserInGroupChat(this.tripPlanIdentifier, this.user.nameid)
        .subscribe((response: boolean) => {
          this.isMember = response;
        })
    );
  }

  fetchTripPlanDetail() {
    this.subscription.add(
      this.postService
        .getTripPlanDetail(this.tripPlanId)
        .subscribe((response: TripPlan) => {
          this.tripPlanDetail = response;
        })
    );
  }

  handleJoinGroupChat() {
    const member: Member = {
      userId: this.user.nameid,
      userName: this.user.name,
      userAvatar: this.user.avatar,
    };
    this.subscription.add(
      this.chatGroupService
        .addMemberToChatGroup(this.tripPlanIdentifier, member)
        .subscribe((response: boolean) => {
          if (response) {
            this.isMember = true;
            this.chatGroup.members.push(member);
          }
        })
    );
  }

  subscribeMessageEvent() {
    this.signalRService.message$.subscribe((event) => {
      if (event.type === 'OnReceiveMessage' && event.data) {
        this.messages.push(event.data);
      }
    });
  }

  onSendMessage() {
    if (this.sendMessage.nativeElement.value.length != 0) {
      const message: Message = {
        id: 'sss',
        fromUserId: this.user.nameid,
        fromUserName: this.user.name,
        fromUserAvatar: this.user.avatar,
        content: this.sendMessage.nativeElement.value,
        createdAt: new Date(),
      };

      this.signalRService
        .sendMessage(this.tripPlanIdentifier, message)
        .then((result) => {
          this.sendMessage.nativeElement.value = '';
          // this.messages.push({
          //   fromUserId: this.user.userId,
          //   fromUserAvatar: this.user.avatar,
          //   fromUserName: this.user
          // })
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  onLeaveChat()
  {
    this.subscription.add(
      this.chatGroupService
        .removeMemberFromGroupChat(this.tripPlanIdentifier, this.user.nameid)
        .subscribe((response: boolean) => {
          if (response) {
            this.isMember = false;
          }
        })
    );
  }

  togglePanel(id: number) {
    this.activePanel = this.activePanel !== id ? id : null;
  }

  isPanelActive(id: number) {
    return this.activePanel === id;
  }
}
