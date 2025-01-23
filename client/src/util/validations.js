export const accountFormValidation = (values)=>{
    const errors = {}
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
    }
    if (values.mobile_num === '' || values.mobile_num === undefined || values.mobile_num === null) {
        errors.mobile_num = 'Mobile number is required. Please provide your contact number.';
    }
    if (values.email === '' || values.email === undefined || values.email === null) {
        errors.email = 'Email address is required. Please provide a valid email address.';
    }
    if (values.street === '' || values.street === undefined || values.street === null) {
        errors.street = 'Street address is required. Please provide your street address.';
    }

    return errors;
}

export const contentFormValidation = (values) =>{
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

export const  isObjEmpty = (obj) => {
    for (const prop in obj) {
      if (Object.hasOwn(obj, prop)) {
        return false;
      }
    }
  
    return true;
  }