import MailConfig from '../config/mail-config';
import nodeMailer from 'nodemailer';

export default class MailService {

  static async sendMail(fromInfo, toMail, subject, text, html) {
    const transporter = nodeMailer.createTransport(MailConfig);
    const mailOptions = {
      from: fromInfo || '"Fred Foo 👻" <foo@example.com>', // sender address
      to: toMail || "zukiboom@gmail.com", // list of receivers
      subject: subject || "Hello ✔", // Subject line
      text: text || "Hello world?", // plain text body
      html: html || "<b>Hello world?</b>" // html body
    };
    return transporter.sendMail(mailOptions);
  }
}
