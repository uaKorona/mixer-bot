import {Markup} from "telegraf";

export enum TEXT_BUTTONS {
    TEXT_CANCEL = 'Скасувати',
    TEXT_SAVE = 'Зберегти',
    TEXT_NEXT = 'Далі'
}

export const TEXT_KEYBOARD = Markup.keyboard([
    [TEXT_BUTTONS.TEXT_CANCEL],
]).resize()

export const TEXT_OVERFLOW_KEYBOARD = Markup.inlineKeyboard([
    Markup.button.callback(TEXT_BUTTONS.TEXT_SAVE, TEXT_BUTTONS.TEXT_SAVE)
]);

export const TEXT_INLINE_KEYBOARD = Markup.inlineKeyboard([
    Markup.button.callback(TEXT_BUTTONS.TEXT_NEXT, TEXT_BUTTONS.TEXT_NEXT)
]);