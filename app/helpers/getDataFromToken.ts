import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";

// export const getDataFromToken = (request: NextRequest) => {
//   try {
//     const token = request.cookies.get("token")?.value || "";
//     const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);
//     console.log(decodedToken.id);

//     return decodedToken.id;
//   } catch (error: any) {
//     throw new Error(error.message);
//   }
// };

export const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length === 0) {
    throw new Error("The environment variable JWT_SECRET is not set.");
  }
  return secret;
};

export const getDataFromToken = async (request: NextRequest) => {
  try {
    const token = request.cookies.get("token")?.value || "";
    const decodedToken: any = await jwtVerify(
      token,
      new TextEncoder().encode(getJwtSecretKey())
    );

    return decodedToken.payload.id;
  } catch (error: any) {
    //   throw new Error(error.message);
    return null;
  }
};
