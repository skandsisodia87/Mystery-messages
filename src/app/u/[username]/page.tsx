'use client';

import React, { useState } from 'react';
import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import ApiResponse from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { getsuggestMessages, sendMessage } from '@/services/services';

interface FormData {
  content: string;
}

export default function SendMessage() {
  const { toast } = useToast();
  const params = useParams() as { username: string };
  const username = params.username;
  const [suggestMessage, setSuggestMessage] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);

  const form = useForm<FormData>({
    defaultValues: { content: '' },
  });

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const onSubmit = (data: FormData) => {
    if (!data.content.trim()) {
      toast({
        title: 'Error',
        description: 'Message content cannot be empty',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    sendMessage(username, data.content)
      .then((response) => {
        toast({
          title: 'Message Sent',
          description: response.data.message,
          variant: 'default',
        });
        form.reset({ content: '' });
      })
      .catch((error) => {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Error',
          description:
            axiosError.response?.data.message ?? 'Failed to send message',
          variant: 'destructive',
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const fetchSuggestedMessages = () => {
    setIsSuggestLoading(true);
    getsuggestMessages()
      .then((res) => {
        setSuggestMessage(res.data.question ?? []);
      })
      .catch((err) => {
        const axiosError = err as AxiosError<ApiResponse>;
        console.error('Error fetching suggested messages:', axiosError);
        toast({
          title: 'Error',
          description:
            axiosError.response?.data.message ??
            'Failed to fetch suggested messages',
          variant: 'destructive',
        });
      })
      .finally(() => {
        setIsSuggestLoading(false);
      });
  };

  return (
    <div className='container mx-auto my-8 p-6 bg-white rounded max-w-4xl'>
      <h1 className='text-4xl font-bold mb-6 text-center'>
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FormField
            control={form.control}
            name='content'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Write your anonymous message here'
                    className='resize-none'
                    aria-label='Write your anonymous message'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex justify-center'>
            {isLoading ? (
              <Button disabled>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Please wait
              </Button>
            ) : (
              <Button type='submit'>Send It</Button>
            )}
          </div>
        </form>
      </Form>

      <div className='space-y-4 my-8'>
        <div className='space-y-2'>
          <Button
            onClick={fetchSuggestedMessages}
            className='my-4'
            disabled={isSuggestLoading}
          >
            {isSuggestLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Loading...
              </>
            ) : (
              'Suggest Messages'
            )}
          </Button>
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className='text-xl font-semibold'>Messages</h3>
          </CardHeader>
          <CardContent className='flex flex-col space-y-4'>
            {suggestMessage.map((message, index) => (
              <Button
                key={`${message}-${index}`}
                variant='outline'
                className='mb-2'
                onClick={() => handleMessageClick(message)}
              >
                {message}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
      <Separator className='my-6' />
      <div className='text-center'>
        <div className='mb-4'>Get Your Message Board</div>
        <Link href={'/sign-up'}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
}
