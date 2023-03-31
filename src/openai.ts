import fs from 'fs'
import {
  Configuration,
  CreateImageRequestResponseFormatEnum,
  CreateImageRequestSizeEnum,
  OpenAIApi
} from 'openai'
import { config } from './config.js'
import DBUtils from './data.js'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration)

/**
 * 如果失败获取或一条信息
 * @param username
 * @param message
 */
async function againWakeGpt(message: any[]) {
  const response = await openai
    .createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: message,
      temperature: config.temperature
    })
    .then(res => res.data)
    .catch(err => console.log(err))
  if (response) {
    return (response.choices[0].message as any).content.replace(/^\n+|\n+$/g, '')
  }
}

/**
 * Get completion from OpenAI
 * @param username
 * @param message
 */
async function chatgpt(username: string, message: string) {
  // 先将用户输入的消息添加到数据库中
  DBUtils.addUserMessage(username, message)
  const messages = DBUtils.getChatMessage(username)
  console.log('测试', messages.length)
  const response = await openai
    .createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: config.temperature
    })
    .then(res => res.data)
    .catch(err => console.log(err))
  if (response) {
    if (messages && messages.length > 15) {
      DBUtils.clearHistory(username)
    }
    return (response.choices[0].message as any).content.replace(/^\n+|\n+$/g, '')
  } else {
    let info = await againWakeGpt(messages[messages.length - 1])
    if (info) {
      return info
    } else {
      return '不好意思，咨询数据过大，请稍后咨询哦 ฅʕ•̫͡•ʔฅ'
    }
  }
}

/**
 * Get image from Dall·E
 * @param username
 * @param prompt
 */
async function dalle(username: string, prompt: string) {
  const response = await openai
    .createImage({
      prompt: prompt,
      n: 1,
      size: CreateImageRequestSizeEnum._256x256,
      response_format: CreateImageRequestResponseFormatEnum.Url,
      user: username
    })
    .then(res => res.data)
    .catch(err => console.log(err))
  if (response) {
    return response.data[0].url
  } else {
    return 'Generate image failed'
  }
}

/**
 * Speech to text
 * @param username
 * @param videoPath
 */
async function whisper(username: string, videoPath: string): Promise<string> {
  const file: any = fs.createReadStream(videoPath)
  const response = await openai
    .createTranscription(file, 'whisper-1')
    .then(res => res.data)
    .catch(err => console.log(err))
  if (response) {
    return response.text
  } else {
    return 'Speech to text failed'
  }
}

export { chatgpt, dalle, whisper }
