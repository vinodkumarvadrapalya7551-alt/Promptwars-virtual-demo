import React, { useState, useEffect, useRef } from 'react';
import { Send, MapPin, Search, Bot, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const ELECTION_STEPS = [
  { id: 1, title: "Voter Registration", desc: "Ensure you are on the electoral roll." },
  { id: 2, title: "Research Candidates", desc: "Understand who is running and their manifestos." },
  { id: 3, title: "Polling Day", desc: "Go to the booth and cast your vote." },
  { id: 4, title: "Results", desc: "Watch the vote count and outcome." }
];

const INITIAL_MESSAGES = [
  { id: 1, sender: 'bot', text: 'Welcome to your Election Education Assistant! I am here to guide you through the democratic process. Are you ready to start with Step 1: Voter Registration?' }
];

const HURDLES = {
  1: {
    title: "Unexpected Hurdle!",
    desc: "Oh no! The deadline for registration is tomorrow, but you can't find your proof of address. What do you do?",
    options: [
      { text: "Give up and not vote this year.", correct: false, feedback: "Every vote counts! Don't give up." },
      { text: "Quickly download a recent bank statement or utility bill online.", correct: true, feedback: "Great! Digital copies are often accepted as proof." }
    ]
  },
  2: {
    title: "Misinformation Alert!",
    desc: "You saw a viral post claiming the election date was moved, but no official news outlets are reporting it. How should you react?",
    options: [
      { text: "Share it with friends so they don't miss the new date.", correct: false, feedback: "Sharing unverified information spreads fake news." },
      { text: "Check the official Election Commission website to verify.", correct: true, feedback: "Perfect! Always verify with official sources." }
    ]
  },
  3: {
    title: "Polling Booth Trouble!",
    desc: "You arrive at the polling booth, but your name is missing from the list despite having a voter ID. What is your next move?",
    options: [
      { text: "Argue with the polling officer.", correct: false, feedback: "Arguing won't help. Officers follow the provided lists." },
      { text: "Ask for the Booth Level Officer (BLO) or check the electoral search online.", correct: true, feedback: "Yes! The BLO can help resolve list discrepancies." }
    ]
  }
};

function App() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [activeHurdle, setActiveHurdle] = useState(null);
  const [hurdleFeedback, setHurdleFeedback] = useState(null);
  const [userVote, setUserVote] = useState(null);
  const [showVotingBooth, setShowVotingBooth] = useState(false);
  
  const CANDIDATES = [
    { id: 'a', name: 'Unity Party', color: '#4F46E5' },
    { id: 'b', name: 'Progress Alliance', color: '#06B6D4' },
    { id: 'c', name: 'Heritage Group', color: '#F43F5E' }
  ];
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    const newUserMsg = { id: Date.now(), sender: 'user', text: inputText };
    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');

    // Simple bot logic
    setTimeout(() => {
      let botResponse = "I understand. Let's keep moving forward with the election process.";
      
      const lowerInput = inputText.toLowerCase();
      if (lowerInput.includes('yes') || lowerInput.includes('ready')) {
        botResponse = `Great! Let's tackle Step ${currentStep}: ${ELECTION_STEPS[currentStep-1].title}. ${ELECTION_STEPS[currentStep-1].desc}`;
        
        // Trigger hurdle randomly or specifically
        if (HURDLES[currentStep]) {
          setTimeout(() => {
            setActiveHurdle(HURDLES[currentStep]);
          }, 2000);
        } else if (currentStep < 4) {
             botResponse += " Ready for the next step?";
        } else {
             botResponse += " Congratulations! You've completed the election journey!";
        }
      } else if (lowerInput.includes('next')) {
        if (currentStep < 4) {
          setCurrentStep(prev => prev + 1);
          botResponse = `Moving to Step ${currentStep + 1}. Are you ready?`;
        } else {
          botResponse = "You have completed all the steps!";
        }
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: botResponse }]);
    }, 1000);
  };

  const handleHurdleChoice = (option) => {
    setHurdleFeedback({ isCorrect: option.correct, message: option.feedback });
    
    setTimeout(() => {
      setHurdleFeedback(null);
      setActiveHurdle(null);
      
      if (option.correct) {
        setMessages(prev => [...prev, { 
          id: Date.now(), 
          sender: 'system', 
          text: `Hurdle cleared! ${option.feedback}` 
        }]);
        
        if (currentStep < 4) {
          setTimeout(() => {
            if (currentStep === 3) {
              setShowVotingBooth(true);
            } else {
              setCurrentStep(prev => prev + 1);
              setMessages(prev => [...prev, { 
                id: Date.now() + 1, 
                sender: 'bot', 
                text: `Awesome job overcoming that! Let's proceed to Step ${currentStep + 1}. Type 'ready' when you want to learn about it.` 
              }]);
            }
          }, 1000);
        }
      } else {
        setMessages(prev => [...prev, { 
          id: Date.now(), 
          sender: 'system', 
          text: `Hurdle failed: ${option.feedback} Let's try that step again.` 
        }]);
      }
    }, 3000);
  };

  return (
    <div className="app-container">
      <header className="header animate-fade-in">
        <h1 className="text-gradient">DemocraGuide</h1>
        <p>Your Interactive Election Process Assistant</p>
      </header>

      <main className="main-content">
        {/* Chat Interface */}
        <div className="glass-panel chat-container animate-slide-left">
          <div className="chat-header">
            <div className="bot-avatar">
              <Bot size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem' }}>Election Assistant</h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>● Online</span>
            </div>
          </div>
          
          <div className="chat-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`message ${msg.sender} animate-fade-in`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <input 
              type="text" 
              className="chat-input" 
              placeholder="Type your message... (e.g. 'ready')" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="send-btn" onClick={handleSend}>
              <Send size={20} />
            </button>
          </div>
        </div>

        {/* Timeline Interface */}
        <div className="glass-panel timeline-container animate-slide-right">
          <h2 className="timeline-title">
            <MapPin size={20} className="text-gradient" />
            Your Voter Journey
          </h2>
          
          <div className="timeline">
            {ELECTION_STEPS.map((step) => {
              let statusClass = '';
              if (step.id === currentStep) statusClass = 'active animate-pulse';
              else if (step.id < currentStep) statusClass = 'completed';
              
              return (
                <div key={step.id} className={`timeline-step ${statusClass}`}>
                  <div className="step-indicator">
                    {step.id < currentStep ? <CheckCircle size={16} /> : step.id}
                  </div>
                  <div className="step-content">
                    <h3 className="step-title">{step.title}</h3>
                    <p className="step-desc">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
          
          {currentStep === 4 && (
            <div className="video-container animate-fade-in" style={{marginTop: '2.5rem', borderTop: '1px solid var(--panel-border)', paddingTop: '1.5rem'}}>
              <h3 className="text-gradient" style={{fontSize: '1.1rem', marginBottom: '1rem', textAlign: 'center'}}>Live Coverage: Election Night</h3>
              <div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px', background: '#000'}}>
                <iframe 
                  src="https://www.youtube.com/embed/S7U8U33KOnY?autoplay=1&mute=1" 
                  title="Election Results" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen 
                  style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}
                ></iframe>
              </div>
              
              <div className="poll-results" style={{marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--panel-border)'}}>
                <h4 style={{fontSize: '0.9rem', marginBottom: '1.5rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  <Search size={16} className="text-gradient" />
                  Live Polling Standings
                </h4>
                {CANDIDATES.map(cand => (
                  <div key={cand.id} style={{marginBottom: '1rem'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.4rem'}}>
                      <span>{cand.name} {userVote === cand.id && <span style={{color: 'var(--success)', marginLeft: '0.5rem'}}>(Your Vote)</span>}</span>
                      <span style={{fontWeight: 'bold'}}>{cand.id === 'a' ? '42%' : cand.id === 'b' ? '35%' : '23%'}</span>
                    </div>
                    <div style={{height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden'}}>
                      <div style={{
                        height: '100%', 
                        width: cand.id === 'a' ? '42%' : cand.id === 'b' ? '35%' : '23%', 
                        background: cand.color,
                        boxShadow: `0 0 10px ${cand.color}80`
                      }}></div>
                    </div>
                  </div>
                ))}
              </div>

              <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1.5rem', textAlign: 'center'}}>
                Congratulations! You've successfully navigated the election process and cast your vote.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Voting Booth Modal */}
      {showVotingBooth && (
        <div className="hurdle-overlay animate-fade-in">
          <div className="hurdle-modal glass-panel animate-fade-in" style={{maxWidth: '600px'}}>
            <div className="hurdle-icon" style={{background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)'}}>
              <CheckCircle size={32} />
            </div>
            <h2 className="hurdle-title text-gradient">The Voting Booth</h2>
            <p className="hurdle-desc">It's time to make your voice heard! Select your candidate from the ballot below.</p>
            
            <div className="hurdle-options" style={{display: 'grid', gridTemplateColumns: '1fr', gap: '1rem'}}>
              {CANDIDATES.map((cand) => (
                <button 
                  key={cand.id} 
                  className="hurdle-btn"
                  onClick={() => {
                    setUserVote(cand.id);
                    setShowVotingBooth(false);
                    setCurrentStep(4);
                    setMessages(prev => [...prev, { 
                      id: Date.now(), 
                      sender: 'bot', 
                      text: `Your vote for ${cand.name} has been cast! Let's watch the results come in.` 
                    }]);
                  }}
                  style={{borderLeft: `4px solid ${cand.color}`}}
                >
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                    <span style={{fontWeight: '600'}}>{cand.name}</span>
                    <span style={{fontSize: '0.7rem', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px'}}>Official Ballot</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hurdle Modal Overlay */}
      {activeHurdle && (
        <div className="hurdle-overlay animate-fade-in">
          <div className="hurdle-modal glass-panel animate-shake">
            <div className="hurdle-icon">
              {hurdleFeedback ? (
                hurdleFeedback.isCorrect ? <CheckCircle size={32} color="var(--success)" /> : <XCircle size={32} color="var(--accent)" />
              ) : (
                <AlertTriangle size={32} />
              )}
            </div>
            
            {!hurdleFeedback ? (
              <>
                <h2 className="hurdle-title text-gradient">{activeHurdle.title}</h2>
                <p className="hurdle-desc">{activeHurdle.desc}</p>
                <div className="hurdle-options">
                  {activeHurdle.options.map((opt, idx) => (
                    <button 
                      key={idx} 
                      className="hurdle-btn"
                      onClick={() => handleHurdleChoice(opt)}
                    >
                      <span style={{fontWeight: 'bold', color: 'var(--primary)'}}>{String.fromCharCode(65 + idx)}.</span> {opt.text}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h2 className="hurdle-title" style={{color: hurdleFeedback.isCorrect ? 'var(--success)' : 'var(--accent)'}}>
                  {hurdleFeedback.isCorrect ? 'Great Choice!' : 'Oops!'}
                </h2>
                <p className="hurdle-desc">{hurdleFeedback.message}</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
