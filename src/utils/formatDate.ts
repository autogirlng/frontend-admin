 export const formatDate = (isoString: string) => {
        const date = new Date(isoString);

        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();

        // Get hours & minutes in local time
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert to 12-hour format

        // Ordinal suffix (1st, 2nd, 3rd, etc.)
        const getOrdinal = (n: number) => {
            if (n > 3 && n < 21) return 'th';
            switch (n % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };

        return `${day}${getOrdinal(day)} ${month} ${year} | ${hours}:${minutes}${ampm}`;
    }

export const hoursBetweenISOStrings = (isoString1:string, isoString2:string ):number => {
    const startTime = new Date(isoString1);
    const endTime = new Date(isoString2);

const diffMs = endTime.getTime() - startTime.getTime(); 
return Math.round(diffMs / (1000 * 60 * 60 * 24)); 

}