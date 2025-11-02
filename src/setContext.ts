import type { BaseContext, ContextFunction } from '@apollo/server';
import type { LambdaContextFunctionArgument, Context } from './types';

export const setContext: ContextFunction<
  [LambdaContextFunctionArgument],
  BaseContext
> = async ({ event, context }): Promise<Context> => {
  // TODO: Call users service to populate this value
  // from the provided authentication token
  const userId = event.headers['x-user-id'];

  return {
    ...context,
    userId,
    event,
  };
};

export default setContext;
