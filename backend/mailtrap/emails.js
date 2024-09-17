import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js"
import { mailTrapClient  ,sender } from "./mailtrap.config.js"


export const sendVerificationToken=async(email , verificationToken)=>{
    const recipient=[{email}]
    try {
        
        const response = await mailTrapClient.send({
            from:sender,
            to:recipient,
            subject:"Verify your email",
            html:VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}',verificationToken),
            category:"Verification Email"

            

        })
        console.log('Email sent successfully' ,response);
    } catch (error) {
      console.log("Unable to send verification email");
        throw new Error( "Unable to send Verification  email",error);
      
        
    }


}
export const sendWelcomeEmail=async(email , name)=>{
    const recipient=[{email}]
    try {
        const response =await mailTrapClient.send({
            from:sender ,
            to:recipient,
            template_uuid: "46cc7bcd-4442-4e8d-8848-add8204029d9",
            template_variables: {
              "company_info_name": "Quantam Security",
              "company_info_address": "Varanasi , Uttar Pradesh",
              "company_info_city": "Varanasi",
              "company_info_zip_code": "221007",
              "company_info_country": "India"
            }
        })
        console.log(" Welcome Email sent successfully" ,response);
        
    } catch (error) {
        console.log("Unable to send welcome email");
        throw new Error("Unable to send welcome email",error);
        
    }
}
export const sendPasswordResetEmail=async(email ,resetUrl)=>{
    const recipient=[{email}]

    try {
        const response=await mailTrapClient.send({
            from:sender,
            to:recipient ,
            subject:"Reset your  Password Buddy!",
            html:PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}',resetUrl),
            category:"Password Reset "
        })
        console.log('Reset Password Email sent successfully' ,response);
        
        
    } catch (error) {
        console.log("Unable to send Reset Password email");
        throw new Error("Unable to send  Reset Password  email",error);
        
    }

}
export const sendResetSuccessEmail =async(email)=>{
    const recipient=[{email}]
    
    try {
        const response = await mailTrapClient.send({
            from:sender,
            to:recipient,
            subject:"Reset Password Success",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category:"Reset Successfull "
        })
        console.log('Reset Password Email sent successfully' ,response);
        
    } catch (error) {
        
    }
} 