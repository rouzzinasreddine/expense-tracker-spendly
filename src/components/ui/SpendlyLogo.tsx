import Image from "next/image";

interface SpendlyLogoProps {
  size?: number;
  withText?: boolean;
}

export function SpendlyLogo({ size = 32, withText = false }: SpendlyLogoProps) {
  return (
    <div className="flex items-center gap-3">
      <Image
        src="/logo.svg"
        alt="Spendly Logo"
        width={size}
        height={size}
        priority
        className="shrink-0 rounded-xl shadow-sm"
      />
      {withText && (
        <h1 className="font-black tracking-tighter text-white" style={{ fontSize: size * 0.75 }}>
          Spendly
        </h1>
      )}
    </div>
  );
}
