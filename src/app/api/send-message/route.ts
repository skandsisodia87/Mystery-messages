import dbConnect from '@/lib/dbConnect';
import UserModel, { Message } from '@/model/user';
import { messageSchema } from '@/schemas/messageSchema';
import { z } from 'zod';

const messageQuerySchema = z.object({
  content: messageSchema,
});

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, content } = await request.json();
    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 }
      );
    }

    // Check user accepting messages
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: 'User is not accepting messages',
        },
        { status: 403 }
      );
    }

    const queryParams = {
      content,
    };

    const result = messageQuerySchema.safeParse(queryParams);

    if (!result.success) {
      const error = result.error.format().content?._errors;
      return Response.json(
        {
          success: false,
          message: error || 'Invalid query parameter',
        },
        {
          status: 400,
        }
      );
    }

    const newmessge: Message = {
      content: result.data.content,
      createdAt: new Date(),
    } as Message;

    user.messages.push(newmessge);
    await user.save();

    return Response.json(
      {
        success: true,
        message: 'Message sent successfully',
      },
      { status: 200 }
    );
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
