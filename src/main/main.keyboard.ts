import {Markup} from 'telegraf';

export enum MAIN_BUTTONS {
    MEDIA = 'Додати медіа 🖼',
    CANCEL = '❌ Очистити',
    PREVIEW = 'Переглянути 😍',
    PUBLISH = 'Опублікувати 💫️',
    PUBLISHED = 'Опубліковано ✅'
}

export enum MAIN_COMMAND {
    PUBLISH = 'publish'
}

export const MAIN_KEYBOARD = Markup.keyboard([
    [MAIN_BUTTONS.MEDIA]
]).resize();

export const MAIN_KEYBOARD_WITH_PREVIEW = Markup.keyboard([
    [MAIN_BUTTONS.MEDIA],
    [MAIN_BUTTONS.CANCEL, MAIN_BUTTONS.PREVIEW],
]).resize();

export const MAIN_PUBLISH_KEYBOARD = Markup.inlineKeyboard([
    Markup.button.callback(MAIN_BUTTONS.PUBLISH, MAIN_COMMAND.PUBLISH),
]);