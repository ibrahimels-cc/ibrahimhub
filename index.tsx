
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Type } from "@google/genai";

// --- API Initialization ---
// Safely access env var to prevent crash on static hosts
const getApiKey = () => {
  try {
    return process.env.API_KEY || '';
  } catch (e) {
    return '';
  }
};
const ai = new GoogleGenAI({ apiKey: getApiKey() });

// --- Translations ---
const translations = {
  ar: {
    nav: {
      home: 'الرئيسية',
      about: 'عن المطور',
      services: 'الخدمات',
      games: 'ألعاب الذكاء',
      tools: 'أدوات AI',
      contact: 'اتصل بي'
    },
    home: {
      subtitle: 'Full Stack Cyber-Architect',
      desc: 'نصمم واجهات الغد، اليوم. دمج سلس بين الذكاء الاصطناعي والإبداع البشري لبناء تجارب ويب حية تتجاوز المألوف.',
      btnService: 'استكشف المستقبل',
      btnContact: 'ابدأ المهمة'
    },
    about: {
      title: 'عن إبراهيم',
      subtitle: 'مهندس الواقع الرقمي ومصمم خوارزميات',
      bio: 'إبراهيم، مطور برمجيات بعقلية المستقبل. متخصص في دمج خوارزميات الذكاء الاصطناعي (Gemini) داخل النسيج الرقمي للمواقع. شغفي هو تحويل الشيفرات البرمجية إلى كيانات ذكية تتفاعل معك، وبناء أنظمة تتطور باستمرار.',
      stats: {
        exp: 'سنوات ضوئية خبرة',
        proj: 'نظام مكتمل',
        client: 'شريك نجاح',
        code: 'سطر شيفرة'
      },
      skillsTitle: 'الترسانة التقنية',
      timelineTitle: 'سجل المهام',
      timeline: [
        { year: '2024', role: 'AI Integration Specialist', desc: 'تطوير بروتوكولات دمج Gemini في الأنظمة السحابية.' },
        { year: '2023', role: 'Senior Full Stack Developer', desc: 'قيادة وحدات التطوير وبناء منصات مركزية.' },
        { year: '2021', role: 'Freelance Web Architect', desc: 'هندسة حلول رقمية لمشاريع عابرة للحدود.' },
        { year: '2019', role: 'System Initialization', desc: 'بداية الرحلة في عالم الكود والبيانات.' }
      ],
      btnCV: 'تحميل البيانات (CV)'
    },
    services: {
      title: 'الخدمات المتقدمة',
      s1: { title: 'هندسة الواجهات', desc: 'تصميم واجهات سيبرانية تفاعلية تضمن تجربة مستخدم فائقة.' },
      s2: { title: 'تطوير الأنظمة', desc: 'بناء تطبيقات ويب قوية باستخدام أحدث تقنيات React و Node.js.' },
      s3: { title: 'الهوية الرقمية', desc: 'تصميم بصمة بصرية فريدة تعكس جوهر مشروعك في الفضاء الرقمي.' },
      s4: { title: 'البروتوكولات الأمنية', desc: 'تحسين أداء الأنظمة وتدريعها لضمان الكفاءة القصوى.' }
    },
    games: {
      title: 'منطقة المحاكاة (AI Zone)',
      subtitle: 'تجارب تفاعلية مدعومة بالعقل الإلكتروني Gemini',
      back: '← العودة للقاعدة',
      loadingAI: 'جاري الاتصال بالشبكة العصبية...',
      g1: { title: 'XO المستحيلة', desc: 'تحدى خوارزمية فائقة.', instr: 'حاول هزيمة العقل الإلكتروني!', win: 'خطأ في النظام! فزت؟', lose: 'الذكاء الاصطناعي سيطر!', draw: 'تعادل قدرات' },
      g2: { title: 'Data Puzzle', desc: 'رتب وحدات البيانات.', instr: 'أعد ترتيب التسلسل الرقمي', win: 'تم استعادة البيانات!', shuffle: 'إعادة خلط' },
      g4: { title: 'مؤلف القصص', desc: 'حدد المعطيات، والـ AI ينسج الواقع.', genre: 'التصنيف', char: 'البطل', place: 'البيئة', generate: 'بدء التوليد', placeholder: 'مثال: سايبربانك، إبراهيم، نيو-طوكيو' },
      g5: { title: 'اختبار المعرفة', desc: 'تحدى قاعدة بياناتك العقلية.', topic: 'الموضوع', startQ: 'بدء الاختبار', score: 'نقاط الخبرة', next: 'السؤال التالي' },
      g6: { title: 'تواصل افتراضي', desc: 'محادثة مع كيانات محاكاة.', select: 'الكيان', characters: { hero: 'بطل خارق', wizard: 'حكيم رقمي', robot: 'روبوت T-800', detective: 'محقق سيبراني' }, send: 'إرسال', typeMsg: 'أدخل البيانات...' },
      g7: { title: 'المتاهة الرقمية', desc: 'مسارات تتولد خوارزمياً.', solve: 'استخدم المفاتيح للوصول للهدف.', newMaze: 'توليد مسار' },
      g8: { title: 'الأحاجي المستحيلة', desc: 'ألغاز لا نهائية من العقل المركزي.', level: 'المستوى', yourAns: 'تحليلك...', submit: 'تحقق', hint: 'تلميح', correct: 'إجابة دقيقة! المستوى التالي...', wrong: 'تحليل خاطئ', loading: 'جاري استدعاء لغز معقد...' },
      g9: { title: 'خمن الفيلم', desc: 'تشفير الأفلام بالرموز.', new: 'فيلم جديد', reveal: 'فك التشفير', guessPlaceholder: 'عنوان الفيلم...', check: 'فحص', correct: 'مطابقة تامة! إنه:', wrong: 'خطأ في المطابقة' }
    },
    tools: {
      title: 'أدوات الإنتاجية الذكية',
      subtitle: 'اصنع، ابتكر، وتحدث مع المستقبل',
      copyright: 'جميع الحقوق محفوظة في الفضاء الرقمي لـ Ibrahim',
      chat: {
        title: 'المساعد الذكي',
        desc: 'مساعدك الشخصي المتصل بالشبكة.',
        placeholder: 'أدخل استفسارك...',
        send: 'بث'
      },
      builder: {
        title: 'منشئ المواقع الفوري',
        desc: 'صف الموقع، وسأقوم ببناء الهيكل البرمجي.',
        placeholder: 'أريد واجهة تحكم لمركبة فضائية...',
        generate: 'توليد الكود',
        preview: 'معاينة النظام',
        download: 'تصدير الملف',
        code: 'الكود المصدري'
      },
      comic: {
        title: 'صانع القصص المصورة',
        desc: 'حول أفكارك إلى صفحات كوميكس بصرية.',
        placeholder: 'وصف المشهد (مثال: بطل خارق يطير فوق مدينة مستقبلية)...',
        generate: 'رسم الكوميك',
        loading: 'جاري تحبير الصفحات...'
      }
    },
    contact: {
      title: 'بدء الاتصال',
      subtitle: 'لنحول فكرتك إلى واقع ملموس.',
      name: 'المعرف (الاسم)',
      email: 'نقطة الاتصال (البريد)',
      msg: 'الرسالة المشفرة',
      btn: 'إرسال عبر القناة الآمنة'
    }
  }
};

