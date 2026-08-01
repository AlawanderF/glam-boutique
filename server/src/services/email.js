import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = `"Glam Boutique" <${process.env.SMTP_FROM || 'noreply@glamboutique.com.br'}>`;

export async function sendPasswordResetEmail(to, resetToken) {
  const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;
  await transporter.sendMail({
    from: FROM,
    to,
    subject: 'Redefinição de senha — Glam Boutique',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #15130f;">Glam Boutique</h1>
        <p>Você solicitou a redefinição de senha. Clique no botão abaixo para criar uma nova senha:</p>
        <a href="${resetUrl}" style="display: inline-block; background: #15130f; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">Redefinir senha</a>
        <p style="color: #666; font-size: 14px;">Este link expira em 1 hora. Se você não solicitou, ignore este e-mail.</p>
      </div>
    `,
  });
}

export async function sendOrderConfirmationEmail(to, orderDetails) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: `Pedido #${orderDetails.orderId} confirmado — Glam Boutique`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #15130f;">Pedido Confirmado!</h1>
        <p>Seu pedido <strong>#${orderDetails.orderId}</strong> foi recebido.</p>
        <p><strong>Total:</strong> ${orderDetails.total}</p>
        <p>Você receberá atualizações sobre o envio por e-mail.</p>
        <p style="color: #666;">Obrigado por comprar na Glam Boutique!</p>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(to, name) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: 'Bem-vindo à Glam Boutique!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #15130f;">Bem-vindo(a), ${name}!</h1>
        <p>Sua conta na Glam Boutique foi criada com sucesso.</p>
        <p>Aproveite nossas coleções exclusivas e frete grátis acima de R$ 299!</p>
      </div>
    `,
  });
}
