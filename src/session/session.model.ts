import {Context, Scenes} from "telegraf";

interface MySceneSession extends Scenes.SceneSessionData {
    // will be available under `ctx.scene.session.mySceneSessionProp`
}

interface MySession extends Scenes.SceneSession<MySceneSession> {
    // will be available under `ctx.session.mySessionProp`
    text: string;
    photo: string;
    video: string;
}

// Define your own context type
export interface MyContext extends Context {
    // declare scene type
    scene: Scenes.SceneContextScene<MyContext, MySceneSession>;
    // ... more props go here
    session: MySession
}