import { PeerMessageDataType } from './PeerMessageDataType';

export class PeerMessageData {
    type: PeerMessageDataType;
    content: string;
    senderId: string;
}
