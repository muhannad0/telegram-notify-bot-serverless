import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'
import * as path from 'path'

export interface lambdaFunctionArgs {
  environment: {
    tgBotToken: pulumi.Input<string>
  }
}
export class tgBotLambdaFunctions extends pulumi.ComponentResource {
  healthFunction: aws.lambda.Function
  setWebhookFunction: aws.lambda.Function
  webhookFunction: aws.lambda.Function

  constructor(
    name: string,
    args: lambdaFunctionArgs,
    opts?: pulumi.ResourceOptions,
  ) {
    super('artifex:aws:tgBotLambdaFunctions', name, {}, opts)

    const role = new aws.iam.Role(
      `${name}-lambda-role`,
      {
        assumeRolePolicy: {
          Version: '2012-10-17',
          Statement: [
            {
              Action: 'sts:AssumeRole',
              Principal: aws.iam.Principals.LambdaPrincipal,
              Effect: 'Allow',
            },
          ],
        },
      },
      { parent: this },
    )

    new aws.iam.RolePolicyAttachment(
      `${name}-lambda-execute-attach`,
      {
        role,
        policyArn: aws.iam.ManagedPolicies.AWSLambdaBasicExecutionRole,
      },
      { parent: this },
    )

    const lambdaEnvVars = {
      TG_BOT_TOKEN: args.environment.tgBotToken,
    }

    this.healthFunction = this.createLambdaFunction(
      `${name}-health`,
      'health-handler',
      role,
      lambdaEnvVars,
    )
    this.setWebhookFunction = this.createLambdaFunction(
      `${name}-setwebhook`,
      'setwebhook-handler',
      role,
      lambdaEnvVars,
    )
    this.webhookFunction = this.createLambdaFunction(
      `${name}-webhook`,
      'webhook-handler',
      role,
      lambdaEnvVars,
    )
  }

  private createLambdaFunction(
    id: string,
    assetName: string,
    role: aws.iam.Role,
    environment?: any,
  ) {
    return new aws.lambda.Function(
      `${id}-lambda`,
      {
        code: pulumi.output(
          new pulumi.asset.AssetArchive({
            '.': new pulumi.asset.FileArchive(
              path.join(__dirname, `../../build/${assetName}`),
            ),
          }),
        ),
        handler: 'index.handler',
        runtime: aws.lambda.Runtime.NodeJS14dX,
        role: role.arn,
        environment: {
          variables: {
            ...(environment || {}),
          },
        },
      },
      { parent: this },
    )
  }
}
