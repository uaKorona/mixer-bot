export const MAIN_MESSAGES = {
    mainKeyboardDescription: () => `Пришли мені текст, картинку або відео, і я відправлю твій пост у канал`,

    startMessage: (name: string) => [
        `Привіт, <b>${name}</b>!`,
        `Мене звуть - <b>Міксермен 💦</b>, і я допоможу тобі надіслати жартик.`,
        MAIN_MESSAGES.mainKeyboardDescription(),
    ].join('\n\n'),

    unSupportType: () => `Вибач, я ще не вмію обробляти такі повідомленя, я тільки вчуся 😘`,

    unknownFileId: () => [
        `Не вдалося визначити file Id`,
        `звернись до адміна, будь ласка`
    ].join('\n\n'),

    unknownFileUrl: () => [
        `Не вдалося визначити file url`,
        `звернись до адміна, будь ласка`
    ].join('\n\n'),

    proceeding: () => `Обробка...`,

    positioning: (position: string) => `Застосування: ${position}`,

    fileFirst: () => `Будь ласка, завантаж спочатку файл для обробки`,

    logoNotFound: () => [
        `Вибач, не можу знайти логотип`,
        `звернись до адміна, будь ласка`
    ].join('\n\n'),

}
