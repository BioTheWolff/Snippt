import { IsAlpha, IsNotEmpty, Length } from "class-validator";

export class CreatePostDto {
    @IsNotEmpty()
    @Length(1, 60)
    title: string;

    @IsNotEmpty()
    @Length(1, 250)
    description: string;

    @IsNotEmpty()
    @IsAlpha()
    @Length(1, 20)
    language: string;

    @IsNotEmpty()
    @Length(1, 2000)
    content: string;
}
