import { CronOptions } from 'croner';

export interface BackgroundJob{
    name: string;
    pattern: string;
    options: CronOptions | undefined
    run(): Promise<void | Error>
}