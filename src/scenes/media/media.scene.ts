import {Scenes} from 'telegraf';
import {
    DEFAULT_MEDIA_KEYBOARD,
    isPositionButton,
    POSITION_BUTTONS,
    POSITION_KEYBOARD,
    TEXT_BUTTONS
} from "./media.keyboard.js";
import {MyContext} from "../../session/session.model.js";
import {MEDIA_MESSAGES} from "./media.messeges.js";
import {MessageTypes} from "../../message-types.enum.js";
import {SCENES_ID} from "../index.js";
import {Message} from "typegram/message.js";
import {ImageHelper} from "../../helpers/image-helper.js";
import {BotHelper} from "../../helpers/bot-helper.js";
import {bot} from "../../bot.js";
import {Buffer} from "buffer";
import {TypeGuardsHelper} from "../../helpers/type-guards.helper.js";

export const mediaScene = new Scenes.BaseScene<MyContext>(SCENES_ID.MEDIA_SCENE_ID);
let _imageHelper: ImageHelper;
let _botHelper: BotHelper;
let _photoResult: string = '';
let _videoResult: string = '';

mediaScene.enter(async (ctx) => {
    _botHelper = BotHelper.builder();
    _imageHelper = await ImageHelper.builder();
    _emptyMediaResult();

    return ctx.replyWithHTML(MEDIA_MESSAGES.startMessage(), DEFAULT_MEDIA_KEYBOARD)
});

mediaScene.on(MessageTypes.photo, async (ctx) => {
    const fileId = _botHelper.getFileId(ctx.message);

    if (fileId === null) {
        return ctx.replyWithHTML(MEDIA_MESSAGES.unknownFileId());
    }

    const fileUrl = await bot.telegram
        .getFileLink(fileId)
        .then(url => url.toString());

    if (typeof fileUrl === 'undefined') {
        return ctx.replyWithHTML(MEDIA_MESSAGES.unknownFileUrl());
    }

    await ctx.reply(MEDIA_MESSAGES.proceeding());

    const buffer = await _imageHelper.getWatermarkedImage(fileUrl) as Buffer;

    await _replyWithPhotoAndSave(ctx, buffer);

    return ctx.replyWithHTML(MEDIA_MESSAGES.onPhoto(), POSITION_KEYBOARD);
});

mediaScene.on(MessageTypes.video, async (ctx) => {
    const fileId = _botHelper.getFileId(ctx.message);

    if (fileId === null) {
        return ctx.replyWithHTML(MEDIA_MESSAGES.unknownFileId());
    }

    _saveVideoResult(fileId);

    return ctx.replyWithHTML(MEDIA_MESSAGES.onVideo(), DEFAULT_MEDIA_KEYBOARD);
});


mediaScene.on("message", async (ctx, next) => {
    const {text} = ctx.message as Message.TextMessage;

    if (isPositionButton(text)) {
        const result = await _imageHelper.getMarkedImageByPosition(text as POSITION_BUTTONS)

        if (TypeGuardsHelper.isString(result)) {
            return ctx.reply(result);
        }

        await ctx.reply(MEDIA_MESSAGES.proceeding())

        return await _replyWithPhotoAndSave(ctx, result);
    }

    if (text === TEXT_BUTTONS.TEXT_NEXT) {
        _saveMediaSession(ctx, _photoResult, _videoResult);
    }

    if (TEXT_BUTTONS.TEXT_NEXT || TEXT_BUTTONS.TEXT_CANCEL) {
        await ctx.scene.leave();

        return _botHelper.nextWithEmptyText(ctx, next);
    }

    return ctx.replyWithHTML(MEDIA_MESSAGES.unSupportType());
});

function _savePhotoResult(photoId: string | null): void {
    _photoResult = photoId || '';
    _videoResult = '';
}

function _saveVideoResult(videoId: string | null): void {
    _videoResult = videoId || '';
    _photoResult = '';
}

function _emptyMediaResult(): void {
    _photoResult = '';
    _videoResult = '';
}

function _emptyMediaSession(ctx: MyContext): void {
    ctx.session.photo = '';
    ctx.session.video = '';
}

function _saveMediaSession(ctx: MyContext, photoResult: string | null, videoResult: string | null): void {
    if (photoResult) {
        ctx.session.photo = photoResult;
        ctx.session.video = '';

        return
    }

    if (videoResult) {
        ctx.session.video = videoResult;
        ctx.session.photo = '';

        return;
    }

    _emptyMediaSession(ctx);
}

async function _replyWithPhotoAndSave(ctx: MyContext, buffer: Buffer) {
    const msg = await ctx.replyWithPhoto({source: buffer});
    const photoId = _botHelper.getFileId(msg);

    _savePhotoResult(photoId);
}