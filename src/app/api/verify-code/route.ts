import dbConnect from '@/lib/dbConnect';
import UserModel, { User } from '@/model/user';
import { verifySchema } from '@/schemas/verifySchema';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();

    const queryParams = {
      code,
    };

    const result = verifySchema.safeParse(queryParams);
    if (!result.success) {
      const errors = result.error.format().code?._errors;
      return Response.json(
        {
          success: false,
          message: (errors?.join(', ') ?? 'Invalid query parameter'),
        },
        {
          status: 400,
        }
      );
    }

    const user: User | null = await UserModel.findOne({
      username,
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 }
      );
    }

    const isCodeValid = result.data.code === user.verifyCode;
    const isCodeNotExpire = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpire) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: 'Account verified successfully',
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpire) {
      return Response.json(
        {
          success: false,
          message:
            'Verification code has expired, please signup again to get a new code',
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: 'Incorrect verification code.',
        },
        { status: 400 }
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
