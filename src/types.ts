import type {
  Context as LambdaContext,
  APIGatewayProxyEventV2,
  APIGatewayProxyEvent,
} from 'aws-lambda';

export type GatewayEvent = APIGatewayProxyEvent | APIGatewayProxyEventV2;

export interface LambdaContextFunctionArgument {
  event: GatewayEvent;
  context: LambdaContext;
}

export type Context = {
  userId?: string;
  event: GatewayEvent;
};