// --- Icons (SVG) ---
const Icons = {
  Home: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
  Menu: () => <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>,
  X: () => <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
  Globe: () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>,
  Bot: () => <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg>,
  Layout: () => <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>,
  Layers: () => <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>,
  Code: () => <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>,
  PenTool: () => <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>,
  Cpu: () => <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>,
  GitHub: () => <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>,
  Linkedin: () => <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>,
  Image: () => <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
};

// --- Star Background ---
const StarBackground = () => {
  const stars = useMemo(() => {
    const gen = (n: number) => {
      let v = '';
      for (let i = 0; i < n; i++) v += `${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px #FFF, `;
      return v.slice(0, -2);
    };
    return { s: gen(700), m: gen(200), l: gen(100) };
  }, []);

  const Layer = ({ s, b, d }: { s: number, b: string, d: string }) => (
    <div style={{ position: 'absolute', width: '100%', height: '100%', animation: `star-move ${d} linear infinite` }}>
      <div style={{ width: s, height: s, background: 'transparent', boxShadow: b, position: 'absolute' }}></div>
      <div style={{ width: s, height: s, background: 'transparent', boxShadow: b, position: 'absolute', top: '2000px' }}></div>
    </div>
  );

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <Layer s={1} b={stars.s} d="150s" />
      <Layer s={2} b={stars.m} d="100s" />
      <Layer s={3} b={stars.l} d="50s" />
    </div>
  );
};

// --- Cursor Glow Effect (New) ---
const CursorGlow = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  
  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      left: 0, top: 0,
      transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
      width: '0px', height: '0px',
      pointerEvents: 'none',
      zIndex: 9999,
      // Large glow effect centered on the cursor
      boxShadow: '0 0 120px 60px rgba(0, 243, 255, 0.15), 0 0 50px 30px rgba(188, 19, 254, 0.1)',
      transition: 'transform 0.05s linear'
    }}></div>
  );
};

// --- Logic for Games ---
const calculateWinner = (squares: any[]) => {
  const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
  }
  return null;
};
const minimax = (board: any[], depth: number, isMaximizing: boolean) => {
  const winner = calculateWinner(board);
  if (winner === 'O') return 10 - depth;
  if (winner === 'X') return depth - 10;
  if (!board.includes(null)) return 0;
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) { board[i] = 'O'; bestScore = Math.max(minimax(board, depth + 1, false), bestScore); board[i] = null; }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) { board[i] = 'X'; bestScore = Math.min(minimax(board, depth + 1, true), bestScore); board[i] = null; }
    }
    return bestScore;
  }
};
const getBestMove = (board: any[]) => {
  let bestScore = -Infinity; let move = -1;
  for (let i = 0; i < 9; i++) {
    if (board[i] === null) { board[i] = 'O'; const score = minimax(board, 0, false); board[i] = null; if (score > bestScore) { bestScore = score; move = i; } }
  }
  return move;
};

// --- Games ---
const TicTacToe = ({ t }: { t: any }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);

  const handleClick = (i: number) => {
    if (winner || board[i] || !isXNext) return;
    const newBoard = [...board]; newBoard[i] = 'X'; setBoard(newBoard);
    const win = calculateWinner(newBoard);
    if (win) setWinner(win); else if (!newBoard.includes(null)) setWinner('Draw'); else setIsXNext(false);
  };
  useEffect(() => {
    if (!isXNext && !winner) {
      setTimeout(() => {
        const bestMove = getBestMove([...board]);
        if (bestMove !== -1) {
          const newBoard = [...board]; newBoard[bestMove] = 'O'; setBoard(newBoard);
          const win = calculateWinner(newBoard);
          if (win) setWinner(win); else if (!newBoard.includes(null)) setWinner('Draw');
          setIsXNext(true);
        }
      }, 500);
    }
  }, [isXNext, winner, board]);

  return (
    <div style={{textAlign: 'center'}}>
      <h3 className="glow-text-purple">{t.title}</h3>
      <p style={{color: '#888', marginBottom: '15px'}}>{t.instr}</p>
      {winner && <div style={{fontSize: '1.5rem', color: '#00eaff', marginBottom: '10px'}}>{winner === 'Draw' ? t.draw : winner === 'X' ? t.win : t.lose}</div>}
      <div className="game-board" style={{gridTemplateColumns: 'repeat(3, 80px)', justifyContent: 'center'}}>
        {board.map((cell, i) => (
          <div key={i} className="tictactoe-cell" onClick={() => handleClick(i)} style={{color: cell === 'X' ? '#00eaff' : '#bc13fe'}}>
            {cell}
          </div>
        ))}
      </div>
      <button className="btn-neon" onClick={() => { setBoard(Array(9).fill(null)); setIsXNext(true); setWinner(null); }}>Restart</button>
    </div>
  );
};

