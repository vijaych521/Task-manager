const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendSgEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'vijaych521@gmail.com',
        subject: 'Welcome To Task manager App',
        text: `
        We are happy to see you ${name} with us !!
        Welcome you to Our Family !!
        
        Thanks and Regards
        Team Task App`
    })
}

const sendCancleEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'vijaych521@gmail.com',
        subject: 'See you soon !',
        text: `
        We are sad to leave you ${name} !!
        We wish you see you again soon !!
        
        Thanks and Regards
        Team Task App`
    })
}

module.exports = {
    sendSgEmail: sendSgEmail,
    sendCancleEmail: sendCancleEmail
}