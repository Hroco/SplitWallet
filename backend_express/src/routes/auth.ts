import { Prisma } from "@prisma/client";
import express, { Request, Response } from "express";
import { prisma } from "../db";
import { z } from "zod";
const router = express.Router();
import jwt from "jsonwebtoken";
import { getGoogleUser } from "../util/getGoogleUser";
import { updateOrCreateUserFromOauth } from "../util/updateOrCreateUserFromOauth";

import { getGoogleOauthUrl } from "../util/getGoogleOauthUrl";

router.get("/google/url", async (req: Request, res: Response) => {
  const url = getGoogleOauthUrl();
  res.status(200).json({ url });
});

router.get("/google/callback", async (req: Request, res: Response) => {
  const { code } = req.query;

  const oauthUserInfo = await getGoogleUser({ code });
  const updatedUser = await updateOrCreateUserFromOauth({ oauthUserInfo });
  const {
    id,
    emailVerified: isVerified,
    email,
    locale,
    picture,
    name,
  } = updatedUser;

  jwt.sign(
    { id, isVerified, email, locale, picture, name },
    process.env.JWT_SECRET as string,
    (err: any, token: any) => {
      if (err) return res.sendStatus(500);
      res.redirect(`http://localhost:3000/mysettings?token=${token}`);
    }
  );
});

export default router;
