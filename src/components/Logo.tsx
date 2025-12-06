import logoImage from 'figma:asset/7c0cece4711204dc7d3defad0ae3f9cbbc4cfedf.png';

interface LogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export function Logo({ size = 48, className = '', animated = true }: LogoProps) {
  return (
    <div className={`relative ${className}`}>
      <img
        src={logoImage}
        alt="GeniusLab Logo"
        width={size}
        height={size}
        className={`object-contain ${animated ? 'animate-bounce-slow' : ''}`}
      />
    </div>
  );
}
