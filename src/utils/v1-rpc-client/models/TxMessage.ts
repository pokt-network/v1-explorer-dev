/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Fee } from './Fee';
import type { MessageChangeParameter } from './MessageChangeParameter';
import type { MessageEditStake } from './MessageEditStake';
import type { MessageSend } from './MessageSend';
import type { MessageStake } from './MessageStake';
import type { MessageUnpause } from './MessageUnpause';
import type { MessageUnstake } from './MessageUnstake';
import type { Signature } from './Signature';

export type TxMessage = {
  fee: Fee;
  message:
    | MessageSend
    | MessageStake
    | MessageEditStake
    | MessageUnstake
    | MessageUnpause
    | MessageChangeParameter;
  nonce: string;
  signature: Signature;
};
