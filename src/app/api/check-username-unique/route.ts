import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/user';
import { z } from 'zod';
import { usernameValidation } from '@/schemas/signUpSchema';

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get('username'),
    };

    // Validate with zod
    const result = UsernameQuerySchema.safeParse(queryParams);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message: usernameErrors.join(', ') || 'Invalid query parameter',
        },
        {
          status: 400,
        }
      );
    }

    const { username } = result.data;
    const isExistingUserVerified = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (isExistingUserVerified) {
      return Response.json(
        {
          success: false,
          message: 'Username already taken',
        },
        {
          status: 400,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: 'Username is unique',
      },
      {
        status: 200,
      }
    );
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
