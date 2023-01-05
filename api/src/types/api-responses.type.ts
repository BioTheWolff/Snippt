import { ApiProperty } from "@nestjs/swagger";

export class JsonStatusResponse {
    @ApiProperty()
    status: string;
}