import { resend } from '@/lib/resend';
import VerificationEmail from '@/../emails/verificationsEmail';
import ApiResponse from '@/types/ApiResponse';

interface EmailProps {
  email: string;
  username: string;
  verifyCode: string;
}

export async function sendVerificationEmail({
  email,
  username,
  verifyCode,
}: EmailProps): Promise<ApiResponse> {
  try {
    const response: any = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'Verification Code - Mystry Messages',
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    
    if (!response.data) {
      return {
        success: false,
        message: 'Failed to send verification email.',
      };
    }

    return {
      success: true,
      message: 'Verification email send successfully.',
    };
  } catch (emailError) {
    console.error('Error sending verification email ', emailError);
    return {
      success: false,
      message: 'Failed to send verification email.',
    };
  }
}
