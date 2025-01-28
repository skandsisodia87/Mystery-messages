const question = [
  'What’s the most interesting place you’ve ever visited and why?',
  'If you could instantly master any skill, what would it be and how would you use it?',
  'What’s a small act of kindness that left a big impact on you?',
  'What’s a book, movie, or show that changed your perspective on something?',
  'If you could live in any fictional universe, where would it be and why?',
  'What’s a dream or goal you’ve had since childhood?',
  'If you could time travel, would you visit the past or the future, and why?',
  'What’s the best advice you’ve ever received?',
  'If you could invent a new holiday, what would it celebrate and how would people observe it?',
  'What’s a random fact or piece of trivia you recently learned that surprised you?',
  'If you could swap lives with anyone for a day, who would it be and what would you do?',
];

export function GET() {
  try {
    const shuffledArray = question.sort(() => 0.5 - Math.random());
    const randomQuestions = shuffledArray.slice(0, 4);

    return Response.json(
      {
        success: true,
        question: randomQuestions,
      },
      { status: 200 }
    );
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
