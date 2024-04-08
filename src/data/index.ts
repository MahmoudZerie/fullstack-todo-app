import { ILoginInput, IRegisterInput } from "../interfaces";

export const REGISTER_FORM:IRegisterInput[]=[
	{
		name:"username",
		placeholder:"Username",
		type:"text",
		validation:{
			reqired:true,
			minLength:5
		}
	},
	{
		name:"email",
		placeholder:"Email address",
		type:"email",
		validation:{
			reqired:true,
			pattern:/^[^@]+@[^@]+\.[^@.]{2,}$/
		}
	},
	{
		name:"password",
		placeholder:"Password",
		type:"text",
		validation:{
			reqired:true,
			minLength:6
		}
	},
]
export const LOGIN_FORM:ILoginInput[]=[
	{
		name:"identifier",
		placeholder:"Email address",
		type:"email",
		validation:{
			reqired:true,
			pattern:/^[^@]+@[^@]+\.[^@.]{2,}$/
		}
	},
	{
		name:"password",
		placeholder:"Password",
		type:"Password",
		validation:{
			reqired:true,
			minLength:6
		}
	},
]