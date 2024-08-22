import { PhoneCallFormData } from "@/app/aiphone/components/PhoneCallPhoneNumber";

const VAPI_PRIVATE_KEY = process.env.VAPI_PRIVATE_KEY;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

export async function startCallService(data: PhoneCallFormData) {
  console.log('startCallService called at:', new Date().toISOString());
  console.log('Call data:', JSON.stringify(data, null, 2));
  
  if (!VAPI_PRIVATE_KEY || !TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    throw new Error("Missing environment variables");
  }

  const phoneNumberResponse = await fetch('https://api.vapi.ai/phone-number/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${VAPI_PRIVATE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      number: '+12564726229',
      name: 'contact',
      twilioAccountSid: TWILIO_ACCOUNT_SID,
      twilioAuthToken: TWILIO_AUTH_TOKEN,
      provider: "twilio"
    })
  });

  if (!phoneNumberResponse.ok) {
    throw new Error(`HTTP error! status: ${phoneNumberResponse.status}`);
  }

  const phoneNumberData = await phoneNumberResponse.json();

  const callResponse = await fetch('https://api.vapi.ai/call/phone', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${VAPI_PRIVATE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...data,
      customer: {
        number: '+62' + data.customer.number
      },
      phoneNumber: {
        twilioPhoneNumber: TWILIO_PHONE_NUMBER,
        twilioAccountSid: TWILIO_ACCOUNT_SID,
        twilioAuthToken: TWILIO_AUTH_TOKEN,
      },
      phoneNumberId: phoneNumberData.id,
      assistant: {
        ...data.assistant,
        model: {
          ...data.assistant.model,
          systemPrompt: `${data.assistant.name} is a sophisticated AI training assistant...` // Add the full system prompt here
        }
      }
    })
  });

  if (!callResponse.ok) {
    throw new Error(`HTTP error! status: ${callResponse.status}`);
  }

  return await callResponse.json();
}