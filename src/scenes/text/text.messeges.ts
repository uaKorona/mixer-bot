import {TEXT_MAX_LENGTH} from "./text.consts.js";
import {TEXT_BUTTONS} from "./text.keyboard.js";

export const TEXT_MESSAGES = {
    startMessage: () => [
        `Надішли мені текст, що додати до жартика`,
        `Максимальна довжина: <b>${TEXT_MAX_LENGTH}</b> символа.`
    ].join('\n\n'),

    textOverflow: (clippedText: string) => [
        `Текст перевищує <b>${TEXT_MAX_LENGTH} і буде скорочений до:`,
        ``,
        `${clippedText}`
    ].join('\n\n'),

    textSuccess: () => `Текст збережено ✅`,

    unSupportType: () => [
        `Вибач, я не вмію обробляти такі повідомленя 🥰`,
        `надішли текст та натисни під ним кнопку <b>${TEXT_BUTTONS.TEXT_SAVE}</b>`,
        `або кнопку <b>${TEXT_BUTTONS.TEXT_CANCEL}</b> щоб повернутися у головне меню</b> `
    ].join('\n\n'),
}
