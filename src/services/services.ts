import { signUpSchema } from '@/schemas/signUpSchema';
import ApiResponse from '@/types/ApiResponse';
import axios from 'axios';
import { z } from 'zod';

interface verifyuser {
  username: string;
  code: string;
}

export function checkusername(username: string) {
  return axios.get<ApiResponse>(
    `/api/check-username-unique?username=${username}`
  );
}

export function signup(data: z.infer<typeof signUpSchema>) {
  return axios.post<ApiResponse>(`/api/sign-up`, data);
}

export function verifyuserAccount(data: verifyuser) {
  return axios.post<ApiResponse>(`/api/verify-code`, data);
}

export function deleteMessage(messageId: string) {
  return axios.delete<ApiResponse>(`/api/delete-message/${messageId}`);
}

export function acceptMessage() {
  return axios.get<ApiResponse>(`/api/accept-messages`);
}

export function getMessages() {
  return axios.get<ApiResponse>(`/api/get-messages`);
}

export function acceptmessages(acceptMessages: boolean) {
  return axios.post<ApiResponse>('/api/accept-messages', {
    acceptMessages,
  });
}

export function getsuggestMessages() {
  return axios.get<ApiResponse>('/api/suggest-messages');
}

export function sendMessage(username: string, content: string) {
  return axios.post<ApiResponse>('/api/send-message', {
    username,
    content,
  });
}
