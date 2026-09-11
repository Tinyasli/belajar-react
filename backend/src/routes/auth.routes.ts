import { Router, type Request, type Response } from "express";
import { authService, ApiError } from "../services/authService";
import type { LoginRequestBody } from "../types/auth";

const router = Router();

const PHONE_REGEX = /^08[0-9]{8,11}$/;
const PIN_REGEX = /^[0-9]{6}$/;

function validateBody(body: Partial<LoginRequestBody>): string | null {
  if (!body.phoneNumber || !PHONE_REGEX.test(body.phoneNumber)) {
    return "Nomor HP tidak valid.";
  }
  if (!body.pin || !PIN_REGEX.test(body.pin)) {
    return "PIN harus 6 digit angka.";
  }
  return null;
}

router.post("/login", async (req: Request, res: Response) => {
  const validationError = validateBody(req.body ?? {});
  if (validationError) {
    return res.status(400).json({ code: "VALIDATION_ERROR", message: validationError });
  }

  const { phoneNumber, pin } = req.body as LoginRequestBody;

  try {
    const result = await authService.login(phoneNumber, pin);
    return res.status(200).json(result);
  } catch (err) {
    if (err instanceof ApiError) {
      return res.status(err.status).json(err.body);
    }
    console.error(err);
    return res.status(500).json({ code: "UNKNOWN_ERROR", message: "Terjadi kesalahan server." });
  }
});

export default router;
