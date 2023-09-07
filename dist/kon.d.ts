import { Express } from 'express';
type Konponents = {
    [key: string]: Konponent;
};
type Options = {
    folderName: string;
    indexName?: string;
};
declare class Kon {
    app: Express;
    options: Options;
    routes: Konponents;
    konponents: Konponents;
    constructor(app: Express, options: Options);
    private initializeOptions;
    private initializeKonponents;
    private initializeRoutes;
    private createKonponent;
    load(): void;
}
declare class Konponent {
    private app;
    private name;
    content: string;
    children: Konponents;
    constructor(app: Express, name: string, content: string);
}
export default function CreateKon(app: Express, options?: Options): Kon;
export {};
