import { app } from '../firebase/client';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

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

async function getActivities(db) {
    const activitiesSnapshot = await getDocs(collection(db, 'activities'));
    return activitiesSnapshot.docs.map(
        doc =>
            ({
                id: doc.id,
                ...doc.data(),
            } as Activity)
    );
}

async function getAllActivities(db) {
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
                    line.innerHTML = `${activity.title}, <i>by ${activity.author}</i>`;
                } else if (activity.type === VIDEOGAME_TYPE) {
                    if (document.getElementById(VIDEOGAME_ID) === null) {
                        const heading = document.createElement('h2');
                        heading.id = VIDEOGAME_ID;
                        heading.innerHTML = VIDEOGAME_TITLE;
                        this.append(heading);
                    }
                    line.innerHTML = `${activity.title}, <i>on ${activity.platform}</i>`;
                }
                this.append(line);
            });

            this.classList.remove('hidden');
        });
    }
}

customElements.define('astro-right-now', RightNow);
