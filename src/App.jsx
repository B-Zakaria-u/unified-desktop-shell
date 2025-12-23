import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import './index.css';

import Login from './Login';
import { onAuthStateChanged, deleteUser } from 'firebase/auth';
import { auth } from './firebaseConfig';

// URLs
const isDev = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';

const APPS = {
    notebook: isDev ? 'http://localhost:5174' : '/apps/notebook/index.html',
    translation: isDev ? 'http://localhost:5175' : '/apps/translation/index.html'
};

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState('notebook');

    // Monitor Authentication State
    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen w-full bg-[#1E1F22] items-center justify-center">
                <div className="animate-spin text-[#5865F2]">
                    <Sparkles size={48} />
                </div>
            </div>
        );
    }

    if (!user) {
        return <Login onLoginSuccess={() => { }} />;
    }

    return (
        <div className="flex h-screen w-full bg-[#1E1F22] overflow-hidden">
            {/* Sidebar */}
            <div className="flex w-[72px] flex-col items-center py-3 bg-[#1E1F22] z-50 shadow-xl">
                {/* Home / Brand Icon */}
                <div className="mb-2">
                    <NavButton
                        icon={<Sparkles size={28} />}
                        isActive={false}
                        onClick={() => { }}
                        label="Home"
                        isHome={true}
                        color="bg-[#5865F2]"
                    />
                </div>

                <div className="w-8 h-[2px] bg-[#35363C] rounded-lg mb-2" />

                <div className="flex flex-col gap-2 w-full items-center">
                    <NavButton
                        icon={<CourseIcon size={28} />}
                        isActive={activeView === 'notebook'}
                        onClick={() => setActiveView('notebook')}
                        label="Local NoteBook AI"
                        color="bg-purple-600"
                    />

                    <NavButton
                        icon={<TranslationIcon size={28} />}
                        isActive={activeView === 'translation'}
                        onClick={() => setActiveView('translation')}
                        label="AI Translation"
                        color="bg-emerald-600"
                    />
                </div>

                {/* Spacer to push logout to bottom */}
                <div className="flex-1" />

                {/* Bottom Actions (Disconnect + Delete) */}
                <div className="mb-2 flex flex-col gap-2">
                    <NavButton
                        icon={<LogOutIcon size={24} />}
                        isActive={false}
                        onClick={async () => {
                            try {
                                if (window.require) {
                                    const { ipcRenderer } = window.require('electron');
                                    await ipcRenderer.invoke('auth:logout');
                                }
                            } catch (error) {
                                console.error('Failed to clear session:', error);
                            }
                            await auth.signOut();
                        }}
                        label="Logout"
                        isHome={false}
                        color="bg-gray-500"
                    />
                    <NavButton
                        icon={<TrashIcon size={24} />}
                        isActive={false}
                        onClick={async () => {
                            if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
                                try {
                                    await deleteUser(auth.currentUser);
                                } catch (error) {
                                    console.error(error);
                                    alert('Failed to delete account. You may need to re-login deeply to perform this action.');
                                }
                            }
                        }}
                        label="Delete Account"
                        isHome={false}
                        color="bg-red-600"
                    />
                </div>
            </div>

            {/* Main Content Areas (Keep-Alive Iframes) */}
            <div className="flex-1 h-full bg-[#313338] rounded-tl-xl overflow-hidden relative">

                {/* Notebook Iframe */}
                <div className={`w-full h-full ${activeView === 'notebook' ? 'block' : 'hidden'}`}>
                    <iframe
                        src={APPS.notebook}
                        className="w-full h-full border-none"
                        title="Notebook App"
                    />
                </div>

                {/* Translation Iframe */}
                <div className={`w-full h-full ${activeView === 'translation' ? 'block' : 'hidden'}`}>
                    <iframe
                        src={APPS.translation}
                        className="w-full h-full border-none"
                        title="Translation App"
                    />
                </div>

            </div>


        </div>
    );
}

const LogOutIcon = ({ size = 24, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
);

const TrashIcon = ({ size = 24, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M3 6h18" />
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
);

function NavButton({ icon, isActive, onClick, label, isHome, color }) {
    return (
        <div className="relative group flex items-center justify-center w-[72px] h-[48px]">
            {/* Left Pill Indicator */}
            <div
                className={`
            absolute left-0 w-[4px] bg-white rounded-r-xl transition-all duration-200 ease-in-out
            ${isActive ? 'h-[40px] opacity-100' : 'h-[8px] opacity-0 group-hover:opacity-100 group-hover:h-[20px]'}
          `}
            />

            <button
                onClick={onClick}
                title={label}
                className={`
            relative flex items-center justify-center w-[48px] h-[48px] transition-all duration-200 ease-in-out cursor-pointer hover:scale-105
            ${isActive || isHome ? 'rounded-[16px]' : 'rounded-[24px] group-hover:rounded-[16px]'}
            ${isActive ? color : 'bg-[#313338] group-hover:' + color}
            text-gray-200 hover:text-white
          `}
            >
                {/* Icon */}
                <div className="transition-transform duration-200 group-hover:scale-105 group-active:translate-y-[1px]">
                    {icon}
                </div>
            </button>

            {/* Custom Tooltip (Outside Button) - Still visible for good measure */}
            <div className="absolute left-[80px] top-1/2 -translate-y-1/2 px-3 py-2 bg-black rounded-lg text-sm font-bold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-100 z-50 shadow-xl origin-left scale-90 group-hover:scale-100 hidden group-hover:block">
                {label}
                {/* Tiny Arrow */}
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-3 h-3 bg-black rotate-45 -z-10" />
            </div>
        </div>
    );
}

// Icons
const CourseIcon = ({ size = 24, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M5 4m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" />
        <path d="M9 4m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" />
        <path d="M5 8h4" />
        <path d="M9 16h4" />
        <path d="M13.803 4.56l2.184 -.53c.562 -.135 1.133 .19 1.282 .732l3.695 13.418a1.02 1.02 0 0 1 -.634 1.219l-.133 .041l-2.184 .53c-.562 .135 -1.133 -.19 -1.282 -.732l-3.695 -13.418a1.02 1.02 0 0 1 .634 -1.219l.133 -.041z" />
        <path d="M14 9l4 -1" />
        <path d="M16 16l3.923 -.98" />
    </svg>
);

const TranslationIcon = ({ size = 24, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M4 5h7" />
        <path d="M7 4c0 4.846 0 7 .5 8" />
        <path d="M10 8.5c0 2.286 -2 4.5 -3.5 4.5s-2.5 -1.135 -2.5 -2c0 -2 1 -3 3 -3s5 .57 5 2.857c0 1.524 -.667 2.571 -2 3.143" />
        <path d="M12 20l4 -9l4 9" />
        <path d="M19.1 18h-6.2" />
    </svg>
);

export default App;
