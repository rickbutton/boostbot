import { PrismaClient } from "@prisma/client";
import * as express from "express";
import * as passport from "passport";
import * as session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { syncCharacters } from "./wow";
import { updateBnetInformation } from "./auth";


export function startExpressApp() {
    const app = process.env.HTTPS_LOCALHOST ?
        require("https-localhost")() as express.Application :
        express();

    const prisma = new PrismaClient();
    app.use(session({
        secret: String(process.env.SESSION_SECRET),
        resave: false,
        saveUninitialized: false,
        rolling: true,
        store: new PrismaSessionStore(
            prisma,
            {
                checkPeriod: 2 * 60 * 1000,  //ms
                dbRecordIdIsSessionId: true,
                dbRecordIdFunction: undefined,
            }
        )
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    app.get("/connect", function (req, res) {
        if (req.user) {
            res.redirect("/connect/bnet");
        } else {
            res.redirect("/connect/discord");
        }
    });

    app.get("/connect/complete", function (req, res) {
        res.send("Account sync complete! Please return to Discord.");
    });
    app.get("/connect/failed", function (req, res) {
        res.send("Account sync failed. Please open a support ticket.");
    });
    app.get("/connect/discord", passport.authenticate("discord"));
    app.get("/connect/discord/callback",
        passport.authenticate("discord", { failureRedirect: "/sync/failed" }),
        function (req, res) {
            res.redirect("/connect/bnet");
        });

    app.get("/connect/bnet", passport.authorize("bnet"));
    app.get("/connect/bnet/callback",
        passport.authorize("bnet", { failureRedirect: "/sync/failed" }),
        async function (req, res) {
            const bnetAccount = (req as any).account;
            if (bnetAccount) {
                const discordId = (req.user as any).discordId;
                const bnetId = String(bnetAccount.id);
                const bnetTag = String(bnetAccount.battletag);

                await updateBnetInformation(discordId, bnetId, bnetTag);
                await syncCharacters(discordId, bnetAccount.token);

                res.redirect("/connect/complete");
            } else {
                res.redirect("/connect/failed");
            }
        });

    app.listen(Number(process.env.PORT), () => { });
}