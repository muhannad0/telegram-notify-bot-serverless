import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'
import { lambdaApiRoute } from './lambdaApiRoute'
import { tgBotLambdaFunctions } from './lambdaFunctions'

export interface serviceConfig {
  tgBotToken: pulumi.Input<string>
}

export interface tgBotApiGatewayArgs {
  serviceConfig: serviceConfig
}

export class tgBotApiGateway extends pulumi.ComponentResource {
  apiGateway: aws.apigatewayv2.Api
  invokeUrl: pulumi.Output<string>
  functions: tgBotLambdaFunctions
  healthApiRoute: lambdaApiRoute
  setWebhookApiRoute: lambdaApiRoute
  webhookApiRoute: lambdaApiRoute
  stage: aws.apigatewayv2.Stage

  constructor(
    name: string,
    args: tgBotApiGatewayArgs,
    opts?: pulumi.ResourceOptions,
  ) {
    super('artifex:aws:tgBotApiGateway', name, {}, opts)

    this.apiGateway = new aws.apigatewayv2.Api(
      `${name}-gateway`,
      {
        protocolType: 'HTTP',
      },
      { parent: this },
    )

    this.invokeUrl = pulumi.interpolate`${this.apiGateway.apiEndpoint}`

    this.functions = new tgBotLambdaFunctions(
      `${name}`,
      {
        environment: {
          tgBotToken: args.serviceConfig.tgBotToken,
        },
      },
      { parent: this },
    )

    this.healthApiRoute = new lambdaApiRoute(
      `${name}-health`,
      {
        apiGateway: this.apiGateway,
        route: 'GET /health',
        lambdaFunction: this.functions.healthFunction,
      },
      { parent: this },
    )

    this.setWebhookApiRoute = new lambdaApiRoute(
      `${name}-setwebhook`,
      {
        apiGateway: this.apiGateway,
        route: 'POST /set-webhook',
        lambdaFunction: this.functions.setWebhookFunction,
      },
      { parent: this },
    )
    this.webhookApiRoute = new lambdaApiRoute(
      `${name}-webhook`,
      {
        apiGateway: this.apiGateway,
        route: 'POST /webhook',
        lambdaFunction: this.functions.webhookFunction,
      },
      { parent: this },
    )

    this.stage = new aws.apigatewayv2.Stage(
      `${name}-gateway-stage`,
      {
        apiId: this.apiGateway.id,
        name: '$default',
        routeSettings: [],
        autoDeploy: true,
        accessLogSettings: undefined,
      },
      {
        dependsOn: [
          this.healthApiRoute,
          this.setWebhookApiRoute,
          this.webhookApiRoute,
        ],
        parent: this,
      },
    )
  }
}
