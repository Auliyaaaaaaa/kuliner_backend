import { OnModuleDestroy } from '@nestjs/common';
export declare class DatabaseService implements OnModuleDestroy {
    private pool;
    constructor();
    query(sql: string, params?: any[]): Promise<any>;
    onModuleDestroy(): Promise<void>;
}
