import {Markup} from 'telegraf';

export enum TEXT_BUTTONS {
    TEXT_CANCEL = '↩️ Назад',
    TEXT_NEXT = 'Зберегти ✅'
}

export enum POSITION_BUTTONS {
    TOP_LEFT = '↖️',
    TOP_RIGHT = '↗️',
    BOTTOM_LEFT = '↙️',
    BOTTOM_RIGHT = '↘️'
}

export const POSITION_KEYBOARD = Markup.keyboard([
    [POSITION_BUTTONS.TOP_LEFT, POSITION_BUTTONS.BOTTOM_LEFT, POSITION_BUTTONS.TOP_RIGHT, POSITION_BUTTONS.BOTTOM_RIGHT],
    [TEXT_BUTTONS.TEXT_CANCEL, TEXT_BUTTONS.TEXT_NEXT],
]).resize()

export const DEFAULT_MEDIA_KEYBOARD = Markup.keyboard([
    [TEXT_BUTTONS.TEXT_CANCEL, TEXT_BUTTONS.TEXT_NEXT],
]).resize().oneTime()

export function isPositionButton(text: string | unknown): boolean {
    return Object.values(POSITION_BUTTONS).some(btn => text === btn)
}