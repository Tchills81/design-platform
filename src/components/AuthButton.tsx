type AuthButtonProps = {
    provider: string;
    icon: string;
    onClick: () => void;
    tone?: 'primary' | 'apple' | 'reflective' | 'accent';
  };
  
  export default function AuthButton({ provider, icon, onClick, tone = 'primary' }: AuthButtonProps) {
    const toneClass = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      apple: 'bg-black text-white hover:bg-gray-900',
      reflective: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
      accent: 'bg-pink-500 text-white hover:bg-pink-600'
    }[tone];
  
    return (
      <button onClick={onClick} className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-inter ${toneClass}`}>
        <img src={icon} alt={`${provider} icon`} className="w-5 h-5" />
        <span>Continue with {provider}</span>
      </button>
    );
  }
  