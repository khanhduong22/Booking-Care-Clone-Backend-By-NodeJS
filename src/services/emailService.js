require('dotenv').config();
const nodemailer = require('nodemailer');

let sendSimpleEmail = async (dataSend) => {
  // let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Bookingcare Clone 👻" <MoiTapDev@gmail.com>', // sender address
    to: dataSend.receiverEmail, // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Thong tin dat lich kham benh', // plain text body
    html: `${dataSend.redirectLink}`, // html body
  });
};

module.exports = {
  sendSimpleEmail,
};
