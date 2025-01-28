import { Message } from '@/model/user';

export default interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessage?: boolean;
  messages?: Array<Message>;
  question?: Array<string>;
}
