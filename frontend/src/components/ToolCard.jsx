import React from 'react';
import { 
  Merge, 
  Scissors, 
  Archive, 
  Stamp, 
  Trash2, 
  Lock, 
  Unlock, 
  FileImage, 
  Image as ImageIcon,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function ToolCard({ tool, onSelect }) {
  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'Merge': return Merge;
      case 'Scissors': return Scissors;
      case 'Archive': return Archive;
      case 'Stamp': return Stamp;
      case 'Trash2': return Trash2;
      case 'Lock': return Lock;
      case 'Unlock': return Unlock;
      case 'FileImage': return FileImage;
      case 'Image': return ImageIcon;
      default: return Merge;
    }
  };

  const IconComp = getIconComponent(tool.icon);

  return (
    <div
      onClick={() => onSelect(tool.id)}
      className="group relative glass-card-red rounded-3xl p-7 cursor-pointer flex flex-col justify-between overflow-hidden"
    >
      {/* Decorative red gradient overlay */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-rose-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl pointer-events-none" />

      <div>
        {/* Card Header: Icon & Badge */}
        <div className="flex items-center justify-between mb-5">
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 shadow-sm group-hover:scale-110 group-hover:bg-rose-600 group-hover:text-white transition-all duration-300">
            <IconComp className="w-7 h-7" />
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-xs sm:text-sm font-extrabold text-rose-700 shadow-sm">
            {tool.badge === 'Popular' && <Sparkles className="w-4 h-4 text-amber-500" />}
            <span>{tool.badge}</span>
          </div>
        </div>

        {/* Card Title */}
        <h3 className="text-2xl font-extrabold text-slate-900 mb-3 group-hover:text-rose-600 transition-colors">
          {tool.title}
        </h3>

        {/* Description */}
        <p className="text-base text-slate-700 leading-relaxed mb-6 font-medium">
          {tool.description}
        </p>
      </div>

      {/* Card Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-rose-100 text-sm font-extrabold text-rose-600">
        <span className="flex items-center space-x-1">
          <span>Use Tool</span>
        </span>
        <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:translate-x-1 group-hover:bg-rose-600 group-hover:text-white transition-all">
          <ArrowRight className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
