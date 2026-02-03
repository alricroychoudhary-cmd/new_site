import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface OtpModalProps {
  open: boolean;
  onClose: () => void;
  onVerify: (otp: string) => void;
  autoFillDelay?: number;
  title?: string;
  description?: string;
}

export function OtpModal({ 
  open, 
  onClose, 
  onVerify, 
  autoFillDelay = 2000,
  title = "Enter OTP",
  description = "Please enter the OTP sent to your mobile number"
}: OtpModalProps) {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (open) {
      setOtp(["", "", "", "", "", ""]);
      setIsAutoFilling(false);
      
      const timer = setTimeout(() => {
        setIsAutoFilling(true);
        const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpArray = randomOtp.split("");
        
        otpArray.forEach((digit, index) => {
          setTimeout(() => {
            setOtp(prev => {
              const newOtp = [...prev];
              newOtp[index] = digit;
              return newOtp;
            });
            
            if (index === otpArray.length - 1) {
              setTimeout(() => {
                onVerify(randomOtp);
              }, 500);
            }
          }, index * 150);
        });
      }, autoFillDelay);

      return () => clearTimeout(timer);
    }
  }, [open, autoFillDelay, onVerify]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md rounded-3xl border-0 shadow-2xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-bold text-[#008080]">{title}</DialogTitle>
          <DialogDescription className="text-slate-500">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center gap-2 py-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:ring-2 focus:ring-[#008080]/20 outline-none transition-all bg-slate-50 ${
                digit ? "border-[#008080] scale-105" : "border-slate-200 focus:border-[#008080]"
              }`}
              style={{ 
                transform: digit ? "scale(1.05)" : "scale(1)",
                transition: "all 0.2s ease"
              }}
              data-testid={`input-otp-${index}`}
            />
          ))}
        </div>

        {isAutoFilling && (
          <div className="text-center text-sm text-[#008080] font-medium animate-pulse">
            Auto-filling OTP...
          </div>
        )}

        <div className="flex justify-center mt-4">
          <Button
            onClick={() => onVerify(otp.join(""))}
            className="w-full bg-[#008080] hover:bg-[#006666] text-white py-6 rounded-xl text-lg font-semibold"
            disabled={otp.some(d => !d)}
            data-testid="button-verify-otp"
          >
            Verify
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