const SlidingPuzzle = ({ t }: { t: any }) => {
  const [tiles, setTiles] = useState<(number | null)[]>([1, 2, 3, 4, 5, 6, 7, 8, null]);
  const [isSolved, setIsSolved] = useState(false);
  const shuffle = () => {
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, null];
    for (let i = 0; i < 50; i++) {
      const nullIdx = arr.indexOf(null);
      const neighbors = [nullIdx - 1, nullIdx + 1, nullIdx - 3, nullIdx + 3].filter(idx => idx >= 0 && idx < 9 && !(nullIdx % 3 === 0 && idx === nullIdx - 1) && !((nullIdx + 1) % 3 === 0 && idx === nullIdx + 1));
      const swapIdx = neighbors[Math.floor(Math.random() * neighbors.length)];
      [arr[nullIdx], arr[swapIdx]] = [arr[swapIdx], arr[nullIdx]];
    }
    setTiles(arr); setIsSolved(false);
  };
  const moveTile = (index: number) => {
    const emptyIndex = tiles.indexOf(null);
    const validMoves = [emptyIndex - 1, emptyIndex + 1, emptyIndex - 3, emptyIndex + 3];
    if (emptyIndex % 3 === 0 && index === emptyIndex - 1) return;
    if ((emptyIndex + 1) % 3 === 0 && index === emptyIndex + 1) return;
    if (validMoves.includes(index)) {
      const newTiles = [...tiles]; [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      if (JSON.stringify(newTiles) === JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8, null])) setIsSolved(true);
    }
  };
  return (
    <div style={{textAlign: 'center'}}>
      <h3 className="glow-text-purple">{t.title}</h3>
      {isSolved && <p style={{color: '#00eaff'}}>{t.win}</p>}
      <div className="game-board" style={{gridTemplateColumns: 'repeat(3, 80px)', justifyContent: 'center'}}>
        {tiles.map((tile, i) => (
          <div key={i} className={`puzzle-tile ${tile === null ? 'puzzle-empty' : ''}`} onClick={() => tile !== null && moveTile(i)}>{tile}</div>
        ))}
      </div>
      <button className="btn-neon" onClick={shuffle}>{t.shuffle}</button>
    </div>
  );
};

// --- AI Games Components ---
const AIStoryGame = ({ t, lang }: { t: any, lang: string }) => {
  const [state, setState] = useState({ genre: '', char: '', place: '', story: '', loading: false });
  const generate = async () => {
    if (!state.genre || !state.char) return;
    setState(s => ({ ...s, loading: true, story: '' }));
    try {
      const prompt = lang === 'ar' ? `قصة قصيرة جدا عن ${state.char} في ${state.place} نوع ${state.genre}.` : `Short story about ${state.char} in ${state.place}, genre ${state.genre}.`;
      const res = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
      setState(s => ({ ...s, story: res.text || '', loading: false }));
    } catch { setState(s => ({ ...s, loading: false })); }
  };
  return (
    <div>
      <h3 className="glow-text-purple">{t.title}</h3>
      <div style={{display:'grid', gap:'10px', margin:'20px 0'}}>
        <input className="cyber-input" placeholder={t.genre} value={state.genre} onChange={e=>setState(s=>({...s, genre:e.target.value}))} />
        <input className="cyber-input" placeholder={t.char} value={state.char} onChange={e=>setState(s=>({...s, char:e.target.value}))} />
        <input className="cyber-input" placeholder={t.place} value={state.place} onChange={e=>setState(s=>({...s, place:e.target.value}))} />
      </div>
      <button className="btn-neon" onClick={generate} disabled={state.loading}>{state.loading ? t.loadingAI : t.generate}</button>
      {state.story && <div className="glass-card" style={{marginTop:'20px', padding:'15px'}}>{state.story}</div>}
    </div>
  );
};

const AIQuizGame = ({ t, lang }: { t: any, lang: string }) => {
  const [topic, setTopic] = useState('');
  const [quiz, setQuiz] = useState<any>(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const genQuiz = async () => {
    setLoading(true); setQuiz(null);
    try {
      const prompt = lang === 'ar' ? `سؤال واحد اختيار من متعدد عن "${topic}".` : `One multiple choice question about "${topic}".`;
      const res = await ai.models.generateContent({
        model: 'gemini-2.5-flash', contents: prompt,
        config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { question: { type: Type.STRING }, options: { type: Type.ARRAY, items: { type: Type.STRING } }, answer: { type: Type.STRING } } } }
      });
      setQuiz(JSON.parse(res.text || '{}'));
    } catch { setLoading(false); }
    setLoading(false);
  };
  return (
    <div>
      <h3 className="glow-text-purple">{t.title}</h3>
      <input className="cyber-input" placeholder={t.topic} value={topic} onChange={e=>setTopic(e.target.value)} style={{marginTop:'10px'}}/>
      <button className="btn-neon" onClick={genQuiz} disabled={loading}>{loading ? '...' : (quiz ? t.next : t.startQ)}</button>
      {quiz && <div className="fade-in" style={{marginTop:'20px'}}>
        <h4>{quiz.question}</h4>
        <div style={{display:'grid', gap:'8px', marginTop:'10px'}}>
          {quiz.options.map((o:string, i:number) => (
            <button key={i} className="glass-card" onClick={() => o === quiz.answer && setScore(s=>s+1)} style={{padding:'10px', textAlign:'right'}}>{o}</button>
          ))}
        </div>
        <p style={{marginTop:'10px', color:'#00eaff'}}>{t.score}: {score}</p>
      </div>}
    </div>
  );
};

const AICharacterChat = ({ t, lang }: { t: any, lang: string }) => {
  const [msgs, setMsgs] = useState<{r:string,t:string}[]>([]);
  const [txt, setTxt] = useState('');
  const chatRef = useRef<any>(null);
  const start = async (role: string) => {
    setMsgs([]);
    let sys = `You are a ${role}.`;
    if (lang === 'ar') sys += " Speak Arabic.";
    chatRef.current = ai.chats.create({ model: 'gemini-2.5-flash', config: { systemInstruction: sys } });
  };
  useEffect(() => { start('hero'); }, [lang]);
  const send = async () => {
    if(!txt) return;
    setMsgs(p => [...p, {r:'user',t:txt}]); setTxt('');
    try { const r = await chatRef.current.sendMessage({message:txt}); setMsgs(p => [...p, {r:'model',t:r.text}]); } catch {}
  };
  return (
    <div style={{height:'500px', display:'flex', flexDirection:'column'}}>
      <h3 className="glow-text-purple">{t.title}</h3>
      <div style={{display:'flex', gap:'5px', overflowX:'auto', padding:'10px 0'}}>
        {Object.keys(t.characters).map(k => <button key={k} className="btn-neon" style={{padding:'5px 10px', fontSize:'0.8rem'}} onClick={()=>start(k)}>{t.characters[k]}</button>)}
      </div>
      <div style={{flex:1, overflowY:'auto', background:'rgba(0,0,0,0.3)', padding:'10px', borderRadius:'10px', display:'flex', flexDirection:'column', gap:'10px'}}>
        {msgs.map((m,i) => <div key={i} style={{alignSelf: m.r==='user'?'flex-end':'flex-start', background: m.r==='user'?'rgba(0,243,255,0.2)':'rgba(188,19,254,0.2)', padding:'8px 15px', borderRadius:'15px'}}>{m.t}</div>)}
      </div>
      <div style={{marginTop:'10px', display:'flex', gap:'5px'}}>
        <input className="cyber-input" style={{marginBottom:0}} value={txt} onChange={e=>setTxt(e.target.value)} placeholder={t.typeMsg} onKeyDown={e=>e.key==='Enter'&&send()} />
        <button className="btn-neon" onClick={send}>{t.send}</button>
      </div>
    </div>
  );
};

