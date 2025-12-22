
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Monitor, Laptop, Calendar, Cpu, HardDrive, ShieldCheck, Save, AlertCircle } from 'lucide-react';
import { RigProfile, RigType, ResolutionTarget } from '../types';
import { COMMON_CPUS, COMMON_GPUS, RAM_OPTIONS, OTHER_HARDWARE_OPTION } from '../constants';

const setupSchema = z.object({
  type: z.nativeEnum(RigType),
  cpu: z.string().min(1, "CPU is required"),
  customCpu: z.string().optional(),
  gpu: z.string().min(1, "GPU is required"),
  customGpu: z.string().optional(),
  ram: z.number().min(1),
  resolution: z.nativeEnum(ResolutionTarget),
  purchaseDate: z.string().min(1, "Purchase date is required"),
  name: z.string().min(1, "Profile name is required")
}).refine((data) => {
  if (data.cpu === OTHER_HARDWARE_OPTION) {
    return !!data.customCpu && data.customCpu.trim().length > 0;
  }
  return true;
}, {
  message: "Please enter your CPU model",
  path: ["customCpu"]
}).refine((data) => {
  if (data.gpu === OTHER_HARDWARE_OPTION) {
    return !!data.customGpu && data.customGpu.trim().length > 0;
  }
  return true;
}, {
  message: "Please enter your GPU model",
  path: ["customGpu"]
});

type SetupFormData = z.infer<typeof setupSchema>;

interface SetupViewProps {
  onSave: (profile: RigProfile) => void;
  initialProfile: RigProfile | null;
}

const SetupView: React.FC<SetupViewProps> = ({ onSave, initialProfile }) => {
  const navigate = useNavigate();

  // Initialize form with existing profile or defaults
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<SetupFormData>({
    resolver: zodResolver(setupSchema),
    defaultValues: initialProfile ? {
      ...initialProfile,
      // If the current CPU is not in the list, set it to OTHER and put value in customCpu
      cpu: COMMON_CPUS.includes(initialProfile.cpu) ? initialProfile.cpu : OTHER_HARDWARE_OPTION,
      customCpu: COMMON_CPUS.includes(initialProfile.cpu) ? "" : initialProfile.cpu,
      gpu: COMMON_GPUS.includes(initialProfile.gpu) ? initialProfile.gpu : OTHER_HARDWARE_OPTION,
      customGpu: COMMON_GPUS.includes(initialProfile.gpu) ? "" : initialProfile.gpu,
    } : {
      type: RigType.DESKTOP,
      resolution: ResolutionTarget.P1080,
      ram: 16,
      name: 'Main Rig',
      purchaseDate: new Date().toISOString().split('T')[0]
    }
  });

  const selectedType = watch('type');
  const selectedCpu = watch('cpu');
  const selectedGpu = watch('gpu');

  const onFormSubmit = (data: SetupFormData) => {
    const finalCpu = data.cpu === OTHER_HARDWARE_OPTION ? data.customCpu! : data.cpu;
    const finalGpu = data.gpu === OTHER_HARDWARE_OPTION ? data.customGpu! : data.gpu;

    const fullProfile: RigProfile = {
      id: initialProfile?.id || crypto.randomUUID(),
      name: data.name,
      type: data.type,
      cpu: finalCpu,
      gpu: finalGpu,
      ram: data.ram,
      resolution: data.resolution,
      purchaseDate: data.purchaseDate,
      lastPasteChange: initialProfile?.lastPasteChange,
      lastFanClean: initialProfile?.lastFanClean,
    };

    onSave(fullProfile);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Setup Your Rig</h1>
        <p className="text-slate-400">Configure your hardware for accurate FPS predictions and health monitoring.</p>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 pb-20">
        {/* Profile Name */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            Profile Name
          </label>
          <input 
            {...register('name')}
            className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            placeholder="e.g., Gaming PC, Work Laptop"
          />
          {errors.name && <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.name.message}</p>}
        </div>

        {/* Device Type */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setValue('type', RigType.DESKTOP)}
            className={`p-6 rounded-2xl flex flex-col items-center gap-3 transition-all ${
              selectedType === RigType.DESKTOP 
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
            } border-2`}
          >
            <Monitor className="w-10 h-10" />
            <span className="font-semibold">Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setValue('type', RigType.LAPTOP)}
            className={`p-6 rounded-2xl flex flex-col items-center gap-3 transition-all ${
              selectedType === RigType.LAPTOP 
                ? 'bg-purple-500/20 border-purple-500/50 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
            } border-2`}
          >
            <Laptop className="w-10 h-10" />
            <span className="font-semibold">Laptop</span>
          </button>
        </div>

        {/* Hardware Details */}
        <div className="glass p-8 rounded-3xl space-y-6">
          {/* CPU Selection */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Cpu className="w-4 h-4" /> CPU Model
            </label>
            <select 
              {...register('cpu')}
              className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            >
              <option value="">Select CPU...</option>
              {COMMON_CPUS.map(cpu => <option key={cpu} value={cpu}>{cpu}</option>)}
              <option value={OTHER_HARDWARE_OPTION}>Other / Custom</option>
            </select>
            {selectedCpu === OTHER_HARDWARE_OPTION && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <input 
                  {...register('customCpu')}
                  placeholder="Enter your specific CPU model..."
                  className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
                />
                {errors.customCpu && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.customCpu.message}</p>}
              </div>
            )}
          </div>

          {/* GPU Selection */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <HardDrive className="w-4 h-4" /> GPU Model
            </label>
            <select 
              {...register('gpu')}
              className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            >
              <option value="">Select GPU...</option>
              {COMMON_GPUS.map(gpu => <option key={gpu} value={gpu}>{gpu}</option>)}
              <option value={OTHER_HARDWARE_OPTION}>Other / Custom</option>
            </select>
            {selectedGpu === OTHER_HARDWARE_OPTION && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <input 
                  {...register('customGpu')}
                  placeholder="Enter your specific GPU model..."
                  className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
                />
                {errors.customGpu && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.customGpu.message}</p>}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <ShieldCheck className="w-4 h-4" /> RAM (GB)
              </label>
              <select 
                {...register('ram', { valueAsNumber: true })}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              >
                {RAM_OPTIONS.map(opt => <option key={opt} value={opt}>{opt} GB</option>)}
              </select>
            </div>
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Monitor className="w-4 h-4" /> Target Resolution
              </label>
              <select 
                {...register('resolution')}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              >
                <option value={ResolutionTarget.P1080}>1080p Full HD</option>
                <option value={ResolutionTarget.P1440}>1440p Quad HD</option>
                <option value={ResolutionTarget.P2160}>4K Ultra HD</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Calendar className="w-4 h-4" /> Purchase / Last Maintenance Date
            </label>
            <input 
              type="date"
              {...register('purchaseDate')}
              className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          Finalize My Rig
        </button>
      </form>
    </div>
  );
};

export default SetupView;
