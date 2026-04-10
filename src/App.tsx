import React, { useState, useEffect } from 'react';
import { 
    Copy, Check, Sparkles, Map, 
    CloudMoon, Compass, Edit3, Zap, Calendar, ExternalLink, MessageCircle
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const MOON_PHASES = [
    { name: "Nova", icon: "🌑" }, 
    { name: "Crescente", icon: "🌓" },
    { name: "Cheia", icon: "🌕" }, 
    { name: "Minguante", icon: "🌗" },
    { name: "Não sei", icon: "❓" }
];

const ZODIAC_SIGNS = [
    { name: "Áries", icon: "♈" }, { name: "Touro", icon: "♉" }, { name: "Gêmeos", icon: "♊" },
    { name: "Câncer", icon: "♋" }, { name: "Leão", icon: "♌" }, { name: "Virgem", icon: "♍" },
    { name: "Libra", icon: "♎" }, { name: "Escorpião", icon: "♏" }, { name: "Sagitário", icon: "♐" },
    { name: "Capricórnio", icon: "♑" }, { name: "Aquário", icon: "♒" }, { name: "Peixes", icon: "♓" },
    { name: "Não sei", icon: "❓" }
];

const MOODS = [
    { label: 'Radiante', value: 'radiante', emoji: '✨' },
    { label: 'Neutra', value: 'neutra', emoji: '😐' },
    { label: 'Introspectiva', value: 'intro', emoji: '🌙' },
    { label: 'Tensa', value: 'tensa', emoji: '⚡' },
    { label: 'Cansada', value: 'cansada', emoji: '🔋' },
];

export default function App() {
    const [today, setToday] = useState(new Date().toISOString().split('T')[0]);
    const [sign, setSign] = useState('Capricórnio');
    const [phase, setPhase] = useState('Nova');
    const [house, setHouse] = useState('1');
    const [aspects, setAspects] = useState('');
    const [mood, setMood] = useState('neutra');
    const [notes, setNotes] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const draft = localStorage.getItem('luna_draft_v4');
        if (draft) {
            try {
                const data = JSON.parse(draft);
                setToday(data.today || new Date().toISOString().split('T')[0]);
                setSign(data.sign || 'Capricórnio');
                setPhase(data.phase || 'Nova');
                setHouse(data.house || '1');
                setAspects(data.aspects || '');
                setMood(data.mood || 'neutra');
                setNotes(data.notes || '');
            } catch (e) {
                console.error("Failed to parse draft", e);
            }
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            localStorage.setItem('luna_draft_v4', JSON.stringify({ today, sign, phase, house, aspects, mood, notes }));
        }, 500);
        return () => clearTimeout(timer);
    }, [today, sign, phase, house, aspects, mood, notes]);

    const copyToClipboard = () => {
        const selectedMood = MOODS.find(m => m.value === mood);
        const emojiMood = selectedMood?.emoji || '😐';
        const labelMood = selectedMood?.label || 'NEUTRA';
        const emojiPhase = MOON_PHASES.find(p => p.name === phase)?.icon || '🌙';
        const emojiSign = ZODIAC_SIGNS.find(s => s.name === sign)?.icon || '✨';
        const formattedDate = new Date(today + "T12:00:00").toLocaleDateString('pt-BR');

        const text = `✨ RELATÓRIO: DIÁRIO LUNAR ✨
📅 Data: ${formattedDate}
🌙 Lua: ${emojiPhase} ${phase} em ${emojiSign} ${sign}
🏠 Casa Natal Ativada: Casa ${house}

🔍 Aspectos ao Mapa (Via Agente Luna):
${aspects || 'Nenhum aspecto anotado.'}

🧠 Como você se sente hoje:
Humor: ${emojiMood} ${labelMood.toUpperCase()}
Observações: ${notes || 'Sem observações adicionais.'}

--- Gerado pelo seu Diário Lunar ---`;

        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers or restricted environments
            const textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) { console.error(err); }
            document.body.removeChild(textArea);
        });
    };

    return (
        <div className="max-w-xl mx-auto p-4 md:p-8 pb-24 animate-fade-in font-sans">
            {/* Call to Action Luna */}
            <div className="cta-banner p-4 rounded-3xl mb-8 shadow-lg shadow-indigo-100 border border-indigo-400/20">
                <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-2xl">
                        <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <p className="text-white text-sm font-medium leading-tight">
                            Essa experiência fica mais completa conversando com a <span className="font-bold underline">Agente Luna</span>.
                        </p>
                        <a 
                            href="https://gemini.google.com/gem/1J_WsjS4B18JcMBL0xbvN1Ih2x_AlpkGp?usp=sharing" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-100 uppercase mt-2 hover:text-white transition-colors"
                        >
                            Acessar agora <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                </div>
            </div>

            <header className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-indigo-600" />
                        Diário Lunar
                    </h1>
                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Mapeador de Geometria Sagrada</p>
                </div>
                <div className="bg-white shadow-sm border border-slate-100 p-2 rounded-2xl">
                    <CloudMoon className="w-6 h-6 text-indigo-500" />
                </div>
            </header>

            <div className="space-y-6">
                {/* Seção 1: Onde está a lua agora? */}
                <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-5">
                    <h2 className="text-sm font-bold text-slate-400 uppercase flex items-center gap-2">
                        <Compass className="w-4 h-4" /> 1. Onde está a lua agora?
                    </h2>
                    
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-600 flex items-center gap-2">
                                <Calendar className="w-3 h-3" /> Dia de hoje
                            </label>
                            <input 
                                type="date"
                                value={today}
                                onChange={(e) => setToday(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-600">Signo no Céu</label>
                                <select 
                                    value={sign}
                                    onChange={(e) => setSign(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                >
                                    {ZODIAC_SIGNS.map(s => <option key={s.name} value={s.name}>{s.icon} {s.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-600">Fase da Lua</label>
                                <select 
                                    value={phase}
                                    onChange={(e) => setPhase(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                >
                                    {MOON_PHASES.map(p => <option key={p.name} value={p.name}>{p.icon} {p.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Seção 2: O Mapa Natal */}
                <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
                    <h2 className="text-sm font-bold text-slate-400 uppercase flex items-center gap-2">
                        <Map className="w-4 h-4" /> 2. Onde ela bate no seu mapa?
                    </h2>

                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-600 block">Casa Natal Ativada</label>
                        <div className="grid grid-cols-6 gap-2">
                            {[...Array(12)].map((_, i) => (
                                <button 
                                    key={i+1}
                                    onClick={() => setHouse((i+1).toString())}
                                    className={cn(
                                        "aspect-square rounded-xl border font-bold text-sm transition-all",
                                        house === (i+1).toString() 
                                        ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 scale-105" 
                                        : "bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100"
                                    )}
                                >
                                    {i+1}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                            <Zap className="w-3 h-3 text-amber-500" /> 
                            Aspectos & Gatilhos
                        </label>
                        <textarea 
                            value={aspects}
                            onChange={(e) => setAspects(e.target.value)}
                            placeholder="Use a Agente Luna para descobrir... (ex: Quadrando Saturno Natal)"
                            className="w-full h-24 bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                        />
                    </div>
                </section>

                {/* Seção 3: Como você se sente hoje? */}
                <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
                    <h2 className="text-sm font-bold text-slate-400 uppercase flex items-center gap-2">
                        <Edit3 className="w-4 h-4" /> 3. Como você se sente hoje?
                    </h2>

                    <div className="flex flex-wrap gap-2">
                        {MOODS.map((m) => (
                            <button
                                key={m.value}
                                onClick={() => setMood(m.value)}
                                className={cn(
                                    "flex-1 min-w-[100px] px-3 py-3 rounded-2xl border text-sm font-medium transition-all flex items-center justify-center gap-2",
                                    mood === m.value 
                                    ? "bg-slate-900 border-slate-900 text-white shadow-xl" 
                                    : "bg-white border-slate-100 text-slate-600 hover:border-slate-300"
                                )}
                            >
                                <span>{m.emoji}</span> {m.label}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-600 block">Insights da Jornada</label>
                        <textarea 
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Como sentiu essa energia? O que a sua intuição diz hoje?"
                            className="w-full h-32 bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                        />
                    </div>
                </section>

                <button 
                    onClick={copyToClipboard}
                    className={cn(
                        "w-full py-5 rounded-3xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl",
                        copied 
                        ? "bg-emerald-500 text-white shadow-emerald-200" 
                        : "bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700"
                    )}
                >
                    {copied ? <><Check className="w-6 h-6" /> Relatório Copiado!</> : <><Copy className="w-6 h-6" /> Copiar Diário Completo</>}
                </button>
            </div>

            <footer className="mt-12 text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Central de Inteligência Astrológica</p>
            </footer>
        </div>
    );
}
