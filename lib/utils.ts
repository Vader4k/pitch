import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function parseServerActionResponse<T>(response: T) {
    return JSON.parse(JSON.stringify(response));
}


export function formatDate(date: string){
    return new Date(date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

export function formatViews(views: number){
    if(views <= 1) {
        return `view: ${views}`
    } else {
        return `views: ${views}`
    }
}