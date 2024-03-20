// const pool = require("@/db");
import { sql } from "@vercel/postgres";
import { NextRequest } from "next/server";

export const findUserFromDatabase = async (req: NextRequest) => {
  const query = "SELECT COUNT(*) FROM usertrello WHERE user_id = $1";
  const result = await sql.query(query, [1]);
  const userExists = result.rows[0].count > 0;
  //   console.log(result);
  return result;
};
