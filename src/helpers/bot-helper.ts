import {Context} from "telegraf";
import {Update} from "typegram";
import {MessageTypes} from "../message-types.enum.js";
import {Message, PhotoSize, Video} from "typegram/message";
import {MessageEntity} from "telegraf/typings/core/types/typegram.js";
import {MAIN_MESSAGES} from "../main/main.messeges.js";
import {ENV_CONFIG} from "../env/env.config.js";

export class BotHelper {
    static builder(): BotHelper {
        return new BotHelper(
            MAIN_MESSAGES.groupName(),
            MAIN_MESSAGES.sendJoke(),
            ENV_CONFIG.INVITE_LINK,
            ENV_CONFIG.JOKE_LINK
        );
    };

    private readonly _zero: number = 0;

    constructor(
        private readonly _invite: string,
        private readonly _sendJoke: string,
        private readonly _inviteLink: string,
        public readonly _jokeLink: string
    ) {
    }

    public isMessageFromChat(ctx: Context<Update>): boolean {
        const id = ctx?.chat?.id ?? this._zero;

        return id < this._zero;
    }

    public getFileId(message: Message.PhotoMessage | Message.VideoMessage | unknown): string | null {
        const photo: PhotoSize[] = (message as Message.PhotoMessage)[MessageTypes.photo] || [];

        if (photo.length) {
            return photo[photo.length - 1].file_id;
        }

        const video: Video = (message as Message.VideoMessage)[MessageTypes.video] || {};

        if (video.file_id) {
            return video.file_id;
        }

        return null;
    }

    public getCaptionEntityInvite(offset: number): MessageEntity {
        return {
            offset,
            length: this._invite.length,
            type: 'text_link',
            url: this._inviteLink
        }
    }

    public getCaptionEntityJoke(offset: number): MessageEntity {
        return {
            offset,
            length: this._sendJoke.length,
            type: 'text_link',
            url: this._jokeLink
        }
    }

}
