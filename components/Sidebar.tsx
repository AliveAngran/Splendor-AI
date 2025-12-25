
import React from 'react';

interface Props {
  logs: string[];
}

const Sidebar: React.FC<Props> = ({ logs }) => {
  return (
    <div className="p-6 h-[300px] overflow-hidden flex flex-col">
      <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
        游戏日志
      </h3>
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-200">
        {logs.map((log, i) => (
          <div key={i} className={`text-xs font-medium border-l-2 pl-3 py-1 ${i === 0 ? 'border-red-600 text-black' : 'border-gray-200 text-gray-400'}`}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
