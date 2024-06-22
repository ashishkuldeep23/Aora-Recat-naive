

export const ADMIN_EMAILS = [
    "ashishkuldeep6@gmail.com",
    "ashishkuldeep08@gmail.com",
]



export const Default_user_email = "ashishkuldeep6@gmail.com";
export const Default_user_pass = '123456789';


const PASS_REGEX = (/^((?=.*[\d])(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\d\s])|(?=.*[\d])(?=.*[A-Z])(?=.*[^\w\d\s])|(?=.*[\d])(?=.*[a-z])(?=.*[^\w\d\s])).{6,30}$/)

// export function checkPassValueWithRegex(passStr) {
//     return PASS_REGEX.test(passStr)
// }

export const checkPassValueWithRegex = (passStr) => PASS_REGEX.test(passStr);



const EMAIL_REGEX = (/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)


// export function checkEmailValueWithRegex(email) {
//     return EMAIL_REGEX.test(email)
// }

export const checkEmailValueWithRegex = (email) => EMAIL_REGEX.test(email);


const USER_NAME_REGEX = (/^[a-zA-Z]+([\s][a-zA-Z]+)*$/)


export const checkUserNameValueWithRegex = (name) => USER_NAME_REGEX.test(name);