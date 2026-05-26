import Image from 'next/image'

export function MaleFigure() {
  return (
    // Fixed height so both figures feel the same size when switching between genders
    <div className="relative w-full h-[420px]">
      <Image
        src="/size-guide-male.png"
        alt="Male measurement diagram showing chest, waist and hip lines"
        fill
        className="object-contain object-top"
        sizes="200px"
      />
    </div>
  )
}
