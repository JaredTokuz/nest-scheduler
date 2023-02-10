import { IsString } from "class-validator";

export class CreateCronDto {
  @IsString()
  readonly name!: string;

  @IsString()
  readonly cron!: string;

  @IsString()
  readonly url!: string;
}
