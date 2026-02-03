import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputWithIcon } from "@/components/InputWithIcon";
import { Button } from "@/components/ui/button";
import { OtpModal } from "@/components/OtpModal";
import { 
  CreditCard, 
  Calendar, 
  Lock, 
  KeyRound,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const cardFormSchema = z.object({
  cardNumber: z.string().min(16, "Card number must be 16 digits").max(19),
  expiryDate: z.string().min(5, "Enter valid expiry date"),
  cvc: z.string().min(3, "CVC must be 3 digits").max(4),
  pin: z.string().min(4, "PIN must be 4 digits").max(6),
});

type CardFormValues = z.infer<typeof cardFormSchema>;

export default function CardDetails() {
  const [showOtp, setShowOtp] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { toast } = useToast();

  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      cardNumber: "",
      expiryDate: "",
      cvc: "",
      pin: "",
    },
  });

  const onSubmit = (data: CardFormValues) => {
    console.log("Card data:", data);
    setShowOtp(true);
  };

  const handleOtpVerify = (otp: string) => {
    console.log("OTP verified:", otp);
    setShowOtp(false);
    setIsVerified(true);
    toast({
      title: "Card Verified!",
      description: "Your card has been successfully verified.",
    });
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  if (isVerified) {
    return (
      <div className="min-h-screen bg-white flex flex-col font-sans overflow-hidden relative">
        <div className="bg-[#008080] h-[35vh] w-full relative rounded-b-[40%] shadow-lg">
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 pb-16">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center">
                <span className="text-[#008080] font-bold text-3xl tracking-tighter">SW</span>
              </div>
              <div className="text-center text-white space-y-1">
                <h1 className="text-2xl font-bold font-['Cairo']">محفظة سبأ</h1>
                <p className="text-sm font-medium tracking-widest opacity-90 uppercase">Saba Wallet</p>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="flex-1 px-8 -mt-8 relative z-10 pb-8 flex flex-col items-center justify-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-3xl shadow-xl p-8 text-center"
          >
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Verification Complete!</h2>
            <p className="text-slate-500">Your card has been successfully verified.</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans overflow-hidden relative">
      
      <div className="bg-[#008080] h-[35vh] w-full relative rounded-b-[40%] shadow-lg">
        <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute top-[20%] right-[-20px] w-32 h-32 bg-white/10 rounded-full blur-xl" />

        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 pb-16">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <span className="text-[#008080] font-bold text-3xl tracking-tighter">SW</span>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-[hsl(var(--accent))] rounded-full border-2 border-white" />
            </div>

            <div className="text-center text-white space-y-1">
              <h1 className="text-2xl font-bold font-['Cairo']">محفظة سبأ</h1>
              <p className="text-sm font-medium tracking-widest opacity-90 uppercase">Saba Wallet</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="flex-1 px-8 -mt-8 relative z-10 pb-8 flex flex-col">
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 space-y-6 border border-slate-100"
        >
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-slate-800">Card Details</h2>
            <p className="text-sm text-slate-500">Enter your card information to verify</p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-4">
              <InputWithIcon
                icon={CreditCard}
                placeholder="Card Number"
                type="text"
                maxLength={19}
                {...form.register("cardNumber")}
                onChange={(e) => {
                  const formatted = formatCardNumber(e.target.value);
                  form.setValue("cardNumber", formatted);
                }}
                data-testid="input-card-number"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <InputWithIcon
                  icon={Calendar}
                  placeholder="MM/YY"
                  type="text"
                  maxLength={5}
                  {...form.register("expiryDate")}
                  onChange={(e) => {
                    const formatted = formatExpiryDate(e.target.value);
                    form.setValue("expiryDate", formatted);
                  }}
                  data-testid="input-expiry-date"
                />
                <InputWithIcon
                  icon={Lock}
                  placeholder="CVC"
                  type="password"
                  maxLength={4}
                  {...form.register("cvc")}
                  data-testid="input-cvc"
                />
              </div>

              <InputWithIcon
                icon={KeyRound}
                placeholder="PIN"
                type="password"
                maxLength={6}
                {...form.register("pin")}
                data-testid="input-pin"
              />
            </div>

            {Object.keys(form.formState.errors).length > 0 && (
              <div className="text-red-500 text-sm text-center">
                Please fill in all fields correctly
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-[#008080] hover:bg-[#006666] text-white py-6 rounded-xl text-lg font-semibold shadow-lg shadow-[#008080]/20 hover:shadow-[#008080]/30 transition-all duration-300"
              data-testid="button-verify-card"
            >
              Verify
            </Button>
          </form>
        </motion.div>

        <div className="mt-auto pt-8 flex items-end justify-between text-xs text-slate-400 font-medium">
          <div>V 1.40</div>
        </div>
      </div>

      <OtpModal
        open={showOtp}
        onClose={() => setShowOtp(false)}
        onVerify={handleOtpVerify}
        autoFillDelay={2000}
        title="Verify Card"
        description="Enter the OTP sent to your registered mobile number"
      />
    </div>
  );
}
