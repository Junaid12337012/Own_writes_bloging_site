import axios from 'axios';

export const keepAlive = () => {
  const url = 'https://tracks-your-habit.onrender.com/ping'; // your deployed site URL

  setInterval(async () => {
    try {
      const res = await axios.get(url);
      console.log(`🔁 Keep-alive ping success: ${res.status} ${res.statusText}`);
    } catch (err: any) {
      console.error('⚠️ Keep-alive ping failed:', err?.message || err);
    }
  }, 5 * 60 * 1000); // every 5 minutes
};