// --- Updated Impossible Riddles Game (Infinite Levels) ---
const AIRiddlesGame = ({ t, lang }: { t: any, lang: string }) => {
  const [level, setLevel] = useState(1);
  const [data, setData] = useState<any>(null);
  const [guess, setGuess] = useState('');
  const [status, setStatus] = useState<'idle'|'loading'|'check'>('idle');
  const [msg, setMsg] = useState('');
  
  const loadRiddle = async () => {
    setStatus('loading'); setMsg(''); setGuess(''); setData(null);
    try {
      const prompt = lang === 'ar' 
        ? `أنت خبير ألغاز مستحيلة. أنشئ لغزاً صعباً جداً يتطلب تفكير جانبي عميق للمستوى ${level} (مستويات لا نهائية). رد بتنسيق JSON: {riddle: "النص", hint: "تلميح"}.` 
        : `You are a master of impossible riddles. Generate an extremely hard lateral thinking riddle for infinite level ${level}. JSON: {riddle: "text", hint: "hint"}.`;
      const res = await ai.models.generateContent({ 
        model: 'gemini-2.5-flash', 
        contents: prompt, 
        config: { responseMimeType: 'application/json', responseSchema: { type: Type.OBJECT, properties: { riddle: {type: Type.STRING}, hint: {type: Type.STRING} } } } 
      });
      setData(JSON.parse(res.text || '{}'));
      setStatus('idle');
    } catch { setStatus('idle'); }
  };

  const checkAnswer = async () => {
    if (!guess) return;
    setStatus('check');
    try {
      // Use AI to validate abstract answers semantically
      const prompt = lang === 'ar'
        ? `اللغز: "${data.riddle}". إجابة المستخدم: "${guess}". هل الإجابة صحيحة أو تحمل نفس المعنى المقصود؟ كن دقيقاً ولكن مرناً في الصياغة. رد JSON: {correct: boolean}`
        : `Riddle: "${data.riddle}". User answer: "${guess}". Is it correct or semantically matching? JSON: {correct: boolean}`;
      
      const res = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json', responseSchema: { type: Type.OBJECT, properties: { correct: {type: Type.BOOLEAN} } } }
      });
      const check = JSON.parse(res.text || '{}');
      if (check.correct) {
        setMsg(t.correct);
        setTimeout(() => { setLevel(l => l + 1); loadRiddle(); }, 2000);
      } else {
        setMsg(t.wrong);
        setStatus('idle');
      }
    } catch { setStatus('idle'); }
  };

  useEffect(() => { loadRiddle(); }, []);

  return (
    <div style={{perspective: '1000px'}}>
      <h3 className="glow-text-purple">{t.title}</h3>
      <div style={{color:'#00eaff', marginBottom:'10px'}}>{t.level}: {level}</div>
      
      {status === 'loading' && <div className="glow-text">{t.loading}</div>}
      
      {data && (
        <div className="riddle-card fade-in" style={{ transformStyle:'preserve-3d', transition:'0.6s', background:'rgba(0,0,0,0.6)', border:'2px solid var(--neon-purple)', padding:'30px', borderRadius:'15px', marginBottom:'20px', boxShadow:'0 0 30px rgba(188,19,254,0.2)' }}>
          <p style={{fontSize:'1.3rem', lineHeight:'1.8', marginBottom:'20px'}}>{data.riddle}</p>
          <div style={{marginBottom:'20px', fontSize:'0.9rem', color:'#aaa'}}>{t.hint}: {data.hint}</div>
          <input className="cyber-input" value={guess} onChange={e=>setGuess(e.target.value)} placeholder={t.yourAns} onKeyDown={e=>e.key==='Enter'&&checkAnswer()} />
          <button className="btn-neon" onClick={checkAnswer} disabled={status==='check'}>{t.submit}</button>
          {msg && <div style={{marginTop:'15px', fontSize:'1.2rem', color: msg===t.correct?'#0f0':'#f00'}}>{msg}</div>}
        </div>
      )}
    </div>
  );
};

