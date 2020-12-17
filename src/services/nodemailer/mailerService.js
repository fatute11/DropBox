const transporter = require("./transport")
const ejs = require('ejs');

let path = require('path');
let appDir = path.dirname(require.main.filename);

const mailerService = {
    forgotPassword: (token, email) => {
        sendForgotPassword(token, email)
    }
}

module.exports = mailerService;

async function sendForgotPassword(token, email) {
    let info = transporter.sendMail({
        from: '"L\'Équipe Projet Dropbox" <no-reply@dropbox-project.com>', 
        to: email, 
        subject: "Changez votre mot de passe Dropbox-project", 
        html: await ejs.renderFile(appDir+'/public/forgot-password.ejs', { link: token }, 'utf8')
    });
}

