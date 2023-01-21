import {Context} from "telegraf";
import {Update} from "typegram";
import {BotHelper} from "./bot-helper.js";
import {Message} from "typegram/message";
import {MyContext} from "../session/session.model.js";
import {MAIN_BUTTONS, MAIN_KEYBOARD, MAIN_KEYBOARD_WITH_PREVIEW, MAIN_PUBLISH_KEYBOARD} from "../main/main.keyboard.js";
import {MAIN_MESSAGES} from "../main/main.messeges.js";
import {SCENES_ID} from "../scenes/index.js";
import {TypeGuardsHelper} from "./type-guards.helper.js";
import {InlineKeyboardMarkup, MessageEntity} from "telegraf/typings/core/types/typegram.js";


export class BotCommands {
    constructor(
        private readonly _botHelper: BotHelper,
        private readonly _channel_id: string
    ) {
    }

    onStart = (ctx: Context<Update>) =>
        ctx.replyWithHTML(
            MAIN_MESSAGES.startMessage(ctx?.from?.first_name ?? 'guest'),
            MAIN_KEYBOARD
        );

    skipMessageFromChat = async (ctx: Context<Update>, next: () => Promise<void>) => {
        if (this._botHelper.isMessageFromChat(ctx)) {
            console.log(ctx.message);
            // skip running next middlewares for MAIN_MESSAGES from chat
            return;
        }

        return next(); // running next middleware
    }

    otherMessagesHandler = async (ctx: MyContext, next: () => Promise<void>) => {
        const {text} = ctx.message as Message.TextMessage;

        switch (text) {
            case MAIN_BUTTONS.MEDIA:
                return ctx.scene.enter(SCENES_ID.MEDIA_SCENE_ID);

            case MAIN_BUTTONS.CANCEL:
            case MAIN_BUTTONS.PUBLISHED:
                 this._emptySession(ctx);
                 break;

            case MAIN_BUTTONS.PREVIEW:
                const extra = this._getCaption(ctx);
                console.log(ctx.session, extra.caption_entities);

                if (ctx.session.photo) {
                    return ctx.replyWithPhoto(ctx.session.photo, extra)
                }

                if (ctx.session.video) {
                    return ctx.replyWithVideo(ctx.session.video, extra)
                }

                return ctx.reply(extra.caption, {entities: extra.caption_entities});

            default: {
                if (TypeGuardsHelper.isString(text) && text.length) {
                    ctx.session.text = text; //TODO: sanitize
                }
            }

        }

        if (this._isSessionNotEmpty(ctx)) {
            return ctx.reply(
                MAIN_MESSAGES.previewKeyboardDescription(),
                MAIN_KEYBOARD_WITH_PREVIEW)
        }

        return ctx.reply(MAIN_MESSAGES.mainKeyboardDescription(), MAIN_KEYBOARD)
    }

    publishPost = async (ctx: MyContext) => {
        await ctx.copyMessage(this._channel_id);
        await ctx.editMessageReplyMarkup({inline_keyboard: []})

        return ctx.reply(MAIN_BUTTONS.PUBLISHED)
    }

    private _getCaption(ctx: MyContext): { caption: string, caption_entities: MessageEntity[], reply_markup: InlineKeyboardMarkup } {
        const divider = '\n\n';

        const firstPart = [
            ctx.session.text,
            divider
        ];

        const secondPart = [
            MAIN_MESSAGES.groupName(),
            MAIN_MESSAGES.inviteEnd(),
            divider
        ];

        const thirdPart = [
            MAIN_MESSAGES.sendJokeFooter()
        ];

        const inviteOffset: number = this._getOffset(firstPart);
        const jokeOffset = inviteOffset + this._getOffset(secondPart);

        const caption_entities = [
            this._botHelper.getCaptionEntityInvite(inviteOffset),
            this._botHelper.getCaptionEntityJoke(jokeOffset)
        ];

        const caption = [...firstPart, ...secondPart, ...thirdPart].join('');

        return {caption, caption_entities, ...MAIN_PUBLISH_KEYBOARD};
    }

    private _isSessionNotEmpty(ctx: MyContext): boolean {
        return !!(ctx.session.photo || ctx.session.text || ctx.session.video);
    }

    private _emptySession(ctx: MyContext): void {
        ctx.session.text = '';
        ctx.session.photo = '';
        ctx.session.video = '';
    }

    private _getOffset(texts: string[]): number {
        return texts.reduce((res, curr) => {
            if (curr == null) {
                console.log(texts);
            }

            return res + (curr ?? '').length;
        }, 0);
    }
}