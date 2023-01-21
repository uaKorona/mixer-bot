import {Scenes, session, Telegraf} from 'telegraf';
import {BotHelper} from "./helpers/bot-helper.js";
import {ENV_CONFIG} from "./env/env.config.js";
import {BotCommands} from "./helpers/bot-commands.js";
import {MyContext} from "./session/session.model.js";
import {mediaScene} from "./scenes/media/media.scene.js";
import {MAIN_COMMAND} from "./main/main.keyboard.js";

const botHelper = BotHelper.builder();
const botCommands = new BotCommands(botHelper, ENV_CONFIG.CHANNEL_ID);
const stage = new Scenes.Stage<MyContext>([mediaScene]);

export const bot = new Telegraf<MyContext>(ENV_CONFIG.BOT_TOKEN);

bot.start(botCommands.onStart);
bot.use(session());
bot.use(stage.middleware());
bot.use(botCommands.skipMessageFromChat);
bot.action(MAIN_COMMAND.PUBLISH, botCommands.publishPost);
bot.use(botCommands.otherMessagesHandler);



