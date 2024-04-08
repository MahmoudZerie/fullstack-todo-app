import * as yup from "yup"

export const registerSchema = yup
  .object({
    username: yup.string().required("Username is reqired!").min(5,"Username should be at least 5 characters."),
	email:yup.string().required("Email is required").matches(/^[^@]+@[^@]+\.[^@ .]{2,}$/,"Not a valid email address."),
	password:yup.string().required("Password is required").min(6,"Password should be at least 6 characters."),
})
  .required()
  export const loginSchema = yup
  .object({
    identifier:yup.string().required("Email is required").matches(/^[^@]+@[^@]+\.[^@ .]{2,}$/,"Not a valid email address."),
	password:yup.string().required("Password is required").min(6,"Password should be at least 6 characters."),
})
  .required()

  
  export const EditValidation = (login: { title: string, description: string }) => {

    const errors: { title: string, description: string } = {
         title: "",
         description: "",
   };

    if (!login.title) {
        errors.title = "Title is required";
    } else if (login.title.length < 3) {
        errors.title = "Title must be at least 5 characters long";
    } 

    if (!login.description) {
        errors.description = "Description is required";
    } else if (login.description.length < 6) {
        errors.description = "Description must be at least 10 characters long";
    } 
    return errors;
}