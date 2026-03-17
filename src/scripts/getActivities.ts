import { app } from '../firebase/client';
import { getFirestore, collection, getDocs, type Firestore } from 'firebase/firestore';

const BOOK_TYPE = 'book';
const VIDEOGAME_TYPE = 'videogame';
const BOOK_ID = 'books';
const VIDEOGAME_ID = 'videogames';
const BOOK_TITLE = 'Reading';
const VIDEOGAME_TITLE = 'Playing';

interface Activity {
    id: string;
    type: string;
    title: string;
    author?: string;
    platform?: string;
}

const db = getFirestore(app);

async function getActivities(db: Firestore) {
    const activitiesSnapshot = await getDocs(collection(db, 'activities'));
    return activitiesSnapshot.docs.map(
        doc =>
            ({
                id: doc.id,
                ...doc.data(),
            } as Activity)
    );
}

async function getAllActivities(db: Firestore) {
    let activities: Activity[] = JSON.parse(
        sessionStorage.getItem('activities')
    );
    if (activities) return activities;

    activities = await getActivities(db);
    sessionStorage.setItem('activities', JSON.stringify(activities));
    return activities;
}

class RightNow extends HTMLElement {
    constructor() {
        super();

        getAllActivities(db).then(activities => {
            activities.forEach(activity => {
                const line = document.createElement('small');
                if (activity.type === BOOK_TYPE) {
                    if (document.getElementById(BOOK_ID) === null) {
                        const heading = document.createElement('h2');
                        heading.id = BOOK_ID;
                        heading.innerHTML = BOOK_TITLE;
                        this.append(heading);
                    }
                    line.textContent = `${activity.title}, by `;
                    const byLine = document.createElement('i');
                    byLine.textContent = activity.author ?? '';
                    line.append(byLine);
                } else if (activity.type === VIDEOGAME_TYPE) {
                    if (document.getElementById(VIDEOGAME_ID) === null) {
                        const heading = document.createElement('h2');
                        heading.id = VIDEOGAME_ID;
                        heading.innerHTML = VIDEOGAME_TITLE;
                        this.append(heading);
                    }
                    line.textContent = `${activity.title}, on `;
                    const onLine = document.createElement('i');
                    onLine.textContent = activity.platform ?? '';
                    line.append(onLine);
                }
                this.append(line);
            });

            this.classList.remove('hidden');
        });
    }
}

customElements.define('astro-right-now', RightNow);
