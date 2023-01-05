import { ApiProperty } from "@nestjs/swagger";
import { UpdatePostDto } from "../posts/dto/update-post.dto";
import { Post } from "../posts/entities/post.entity";

export class JsonStatusResponse {
    @ApiProperty()
    status: string;
}

export class JsonLoginResponse {
    @ApiProperty()
    handle: string;

    @ApiProperty()
    display_name: string;

    @ApiProperty()
    email: string;

    @ApiProperty({ default: false })
    admin: boolean;
};

export class ValidationErrorResponse {
    @ApiProperty({ default: 400 })
    status: number;

    @ApiProperty()
    message: [ string ];
}

export class AuthStatusResponse {
    @ApiProperty({ default: "OK" })
    status: string;

    @ApiProperty({ description: "The number of seconds before the token expires" })
    expiresIn: number;
}

export class UserSimpleProfileResponse {
    @ApiProperty({ default: 'my_handle' })
    handle: string;

    @ApiProperty({ default: 'My display name' })
    display_name: string;
}

export class UserProfileRelationsResponse {
    @ApiProperty({ default: 'my_handle' })
    handle: string;

    @ApiProperty({ default: 'My display name' })
    display_name: string;

    @ApiProperty()
    following!: UserSimpleProfileResponse[];

    @ApiProperty()
    followers!: UserSimpleProfileResponse[];

    @ApiProperty()
    posts!: Post[];

    @ApiProperty()
    likes: Post[];

    @ApiProperty()
    dislikes: Post[];
}

export class PostUpdateResponse {
    @ApiProperty()
    id: number;

    @ApiProperty()
    updated: UpdatePostDto;
}