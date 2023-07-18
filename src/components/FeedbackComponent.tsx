import React, { useEffect, useState } from 'react'
import Modal from 'react-modal';
import { type Message } from '~/interfaces/message';
import { api } from "~/utils/api";
import { Feedback } from '~/interfaces/feedback';
import { Button } from './ui/button/Button';
import { Icon } from './ui/icon/Icon';
import { InputField } from './ui/inputField/InputField';
import { Label } from './ui/label/Label';
import { TextArea } from './ui/textArea/TextArea';

Modal.setAppElement('#__next');

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        innerHeight: '80vh',
        bottom: 'auto',
        right: 'auto',
        transform: 'translate(-50%, -50%)',
        padding: '3rem'
    },
};

type Props = {
    chat: Message[]
}


const FeedbackComponent = ({ chat }: Props) => {

    let thanku: HTMLParagraphElement;
    const [feedbackComment, setFeedbackComment] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    useEffect(() => {
        // Get the value from local storage if it exists
        let nameValue = localStorage.getItem("name") || ""
        let emailValue = localStorage.getItem("email") || ""
        setName(nameValue)
        setEmail(emailValue)
    }, [])

    const [modalIsOpen, setIsOpen] = useState(false);

    const mutateFeedback = api.feedback.createNewFeedback.useMutation({
        onError: (error) => console.error(error),
        onSuccess: () => console.info("Feedback sent!"),
    });



    function openModal() {
        setIsOpen(true);
        setFeedbackComment("")
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        thanku.style.display = 'none';
    }

    function closeModal() {
        localStorage.setItem("email", email)
        localStorage.setItem("name", name)
        setIsOpen(false);
    }

    function sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function handleSubmit() {
        if (feedbackComment == undefined || feedbackComment == null || feedbackComment == "") {
            return
        }
        thanku.style.display = "block";


        const feedback: Feedback = {
            comment: feedbackComment,
            name: name,
            email: email,
            messages: chat
        }

        mutateFeedback.mutate(feedback);

        await sleep(1 * 1000);
        closeModal()
    }


    return (
        <div className='float-right ml-4'>
            <Button onClick={openModal}><Icon name={'mail'}></Icon></Button>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <h1 className='font-bold text-2xl'>Tilbakemeldingskjema</h1>
                <p>Både tilbakemelding og samtalen du har hatt vil bli sendt inn til oss</p>
                <form>
                    <Label>Tilbakemelding</Label>
                    <TextArea id={'feedback'} className="w-[40rem] h-[40rem]" onChange={(e) => setFeedbackComment(e.target.value)} />
                    <InputField id='' label='Navn (valgfritt)' onChange={(e) => setName(e.target.value)} value={name}></InputField>
                    <InputField id='' label='E-mail (valgfritt)' onChange={(e) => setEmail(e.target.value)} value={email}></InputField>
                </form>
                <Button className='float-right' color={"green"} onClick={handleSubmit}>Send inn</Button>
                <Button className='float-right' color={"red"} onClick={closeModal}>Cancel</Button>
                <p ref={(_thanku) => (thanku = _thanku!)} className="text-green550">Tusentakk for din tilbakemelding</p>
            </Modal>
        </div >
    )
}

export default FeedbackComponent