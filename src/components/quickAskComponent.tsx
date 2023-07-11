import React from 'react';
import { Button } from './button/Button';
import { type FormEvent } from 'react';


type Props = {
    suggestedQuestions: string[],
    onClick: () => void, // needs to submit the text and disable all buttons for submitting
    isLoadingReply: boolean,
};


const QuickAskComponent = ({ suggestedQuestions, onClick, isLoadingReply }: Props) => {
    // Need some sort of check on the suggestedQuestions here
    // If not passing this check then just return.

    return (
        <div>
            {suggestedQuestions.map((question: string, index: number) => (
                <div key={index}>
                    <Button 
                        onClick={onClick}
                        color={"white"}
                        withBorder={true}
                        disabled={isLoadingReply}
                        className='mb-[0.4rem] mt-0.5 w-[64rem]'
                    >
                        {question}
                    </Button>
                </div>
            ))}
        </div>
    );







};

export default QuickAskComponent;