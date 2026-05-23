import { useEffect, useMemo, useRef, useState } from 'react'
import _AnsiModule from 'ansi-to-react';
const Ansi = _AnsiModule.default || _AnsiModule;
import { PROFILE, PROJECTS, EXPERIENCES, SKILLS, EDUCATION, SOCIALS } from '../data/portfolio'
import SectionHeaderCanvas from './SectionHeaderCanvas';
import '../styles/terminal-colors.css';


export default function Terminal() {

    const BANNER_LARGE = [
        '     ██╗ ██████╗ ███████╗██╗  ██╗██╗   ██╗ █████╗      ██████╗ ██████╗ ██████╗ ██╗ █████╗ ',
        '     ██║██╔═══██╗██╔════╝██║  ██║██║   ██║██╔══██╗    ██╔═══██╗██╔══██╗██╔══██╗██║██╔══██╗',
        '     ██║██║   ██║███████╗███████║██║   ██║███████║    ██║   ██║██████╔╝██████╔╝██║███████║',
        '██   ██║██║   ██║╚════██║██╔══██║██║   ██║██╔══██║    ██║   ██║██╔═══╝ ██╔══██╗██║██╔══██║',
        '╚█████╔╝╚██████╔╝███████║██║  ██║╚██████╔╝██║  ██║    ╚██████╔╝██║     ██║  ██║██║██║  ██║',
        ' ╚════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝     ╚═════╝ ╚═╝     ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝',
        '',
        "Welcome to opria.dev — type 'help' for commands. tip: try 'chat' to talk with my AI clone.",
    ];

    const BANNER_MEDIUM = [
        '     ██╗ ██████╗ ███████╗██╗  ██╗██╗   ██╗ █████╗ ',
        '     ██║██╔═══██╗██╔════╝██║  ██║██║   ██║██╔══██╗',
        '     ██║██║   ██║███████╗███████║██║   ██║███████║',
        '██   ██║██║   ██║╚════██║██╔══██║██║   ██║██╔══██║',
        '╚█████╔╝╚██████╔╝███████║██║  ██║╚██████╔╝██║  ██║',
        ' ╚════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝',
        '   ██████╗ ██████╗ ██████╗ ██╗ █████╗ ',
        '  ██╔═══██╗██╔══██╗██╔══██╗██║██╔══██╗',
        '  ██║   ██║██████╔╝██████╔╝██║███████║',
        '  ██║   ██║██╔═══╝ ██╔══██╗██║██╔══██║',
        '  ╚██████╔╝██║     ██║  ██║██║██║  ██║',
        '   ╚═════╝ ╚═╝     ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝',
        '',
        "Welcome to opria.dev — type 'help' for commands. tip: try 'chat' to talk with my AI clone.",
    ];

    const BANNER_SMALL = [
        '     ██╗ ██████╗ ███████╗██╗  ██╗',
        '     ██║██╔═══██╗██╔════╝██║  ██║',
        '     ██║██║   ██║███████╗███████║',
        '██   ██║██║   ██║╚════██║██╔══██║',
        '╚█████╔╝╚██████╔╝███████║██║  ██║',
        ' ╚════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝',
        ' ██████╗ ██████╗ ██████╗ ██╗ █████╗ ',
        '██╔═══██╗██╔══██╗██╔══██╗██║██╔══██╗',
        '██║   ██║██████╔╝██████╔╝██║███████║',
        '██║   ██║██╔═══╝ ██╔══██╗██║██╔══██║',
        '╚██████╔╝██║     ██║  ██║██║██║  ██║',
        ' ╚═════╝ ╚═╝     ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝',
        '',
        "Welcome to opria.dev — type 'help'",
        "for commands.",
        "tip: try 'chat' to talk with ",
        "my AI clone.",
    ];

    const SHELL_PROMPT = 'visitor@opria.dev:~$'
    const CHAT_PROMPT = 'chat ›'
    const CHAT_STORAGE_KEY = 'opria-terminal-chat-v1'
    const AI_ENDPOINT = import.meta.env.VITE_AI_AGENT_URL || ''

    function listAll(map) {
        return Object.entries(map).flatMap(([cat, arr]) => arr.map((s) => `${s.key}  (${cat})`))
    }

    function loadChat() {
        try {
            const raw = localStorage.getItem(CHAT_STORAGE_KEY)
            if (!raw) return []
            const arr = JSON.parse(raw)
            return Array.isArray(arr) ? arr : []
        } catch { return [] }
    }
    function saveChat(messages) {
        try { localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages.slice(-40))) } catch { /* ignore */ }
    }

    function makeCommands({ theme, setTheme, enterChat, hasChatHistory, clearChatHistory }) {
        // ANSI color helpers
        const green = (t) => `\u001b[32m${t}\u001b[0m`;
        const yellow = (t) => `\u001b[33m${t}\u001b[0m`;
        const cyan = (t) => `\u001b[36m${t}\u001b[0m`;
        const magenta = (t) => `\u001b[35m${t}\u001b[0m`;
        const red = (t) => `\u001b[31m${t}\u001b[0m`;
        const bold = (t) => `\u001b[1m${t}\u001b[0m`;
        const gray = (t) => `\u001b[90m${t}\u001b[0m`;

        return {
            help: () => [
                bold('Available commands:'),
                gray('  help              show this help'),
                cyan('  chat              start a conversation with my AI clone (persistent)'),
                gray('  whoami            print profile summary'),
                gray('  about             longer bio'),
                yellow('  skills [cat]      list skills (optional category)'),
                yellow('  projects          list portfolio projects'),
                yellow('  experience        list job history'),
                yellow('  certs             list certifications'),
                magenta('  contact           show contact channels'),
                magenta('  social            list social links'),
                cyan('  open <name>       open a project or social link'),
                cyan('  goto <section>    scroll to section (playground, experiences, projects, skills, education, publications)'),
                gray('  theme [light|dark]toggle theme'),
                gray('  date              print current date'),
                gray('  clear             clear the terminal'),
                gray('  reset-chat        wipe stored AI chat history'),
                red('  exit              close the terminal'),
            ],
            chat: () => { enterChat(); return null },
            ai: () => { enterChat(); return null },
            whoami: () => [
                bold(`${PROFILE.name || 'Joshua Opria'} — ${PROFILE.title || 'Software / AI Engineer'}`),
                PROFILE.location ? cyan(`Location: ${PROFILE.location}`) : '',
                PROFILE.email ? magenta(`Email: ${PROFILE.email}`) : '',
            ].filter(Boolean),
            about: () => (PROFILE.bio ? [PROFILE.bio] : [gray('No bio set.')]),
            skills: (args) => {
                const cat = (args[0] || '').toLowerCase()
                if (!cat) return listAll(SKILLS).map(green)
                const found = Object.entries(SKILLS).find(([k]) => k.toLowerCase().includes(cat))
                if (!found) return [red(`Unknown category: ${cat}. Categories: ${Object.keys(SKILLS).join(', ')}`)]
                return found[1].map((s) => green(`- ${s.key}${s.experience ? ' (' + s.experience + ')' : ''}`))
            },
            projects: () => PROJECTS.map((p, i) => cyan(`${i + 1}. ${p.title} — ${p.subtitle || ''}`)),
            experience: () => EXPERIENCES.map((e) => yellow(`- ${e.jobTitle} @ ${e.company} (${e.period})`)),
            certs: () => EDUCATION.filter((e) => /Certified/i.test(e.status)).map((e) => magenta(`- ${e.title} — ${e.institution} (${e.period})`)),
            contact: () => [
                PROFILE.email ? magenta(`email: ${PROFILE.email}`) : gray('email: (not set)'),
                ...SOCIALS.map((s) => cyan(`${s.title.toLowerCase()}: ${s.url}`)),
            ],
            social: () => SOCIALS.map((s) => cyan(`- ${s.title}: ${s.url}`)),
            open: (args) => {
                const q = args.join(' ').toLowerCase().trim()
                if (!q) return [gray('usage: open <name>')]
                const social = SOCIALS.find((s) => s.title.toLowerCase().includes(q) || s.id.includes(q))
                if (social) { window.open(social.url, '_blank', 'noopener'); return [green(`opening ${social.title}…`)] }
                const project = PROJECTS.find((p) => p.title.toLowerCase().includes(q))
                if (project?.url) { window.open(project.url, '_blank', 'noopener'); return [green(`opening ${project.title}…`)] }
                return [red(`nothing matches "${q}"`)]
            },
            goto: (args) => {
                const id = (args[0] || '').toLowerCase()
                const el = id && document.getElementById(id)
                if (!el) return [red(`no section: ${id}. try: playground, experiences, projects, skills, education, publications`)]
                el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                return [green(`scrolling to #${id}…`)]
            },
            theme: (args) => {
                const t = args[0]
                if (t === 'light' || t === 'dark') { setTheme(t); return [cyan(`theme set to ${t}`)] }
                const next = theme === 'dark' ? 'light' : 'dark'
                setTheme(next)
                return [cyan(`theme toggled → ${next}`)]
            },
            date: () => [gray(new Date().toString())],
            clear: () => '__CLEAR__',
            'reset-chat': () => {
                clearChatHistory()
                return hasChatHistory() ? [green('chat history cleared.')] : [gray('no chat history to clear.')]
            },
            exit: () => '__EXIT__',
        }
    }

    // Responsive banner selection
    const headerRef = useRef(null);
    const getBanner = () => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth <= 400) return BANNER_SMALL;
            if (window.innerWidth <= 700) return BANNER_MEDIUM;
        }
        return BANNER_LARGE;
    };
    const [history, setHistory] = useState([{ type: 'banner', text: getBanner().join('\n') }])
    const [input, setInput] = useState('')
    const [cmdHistory, setCmdHistory] = useState([])
    const [histIdx, setHistIdx] = useState(-1)
    const [open, setOpen] = useState(true)
    const [mode, setMode] = useState('shell') // 'shell' | 'chat'
    const [busy, setBusy] = useState(false)
    const [inputBlocked, setInputBlocked] = useState(false)
    const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'dark')
    const chatRef = useRef(loadChat())
    const scrollRef = useRef(null)
    const inputRef = useRef(null)

    const append = (lines) => setHistory((h) => [...h, ...lines])
    const appendLine = (type, text) => append([{ type, text }])

    function enterChatMode() {
        setMode('chat')
        const stored = chatRef.current
        const intro = stored.length
            ? [`-- resuming chat (${stored.length} prior messages) -- type 'exit' to leave, 'reset' to wipe history`]
            : [
                "-- chat mode -- talking to Joshua's AI clone.",
                "type 'exit' to leave, 'reset' to wipe history.",
            ]
        append(intro.map((t) => ({ type: 'sys', text: t })))
        // replay last few turns so user sees continuity
        if (stored.length) {
            const recent = stored.slice(-6)
            append(recent.map((m) => ({
                type: m.role === 'user' ? 'chat-user' : 'chat-ai',
                text: (m.role === 'user' ? '› ' : 'ai: ') + m.content,
            })))
        }
    }

    const commands = useMemo(() => makeCommands({
        theme,
        setTheme: (t) => { setTheme(t); document.documentElement.setAttribute('data-theme', t) },
        enterChat: enterChatMode,
        hasChatHistory: () => chatRef.current.length > 0,
        clearChatHistory: () => { chatRef.current = []; saveChat([]) },
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [theme])

    // Update banner on resize
    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }, [history])
    useEffect(() => {
        const handleResize = () => {
            setHistory((h) => {
                if (!h.length || h[0].type !== 'banner') return h;
                let banner;
                if (window.innerWidth <= 400) banner = BANNER_SMALL.join('\n');
                else if (window.innerWidth <= 700) banner = BANNER_MEDIUM.join('\n');
                else banner = BANNER_LARGE.join('\n');
                if (h[0].text === banner) return h;
                const rest = h.slice(1);
                return [{ type: 'banner', text: banner }, ...rest];
            });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Always refocus input after mode or busy changes
    useEffect(() => {
        inputRef.current?.focus();
    }, [mode, busy]);


    // No longer needed: isContinuation, isCompletion (streaming is now direct)

    async function sendChat(text) {
        const trimmed = text.trim()
        if (!trimmed || busy) return
        appendLine('chat-user', `› ${trimmed}`)
        if (!AI_ENDPOINT) {
            appendLine('err', '⚠ ai endpoint not configured (VITE_AI_AGENT_URL).')
            return
        }

        setBusy(true)
        let lineIdx = -1
        setHistory((h) => { lineIdx = h.length; return [...h, { type: 'chat-ai', text: 'ai: ' }] })

        let acc = ''
        const updateLine = (txt) => setHistory((h) => {
            const copy = h.slice()
            if (copy[lineIdx]) copy[lineIdx] = { type: 'chat-ai', text: `ai: ${txt}` }
            return copy
        })

        try {
            const res = await fetch(AI_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input: trimmed }),
            })
            if (!res.body) throw new Error('No response body')

            const reader = res.body.getReader()
            const decoder = new TextDecoder()
            let done = false

            while (!done) {
                const { value, done: streamDone } = await reader.read()
                if (streamDone) break
                const chunk = decoder.decode(value, { stream: true })
                acc += chunk
                updateLine(acc)
            }

            // Save chat history for context recall
            chatRef.current = [...chatRef.current, { role: 'user', content: trimmed }, { role: 'assistant', content: acc }]
            saveChat(chatRef.current)

            setInputBlocked(false)
        } catch (err) {
            updateLine(`error: ${err.message || 'request failed'}`)
            setInputBlocked(false)
        } finally {
            setBusy(false)
        }
    }

    function runShell(line) {
        const trimmed = line.trim()
        if (!trimmed) return
        const [cmd, ...args] = trimmed.split(/\s+/)
        const fn = commands[cmd.toLowerCase()]
        appendLine('cmd', `${SHELL_PROMPT} ${trimmed}`)
        if (!fn) {
            appendLine('err', `command not found: ${cmd}. type 'help'`)
        } else {
            const out = fn(args)
            if (out === '__CLEAR__') { setHistory([]); return }
            if (out === '__EXIT__') { setOpen(false); return }
            if (out == null) return // command handled its own output (e.g. chat)
            const lines = Array.isArray(out) ? out : [String(out)]
            append(lines.map((l) => ({ type: 'out', text: l })))
        }
    }

    function handleSubmit() {
        if (busy) return
        const value = input
        setInput('')
        setHistIdx(-1)
        if (!value.trim()) {
            inputRef.current?.focus();
            return
        }
        setCmdHistory((h) => [value.trim(), ...h].slice(0, 50))

        if (mode === 'chat') {
            const cmd = value.trim().toLowerCase()
            // Allow only 'exit', 'reset', or 'clear' if input is blocked
            if (inputBlocked && !['exit', ':q', 'quit', 'reset', 'clear'].includes(cmd)) {
                appendLine('err', '\u001b[31mAI is still responding. Please wait for completion or type "exit"/"reset".\u001b[0m')
                inputRef.current?.focus();
                return
            }
            if (cmd === 'exit' || cmd === ':q' || cmd === 'quit') {
                appendLine('sys', '-- left chat mode --')
                setMode('shell')
                setInputBlocked(false);
                inputRef.current?.focus();
                return
            }
            if (cmd === 'reset') {
                chatRef.current = []
                saveChat([])
                appendLine('sys', '-- chat history wiped --')
                setInputBlocked(false);
                inputRef.current?.focus();
                return
            }
            if (cmd === 'clear') { setHistory([]); inputRef.current?.focus(); return }
            sendChat(value)
            inputRef.current?.focus();
            return
        }
        runShell(value)
        inputRef.current?.focus();
    }

    function onKeyDown(e) {
        if (e.key === 'Enter') { e.preventDefault(); handleSubmit() }
        else if (e.key === 'ArrowUp') {
            e.preventDefault()
            const i = Math.min(histIdx + 1, cmdHistory.length - 1)
            if (i >= 0) { setHistIdx(i); setInput(cmdHistory[i]) }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault()
            const i = Math.max(histIdx - 1, -1)
            setHistIdx(i)
            setInput(i === -1 ? '' : cmdHistory[i])
        } else if (e.key === 'Tab' && mode === 'shell') {
            e.preventDefault()
            const partial = input.trim().toLowerCase()
            const match = Object.keys(commands).find((c) => c.startsWith(partial))
            if (match) setInput(match + ' ')
        } else if (e.key === 'Escape' && mode === 'chat') {
            appendLine('sys', '-- left chat mode --')
            setMode('shell')
        }
    }

    if (!open) {
        return (
            <section id="terminal" className="terminal-section">
                <button type="button" className="terminal-reopen" onClick={() => setOpen(true)}>
                    {'>'} open terminal
                </button>
            </section>
        )
    }

    const prompt = mode === 'chat' ? CHAT_PROMPT : SHELL_PROMPT

    return (
        <section id="terminal" className="terminal-section">
            <div className="terminal-header section-header-unified " ref={headerRef} style={{ position: 'relative' }}>
                <SectionHeaderCanvas containerRef={headerRef} width={600} height={120} />
                <h2 className="section-title-unified playground-title" style={{ position: 'relative', zIndex: 1 }}>Playground</h2>
                <p className="section-subtitle-unified playground-sub" style={{ position: 'relative', zIndex: 1 }}>
                   Run commands — or type <code>chat</code>.
                </p>
            </div>
            <div className={`terminal-window${mode === 'chat' ? ' terminal-chat-mode' : ''}`} onClick={() => inputRef.current?.focus()}>
                <div className="terminal-titlebar">
                    <span className="terminal-dot red" />
                    <span className="terminal-dot yellow" />
                    <span className="terminal-dot green" />
                    <span className="terminal-title">
                        visitor@opria.dev — {mode === 'chat' ? 'ai chat' : 'zsh'}
                    </span>
                    <button type="button" className="terminal-close" aria-label="close" onClick={(e) => { e.stopPropagation(); setOpen(false) }}>×</button>
                </div>
                <div className="terminal-body" ref={scrollRef}>
                    {history.map((h, i) => {
                        if (h.type === 'chat-ai' || h.type === 'out') {
                            return (
                                <pre key={i} className={`terminal-line terminal-${h.type}`} dangerouslySetInnerHTML={{ __html: h.text }} />
                            );
                        }
                        return (
                            <pre key={i} className={`terminal-line terminal-${h.type}`}>{h.text}</pre>
                        );
                    })}
                    <div className="terminal-input-row">
                        <span className={`terminal-prompt${mode === 'chat' ? ' terminal-prompt-chat' : ''}`}>{prompt}</span>
                        <span className="terminal-input-wrap">
                            <span className="terminal-typed">{input}</span>
                            <span className="terminal-caret" />
                            <input
                                ref={inputRef}
                                className="terminal-input"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={onKeyDown}
                                spellCheck={false}
                                autoComplete="off"
                                autoCapitalize="off"
                                disabled={busy || inputBlocked}
                                aria-label={mode === 'chat' ? 'chat input' : 'terminal input'}
                            />
                        </span>
                    </div>
                </div>
            </div>
        </section>
    )
}