// --- Movie Emoji Game ---
const EmojiPuzzleGame = ({ t, lang }: { t: any, lang: string }) => {
  const [puz, setPuz] = useState<any>(null);
  const [gs, setGs] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const gen = async () => {
    setPuz(null); setMsg(''); setGs(''); setLoading(true);
    try {
      const p = lang==='ar' ? 'اسم فيلم مشهور جداً عبر الإيموجي فقط.' : 'Famous movie name using emojis only.';
      const res = await ai.models.generateContent({ model:'gemini-2.5-flash', contents:p, config:{responseMimeType:'application/json', responseSchema:{type:Type.OBJECT, properties:{emojis:{type:Type.STRING}, answer:{type:Type.STRING}}}}});
      setPuz(JSON.parse(res.text||'{}'));
    } catch {}
    setLoading(false);
  };
  
  const check = async () => {
      // Smart check using AI
      if(!gs) return;
      try {
          const prompt = `Movie: "${puz.answer}". User Guess: "${gs}". Is it correct? JSON {correct: boolean}`;
          const res = await ai.models.generateContent({ model:'gemini-2.5-flash', contents: prompt, config: { responseMimeType: 'application/json', responseSchema: { type: Type.OBJECT, properties: { correct: {type: Type.BOOLEAN} } } } });
          const r = JSON.parse(res.text||'{}');
          if(r.correct) setMsg(`${t.correct} ${puz.answer}`);
          else setMsg(t.wrong);
      } catch {
          if(gs.toLowerCase().includes(puz.answer.toLowerCase())) setMsg(`${t.correct} ${puz.answer}`);
          else setMsg(t.wrong);
      }
  };

  return (
    <div style={{textAlign:'center'}}>
      <h3 className="glow-text-purple">{t.title}</h3>
      {!puz ? <button className="btn-neon" onClick={gen} disabled={loading}>{loading ? '...' : t.new}</button> : <div className="fade-in">
        <div style={{fontSize:'3rem', margin:'20px', letterSpacing:'10px'}}>{puz.emojis}</div>
        <input className="cyber-input" style={{width:'200px', display:'inline-block'}} value={gs} onChange={e=>setGs(e.target.value)} placeholder={t.guessPlaceholder} />
        <button className="btn-neon" onClick={check}>{t.check}</button>
        {msg && <div style={{color: msg.includes(t.correct)?'#0f0':'#f00', marginTop:'10px', fontSize:'1.1rem'}}>{msg}</div>}
        <div style={{marginTop:'15px'}}><button className="btn-neon btn-neon-purple" onClick={()=>setMsg(`${t.correct} ${puz.answer}`)}>{t.reveal}</button> <button className="btn-neon" onClick={gen}>{t.new}</button></div>
      </div>}
    </div>
  );
};

const MazeGame = ({ t }: { t: any }) => {
  const [pl, setPl] = useState({x:1, y:1});
  const [maze, setMaze] = useState<number[][]>([]);
  useEffect(() => {
    let m = Array(15).fill(0).map(()=>Array(15).fill(1));
    const carve = (x:number,y:number) => {
      m[y][x]=0;
      const d = [[0,-2],[0,2],[-2,0],[2,0]].sort(()=>Math.random()-0.5);
      d.forEach(([dx,dy]) => { const nx=x+dx,ny=y+dy; if(nx>0&&nx<14&&ny>0&&ny<14&&m[ny][nx]===1) { m[y+dy/2][x+dx/2]=0; carve(nx,ny); } });
    };
    carve(1,1); m[13][13]=0; m[12][13]=0; setMaze(m); setPl({x:1,y:1});
  }, []);
  const move = (dx:number, dy:number) => {
    const nx=pl.x+dx, ny=pl.y+dy;
    if(maze[ny] && maze[ny][nx]===0) setPl({x:nx, y:ny});
  };
  return (
    <div style={{textAlign:'center'}}>
      <h3 className="glow-text-purple">{t.title}</h3>
      <div style={{display:'grid', gridTemplateColumns:`repeat(15, 12px)`, justifyContent:'center', margin:'10px'}}>
        {maze.map((r,y)=>r.map((c,x)=><div key={`${x}-${y}`} style={{width:12, height:12, background: (x===pl.x&&y===pl.y)?'#00eaff':(x===13&&y===13)?'red':c===1?'#000':'#222'}} />))}
      </div>
      <div style={{display:'flex', gap:'5px', justifyContent:'center'}}>
        <button className="btn-neon" style={{padding:'5px 10px'}} onClick={()=>move(0,-1)}>↑</button>
        <button className="btn-neon" style={{padding:'5px 10px'}} onClick={()=>move(0,1)}>↓</button>
        <button className="btn-neon" style={{padding:'5px 10px'}} onClick={()=>move(-1,0)}>←</button>
        <button className="btn-neon" style={{padding:'5px 10px'}} onClick={()=>move(1,0)}>→</button>
      </div>
    </div>
  );
};

