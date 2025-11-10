import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

interface SocialMediaSelectorProps {
  selectedPlatforms: string[];
  onChange: (platforms: string[]) => void;
}

const PLATFORMS = [
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: '#1877F2' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E4405F' },
  { id: 'twitter', name: 'Twitter/X', icon: Twitter, color: '#1DA1F2' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: '#0A66C2' },
];

export const SocialMediaSelector = ({ selectedPlatforms, onChange }: SocialMediaSelectorProps) => {
  const togglePlatform = (platformId: string) => {
    if (selectedPlatforms.includes(platformId)) {
      onChange(selectedPlatforms.filter(p => p !== platformId));
    } else {
      onChange([...selectedPlatforms, platformId]);
    }
  };

  return (
    <div className="space-y-3">
      <Label>Redes Sociales</Label>
      <div className="grid grid-cols-2 gap-3">
        {PLATFORMS.map(({ id, name, icon: Icon, color }) => (
          <div
            key={id}
            className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${
              selectedPlatforms.includes(id)
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => togglePlatform(id)}
          >
            <Checkbox
              checked={selectedPlatforms.includes(id)}
              onCheckedChange={() => togglePlatform(id)}
            />
            <Icon size={20} style={{ color }} />
            <span className="text-sm font-medium">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
