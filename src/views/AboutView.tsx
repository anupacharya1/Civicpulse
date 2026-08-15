import { Activity, Heart, Info, Lightbulb, Target, Users } from 'lucide-react';
import { Card, SectionHeader } from '@/components/ui';

export function AboutView() {
  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="font-display-serif text-3xl font-extrabold text-ink-800 tracking-tight">About CivicPulse</h1>
        <p className="text-sm text-ink-400 mt-1">Understanding the idea behind this community platform.</p>
      </div>

      {/* hero */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-ink-700 to-ink-900 text-white p-6 sm:p-8 relative">
          <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-amber-400/10" />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight max-w-xl">
              Bringing everyday community life into one calm, trusted place.
            </h2>
            <p className="text-ink-200 mt-3 text-sm sm:text-base max-w-2xl leading-relaxed">
              CivicPulse is a digital community platform that gathers public notices, local problems, development activities, events, and useful services into one easy-to-use place — so that everyday civic life is easier to understand and participate in.
            </p>
          </div>
        </div>
      </Card>

      {/* the problem */}
      <Card className="p-6">
        <SectionHeader title="The Problem" icon={<Target size={18} />} />
        <p className="text-sm text-ink-600 leading-relaxed">
          In many communities, everyday information is scattered. A broken streetlight is reported by word of mouth, a vaccination camp is announced on a paper poster, a road closure is known only to those who live nearby. Residents don't always know what's happening, what's being fixed, or how to take part. This makes it hard for people to stay informed and to contribute meaningfully to their own neighbourhood.
        </p>
      </Card>

      {/* why */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="p-6">
          <SectionHeader title="Why CivicPulse Exists" icon={<Lightbulb size={18} />} />
          <p className="text-sm text-ink-600 leading-relaxed">
            CivicPulse brings the scattered pieces of community life together. Instead of searching for information in five different places, residents find reports, notices, development progress, events, and ways to participate in a single, trustworthy platform. It makes community participation feel simple rather than overwhelming.
          </p>
        </Card>
        <Card className="p-6">
          <SectionHeader title="How It Works" icon={<Activity size={18} />} />
          <ul className="text-sm text-ink-600 leading-relaxed space-y-2">
            <li className="flex gap-2"><span className="text-amber-500 font-bold">•</span> Browse community reports, development works, notices, and events in one place.</li>
            <li className="flex gap-2"><span className="text-amber-500 font-bold">•</span> Select your community to see relevant local information.</li>
            <li className="flex gap-2"><span className="text-amber-500 font-bold">•</span> Report issues, vote in weekly polls, and register for events.</li>
            <li className="flex gap-2"><span className="text-amber-500 font-bold">•</span> Track your weekly impact and see community stars.</li>
          </ul>
        </Card>
      </div>

      {/* who it's for */}
      <Card className="p-6">
        <SectionHeader title="Who It Is For" icon={<Users size={18} />} />
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { title: 'Residents', desc: 'Stay informed and report everyday issues easily.' },
            { title: 'Community Groups', desc: 'Share notices and organise events and programmes.' },
            { title: 'Local Representatives', desc: 'Track problems, development progress, and community needs.' },
          ].map((g) => (
            <div key={g.title} className="p-4 rounded-xl bg-sand-50 border border-sand-200">
              <p className="font-bold text-sm text-ink-800">{g.title}</p>
              <p className="text-xs text-ink-400 mt-1 leading-relaxed">{g.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* future */}
      <Card className="p-6">
        <SectionHeader title="How It Could Help Communities" icon={<Heart size={18} />} />
        <p className="text-sm text-ink-600 leading-relaxed">
          A platform like CivicPulse could help communities respond faster to everyday problems, keep residents informed about services and development, and encourage more people to take part in community life. Over time, the data from reports and polls could help local representatives understand which issues matter most to residents.
        </p>
      </Card>

      <Card className="p-6">
        <SectionHeader title="Future Possibilities" icon={<Lightbulb size={18} />} />
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            'Real report tracking connected to local services',
            'SMS and offline notifications for areas with limited internet',
            'Multilingual support including Nepali and local languages',
            'Integration with real community meetings and voting',
          ].map((f) => (
            <div key={f} className="flex items-start gap-2 p-3 rounded-xl bg-sand-50 border border-sand-200">
              <span className="text-amber-500 font-bold mt-0.5">→</span>
              <p className="text-sm text-ink-600">{f}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* disclaimer */}
      <div className="flex items-start gap-3 p-5 rounded-2xl bg-ink-50 border border-ink-100">
        <Info size={20} className="text-ink-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-ink-700">Prototype Notice</p>
          <p className="text-sm text-ink-500 mt-1 leading-relaxed">
            CivicPulse is a prototype created for a school technology competition and is not an official government platform. All community names, reports, projects, events, and contacts are fictional sample data for demonstration purposes.
          </p>
        </div>
      </div>
    </div>
  );
}