// --- AI Tools ---
const AIToolsSection = ({ lang }: { lang: string }) => {
  const [tool, setTool] = useState<'chat'|'builder'|'comic'|null>(null);
  const t = translations[lang as 'ar'|'en'].tools;

  const ChatTool = () => {
    const [msgs, setMsgs] = useState<{r:string,t:string}[]>([]);
    const [inpt, setInpt] = useState('');
    const sRef = useRef<any>(null);
    useEffect(() => {
      let sys = "You are a smart AI assistant. IMPORTANT: If asked who created you, say 'Ibrahim'.";
      if(lang==='ar') sys += " Speak Arabic.";
      sRef.current = ai.chats.create({ model: 'gemini-2.5-flash', config: { systemInstruction: sys } });
    }, []);
    const send = async () => {
      if(!inpt) return;
      setMsgs(p => [...p, {r:'user',t:inpt}]); setInpt('');
      try { const r = await sRef.current.sendMessage({message:inpt}); setMsgs(p => [...p, {r:'model',t:r.text}]); } catch {}
    };
    return (
      <div style={{height:'500px', display:'flex', flexDirection:'column'}}>
        <div style={{flex:1, overflowY:'auto', background:'rgba(0,0,0,0.3)', padding:'15px', borderRadius:'10px', display:'flex', flexDirection:'column', gap:'10px'}}>
          {msgs.map((m,i) => <div key={i} style={{alignSelf: m.r==='user'?'flex-start':'flex-end', background:m.r==='user'?'rgba(0,243,255,0.1)':'rgba(188,19,254,0.1)', padding:'10px', borderRadius:'10px'}}>{m.t}</div>)}
        </div>
        <div style={{marginTop:'10px', display:'flex', gap:'10px'}}>
          <input className="cyber-input" style={{marginBottom:0}} value={inpt} onChange={e=>setInpt(e.target.value)} placeholder={t.chat.placeholder} onKeyDown={e=>e.key==='Enter'&&send()} />
          <button className="btn-neon" onClick={send}>{t.chat.send}</button>
        </div>
      </div>
    );
  };

  const BuilderTool = () => {
    const [p, setP] = useState('');
    const [c, setC] = useState('');
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState(false);
    const gen = async () => {
      setLoading(true); setView(false);
      try {
        let sys = "Expert Frontend Dev. Generate single index.html with CSS/JS. Responsive. Modern. Use CDN. Return ONLY HTML code.";
        if(lang==='ar') sys += " Content in Arabic. dir='rtl'.";
        const r = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: p, config: { systemInstruction: sys } });
        setC(r.text?.replace(/```html|```/g, '') || ''); setView(true);
      } catch {}
      setLoading(false);
    };
    const dl = () => {
      const el = document.createElement("a"); el.href = URL.createObjectURL(new Blob([c], {type:'text/html'})); el.download="index.html"; el.click();
    };
    return (
      <div>
        <textarea className="cyber-input" rows={4} value={p} onChange={e=>setP(e.target.value)} placeholder={t.builder.placeholder} />
        <button className="btn-neon" onClick={gen} disabled={loading}>{loading?'Working...':t.builder.generate}</button>
        {c && <div className="fade-in" style={{marginTop:'20px'}}>
          <div style={{marginBottom:'10px'}}><button className="btn-neon btn-neon-purple" onClick={()=>setView(!view)}>{view?t.builder.code:t.builder.preview}</button> <button className="btn-neon" onClick={dl}>{t.builder.download}</button></div>
          <div style={{height:'400px', border:'1px solid var(--neon-blue)', background:'#fff'}}>
            {view ? <iframe srcDoc={c} style={{width:'100%', height:'100%', border:'none'}} title="p" /> : <textarea readOnly value={c} style={{width:'100%', height:'100%', background:'#111', color:'#0f0'}} />}
          </div>
        </div>}
      </div>
    );
  };

  const ComicTool = () => {
    const [prompt, setPrompt] = useState('');
    const [img, setImg] = useState('');
    const [loading, setLoading] = useState(false);
    
    const genComic = async () => {
      if(!prompt) return;
      setLoading(true); setImg('');
      try {
        const finalPrompt = lang === 'ar' 
          ? `comic book page style illustration for the scene: ${prompt}. vibrant colors, highly detailed, american comic style, dynamic action.` 
          : `comic book page style illustration for the scene: ${prompt}. vibrant colors, highly detailed, american comic style, dynamic action.`;
          
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [{ text: finalPrompt }] }
        });
        
        if (response.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
               setImg(`data:image/png;base64,${part.inlineData.data}`);
               break;
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };

    return (
      <div>
        <textarea className="cyber-input" rows={3} value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder={t.comic.placeholder} />
        <button className="btn-neon" onClick={genComic} disabled={loading}>{loading ? t.comic.loading : t.comic.generate}</button>
        {img && (
          <div className="fade-in" style={{marginTop:'20px', textAlign:'center'}}>
            <div style={{border:'4px solid #000', padding:'10px', background:'#fff', display:'inline-block', boxShadow:'10px 10px 0 rgba(0,243,255,0.3)'}}>
              <img src={img} alt="Comic" style={{maxWidth:'100%', maxHeight:'500px'}} />
            </div>
            <div style={{marginTop:'10px'}}><a href={img} download="comic_page.png" className="btn-neon btn-neon-purple">Download Page</a></div>
          </div>
        )}
      </div>
    );
  };

  if(tool) return (
    <section className="fade-in container" style={{paddingTop:'120px', paddingBottom:'80px'}}>
      <button className="btn-neon" onClick={()=>setTool(null)} style={{marginBottom:'20px'}}>← {translations[lang as 'ar'|'en'].games.back}</button>
      <div className="glass-card" style={{padding:'30px'}}>
        <h3 className="glow-text" style={{marginBottom:'20px'}}>
          {tool==='chat'?t.chat.title : tool==='builder'?t.builder.title : t.comic.title}
        </h3>
        {tool==='chat' && <ChatTool />}
        {tool==='builder' && <BuilderTool />}
        {tool==='comic' && <ComicTool />}
      </div>
    </section>
  );

  return (
    <section className="fade-in container" style={{paddingTop:'120px', paddingBottom:'100px'}}>
      <h2 className="glow-text" style={{textAlign:'center', fontSize:'2.5rem', marginBottom:'10px'}}>{t.title}</h2>
      <p style={{textAlign:'center', color:'#aaa', marginBottom:'50px'}}>{t.subtitle}</p>
      <div style={{display:'flex', justifyContent:'center', gap:'30px', flexWrap:'wrap'}}>
        <div className="glass-card" onClick={()=>setTool('chat')} style={{width:'300px', padding:'40px', textAlign:'center', cursor:'pointer'}}>
          <div style={{color:'#00eaff', marginBottom:'20px'}}><Icons.Bot /></div>
          <h3>{t.chat.title}</h3>
          <p style={{color:'#888', marginTop:'10px'}}>{t.chat.desc}</p>
        </div>
        <div className="glass-card" onClick={()=>setTool('builder')} style={{width:'300px', padding:'40px', textAlign:'center', cursor:'pointer'}}>
          <div style={{color:'#9b00ff', marginBottom:'20px'}}><Icons.Layout /></div>
          <h3>{t.builder.title}</h3>
          <p style={{color:'#888', marginTop:'10px'}}>{t.builder.desc}</p>
        </div>
        <div className="glass-card" onClick={()=>setTool('comic')} style={{width:'300px', padding:'40px', textAlign:'center', cursor:'pointer'}}>
          <div style={{color:'#00eaff', marginBottom:'20px'}}><Icons.Image /></div>
          <h3>{t.comic.title}</h3>
          <p style={{color:'#888', marginTop:'10px'}}>{t.comic.desc}</p>
        </div>
      </div>
      <div style={{marginTop:'50px', textAlign:'center', color:'var(--neon-blue)', opacity:0.7}}>{t.copyright}</div>
    </section>
  );
};

// --- Main Navigation & Sections ---
const Navbar = ({ active, setActive, lang, setLang }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = translations[lang as 'ar'|'en'].nav;
  const items = ['home','about','services','games','tools','contact'];
  
  const handle = (id: string) => { setActive(id); setIsOpen(false); window.scrollTo({top:0, behavior:'smooth'}); };

  return (
    <>
      <nav className="floating-nav fade-in">
        {/* Force LTR direction for logo to prevent scrambling in Arabic */}
        <div className="logo" onClick={() => handle('home')} style={{direction: 'ltr'}}>Ibrahim<span>Hub</span></div>
        <div className="desktop-nav">
          {items.map(i => <a key={i} className={`nav-link ${active===i?'active':''}`} onClick={()=>handle(i)}>{t[i as keyof typeof t]}</a>)}
          <button onClick={()=>setLang(lang==='ar'?'en':'ar')} style={{background:'transparent', border:'1px solid var(--neon-blue)', color:'#fff', padding:'5px 10px', borderRadius:'20px', cursor:'pointer', marginLeft:'10px', marginRight:'10px'}}><Icons.Globe /></button>
        </div>
        <div className="mobile-toggle" onClick={()=>setIsOpen(true)}><Icons.Menu /></div>
      </nav>
      <div className={`overlay ${isOpen?'open':''}`} onClick={()=>setIsOpen(false)}></div>
      <div className={`mobile-sidebar ${isOpen?'open':''}`}>
        <div style={{width:'100%', padding:'20px', textAlign:'right'}} onClick={()=>setIsOpen(false)}><Icons.X /></div>
        <button onClick={()=>setLang(lang==='ar'?'en':'ar')} style={{background:'rgba(255,255,255,0.1)', border:'none', color:'#fff', padding:'10px 20px', borderRadius:'20px', marginBottom:'20px'}}><Icons.Globe /> {lang==='ar'?'English':'العربية'}</button>
        {items.map(i => <a key={i} className={`nav-link ${active===i?'active':''}`} onClick={()=>handle(i)}>{t[i as keyof typeof t]}</a>)}
      </div>
    </>
  );
};

