import React from 'react';
import { Button } from './button/Button';
import { type FormEvent } from 'react';


type Props = {
    suggestedQuestions: string[],
    onClick: (n: number) => void,
    isLoadingReply: boolean,
};


const QuickAskComponent = ({ suggestedQuestions, onClick, isLoadingReply }: Props) => {
    return (
        <div>
            {suggestedQuestions.map((question: string, index: number) => (
                <div key={index}>
                    <Button 
                        onClick={() => onClick(index)}
                        color={"white"}
                        withBorder={true}
                        disabled={isLoadingReply}
                        className='mb-[0.4rem] mt-1 w-[64rem]'
                    >
                        {question}
                    </Button>
                </div>
            ))}
        </div>
    );







};

export default QuickAskComponent;