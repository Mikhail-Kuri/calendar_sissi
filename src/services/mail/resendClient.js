import { Resend } from "resend";

let _resend = null;

export function getResend() {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY missing in environment variables");
    _resend = new Resend(key);
  }
  return _resend;
}