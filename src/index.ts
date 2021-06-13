import * as pulumi from '@pulumi/pulumi'
import { tgBotApiGateway } from './components/apiGatewayV2'

const config = new pulumi.Config()
const tgBotToken = config.requireSecret('tgBotToken')

const tgBotSvc = new tgBotApiGateway('artifex-tg-bot', {
  serviceConfig: {
    tgBotToken,
  },
})

export const apiUrl = tgBotSvc.invokeUrl
