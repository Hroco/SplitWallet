import { Prisma } from "@prisma/client";
import { prisma } from "../db";

export const updateOrCreateUserFromOauth = async ({ oauthUserInfo }: any) => {
  const {
    id: googleId,
    verified_email: isVerified,
    email,
    locale,
    picture,
    name,
  } = oauthUserInfo;

  const existingUser = await prisma.user.findUnique({
    where: { email: email },
  });

  if (existingUser) {
    const result = await prisma.user.update({
      where: { email: email },
      data: {
        googleId: googleId,
        isVerified: isVerified,
        locale: locale,
        picture: picture,
        name: name,
      },
    });

    return result;
  } else {
    const result = await prisma.user.create({
      data: {
        email: email,
        googleId: googleId,
        isVerified: isVerified,
        locale: locale,
        picture: picture,
        name: name,
      },
    });
    return result;
  }
};
