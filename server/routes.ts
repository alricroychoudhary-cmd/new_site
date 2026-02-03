import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post(api.auth.login.path, async (req, res) => {
    try {
      const input = api.auth.login.input.parse(req.body);
      const user = await storage.getUserByMobile(input.mobileNo);
      
      if (!user || user.password !== input.password) {
        // In a real app, use hashed passwords!
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      res.json(user);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ 
          message: err.errors[0].message,
          field: err.errors[0].path.join('.')
        });
      }
      throw err;
    }
  });

  app.post(api.auth.register.path, async (req, res) => {
    try {
      const input = api.auth.register.input.parse(req.body);
      
      const existing = await storage.getUserByMobile(input.mobileNo);
      if (existing) {
        return res.status(400).json({ message: "Mobile number already registered" });
      }

      const user = await storage.createUser(input);
      res.status(201).json(user);
    } catch (err) {
       if (err instanceof z.ZodError) {
        return res.status(400).json({ 
          message: err.errors[0].message,
          field: err.errors[0].path.join('.')
        });
      }
      throw err;
    }
  });

  // Seed database
  await seedDatabase();

  return httpServer;
}

export async function seedDatabase() {
  const existingUser = await storage.getUserByMobile("770000000");
  if (!existingUser) {
    await storage.createUser({
      mobileNo: "770000000",
      password: "password123",
      name: "Demo User"
    });
  }
}
