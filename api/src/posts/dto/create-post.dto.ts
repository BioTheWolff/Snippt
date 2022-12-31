import { IsAlpha, IsIn, IsNotEmpty, Length } from "class-validator";

export const languages = {
    c: "C",
    csharp: "C#",
    coffeescript: "CoffeeScript",
    css: "CSS",
    d: "D",
    go: "Go",
    haskell: "Haskell",
    html: "HTML",
    java: "Java",
    javascript: "JavaScript",
    json: "JSON",
    lua: "Lua",
    php: "PHP",
    python: "Python",
    r: "R",
    ruby: "Ruby",
    scheme: "Scheme",
    shell: "Shell",
    smalltalk: "SmallTalk",
    sql: "SQL",
    text: "Text/Plain"
};

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
    @IsIn(Object.keys(languages), { message: 'language not allowed' })
    language: string;

    @IsNotEmpty()
    @Length(1, 2000)
    content: string;
}
