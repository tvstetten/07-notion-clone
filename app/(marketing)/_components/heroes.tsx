import Image from "next/image";
import { cn } from "@/lib/utils";

// My own HeroesImage component with specific format
interface BigImageProps {
  src: string
  src_dark?: string
  alt: string
  hidden?: boolean
}

const HeroesImage = function (props: BigImageProps) {
  return (
    <div className={cn(
      "relative w-[300px] h-[350px] sm:w-[350px] sm:h-[350px] md:h-[400px} md:w-[400px]",
      props.hidden
        ? "hidden md:block" : "block")}>
      <Image
        src={props.src}
        fill
        className="object-contain dark:block"
        alt={props.alt}
      />
      <Image
        src={props.src_dark || props.src}
        fill
        className="object-contain hidden dark:block"
        alt={props.alt}
      />
    </div>
  )
}

export default function Heroes() {
  return (
    <div className="flex-col items-center justify-center max-w-5xl">
      <div className="flex items-center">
        {/* TVS: Use of my own component */}
        <HeroesImage
          src="/documents.png"
          src_dark="/documents-dark.png"
          alt="Documents"
        />
        <HeroesImage
          src="/reading.png"
          src_dark="/reading-dark.png"
          alt="Reading"
          hidden
        />
        {/* <div className="relative w-[300px] h-[350px] sm:w-[350px] sm:h-[350px] md:h-[400px} md:w-[400px]">
                    <Image
                        src="/documents.png"
                        fill
                        className="object-contain"
                        alt="Documents"
                    />
                </div> */}
        {/* <div className="relative h-[400px] w-[400px]">
                    <Image
                        src="/reading.png"
                        fill
                        className="object-contain"
                        alt="Reading"
                    />
                </div> */}
      </div>

    </div>
  )
}