import React from 'react'
import { colors } from '~/stitches/colors'
import { LogoWordmark } from './ui/logo/LogoWordmark'

type Prop = {
  chatStarted: boolean,
  diagnosismode: boolean
}

const Header = ({ chatStarted, diagnosismode }: Prop) => {
  return (
    <div className="container mx-8 flex flex-col items-center gap-4 px-4 pt-8 lg:gap-12 md:pt-16">
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
        {
          diagnosismode ?
            <>
              <h5 className='text-green700 text-center text-2xl'>Diagnosemodus</h5>
              <li>Skriv inn symptonene til pasienten</li>
              <li>Svar på eventuelle oppfølgingsspørsmål</li>
              <li>Få svar på mulige diagnoser fra ICD-10</li>
              <li>Diagnosemodus er kun på norsk</li>
            </>

            :
            <>
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
                Gjerne gi tilbakemelding
              </li>
            </>
        }
      </ul>
    </div>
  )
}

export default Header