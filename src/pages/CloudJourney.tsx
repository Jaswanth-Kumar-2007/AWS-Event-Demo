import { Monitor, Wifi, Cloud, Server, HardDrive, Database, Globe, ArrowDown } from 'lucide-react';
import { useChallenge } from '@/context/ChallengeContext';
import { ServiceHeader, Badge } from '@/components/ui';

export function CloudJourney() {
  const { participant } = useChallenge();
  const completedSteps = participant?.completed_steps || [];

  return (
    <div className="animate-fade-in">
      <ServiceHeader
        icon={<Cloud className="h-7 w-7 text-white" />}
        title="Cloud Journey"
        subtitle="How your computer reaches the cloud"
        accentColor="bg-gradient-to-br from-accent-400 to-accent-600"
      />

      <div className="mb-6 rounded-xl border border-cloud-800 bg-cloud-850/60 p-5">
        <p className="text-sm leading-relaxed text-cloud-300">
          Here's a simple picture of how everything connects. Your computer talks to the internet,
          the internet reaches the cloud, and inside the cloud you have four services working together
          — exactly like the challenge you're building.
        </p>
      </div>

      {/* Flow diagram */}
      <div className="flex flex-col items-center py-6">
        <FlowNode
          icon={<Monitor className="h-8 w-8 text-sky-300" />}
          title="Your Computer"
          desc="Where you work — your laptop or desktop"
          color="border-sky-500/30 bg-sky-500/10"
          done={true}
        />
        <FlowArrow label="You connect via" sublabel="Wi-Fi / Ethernet" />
        <FlowNode
          icon={<Wifi className="h-8 w-8 text-amber-300" />}
          title="Internet"
          desc="The global network that links everything together"
          color="border-amber-500/30 bg-amber-500/10"
          done={true}
        />
        <FlowArrow label="Your request reaches" sublabel="Data centers around the world" />
        <FlowNode
          icon={<Cloud className="h-8 w-8 text-accent-300" />}
          title="Cloud"
          desc="Powerful servers managed by a cloud provider"
          color="border-accent-500/30 bg-accent-500/10"
          done={true}
        />
        <FlowArrow label="The cloud gives you" sublabel="Four connected services" />
      </div>

      {/* Four services — with challenge status */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <ServiceTile
          icon={<Server className="h-6 w-6 text-sky-300" />}
          title="Compute"
          desc="Virtual servers"
          aws="Amazon EC2"
          color="border-sky-500/30 bg-sky-500/5"
          done={completedSteps.includes(1)}
        />
        <ServiceTile
          icon={<HardDrive className="h-6 w-6 text-amber-300" />}
          title="Storage"
          desc="File buckets"
          aws="Amazon S3"
          color="border-amber-500/30 bg-amber-500/5"
          done={completedSteps.includes(2)}
        />
        <ServiceTile
          icon={<Database className="h-6 w-6 text-emerald-300" />}
          title="Database"
          desc="Organized data"
          aws="Amazon RDS"
          color="border-emerald-500/30 bg-emerald-500/5"
          done={completedSteps.includes(3)}
        />
        <ServiceTile
          icon={<Globe className="h-6 w-6 text-violet-300" />}
          title="Hosting"
          desc="Live websites"
          aws="AWS Hosting"
          color="border-violet-500/30 bg-violet-500/5"
          done={completedSteps.includes(4)}
        />
      </div>

      {/* Connection explanation */}
      <div className="mt-8 rounded-xl border border-cloud-800 bg-cloud-850/60 p-6">
        <h2 className="mb-3 text-sm font-semibold text-white">How They Connect in Your Challenge</h2>
        <div className="space-y-3 text-sm text-cloud-300">
          <p><span className="font-semibold text-sky-400">Compute</span> — Your server runs the application.</p>
          <p><span className="font-semibold text-amber-400">Storage</span> — Your bucket holds the image, connected to the server.</p>
          <p><span className="font-semibold text-emerald-400">Database</span> — Your database stores the website code (HTML + CSS).</p>
          <p><span className="font-semibold text-violet-400">Hosting</span> — Your server, storage, and database work together to publish the website.</p>
        </div>
      </div>
    </div>
  );
}

function FlowNode({ icon, title, desc, color, done }: { icon: React.ReactNode; title: string; desc: string; color: string; done?: boolean }) {
  return (
    <div className={`flex w-full max-w-md items-center gap-4 rounded-xl border ${color} p-5 transition hover:scale-[1.02]`}>
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-cloud-900/50">
        {icon}
      </div>
      <div>
        <h3 className="text-base font-bold text-white">{title}</h3>
        <p className="text-xs leading-relaxed text-cloud-400">{desc}</p>
      </div>
      {done && <Badge variant="success"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Ready</Badge>}
    </div>
  );
}

function FlowArrow({ label, sublabel }: { label: string; sublabel: string }) {
  return (
    <div className="flex flex-col items-center py-3">
      <div className="flex flex-col items-center">
        <div className="h-6 w-px bg-gradient-to-b from-cloud-600 to-cloud-500" />
        <ArrowDown className="h-5 w-5 text-cloud-500" />
      </div>
      <div className="mt-1 text-center">
        <p className="text-[11px] font-medium text-cloud-400">{label}</p>
        <p className="text-[10px] text-cloud-600">{sublabel}</p>
      </div>
    </div>
  );
}

function ServiceTile({ icon, title, desc, aws, color, done }: { icon: React.ReactNode; title: string; desc: string; aws: string; color: string; done?: boolean }) {
  return (
    <div className={`rounded-xl border ${color} p-4 text-center transition hover:scale-[1.03]`}>
      <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-cloud-900/50">
        {icon}
      </div>
      <h4 className="text-sm font-bold text-white">{title}</h4>
      <p className="text-[11px] text-cloud-400">{desc}</p>
      <p className="mt-1 text-[10px] font-medium text-cloud-500">AWS: {aws}</p>
      {done && (
        <div className="mt-2">
          <Badge variant="success"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Completed</Badge>
        </div>
      )}
    </div>
  );
}
