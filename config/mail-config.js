module.exports = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
      user: 'nvminh023@gmail.com',
      pass: process.env.PASS_SMTP 
  }
};
