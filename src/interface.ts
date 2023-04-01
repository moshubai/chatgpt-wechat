import { ChatCompletionRequestMessage } from 'openai'

export interface IConfig {
  api: string
  openai_api_key: string
  model: string
  chatTriggerRule: string
  disableGroupMessage: boolean
  temperature: any
  blockWords: string[]
  chatgptBlockWords: string[]
  chatPrivateTriggerKeyword: string
  singleMessageMaxSize: number
}
export interface User {
  username: string
  chatMessage: Array<ChatCompletionRequestMessage>
}
