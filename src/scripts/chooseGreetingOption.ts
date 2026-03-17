declare global {
    interface Window {
        sharedContentIndex?: number;
    }
}

const OPTIONS = [
    { greeting: 'Hello! 👋', inbox: 'hello' },
    { greeting: 'Hola! 👋', inbox: 'hola' },
    { greeting: 'Hej hej! 👋', inbox: 'hejhej' },
];

const index = Math.floor(Math.random() * OPTIONS.length);

if (typeof window !== 'undefined' && window.sharedContentIndex === undefined) {
    window.sharedContentIndex = index;
}

export function chooseGreetingOption() {
    const index = typeof window !== 'undefined' ? window.sharedContentIndex : 0;
    return OPTIONS[index];
}
