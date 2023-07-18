import React from 'react'
import { colors } from '~/stitches/colors'
import { LogoWordmark } from './ui/logo/LogoWordmark'

type Prop = {
  chatStarted: boolean,
}

const Header = ({ chatStarted }: Prop) => {
  return (
    <div className="container mx-8 flex flex-col items-center gap-4 px-4 py-8 lg:gap-12 lg:py-16">
      <div className="flex flex-row items-end gap-1">
        <h1 className="text-5xl font-extrabold tracking-tight text-green750 sm:text-[5rem]">
          Freud
        </h1>
        <p className="pb-[0.3rem] text-green750">by</p>
        <div className="h-6 w-16">
          <LogoWordmark color={colors.green750} />
        </div>
      </div>

      <ul
        className={`list-inside list-disc overflow-hidden text-xl text-gray700 transition-[opacity,max-height] duration-[0.5s] ${chatStarted
          ? "max-h-0 opacity-0"
          : "max-h-[50rem] opacity-100"
          }`}
      >
        <li>
          Freud er en chatbot som kan henvise til fagstoff innenfor
          psykologi.
        </li>
        <li>
          Still den et spørsmål eller prøv forslagene nederst og få et svar
          som er knyttet til kildehenvisningene.
        </li>
        <li>
          Freud er fremdeles i en testing-fase og vil ikke alltid gi
          faktuelle eller gode svar.
        </li>
        <li>Foreløpig er den kun tilpasset å kunne gi svar på engelsk.</li>
        <li>
          Trykk på mail-ikonet for å gi en tilbakemelding på hva som kan
          forbedres.
        </li>
      </ul>
    </div>
  )
}

export default Header