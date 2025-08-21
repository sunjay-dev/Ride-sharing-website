const { z } = require("zod");
const mongoose = require("mongoose");

const nameRegex = /^[A-Za-z\s]+$/;
const departmentRegex = /^[A-Za-z\s]+$/;

const registerSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required")
  .regex(nameRegex, "Please enter a valid first name"),

  lastName: z.string().trim().min(1, "Last name is required")
  .regex(nameRegex, "Please enter a valid last name"),
  
  email: z.email("Invalid email format")
    .regex(/^[a-zA-Z0-9._%+-]+@students\.muet\.edu\.pk$/, "Email must be a valid @students.muet.edu.pk email"),
  
  password: z.string().min(6, "Password must be at least 6 characters"),
  
  phone: z.string()
    .trim()
    .regex(/^\d{11}$/, "Please enter a valid email"),
  
  department: z.string().trim().min(1, "Please enter department")
  .regex(departmentRegex, "Please enter valid deperatment"),
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

const resetPasswordSchema = z.object({
  password: z.string().min(1, "Please enter password"),
  token: z.string().refine((val) => val.split(".").length === 3, {
          message: "Invalid reset token",
      }),
});

module.exports = {registerSchema, loginSchema, forgetPasswordSchema, resetPasswordSchema}