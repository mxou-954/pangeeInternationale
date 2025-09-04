import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';

type Props = {
  text: string;
}

export default function Success({ text }: Props) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden min-w-[320px] max-w-md">
        <div className="p-4 flex items-center gap-3">
          <div className="bg-green-500 rounded-full p-2">
            <Check className="w-4 h-4 text-white" strokeWidth={3} />
          </div>
          <p className="text-gray-800 font-medium">{text}</p>
        </div>
        
        {/* Barre de progression */}
        <div className="h-1 bg-gray-100">
          <div className="h-full bg-green-500 animate-timer" />
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        
        @keyframes timer {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        
        .animate-timer {
          animation: timer 5s linear;
        }
      `}</style>
    </div>
  );
}