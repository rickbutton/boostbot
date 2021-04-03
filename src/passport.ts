import * as passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";
import { Strategy as BnetStrategy } from "passport-bnet";
import { createAccountIfDoesntExist, getAccount } from "./auth";

export function configurePassport() {
    passport.use(new DiscordStrategy({
        clientID: String(process.env.DISCORD_CLIENT_ID),
        clientSecret: String(process.env.DISCORD_CLIENT_SECRET),
        callbackURL: "/connect/discord/callback",
        scope: ["identify"],
    }, function (accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }));

    passport.use(new BnetStrategy({
        clientID: String(process.env.BNET_CLIENT_ID),
        clientSecret: String(process.env.BNET_CLIENT_SECRET),
        callbackURL: "/connect/bnet/callback",
        region: "us",
        scope: ["wow.profile"]
    }, function (accessToken: string, refreshToken: string, profile: any, done: any) {
        return done(null, profile);
    }));

    passport.serializeUser(async function (user, done) {
        try {
            const id = (user as any).id; // discord id
            await createAccountIfDoesntExist(id);
            
            done(null, id);
        } catch (e) {
            done(e, null);
        }

    });
    passport.deserializeUser(async function (id, done) {
        const account = await getAccount(String(id));
        if (account) {
            done(null, account);
        } else {
            done(null, false);
        }
    });
}