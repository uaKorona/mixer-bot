import {Scenes} from 'telegraf';
import {Message} from "typegram/message";
import {TEXT_BUTTONS, TEXT_INLINE_KEYBOARD, TEXT_KEYBOARD, TEXT_OVERFLOW_KEYBOARD} from "./text.keyboard.js";
import {TEXT_MESSAGES} from "./text.messeges.js";
import {TEXT_MAX_LENGTH} from "./text.consts.js";
import {MAIN_KEYBOARD} from "../../main/main.keyboard.js";
import {MAIN_MESSAGES} from "../../main/main.messeges.js";
import {MyContext} from "../../session/session.model.js";
import {SCENES_ID} from "../index.js";


export const textScene = new Scenes.BaseScene<MyContext>(SCENES_ID.TEXT_SCENE_ID);

textScene.enter((ctx) => {
    return ctx.replyWithHTML(TEXT_MESSAGES.startMessage(),
        TEXT_KEYBOARD
    )
});

textScene.action(TEXT_BUTTONS.TEXT_NEXT, async (ctx) => {
    console.log('before exit', ctx.session)
    await ctx.scene.leave();

    return ctx.reply(MAIN_MESSAGES.mainKeyboardDescription(), MAIN_KEYBOARD);
});

textScene.hears(TEXT_BUTTONS.TEXT_CANCEL, async ctx=> {
    console.log('cancel')
    ctx.session.text = '';

    await ctx.scene.leave();

    return ctx.reply(MAIN_MESSAGES.mainKeyboardDescription(), MAIN_KEYBOARD);
})

textScene.on("text", ctx => {
    let {text} = ctx.message as Message.TextMessage;

    if (text.length >= TEXT_MAX_LENGTH) {
        text = text.slice(0, TEXT_MAX_LENGTH);
        ctx.session.text = text;

        return ctx.replyWithHTML(TEXT_MESSAGES.textOverflow(text), TEXT_OVERFLOW_KEYBOARD)
    }

    // @ts-ignore
    ctx.session.text = text;

    return ctx.reply(TEXT_MESSAGES.textSuccess(), TEXT_INLINE_KEYBOARD)
})

textScene.on("message", ctx => {
    return ctx.replyWithHTML(TEXT_MESSAGES.unSupportType());
});