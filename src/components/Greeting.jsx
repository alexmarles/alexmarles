import { useEffect, useState } from 'react';
import { chooseGreetingOption } from '../scripts/chooseGreetingOption.js';

export default function Greeting() {
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const content = chooseGreetingOption();
        setGreeting(content.greeting);
    }, []);

    return <h1>{greeting}</h1>;
}
