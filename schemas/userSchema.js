const { z } = require("zod");

const registerSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.email("Invalid email format")
    .regex(/^[a-zA-Z0-9._%+-]+@students\.muet\.edu\.pk$/, "Email must be a valid @students.muet.edu.pk email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string()
    .trim()
    .regex(/^\d{11}$/, "Phone must be 11 digits"),
  department: z.string().trim().min(1, "Department is required"),
});

const loginSchema = z.object({
  email: z.email("Invalid email format")
    .regex(/^[a-zA-Z0-9._%+-]+@students\.muet\.edu\.pk$/, "Email must be a valid @students.muet.edu.pk email"),
  password: z.string().min(1, "Please enter password")
});

const forgetPasswordSchema = z.object({
  email: z.email("Invalid email format")
    .regex(/^[a-zA-Z0-9._%+-]+@students\.muet\.edu\.pk$/, "Email must be a valid @students.muet.edu.pk email"),
});



module.exports = {registerSchema, loginSchema, forgetPasswordSchema}