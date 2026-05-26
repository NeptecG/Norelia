import Image from 'next/image'

export function FemaleFigure() {
  return (
    // Same fixed height as MaleFigure so switching genders feels consistent
    <div className="relative w-full h-[420px]">
      <Image
        src="/size-guide-female.png"
        alt="Female measurement diagram showing chest, waist and hip lines"
        fill
        className="object-contain object-top"
        sizes="200px"
      />
    </div>
  )
}
