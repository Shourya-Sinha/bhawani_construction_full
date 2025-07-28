import otpGenerator from "otp-generator";

export const GenerateOtp = () =>{
    return otpGenerator.generate(6,{
        digits:true,
        specialChars:false,
        lowerCaseAlphabets:false,
        upperCaseAlphabets:false
    });
};