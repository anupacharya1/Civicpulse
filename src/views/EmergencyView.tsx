import { Phone, Siren, Shield, Heart, Flame, LifeBuoy, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui';

const emergencyContacts = [
  { name: 'Police', number: '100', icon: Shield, desc: 'Report crime or safety concerns', tone: 'bg-ink-700 text-white' },
  { name: 'Ambulance', number: '102', icon: Heart, desc: 'Medical emergencies', tone: 'bg-danger-500 text-white' },
  { name: 'Fire Service', number: '101', icon: Flame, desc: 'Fire and rescue', tone: 'bg-amber-500 text-ink-900' },
  { name: 'Community Help Desk', number: '103', icon: LifeBuoy, desc: 'Local community support', tone: 'bg-ink-500 text-white' },
];

const otherServices = [
  { name: 'Women’s Helpline', number: '181', desc: 'Support for women in distress' },
  { name: 'Child Helpline', number: '1098', desc: 'Child protection and support' },
  { name: 'Disaster Response', number: '115', desc: 'Flood, landslide, and disaster help' },
  { name: 'Electricity Fault', number: '116', desc: 'Power outage and electrical faults' },
  { name: 'Water Supply', number: '117', desc: 'Water supply issues' },
  { name: 'Health Information', number: '111', desc: 'General health advice and information' },
];

export function EmergencyView() {
  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="font-display-serif text-3xl font-extrabold text-ink-800 tracking-tight">Emergency Contacts</h1>
        <p className="text-sm text-ink-400 mt-1">Quick access to emergency and support services.</p>
      </div>

      {/* demo warning */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200">
        <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-amber-700">These are prototype / demo contacts</p>
          <p className="text-xs text-amber-600 mt-0.5">These numbers are fictional and for demonstration only. They are NOT real emergency numbers. In a real emergency, contact your actual local services.</p>
        </div>
      </div>

      {/* main emergency */}
      <section>
        <h2 className="text-lg font-bold text-ink-800 mb-3">Primary Emergency Services</h2>
        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
          {emergencyContacts.map((c) => {
            const Icon = c.icon;
            return (
              <Card key={c.name} className="p-5 flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${c.tone}`}>
                  <Icon size={26} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-ink-800">{c.name}</p>
                  <p className="text-xs text-ink-400 mt-0.5">{c.desc}</p>
                  <a
                    href={`tel:${c.number}`}
                    className="mt-2 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-ink-700 text-white text-sm font-bold hover:bg-ink-800 transition-colors"
                  >
                    <Phone size={15} /> Call {c.number}
                  </a>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* other services */}
      <section>
        <h2 className="text-lg font-bold text-ink-800 mb-3">Other Useful Services</h2>
        <Card className="divide-y divide-sand-100">
          {otherServices.map((s) => (
            <div key={s.name} className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-xl bg-sand-100 text-ink-500 flex items-center justify-center shrink-0">
                <LifeBuoy size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink-800">{s.name}</p>
                <p className="text-xs text-ink-400">{s.desc}</p>
              </div>
              <a
                href={`tel:${s.number}`}
                className="px-3 py-2 rounded-xl bg-sand-50 border border-sand-200 text-ink-700 text-sm font-bold hover:bg-sand-100 transition-colors whitespace-nowrap"
              >
                {s.number}
              </a>
            </div>
          ))}
        </Card>
      </section>

      <div className="flex items-center gap-2 p-4 rounded-2xl bg-ink-50 border border-ink-100">
        <Siren size={18} className="text-ink-500 shrink-0" />
        <p className="text-xs text-ink-500">
          Tip: In a real implementation, this page would connect to verified local emergency numbers. For this prototype, all contacts are sample data.
        </p>
      </div>
    </div>
  );
}
