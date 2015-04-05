var nodemailer = require('nodemailer');
var config = require('./env');

exports.suffle = function(arr) {
  for(var j, x, i = arr.length; i; 
    j = Math.floor(Math.random() * i), 
    x = arr[--i], arr[i] = arr[j], arr[j] = x);
  return arr;
}

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: config.gmail.user,
        pass: config.gmail.password
    }
});

exports.sendEmail = function(params, cb) {
  var subject = params.subject || '';
  var body = (params.body + ' \n tipo '+ params.type + '\n feel:' +params.feel)
              || '';
  var mailOptions = {
    from: "Nohaybasico <jcdevelopment1991@gmail.com>",
    to: config.gmail.to,
    subject: "Nohaybasico "+ subject,
    text: body,
    html: body
  };
  transporter.sendMail(mailOptions, cb);
}