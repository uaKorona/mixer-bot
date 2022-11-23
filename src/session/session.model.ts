import {Context, Scenes, session, Telegraf} from "telegraf";
import {Update} from "typegram";

interface MySceneSession extends Scenes.SceneSessionData {
    // will be available under `ctx.scene.session.mySceneSessionProp`
}

// Define your own context type
export interface MyContext extends Context<Update> {
    context: string;
    // declare scene type
    scene: Scenes.SceneContextScene<MyContext, MySceneSession>;
    // ... more props go here
}