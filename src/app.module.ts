import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ProductsModule} from "./products/products.module";

import * as dotenv from 'dotenv';
dotenv.config();


@Module({
    imports: [
        ProductsModule,
        MongooseModule.forRoot(
            process.env.MONGOOSE_KEY
        )
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
