import { app } from '../firebase/client';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

interface Entry {
    id: string;
    name: string;
    type: string;
}

interface Activity {
    id: string;
    title: string;
    entries: Entry[];
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

async function getEntries(db, activity) {
    const entriesSnapshot = await getDocs(
        collection(db, 'activities', activity.id, 'entries')
    );
    return entriesSnapshot.docs.map(
        doc =>
            ({
                id: doc.id,
                ...doc.data(),
            } as Entry)
    );
}

async function getAllActivities(db) {
    let activities: Activity[] = JSON.parse(
        sessionStorage.getItem('activities')
    );
    if (activities) return activities;

    activities = await getActivities(db);
    for (let [i, activity] of activities.entries()) {
        const entries = await getEntries(db, activity);
        activities[i] = {
            ...activity,
            entries,
        };
    }
    sessionStorage.setItem('activities', JSON.stringify(activities));
    return activities;
}

class RightNow extends HTMLElement {
    constructor() {
        super();

        getAllActivities(db).then(activities => {
            activities.forEach(activity => {
                if (activity.title && activity.entries.length) {
                    const heading = document.createElement('h2');
                    heading.innerHTML = activity.title;
                    this.append(heading);

                    activity.entries.forEach(entry => {
                        const line = document.createElement('p');
                        line.innerHTML = entry.name;
                        this.append(line);
                    });
                }
            });

            this.classList.remove('hidden');
        });
    }
}

customElements.define('astro-right-now', RightNow);
