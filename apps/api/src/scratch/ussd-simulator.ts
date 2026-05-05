import axios from 'axios';
import * as readline from 'readline';

const API_URL = 'http://localhost:3000/api/v1/ussd/callback';
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let sessionId = `test_${Math.floor(Math.random() * 100000)}`;
let phoneNumber = '+256701234567';
let text = '';

async function runSession() {
  console.log('\n--- WETLABS USSD SIMULATOR (DIALING *284#) ---\n');

  while (true) {
    try {
      const response = await axios.post(API_URL, {
        sessionId,
        phoneNumber,
        text
      }, {
        headers: {
          'x-app-hmac': 'dummy_AT_hmac_secret' // Mock HMAC validation
        }
      });

      const menuText = response.data;
      console.log(`\n[PHONE SCREEN]\n------------------\n${menuText}\n------------------`);

      if (menuText.startsWith('END')) {
        console.log('\nSession terminated by server.\n');
        break;
      }

      const input = await new Promise<string>((resolve) => {
        rl.question('\nEnter input: ', resolve);
      });

      if (input.toLowerCase() === 'exit') break;

      // AT formatting: text builds up like '1', '1*2', '1*2*1'
      text = text ? `${text}*${input}` : input;

    } catch (error: any) {
      console.error('\n[ERROR]', error.response?.data || error.message);
      break;
    }
  }

  rl.close();
}

runSession();
