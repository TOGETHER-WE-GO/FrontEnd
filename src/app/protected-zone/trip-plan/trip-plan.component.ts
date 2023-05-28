import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { UserFollow, Message, Token, ChatGroup } from 'src/app/shared/models';
import { SignalRService, TokenStorageService, ChatGroupService } from '../../shared/services';
@Component({
  selector: 'app-trip-plan',
  templateUrl: './trip-plan.component.html',
  styleUrls: ['./trip-plan.component.scss'],
})
export class TripPlanComponent implements OnInit, OnDestroy {
  alignMessage = 'chat-message-right';
  user: Token;
  messages: Message[] = [];
  chatGroup: ChatGroup;
  @ViewChild('sendMessage') sendMessage: ElementRef;
  constructor(
    private signalRService: SignalRService,
    private tokenService: TokenStorageService,
    private chatGroupService: ChatGroupService
  ) {}

  ngOnInit(): void {
    this.user = this.tokenService.getUserTokenInfo();
    this.chatGroupService.getChatGroupDetail('ABC1234').subscribe((response: ChatGroup) =>{
      this.chatGroup = response;
      this.messages = response.messages;
    })
    if (this.signalRService.checkConnection()) {
      this.signalRService.joinGroup('ABC1234');
    }

    this.subscribeMessageEvent();
  }

  ngOnDestroy(): void {
    this.signalRService.leaveGroup('ABC1234');
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
        .sendMessage('ABC1234', message)
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
}
