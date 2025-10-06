import { motion } from 'framer-motion';

interface TileProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  isActive?: boolean;
}

export default function Tile({
  icon,
  title,
  description,
  onClick,
  isActive = false,
}: TileProps) {
  const sharedStyle = 'bg-yellow-100 text-yellow-800';
  const activeRing = isActive ? 'ring-2 ring-offset-2 ring-yellow-400' : '';

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      title={description}
      className={`cursor-pointer rounded-xl p-4 shadow-soft transition-all duration-300 ${sharedStyle} ${activeRing}`}
    >
      <div className="flex items-center justify-center gap-3">
        <div className="flex-shrink-0">{icon}</div>
        <h3 className="text-base font-serif">{title}</h3>
      </div>
    </motion.div>
  );
}
