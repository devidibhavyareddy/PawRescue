import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import Animal from "./models/Animal.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, ".env") });

const animals = [
  {
    name: "Buddy",
    type: "Dog",
    age: 3,
    gender: "Male",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80",
    description: "Friendly Labrador mix who loves people and playtime.",
    story: "Rescued from a shelter and ready for a loving home.",
    status: "Ready For Adoption",
  },
  {
    name: "Mittens",
    type: "Cat",
    age: 2,
    gender: "Female",
    image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800&q=80",
    description: "Affectionate cat who likes to curl up in your lap.",
    story: "Found as a stray and now looking for a forever family.",
    status: "Ready For Adoption",
  },
  {
    name: "Polly",
    type: "Bird",
    age: 1,
    gender: "Female",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    description: "Talkative and curious parrot with a bright personality.",
    story: "Rescued from an unsafe environment and thriving in care.",
    status: "Under Care",
  },
  {
    name: "Shadow",
    type: "Other",
    age: 4,
    gender: "Male",
    image: "https://images.unsplash.com/photo-1516972810927-80185027ca84?auto=format&fit=crop&w=800&q=80",
    description: "Gentle rabbit who enjoys quiet time and carrots.",
    story: "Picked up as a lost pet and ready to settle in.",
    status: "Ready For Adoption",
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    const existing = await Animal.countDocuments();
    if (existing > 0) {
      console.log(`Database already has ${existing} animals. Seed skipped.`);
      process.exit(0);
    }

    const created = await Animal.insertMany(animals);
    console.log(`Inserted ${created.length} animals.`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
