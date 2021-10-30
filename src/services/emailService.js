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
    from: '"Bookingcare Clone" <Bookingcare_Clone@gmail.com>', // sender address
    to: dataSend?.receiverEmail, // list of receivers
    subject: 'Thông tin đặt lịch khám bệnh 📩', // Subject line
    text: 'Thông tin đặt lịch khám bệnh 📩', // plain text body
    html: `
    <h3>Xin chào ${dataSend?.receiverEmail}!</h3>
    <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên trang web Bookingcare Clone</p>
    <p>Thông tin đặt lịch khám bệnh:</p>
    <div><b>Thời gian: ${dataSend?.time}</b></div>
    <div><b>Bác sĩ: ${dataSend?.doctorName}</b></div>
    
    <p>Nếu các thông tin trên là đúng sự thật, vui lòng click vào đường link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh.</p>
    <div><a href=${dataSend?.redirectLink} target="_blank">Click here</a></div>
    
    <div>Xin chân thành cảm ơn đã sử dụng dịch vụ của chúng tôi.</div>`, // html body
  });
};

let sendAttachment = async (dataSend) => {
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
    from: '"Bookingcare Clone" <Bookingcare_Clone@gmail.com>', // sender address
    to: dataSend?.email, // list of receivers
    subject: 'Thông tin hóa đơn khám bệnh', // Subject line
    text: 'Thông tin hóa đơn khám bệnh', // plain text body
    html: `
    <h3>Xin chào ${dataSend?.patientName}!</h3>
    <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên trang web Bookingcare Clone</p>
    <p>Thông tin đơn thuốc hoặc hóa đơn được gửi trong file đính kèm</p>
    <p>Xin chân thành cảm ơn đã sử dụng dịch vụ của chúng tôi.</p>`, // html body
    attachments: [
      {
        filename: `hoa-don-${dataSend.patientId}-${new Date().getTime()}.png`,
        content: dataSend.imageBase64.split('base64,')[1],
        encoding: 'base64',
      },
    ],
  });
};

module.exports = {
  sendSimpleEmail,
  sendAttachment,
};
