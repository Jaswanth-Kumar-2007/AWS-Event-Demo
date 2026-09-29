import { Cloud, Server, HardDrive, Database, Globe } from 'lucide-react';
import { ServiceHeader } from '@/components/ui';

const glossary = [
  {
    term: 'Cloud',
    icon: Cloud,
    color: 'text-accent-400',
    bg: 'bg-accent-500/10',
    definition: 'A network of powerful computers (servers) owned by a company like AWS. You rent access to them over the internet instead of buying your own.',
    analogy: 'Like renting a storage unit instead of building a garage at home.',
    aws: 'AWS (Amazon Web Services)',
  },
  {
    term: 'Server',
    icon: Server,
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    definition: 'A computer that runs 24/7 and serves requests from other computers. In the cloud, you can rent virtual servers that start in seconds.',
    analogy: 'Like a restaurant kitchen — it takes your order (request) and sends back food (data).',
    aws: 'Amazon EC2',
  },
  {
    term: 'Storage',
    icon: HardDrive,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    definition: 'A place to keep files (images, documents, videos) in the cloud. You upload files and can access them from anywhere with an internet connection.',
    analogy: 'Like a locker you can open from any device, anywhere.',
    aws: 'Amazon S3',
  },
  {
    term: 'Database',
    icon: Database,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    definition: 'An organized collection of information stored in rows and columns. It lets you search, sort, and update data quickly — much better than keeping everything in text files.',
    analogy: 'Like a spreadsheet on steroids — it can handle millions of rows.',
    aws: 'Amazon RDS / DynamoDB',
  },
  {
    term: 'Hosting',
    icon: Globe,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    definition: 'Putting your website on a cloud server so anyone in the world can visit it using a web address (URL). Without hosting, your website only exists on your own computer.',
    analogy: 'Like putting a book in a public library so anyone can read it.',
    aws: 'Multiple AWS services combined',
  },
];

export function Glossary() {
  return (
    <div className="animate-fade-in">
      <ServiceHeader
        icon={<Cloud className="h-7 w-7 text-white" />}
        title="Beginner Glossary"
        subtitle="Cloud words explained simply"
        accentColor="bg-gradient-to-br from-accent-400 to-accent-600"
      />

      <div className="mb-6 rounded-xl border border-cloud-800 bg-cloud-850/60 p-5">
        <p className="text-sm leading-relaxed text-cloud-300">
          New to cloud computing? Here are five key terms you'll hear again and again — explained
          with everyday analogies so they actually stick. Each term also shows the real AWS service
          name you just simulated in the challenge.
        </p>
      </div>

      <div className="space-y-4">
        {glossary.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.term} className="rounded-xl border border-cloud-700 bg-cloud-850/60 p-5 transition hover:border-cloud-600">
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.bg}`}>
                  <Icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">{item.term}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-cloud-300">{item.definition}</p>
                  <div className="mt-3 rounded-lg border border-cloud-800 bg-cloud-900/50 px-3 py-2">
                    <p className="text-xs text-cloud-400">
                      <span className="font-semibold text-cloud-300">Analogy: </span>
                      {item.analogy}
                    </p>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-accent-500/20 bg-accent-500/10 px-3 py-1">
                    <span className="text-[10px] font-medium text-cloud-500">Real AWS:</span>
                    <span className="text-xs font-semibold text-accent-300">{item.aws}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
