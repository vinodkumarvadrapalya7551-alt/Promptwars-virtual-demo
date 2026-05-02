import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Security Headers (Basic Implementation)
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

app.use(express.json());
app.use(express.static(join(__dirname, 'dist')));

// Mock Database / Data
const DATA = {
  parties: [
    { id: 'bjp', name: 'Bharatiya Janata Party (BJP)', desc: 'Right-wing, conservative, Hindutva-focused.', color: '#FF9933' },
    { id: 'inc', name: 'Indian National Congress (INC)', desc: 'Center-left, big tent, secularism.', color: '#19AAED' },
    { id: 'aap', name: 'Aam Aadmi Party (AAP)', desc: 'Centre-left, anti-corruption, social welfare.', color: '#0072B0' },
    { id: 'cpm', name: 'Communist Party of India (Marxist) (CPM)', desc: 'Left-wing, communist.', color: '#DE0000' }
  ],
  alliances: [
    { name: 'National Democratic Alliance (NDA)', lead: 'BJP', focus: 'Center-right coalition' },
    { name: 'I.N.D.I.A Alliance', lead: 'INC', focus: 'Opposition coalition of 26+ parties' }
  ],
  votes: {
    bjp: 380,
    inc: 280,
    aap: 120,
    cpm: 80
  }
};

// API Endpoints
app.get('/api/init', (req, res) => {
  res.json(DATA);
});

app.post('/api/vote', (req, res) => {
  const { partyId } = req.body;
  if (DATA.votes[partyId] !== undefined) {
    DATA.votes[partyId]++;
    res.json({ success: true, votes: DATA.votes });
  } else {
    res.status(400).json({ success: false, error: 'Invalid party ID' });
  }
});

app.post('/api/chat', (req, res) => {
  const { message, step, voterId } = req.body;
  const lowerMsg = message.toLowerCase();
  
  let response = "I'm processing that information. Let's continue.";
  let nextAction = null;

  if (lowerMsg.includes('ready') || lowerMsg.includes('yes')) {
    if (step === 1 && !voterId) {
      response = "Excellent! To begin Step 1: Voter Registration, please enter your Voter ID number.";
      nextAction = 'AWAIT_VOTER_ID';
    } else {
      response = "Great! Let's move to the next stage of your voter journey.";
    }
  }

  res.json({ response, nextAction });
});

app.use((req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
