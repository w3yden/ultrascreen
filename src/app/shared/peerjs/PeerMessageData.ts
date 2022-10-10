import { PeerMessageDataType } from './PeerMessageDataType';

export class PeerMessageData {
    type: PeerMessageDataType;
    content: string;

    constructor(type: PeerMessageDataType, content: string = '') {
        this.type = type;
        this.content = content;
    }
}
