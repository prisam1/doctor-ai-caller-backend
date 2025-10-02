const Retell = require("retell-sdk");
const client = new Retell({ apiKey: process.env.RETELL_API_KEY });

async function createWebCallSession({  patientId, name, dob }) {
  return client.call.createWebCall({
    agent_id: process.env.RETELL_AGENT_ID,
    metadata: {
      patientId,
      customer_name: name,
      dob,
    },
  });
}

module.exports = { createWebCallSession };

// const axios = require("axios");

// const RETELL_API_URL = "https://api.retellai.com/v2";
// const RETELL_API_KEY = process.env.RETELL_API_KEY; // store in .env

// Create Web Call
// async function createWebCallSession(patientName, dob) {
//   try {
//     const response = await axios.post(
//       `${RETELL_API_URL}/create-web-call`,
//       {
//         agent_id: process.env.RETELL_AGENT_ID, // configure in .env
//         metadata: {
//           customer_name: patientName,
//           dob,
//         },
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${RETELL_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     return response.data;
//   } catch (err) {
//     console.error(
//       "Error creating Retell web call:",
//       err.response?.data || err.message
//     );
//     throw new Error("Failed to create web call");
//   }
// }

// module.exports = { createWebCallSession };
