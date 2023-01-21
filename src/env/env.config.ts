import {EnvInterface} from "./env.interface.js";

const {
    PRODUCTION,
    MIXER_BOT_TOKEN, TEST_BOT_TOKEN,
    MIXER_INVITE_LINK, TEST_INVITE_LINK,
    MIXER_JOKE_LINK, TEST_JOKE_LINK,
    MIXER_CHANNEL_ID, TEST_CHANNEL_ID
} = process.env;

export const ENV_CONFIG: EnvInterface = {
    PRODUCTION: !!PRODUCTION,
    BOT_TOKEN: PRODUCTION ? MIXER_BOT_TOKEN as string: TEST_BOT_TOKEN as string,
    INVITE_LINK: PRODUCTION ? MIXER_INVITE_LINK as string: TEST_INVITE_LINK as string,
    JOKE_LINK: PRODUCTION ? MIXER_JOKE_LINK as string: TEST_JOKE_LINK as string,
    CHANNEL_ID: PRODUCTION ? MIXER_CHANNEL_ID as string: TEST_CHANNEL_ID as string
}

const emptyPops = Object
    .keys(ENV_CONFIG)
    .filter((key: string ) => ENV_CONFIG[key as keyof EnvInterface] == null);

if (emptyPops.length) {
    emptyPops.forEach(prop => console.log(prop, 'is empty'));
    if (!ENV_CONFIG.PRODUCTION) {
        throw new Error('env.config is fail!' + JSON.stringify(ENV_CONFIG))
    }
}