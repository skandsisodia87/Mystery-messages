import { z } from 'zod';

export const messageSchema = z
  .string()
  .min(10, { message: 'Content must be atleast of 10 characters.' })
  .max(360, { message: 'Content must be no longer than 360 characters' });
