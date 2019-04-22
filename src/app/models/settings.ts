export class Settings {
    pattern: number; // enum
    patternPassword: string; //
    seletedHistory: boolean;
    columnsPerRow: number;
    ShowCategories: number;
    ShowGroup: number;
    showGroupAll: boolean;

    // http://akhromieiev.com/tutorials/convert-text-speech-ionic-3/
    rateSpeek: number; // volumen 0 a 1 utilizar  slider
    localeSpeek: string; // idioma

    editMode: boolean;
    isMyFirtView: boolean;
}
