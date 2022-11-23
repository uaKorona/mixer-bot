import {Context} from "telegraf";
import {Update} from "typegram";
import {BotHelper} from "./bot-helper.js";
import {Buffer} from "buffer";
import {bot} from "../bot.js";
import {MARK_POSITIONS} from "../consts/image.consts.js";
import {Message} from "typegram/message";
import {TypeGuardsHelper} from "./type-guards.helper.js";
import {MyContext} from "../session/session.model.js";
import {MAIN_BUTTONS, MAIN_KEYBOARD} from "../main/main.keyboard.js";
import {MAIN_MESSAGES} from "../main/main.messeges.js";


export class BotCommands {
    constructor(
        private readonly _botHelper: BotHelper
    ) {
    }

    onStart = (ctx: Context<Update>) =>
        ctx.replyWithHTML(
            MAIN_MESSAGES.startMessage(ctx?.from?.first_name ?? 'guest'),
            MAIN_KEYBOARD
        );
   /* ctx.replyWithHTML(
            MAIN_MESSAGES.startMessage(ctx?.from?.first_name ?? 'guest'),
            Markup.keyboard([
                [MARK_POSITIONS.TOP_LEFT, MARK_POSITIONS.TOP_RIGHT],
                [MARK_POSITIONS.BOTTOM_LEFT, MARK_POSITIONS.BOTTOM_RIGHT],
            ]).resize()
        );*/

    skipMessageFromChat = async (ctx: MyContext, next: () => Promise<void>) => {
        if (this._botHelper.isMessageFromChat(ctx)) {
            // skip running next middlewares for MAIN_MESSAGES from chat
            return;
        }

        return next(); // running next middleware
    }

    onMedia = async (ctx: Context<Update>) => {
        const fileId = this._botHelper.getFileId(ctx.message);

        if (fileId === null) {
            console.log(ctx.message);
            throw new Error(MAIN_MESSAGES.unknownFileId());
        }

        const fileUrl = await bot.telegram
            .getFileLink(fileId)
            .then(url => url.toString());

        if (typeof fileUrl === 'undefined') {
            return ctx.replyWithHTML(MAIN_MESSAGES.unknownFileUrl());
        }

        ctx.reply(MAIN_MESSAGES.proceeding());

        const buffer = await this._botHelper.getWatermarkedImage(fileUrl) as Buffer;

        return ctx.replyWithPhoto({source: buffer})
    }

    otherMessagesHandler = async (ctx: MyContext, next: () => Promise<void>) => {
        const {text} = ctx.message as Message.TextMessage;

        switch (text) {
            case MARK_POSITIONS.TOP_LEFT:
            case MARK_POSITIONS.TOP_RIGHT:
            case MARK_POSITIONS.BOTTOM_LEFT:
            case MARK_POSITIONS.BOTTOM_RIGHT: {
                const result = await this._botHelper.changeWatermarkPosition(text);

                if (TypeGuardsHelper.isString(result)) {
                    return ctx.reply(result);
                }

                return ctx.reply(MAIN_MESSAGES.positioning( text))
                    .then(() => ctx.replyWithPhoto({source: result}));
            }

            case MAIN_BUTTONS.TEXT:
                return ctx.scene.enter("MIXER_TEXT_SCENE");

            case MAIN_BUTTONS.PREVIEW:
                // @ts-ignore
                console.log(ctx['session']);
                return ctx.reply(ctx.context|| 'nothing');

            default:
                console.log('default handler');
                return next()
               // return ctx.replyWithHTML(MAIN_MESSAGES.unSupportType());
        }
    }
}