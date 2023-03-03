import { create } from 'zustand';


export type FormStep = "START_SUBMISSION" | "ENTER_ARTIST_NAME" | "ENTER_SONG_NAME" | "UPLOAD_SONG" | "SUBMITTED";

type FormStepMap = {
    [key: string]: NonNullable<FormStep>
}

export const FORM_STEPS: FormStepMap = {
    START_SUBMISSION: "START_SUBMISSION",
    ENTER_ARTIST_NAME: "ENTER_ARTIST_NAME",
    ENTER_SONG_NAME: "ENTER_SONG_NAME",
    UPLOAD_SONG: "UPLOAD_SONG",
    SUBMITTED: "SUBMITTED"
}


export type FileUploadState = "SUCCESS" | "FAILURE" | "READY" | "UPLOADING" | "EMPTY"

type FileUploadStateMap = {
    [key: string]: NonNullable<FileUploadState>
}

export const UPLOAD_STATE: FileUploadStateMap = {
    SUCCESS: "SUCCESS",
    FAILURE: "FAILURE",
    READY: "READY",
    UPLOADING: "UPLOADING",
    EMPTY: "EMPTY"
}


interface FormState {
    artistName?: string;
    songName?: string;
    song: File | null | undefined;
    setArtistName: (updatedArtistName: string) => void;
    setSongName: (updatedSongName: string) => void;
    setSong: (updatedSong: File | null | undefined) => void;
}

export const useFormStore = create<FormState>()((set) => ({
    artistName: undefined,
    songName: undefined,
    song: undefined,
    setArtistName: (updatedArtistName) => set(() => ({ artistName: updatedArtistName })),
    setSongName: (updatedSongName) => set(() => ({ songName: updatedSongName })),
    setSong: (updatedSong) => set(() => ({ song: updatedSong })),
}))


interface DisplayState {
    darkMode: boolean;
    openState: boolean;
    fileUploadState: FileUploadState;
    currentFormStep: FormStep;
    setDarkMode: () => void;
    setOpenState: (updatedOpenState: boolean) => void;
    setFileUploadState: (updatedUploadState: FileUploadState) => void;
    setCurrentFormStep: (updatedFormStep: FormStep) => void;
}


export const useDisplayStore = create<DisplayState>()((set) => ({
    darkMode: true,
    openState: true,
    fileUploadState: "EMPTY",
    currentFormStep: "START_SUBMISSION",
    setDarkMode: () => set((state) => ({ darkMode: !state.darkMode})),
    setOpenState: (updatedOpenState) => set(() => ({ openState: updatedOpenState })),
    setFileUploadState: (updatedUploadState) => set(() => ({ fileUploadState: updatedUploadState })),
    setCurrentFormStep: (updatedFormStep) => set(() => ({ currentFormStep: updatedFormStep}))
}))


interface FormValidationState {
    artistNameValid: boolean;
    songNameValid: boolean;
    songFileValid: boolean;
    setArtistNameValidState: (updatedArtistNameValidationState: boolean) => void;
    setSongNameValidState: (updateSongNameValidationState: boolean) => void;
    setSongFileValidState: (updateSongFileValidationState: boolean) => void;
}

export const useFormValidationStore = create<FormValidationState>()((set) => ({
    artistNameValid: false,
    songNameValid: false,
    songFileValid: false,
    setArtistNameValidState: (updatedArtistNameValidationState) => set(() => ({
        artistNameValid: updatedArtistNameValidationState
    })),
    setSongNameValidState: (updatedSongNameValidationState) => set(() => ({
        songNameValid: updatedSongNameValidationState
    })),
    setSongFileValidState: (updatedSongFileValidationState) => set(() => ({
        songFileValid: updatedSongFileValidationState
    }))
}))