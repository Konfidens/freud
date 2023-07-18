import React from 'react';
import { Button } from './ui/button/Button';


type Props = {
    suggestedQuestions: string[],
    onClick: (n: number) => void,
    isLoadingReply: boolean,
};


const QuickAsk = ({ suggestedQuestions, onClick, isLoadingReply }: Props) => {
    return (
        <div className='w-[50%]'>
            {suggestedQuestions.map((question: string, index: number) => (
                <div key={index}>
                    <Button
                        onClick={() => onClick(index)}
                        color={"white"}
                        withBorder={true}
                        disabled={isLoadingReply}
                        className='mb-[0.4rem] mt-1 w-full'
                    >
                        {question}
                    </Button>
                </div>
            ))}
        </div>
    );







};

export default QuickAsk;