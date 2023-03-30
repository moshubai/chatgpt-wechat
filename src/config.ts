import * as dotenv from "dotenv";
import { IConfig } from "./interface";
dotenv.config();

export const config: IConfig = {
  api: process.env.API || "https://api.openai.com",
  openai_api_key: process.env.OPENAI_API_KEY || "123456789",
  model: process.env.MODEL || "gpt-3.5-turbo",
  // 聊中触发的关键词 
  chatPrivateTriggerKeyword: process.env.CHAT_PRIVATE_TRIGGER_KEYWORD || "",
  chatTriggerRule: process.env.CHAT_TRIGGER_RULE || "",
  // 禁止群聊使用机器人
  disableGroupMessage: process.env.DISABLE_GROUP_MESSAGE === "true",
  temperature: process.env.TEMPERATURE ? parseFloat(process.env.TEMPERATURE) : 1.0,
  // 避免敏感词
  blockWords: process.env.BLOCK_WORDS?.split(",") || [],
  // 连天敏感词
  chatgptBlockWords: process.env.CHATGPT_BLOCK_WORDS?.split(",") || [],
  // 一条消息的字数
  singleMessageMaxSize: Number(process.env.SINGLE_MESSAGE_MAX_SIZE) || 5000
};

