import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const config: Record<string, any> = {
  ...process.env,
  FACTORY_ADDRESS: {
    56: process.env.NEXT_PUBLIC_FACTORY_ADDRESS_56,
    97: process.env.NEXT_PUBLIC_FACTORY_ADDRESS_97,
    1337: process.env.NEXT_PUBLIC_FACTORY_ADDRESS_1337,
  },
  PRIVATE_KEY: {
    56: process.env.PRIVATE_KEY_56,
    97: process.env.PRIVATE_KEY_97,
    1337: process.env.PRIVATE_KEY_1337,
  },
};

export default config;
