import { ZodError } from "zod";

export function validate(schema) {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const isDefaultError = error.issues[0].message.startsWith("Invalid input");
        const message = isDefaultError? `${error.issues[0].path}: ${error.issues[0].message}`: error.issues[0].message;
        res.status(400).json({ message });
        return;
      }

      res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
  };
}

export function validateParams(schema) {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req.params);
      req.params = parsed
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const isDefaultError = error.issues[0].message.startsWith("Invalid input");
        const message = isDefaultError? `${error.issues[0].path}: ${error.issues[0].message}`: error.issues[0].message;
        
        res.status(400).json({ message });
        return;
      }

      res.status(500).json({ message: "Something went wrong. Please try again later." });
    }
  };
}