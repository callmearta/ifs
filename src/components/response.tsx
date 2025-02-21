import { useEffect, useState } from "react";

export default function Response({ response }: { response: string }) {
    const [responseText, setResponseText] = useState<string>(response);

    useEffect(() => {
        setResponseText('');
        response.split(' ').forEach((word, index) => {
            setTimeout(() => {
                setResponseText(prev => prev + word + ' ');
            }, 100 * index);
        });
    }, [response]);

    return (
        <p className='font-medium text-lg text-left px-12 w-full min-h-48'>{responseText.split(' ').map((word, index) => <span key={index} className="response-word" style={{ '--delay': `${(index+1) * 0.015}s` } as React.CSSProperties}>{word}&nbsp;</span>)}</p>
    );
}


