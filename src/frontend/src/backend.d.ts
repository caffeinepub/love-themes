import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Video {
    id: string;
    title: string;
    thumbnailImageId: string;
    description: string;
    videoUrl: string;
}
export interface Home {
    title: string;
    heroImageId: string;
    subtitle: string;
}
export interface Memory {
    id: string;
    title: string;
    date: string;
    description: string;
    imageId: string;
}
export interface Theme {
    backgroundColor: string;
    fontStyle: string;
    primaryColor: string;
    accentColor: string;
}
export interface Question {
    id: string;
    questionText: string;
    category: string;
}
export interface UserProfile {
    bio: string;
    name: string;
    role: string;
    avatarImageId: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMemory(memory: Memory): Promise<void>;
    addQuestion(q: Question): Promise<void>;
    addVideo(video: Video): Promise<void>;
    adminAddUserProfile(user: Principal, profile: UserProfile): Promise<void>;
    adminDeleteUserProfile(user: Principal): Promise<void>;
    adminUpdateUserProfile(user: Principal, profile: UserProfile): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteMemory(id: string): Promise<void>;
    deleteQuestion(id: string): Promise<void>;
    deleteVideo(id: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getHome(): Promise<Home>;
    getMemories(): Promise<Array<Memory>>;
    getMemoryById(id: string): Promise<Memory>;
    getQuestionById(id: string): Promise<Question>;
    getQuestions(): Promise<Array<Question>>;
    getTheme(): Promise<Theme>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserProfiles(): Promise<Array<[Principal, UserProfile]>>;
    getVideoById(id: string): Promise<Video>;
    getVideos(): Promise<Array<Video>>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveHome(newHome: Home): Promise<void>;
    saveTheme(newTheme: Theme): Promise<void>;
    updateMemory(memory: Memory): Promise<void>;
    updateQuestion(q: Question): Promise<void>;
    updateVideo(video: Video): Promise<void>;
}
