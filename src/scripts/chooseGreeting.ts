document.addEventListener('astro:page-load', () => {
    console.log('HEYO!');
    const time = Date.now();
    const GREETINGS = ['Hello! 👋', 'Hola! 👋', 'Hej hej! 👋'];
    const greeting = GREETINGS[time % GREETINGS.length];
    const INBOXES = ['hello', 'hola', 'hejhej'];
    const inbox = INBOXES[time % INBOXES.length];

    document.querySelector('#footer-inbox').innerHTML = inbox;

    class Greeting extends HTMLElement {
        constructor() {
            super();

            const greetingEl = this.querySelector('#greeting');
            greetingEl.innerHTML = greeting;
        }
    }

    class Inbox extends HTMLElement {
        constructor() {
            super();

            const inboxEl = this.querySelector('#inbox');
            inboxEl.innerHTML = inbox;
        }
    }

    customElements.define('astro-greeting', Greeting);
    customElements.define('astro-inbox', Inbox);
});