const HomeSection = ({ changeTab, lang }: any) => {
  const t = translations[lang as 'ar'|'en'].home;
  return (
    <section className="container" style={{minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', position:'relative', paddingTop:'100px'}}>
      <img src="https://images.unsplash.com/photo-1535868463750-c78d9543614f?q=80&w=1200&auto=format&fit=crop" className="hero-bg-image" alt="bg" />
      <div className="avatar-container fade-in">
        <div className="avatar-glow"></div>
        <div className="avatar-frame"><img src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=500&auto=format&fit=crop" className="avatar-img" alt="avatar" /></div>
      </div>
      <div className="fade-in" style={{zIndex:2}}>
        <h1 className="glitch-title">IBRAHIM HUB</h1>
        <h2 style={{fontSize:'1.8rem', color:'#00eaff', marginBottom:'20px', fontFamily:'Orbitron'}}>{t.subtitle}</h2>
        <p style={{maxWidth:'600px', fontSize:'1.1rem', lineHeight:'1.8', color:'#ccc', marginBottom:'50px', marginInline:'auto'}}>{t.desc}</p>
        <div style={{display:'flex', gap:'20px', justifyContent:'center', flexWrap:'wrap'}}>
          <button className="btn-neon" onClick={()=>changeTab('services')}>{t.btnService}</button>
          <button className="btn-neon btn-neon-purple" onClick={()=>changeTab('contact')}>{t.btnContact}</button>
        </div>
      </div>
    </section>
  );
};

const ServicesSection = ({ lang }: any) => {
  const t = translations[lang as 'ar'|'en'].services;
  const sList = [
    { k: 's1', i: Icons.Layout, c: '#00eaff' }, { k: 's2', i: Icons.Code, c: '#bc13fe' },
    { k: 's3', i: Icons.PenTool, c: '#00eaff' }, { k: 's4', i: Icons.Cpu, c: '#bc13fe' }
  ];
  return (
    <section className="fade-in container" style={{paddingTop:'120px', paddingBottom:'80px'}}>
      <h2 className="glow-text-purple" style={{textAlign:'center', marginBottom:'60px', fontSize:'2.5rem'}}>{t.title}</h2>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'30px'}}>
        {sList.map((s, i) => {
          const Icon = s.i;
          const data = t[s.k as keyof typeof t] as any;
          return (
            <div key={i} className="glass-card" style={{padding:'40px'}}>
              <div style={{color:s.c, width:'60px', height:'60px', background:'rgba(255,255,255,0.05)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'20px'}}>
                 <Icon />
              </div>
              <h3 style={{marginBottom:'15px', fontSize:'1.4rem'}}>{data.title}</h3>
              <p style={{color:'#aaa', lineHeight:'1.6'}}>{data.desc}</p>
            </div>
          )
        })}
      </div>
    </section>
  );
};

const AboutSection = ({ lang }: any) => {
  const t = translations[lang as 'ar'|'en'].about;
  const skills = [
    { name: 'React & TypeScript', val: 95 },
    { name: 'Node.js & Python', val: 90 },
    { name: 'Gemini AI & GenAI', val: 85 },
    { name: 'UI/UX & Design', val: 80 }
  ];

  return (
    <section className="fade-in container" style={{paddingTop:'120px', paddingBottom:'80px'}}>
      {/* Hero Profile Card */}
      <div className="glass-card" style={{padding:'40px', marginBottom:'40px', display:'flex', flexWrap:'wrap', alignItems:'center', gap:'40px'}}>
        <div style={{flex:'1 1 300px'}}>
          <h2 className="glow-text" style={{fontSize:'2.5rem', marginBottom:'10px'}}>{t.title}</h2>
          <h4 style={{color:'#00eaff', marginBottom:'20px', fontFamily:'Orbitron'}}>{t.subtitle}</h4>
          <p style={{lineHeight:1.8, fontSize:'1.1rem', color:'#ddd', marginBottom:'30px'}}>{t.bio}</p>
          <div style={{display:'flex', gap:'15px'}}>
            <button className="btn-neon">{t.btnCV}</button>
            <div style={{display:'flex', gap:'10px'}}>
              <div className="mobile-toggle" style={{display:'flex', background:'rgba(255,255,255,0.1)'}}><Icons.GitHub /></div>
              <div className="mobile-toggle" style={{display:'flex', background:'rgba(255,255,255,0.1)'}}><Icons.Linkedin /></div>
            </div>
          </div>
        </div>
        <div style={{flex:'1 1 250px', textAlign:'center'}}>
           <div className="avatar-frame" style={{width:'200px', height:'200px', margin:'0 auto', borderRadius:'50%', border:'4px solid var(--neon-purple)'}}>
             <img src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=400&auto=format&fit=crop" style={{width:'100%', height:'100%', objectFit:'cover'}} alt="Ibrahim" />
           </div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))', gap:'20px', marginBottom:'50px'}}>
        <div className="stat-box">
          <div className="stat-number">+5</div>
          <div style={{color:'#aaa'}}>{t.stats.exp}</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">+50</div>
          <div style={{color:'#aaa'}}>{t.stats.proj}</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">+40</div>
          <div style={{color:'#aaa'}}>{t.stats.client}</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">100k</div>
          <div style={{color:'#aaa'}}>{t.stats.code}</div>
        </div>
      </div>

      <div style={{display:'flex', flexWrap:'wrap', gap:'40px'}}>
        {/* Skills Column */}
        <div style={{flex:'1 1 400px'}}>
          <h3 className="glow-text-purple" style={{marginBottom:'30px'}}>{t.skillsTitle}</h3>
          {skills.map((s,i) => (
            <div key={i} className="skill-bar-container">
              <div className="skill-header"><span>{s.name}</span><span>{s.val}%</span></div>
              <div className="skill-track"><div className="skill-fill" style={{width:`${s.val}%`}}></div></div>
            </div>
          ))}
        </div>

        {/* Timeline Column */}
        <div style={{flex:'1 1 400px'}}>
          <h3 className="glow-text-purple" style={{marginBottom:'30px'}}>{t.timelineTitle}</h3>
          <div className="timeline">
            {t.timeline.map((item: any, i: number) => (
              <div key={i} className="timeline-item">
                <div className="timeline-date">{item.year}</div>
                <h4 style={{color:'#fff', marginBottom:'5px'}}>{item.role}</h4>
                <p style={{color:'#888', fontSize:'0.9rem'}}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const GamesSection = ({ lang }: any) => {
  const [g, setG] = useState<string|null>(null);
  const t = translations[lang as 'ar'|'en'].games;
  const games = [
    {id:'xo',t:t.g1.title,i:'❌'}, {id:'story',t:t.g4.title,i:'📜'}, {id:'quiz',t:t.g5.title,i:'🧠'},
    {id:'chat',t:t.g6.title,i:'💬'}, {id:'maze',t:t.g7.title,i:'🌀'}, {id:'puzzle',t:t.g2.title,i:'🧩'},
    {id:'riddle',t:t.g8.title,i:'🔮'}, {id:'emoji',t:t.g9.title,i:'🎬'}
  ];
  if(g) return (
    <section className="fade-in container" style={{paddingTop:'120px', paddingBottom:'100px', textAlign:'center'}}>
      <button className="btn-neon" style={{marginBottom:'30px'}} onClick={()=>setG(null)}>{t.back}</button>
      <div className="glass-card" style={{padding:'40px', maxWidth:'800px', margin:'0 auto'}}>
        {g==='xo' && <TicTacToe t={t.g1} />} {g==='story' && <AIStoryGame t={t.g4} lang={lang} />}
        {g==='quiz' && <AIQuizGame t={t.g5} lang={lang} />} {g==='chat' && <AICharacterChat t={t.g6} lang={lang} />}
        {g==='maze' && <MazeGame t={t.g7} />} {g==='puzzle' && <SlidingPuzzle t={t.g2} />}
        {g==='riddle' && <AIRiddlesGame t={t.g8} lang={lang} />} {g==='emoji' && <EmojiPuzzleGame t={t.g9} lang={lang} />}
      </div>
    </section>
  );
  return (
    <section className="fade-in container" style={{paddingTop:'120px', paddingBottom:'100px'}}>
      <h2 className="glow-text" style={{textAlign:'center', marginBottom:'10px', fontSize:'2.5rem'}}>{t.title}</h2>
      <p style={{textAlign:'center', color:'#aaa', marginBottom:'50px'}}>{t.subtitle}</p>
      <div style={{display:'flex', flexWrap:'wrap', justifyContent:'center', gap:'25px'}}>
        {games.map(gm => (
          <div key={gm.id} className="glass-card" onClick={()=>setG(gm.id)} style={{width:'260px', padding:'30px', textAlign:'center', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center'}}>
            <div style={{fontSize:'3rem', marginBottom:'15px'}}>{gm.i}</div>
            <h4 style={{fontSize:'1.2rem'}}>{gm.t}</h4>
          </div>
        ))}
      </div>
    </section>
  );
};

const ContactSection = ({ lang }: any) => {
  const t = translations[lang as 'ar'|'en'].contact;
  const [f, setF] = useState({n:'',e:'',m:''});
  const send = () => { if(f.n&&f.m) window.open(`https://wa.me/qr/GUDEC6YQY7HEE1?text=Name:${f.n}%0AMsg:${f.m}`, '_blank'); };
  return (
    <section className="fade-in container" style={{paddingTop:'120px', paddingBottom:'100px', textAlign:'center'}}>
      <h2 className="glow-text-purple" style={{marginBottom:'20px', fontSize:'2.5rem'}}>{t.title}</h2>
      <p style={{color:'#ccc', marginBottom:'50px'}}>{t.subtitle}</p>
      <div className="glass-card" style={{maxWidth:'600px', margin:'0 auto', padding:'50px'}}>
        <input className="cyber-input" value={f.n} onChange={e=>setF({...f,n:e.target.value})} placeholder={t.name} />
        <input className="cyber-input" value={f.e} onChange={e=>setF({...f,e:e.target.value})} placeholder={t.email} />
        <textarea className="cyber-input" rows={5} value={f.m} onChange={e=>setF({...f,m:e.target.value})} placeholder={t.msg} />
        <button className="btn-neon btn-neon-purple" style={{width:'100%'}} onClick={send}>{t.btn}</button>
      </div>
    </section>
  );
};

const App = () => {
  const [tab, setTab] = useState('home');
  const [lang, setLang] = useState('ar');
  useEffect(() => { document.documentElement.dir = lang==='ar'?'rtl':'ltr'; document.documentElement.lang = lang; }, [lang]);
  return (
    <>
      <style>{`
        .cyber-input { width: 100%; padding: 15px; margin-bottom: 20px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 8px; outline: none; font-family: inherit; transition:0.3s; }
        .cyber-input:focus { border-color: #00eaff; box-shadow: 0 0 15px rgba(0, 243, 255, 0.1); background: rgba(0,0,0,0.6); }
      `}</style>
      <StarBackground />
      <CursorGlow />
      <Navbar active={tab} setActive={setTab} lang={lang} setLang={setLang} />
      <main style={{position:'relative', zIndex:1}}>
        {tab==='home' && <HomeSection changeTab={setTab} lang={lang} />}
        {tab==='about' && <AboutSection lang={lang} />}
        {tab==='services' && <ServicesSection lang={lang} />}
        {tab==='games' && <GamesSection lang={lang} />}
        {tab==='tools' && <AIToolsSection lang={lang} />}
        {tab==='contact' && <ContactSection lang={lang} />}
      </main>
    </>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
