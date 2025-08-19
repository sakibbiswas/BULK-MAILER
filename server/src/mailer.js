
import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';

export function createTransporter({ host, port, secure, user, pass }) {
  return nodemailer.createTransport({
    host,
    port: Number(port),
    secure: String(secure) === 'true',
    auth: { user, pass }
  });
}

export async function sendEmail(transporter, { from, to, subject, html, variables }) {
  // Compile Handlebars template
  const template = Handlebars.compile(html);
  const finalHtml = template(variables || {});

  return transporter.sendMail({ from, to, subject, html: finalHtml });
}


// import nodemailer from 'nodemailer';
// import Handlebars from 'handlebars';

// export function createTransporter({ host, port, secure, user, pass }) {
//   return nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
// }

// export async function sendEmail(transporter, { from, to, subject, html, variables = {} }) {
//   const subjectTemplate = Handlebars.compile(subject || '');
//   const htmlTemplate = Handlebars.compile(html || '');
//   const compiledHtml = htmlTemplate(variables);
//   const compiledSubject = subjectTemplate(variables);

//   return transporter.sendMail({ from, to, subject: compiledSubject, html: compiledHtml });
// }
