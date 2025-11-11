import type { BaseContext, ContextFunction } from '@apollo/server';
import type { LambdaContextFunctionArgument, Context } from './types';

export const setContext: ContextFunction<
  [LambdaContextFunctionArgument],
  BaseContext
> = async ({ event, context }): Promise<Context> => {
  // TODO: Call users service to populate this value
  // from the provided authentication token
  const userId = event.headers['x-user-id'];
  // we'll trust the user with these, they're not dangerous
  const gameId = event.headers['x-game-id'];
  const attemptId = event.headers['x-attempt-id'];

  return {
    ...context,
    userId,
    gameId,
    attemptId,
    event,
  };
};

export default setContext;
