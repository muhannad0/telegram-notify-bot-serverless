import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'

interface lambdaApiRouteArgs {
  apiGateway: aws.apigatewayv2.Api
  route: pulumi.Input<string>
  lambdaFunction: aws.lambda.Function
}

export class lambdaApiRoute extends pulumi.ComponentResource {
  apiGwLambdaRoute: aws.apigatewayv2.Route

  constructor(
    name: string,
    args: lambdaApiRouteArgs,
    opts?: pulumi.ResourceOptions,
  ) {
    super('artifex:aws:lambdaApiRoute', name, args, opts)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const apiGwLambdaPermission = new aws.lambda.Permission(
      `${name}-permission`,
      {
        action: 'lambda:InvokeFunction',
        principal: 'apigateway.amazonaws.com',
        function: args.lambdaFunction,
        sourceArn: pulumi.interpolate`${args.apiGateway.executionArn}/*/*`,
      },
      { dependsOn: [args.apiGateway, args.lambdaFunction], parent: this },
    )

    const apiGwLambdaIntegration = new aws.apigatewayv2.Integration(
      `${name}-integration`,
      {
        apiId: args.apiGateway.id,
        integrationType: 'AWS_PROXY',
        integrationUri: args.lambdaFunction.arn,
      },
      { parent: this },
    )

    this.apiGwLambdaRoute = new aws.apigatewayv2.Route(
      `${name}-api-route`,
      {
        apiId: args.apiGateway.id,
        routeKey: args.route,
        target: pulumi.interpolate`integrations/${apiGwLambdaIntegration.id}`,
      },
      { parent: this },
    )
  }
}
