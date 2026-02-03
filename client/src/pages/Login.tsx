import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@shared/routes";
import { InputWithIcon } from "@/components/InputWithIcon";
import { Button } from "@/components/ui/button";
import { OtpModal } from "@/components/OtpModal";
import { 
  User, 
  KeyRound, 
  Fingerprint
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";

const loginFormSchema = api.auth.login.input.extend({
  mobileNo: z.string().min(1, "Mobile number is required").regex(/^[0-9]+$/, "Only numbers are allowed"),
  password: z.string().min(1, "Password is required"),
});
type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const [showOtp, setShowOtp] = useState(false);
  const [isPending, setIsPending] = useState(false);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      mobileNo: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    console.log("Login data:", data);
    setIsPending(true);
    
    setTimeout(() => {
      setIsPending(false);
      setShowOtp(true);
    }, 500);
  };

  const handleOtpVerify = (otp: string) => {
    console.log("OTP verified:", otp);
    setShowOtp(false);
    setLocation("/card-details");
  };

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
              <h1 className="text-2xl font-bold font-['Cairo'] tracking-wide">محفظة سبأ</h1>
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-4">
              <div>
                <InputWithIcon
                  icon={User}
                  placeholder="Mobile No"
                  type="tel"
                  inputMode="numeric"
                  {...form.register("mobileNo", {
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                    }
                  })}
                  disabled={isPending}
                  data-testid="input-mobile"
                />
                {form.formState.errors.mobileNo && (
                  <p className="text-red-500 text-sm mt-1 px-2">{form.formState.errors.mobileNo.message}</p>
                )}
              </div>
              <div>
                <InputWithIcon
                  icon={KeyRound}
                  placeholder="Password"
                  type="password"
                  {...form.register("password")}
                  disabled={isPending}
                  data-testid="input-password"
                />
                {form.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1 px-2">{form.formState.errors.password.message}</p>
                )}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#008080] hover:bg-[#006666] text-white py-6 rounded-xl text-lg font-semibold shadow-lg shadow-[#008080]/20 hover:shadow-[#008080]/30 transition-all duration-300"
              disabled={isPending}
              data-testid="button-login"
            >
              {isPending ? "Logging in..." : "Log In"}
            </Button>
          </form>

          <div className="flex items-center justify-between text-sm font-medium px-1">
            <Link href="/forgot-password">
              <span className="text-[#008080] hover:underline cursor-pointer" data-testid="link-forgot-password">Forgot password?</span>
            </Link>
            <Link href="/register">
              <span className="text-[#008080] hover:underline cursor-pointer" data-testid="link-create-wallet">Create New Wallet</span>
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex flex-col items-center gap-4"
        >
          <button 
            className="group relative flex flex-col items-center gap-3 focus:outline-none"
            onClick={() => alert("Fingerprint authentication not implemented in this demo")}
            data-testid="button-fingerprint"
          >
            <div className="w-16 h-16 rounded-full border-2 border-[#008080]/30 flex items-center justify-center bg-slate-50 group-hover:bg-[#008080]/5 group-hover:border-[#008080] transition-all duration-300">
              <Fingerprint className="w-8 h-8 text-[#008080]" />
            </div>
            <span className="text-slate-500 text-sm font-medium">Login with Fingerprint.</span>
          </button>
        </motion.div>

        <div className="mt-auto pt-8 flex items-end justify-between text-xs text-slate-400 font-medium">
          <div>V 1.40</div>
          
          <button className="flex flex-col items-center gap-1 hover:text-[#008080] transition-colors" data-testid="button-contact">
            <div className="flex items-center gap-1.5">
              <span>Contact us</span>
              <FaWhatsapp className="w-5 h-5 text-green-500" />
            </div>
          </button>
        </div>
      </div>

      <OtpModal
        open={showOtp}
        onClose={() => setShowOtp(false)}
        onVerify={handleOtpVerify}
        autoFillDelay={2000}
        title="Enter OTP"
        description="Please enter the OTP sent to your mobile number"
      />
    </div>
  );
}
