import {Controller,Get} from "@nestjs/common";


@Controller("")
export class AppController {
    constructor() {}

    @Get("/")
    cron() {
        return "Hello World!";
    }
}
