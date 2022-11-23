import {Markup} from "telegraf";

export enum MAIN_BUTTONS {
    TEXT = 'Додати текст',
    MEDIA = 'Додати картинку або відео',
    CANCEL = 'Скасувати',
    PREVIEW = 'Переглянути',
}

export const MAIN_KEYBOARD = Markup.keyboard([
    [MAIN_BUTTONS.MEDIA, MAIN_BUTTONS.TEXT],
    [MAIN_BUTTONS.CANCEL, MAIN_BUTTONS.PREVIEW]
]).resize()