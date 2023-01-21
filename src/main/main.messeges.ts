import {MAIN_BUTTONS} from "./main.keyboard.js";

export const MAIN_MESSAGES = {
    mainKeyboardDescription: () => `Пришли текст або тисни кнопку, щоб додати картинку чи відео`,

    startMessage: (name: string) => [
        `Привіт, <b>${name}</b>!`,
        `Я <b>Міксер-бот 🧜🏻‍️</b>, і я допоможу тобі надсилати жартики`,
        MAIN_MESSAGES.mainKeyboardDescription(),
    ].join('\n\n'),

    previewKeyboardDescription: () => `Натисни "${MAIN_BUTTONS.PREVIEW}", щоб подивитись перед публікацією`,

    unSupportType: () => `Вибач, я ще не вмію обробляти такі повідомленя, я тільки вчуся 😘`,

    fileFirst: () => `Будь ласка, завантаж спочатку файл для обробки`,

    logoNotFound: () => [
        `Вибач, не можу знайти логотип`,
        `звернись до адміна, будь ласка`
    ].join('\n\n'),

    groupName: () => 'Підписатися на Міксер',
    inviteEnd: () => ' 🥰',

    sendJoke: () => `Прислати жартик`,
    sendJokeFooter: () => MAIN_MESSAGES.sendJoke() + ' ⚡',
}
