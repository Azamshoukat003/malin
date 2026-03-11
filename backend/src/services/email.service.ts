import { Resend } from 'resend';
import { env } from '../config/env';

const resend = new Resend(env.RESEND_API_KEY);

export const sendMagicLinkEmail = async (email: string, token: string): Promise<void> => {
  const link = `${env.FRONTEND_URL}/auth/verify?token=${token}`;
  console.log('--- DEVELOPMENT MAGIC LINK ---');
  console.log(`To: ${email}`);
  console.log(`Link: ${link}`);
  console.log('------------------------------');
  try {
    await resend.emails.send({
      from: `MalinKiddy Erinnerungen <${env.FROM_EMAIL}>`,
      to: email,
      subject: 'Dein MalinKiddy-Anmeldelink',
      html: `
        <div style="font-family: Georgia, serif; background: #FAF7F2; padding: 40px;">
          <div style="max-width: 500px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 40px; border: 1px solid #E8DFD0;">
            <h1 style="color: #2C4A3E;">MalinKiddy Erinnerungen</h1>
            <p>Hallo,</p>
            <p>hier ist dein persönlicher Anmeldelink:</p>
            <a href="${link}" style="display:inline-block; background:#2C4A3E; color:#FAF7F2; padding:14px 28px; border-radius:8px; text-decoration:none; margin:20px 0;">
              Jetzt anmelden
            </a>
            <p style="color:#6B6B6B; font-size:14px;">Dieser Link ist 15 Minuten gültig und nur einmal nutzbar.</p>
          </div>
        </div>
      `
    });
    console.log('[SUCCESS] Email sent via Resend');
  } catch (error) {
    console.error('[ERROR] Failed to send email via Resend:', error);
  }
};

export const sendPasswordResetOtpEmail = async (email: string, otp: string): Promise<void> => {
  console.log('--- DEVELOPMENT PASSWORD RESET OTP ---');
  console.log(`To: ${email}`);
  console.log(`OTP: ${otp}`);
  console.log('--------------------------------------');
  try {
    await resend.emails.send({
      from: `MalinKiddy Erinnerungen <${env.FROM_EMAIL}>`,
      to: email,
      subject: 'Dein MalinKiddy Reset-Code',
      html: `
        <div style="font-family: Georgia, serif; background: #FAF7F2; padding: 40px;">
          <div style="max-width: 500px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 40px; border: 1px solid #E8DFD0;">
            <h1 style="color: #2C4A3E;">MalinKiddy Erinnerungen</h1>
            <p>Hallo,</p>
            <p>hier ist dein Code zum Zurucksetzen deines Passworts:</p>
            <p style="font-size: 30px; letter-spacing: 6px; font-weight: 700; color: #2C4A3E; margin: 24px 0;">
              ${otp}
            </p>
            <p style="color:#6B6B6B; font-size:14px;">Der Code ist 10 Minuten gultig.</p>
            <p style="color:#6B6B6B; font-size:14px;">Falls du das nicht angefordert hast, kannst du diese Nachricht ignorieren.</p>
          </div>
        </div>
      `
    });
    console.log('[SUCCESS] Password reset OTP sent via Resend');
  } catch (error) {
    console.error('[ERROR] Failed to send password reset OTP via Resend:', error);
  }
};
