import { useEffect, useState } from 'react';
import { chooseGreetingOption } from '../scripts/chooseGreetingOption.js';

export default function Inbox() {
    const [inbox, setInbox] = useState('');

    useEffect(() => {
        const content = chooseGreetingOption();
        setInbox(content.inbox);
    }, []);

    return (
        <a href={`mailto:${inbox}@alexmarles.com`}>{inbox}@alexmarles.com</a>
    );
}
