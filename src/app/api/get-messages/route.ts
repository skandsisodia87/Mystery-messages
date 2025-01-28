import dbConnect from '@/lib/dbConnect';
import { getServerSession, User } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import mongoose from 'mongoose';
import UserModel from '@/model/user';

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: 'Not Authenticated',
      },
      { status: 401 }
    );
  }

  const user: User = session.user as User;
  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const usermessages = await UserModel.aggregate([
      {
        $match: {
          _id: userId,
        },
      },
      {
        $unwind: {
          path: '$messages',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          'messages.createdAt': -1,
        },
      },
      {
        $group: {
          _id: '$_id',
          messages: {
            $push: '$messages',
          },
        },
      },
    ]);

    if (!usermessages || usermessages.length === 0) {
      return Response.json(
        { success: false, message: 'No message found' },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, messages: usermessages[0].messages },
      { status: 200 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error?.message,
      },
      { status: 500 }
    );
  }
}
