interface Props { dark?: boolean }
export function Marquee({ dark }: Props) {
  return (
    <div className={`overflow-hidden py-2 border-t border-b ${dark ? 'bg-surface-alt border-[rgba(255,255,255,0.15)]' : 'bg-surface border-border'}`} />
  )
}
