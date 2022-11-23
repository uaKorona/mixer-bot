import {Scenes} from 'telegraf';
import {MyContext} from "../../session/session.model.js";
import {Message} from "typegram/message";
import {TEXT_BUTTONS, TEXT_OVERFLOW_KEYBOARD, TEXT_KEYBOARD, TEXT_INLINE_KEYBOARD} from "./text.keyboard.js";
import {TEXT_MESSAGES} from "./text.messeges.js";
import {TEXT_MAX_LENGTH} from "./text.consts.js";
import {MAIN_KEYBOARD} from "../../main/main.keyboard.js";
import {MAIN_MESSAGES} from "../../main/main.messeges.js";

export const textScene = new Scenes.BaseScene<MyContext>('MIXER_TEXT_SCENE');

textScene.enter((ctx) => {
    return ctx.replyWithHTML(TEXT_MESSAGES.startMessage(),
        TEXT_KEYBOARD
    )
});

textScene.action(TEXT_BUTTONS.TEXT_NEXT, async (ctx) => {
    console.log('before exit', ctx.context)
    await ctx.scene.leave();

    return ctx.reply(MAIN_MESSAGES.mainKeyboardDescription(), MAIN_KEYBOARD);
});

textScene.hears(TEXT_BUTTONS.TEXT_CANCEL, async ctx=> {
    console.log('cancel')
    ctx.context = '';

    await ctx.scene.leave();

    return ctx.reply(MAIN_MESSAGES.mainKeyboardDescription(), MAIN_KEYBOARD);
})

textScene.on("text", ctx => {
    let {text} = ctx.message as Message.TextMessage;

    if (text.length >= TEXT_MAX_LENGTH) {
        text = text.slice(0, TEXT_MAX_LENGTH);
        ctx.context = text;

        return ctx.replyWithHTML(TEXT_MESSAGES.textOverflow(text), TEXT_OVERFLOW_KEYBOARD)
    }

    ctx.context = text;

    return ctx.reply(TEXT_MESSAGES.textSuccess(), TEXT_INLINE_KEYBOARD)
})

textScene.on("message", ctx => {
    return ctx.replyWithHTML(TEXT_MESSAGES.unSupportType());
});