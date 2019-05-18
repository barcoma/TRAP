import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const { env } = process;

export const MAPBOX_API_KEY = env.MAPBOX_API_KEY;