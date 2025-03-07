import { maxDate } from "./formatter";

export const accountFormValidation = (values) => {
    const errors = {}


    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const phoneRegex = /^(09|\+639)\d{9}$/

    if (values.firstname === '' || values.firstname === undefined || values.firstname === null) {
        errors.firstname = 'First name is required. Please provide your first name.';
    }
    if (values.lastname === '' || values.lastname === undefined || values.lastname === null) {
        errors.lastname = 'Last name is required. Please provide your last name.';
    }
    if (values.sex === '' || values.sex === undefined || values.sex === null) {
        errors.sex = 'Sex selection is required. Please choose your sex.';
    }
    if (values.username === '' || values.username === undefined || values.username === null) {
        errors.username = 'A username is required. Please enter a username.';
    }
    if (values.birthdate === '' || values.birthdate === undefined || values.birthdate === null) {
        errors.birthdate = 'Birthdate is required. Please select your birthdate.';
    } else if (values.birthdate > maxDate()) {
        errors.birthdate = 'Invalid birthdate. Must be 18 years or older';
    }
    if (values.mobile_num === '' || values.mobile_num === undefined || values.mobile_num === null) {
        errors.mobile_num = 'Mobile number is required. Please provide your contact number.';
    } else if (!phoneRegex.test(values.mobile_num)) {
        errors.mobile_num = 'Invalid mobile number format. Please provide a valid Ph mobile number format that starts with 09.';
    }
    if (values.email === '' || values.email === undefined || values.email === null) {
        errors.email = 'Email address is required. Please provide a valid email address.';
    } else if (!emailRegex.test(values.email)) {
        errors.email = 'Invalid email format. Please provide a valid email.';
    }

    if (values.street === '' || values.street === undefined || values.street === null) {
        errors.street = 'Street address is required. Please provide your street address.';
    }

    return errors;
}


export const passwordValidation = (values) => {
    const errors = {}
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/

    if (values.newPassword === '' || values.newPassword === undefined || values.newPassword === null) {
        errors.newPassword = 'Please provide a new password';
    } else if (!passwordRegex.test(values.newPassword)) {
        errors.newPassword = "Invalid password format.";
    }


    if (values.confirmPass === '' || values.confirmPass === undefined || values.confirmPass === null) {
        errors.confirmPass = 'Please confirm your new password.';
    } else if (values.confirmPass != values.newPassword) {
        errors.confirmPass = 'Password does not match!';
    }else if (!passwordRegex.test(values.confirmPass)) {
        errors.confirmPass = "Invalid password format.";
    }


    return errors

}

export const contentFormValidation = (values) => {
    const errors = {}
    if (values.title === '' || values.title === undefined || values.title === null) {
        errors.title = 'Title is required. Please provide a title.';
    }
    if (values.description === '' || values.description === undefined || values.description === null) {
        errors.description = 'Content description is required. Please provide a description.';
    }
    if (values.type === '' || values.type === undefined || values.type === null) {
        errors.type = 'Type selection is required. Please choose a type of content.';
    }

    return errors;

}
export const feedbackFormValidation = (values) => {
    const errors = {};

    // Standard email regex pattern
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!values.name || values.name.trim() === '') {
        errors.name = 'Please provide your name';
    }

    if (!values.email || values.email.trim() === '') {
        errors.email = 'Email is required. Please provide a valid email.';
    } else if (!emailRegex.test(values.email)) {
        errors.email = 'Invalid email format. Please provide a valid email.';
    }

    if (!values.message || values.message.trim() === '') {
        errors.message = 'Message is required. Please enter your message.';
    }

    return errors;
};

export const isObjEmpty = (obj) => {
    for (const prop in obj) {
        if (Object.hasOwn(obj, prop)) {
            return false;
        }
    }

    return true;
}