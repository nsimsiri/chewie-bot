import { IUser, IUserLevel } from "../models";

export abstract class Command {
    protected isInternalCommand: boolean = false;
    protected minimumUserLevel: IUserLevel = {} as IUserLevel;

    public execute(channel: string, user: IUser, ...args: any[]): void {
        // Empty
    }

    public isInternal(): boolean {
        return this.isInternalCommand;
    }
}
